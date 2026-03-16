# 🚨 CRITICAL FIX: Daraja Server Callback URL Issue

## Problem Identified

Your Daraja server has **HARDCODED** callback URLs and is **NOT using** the `callbackUrl` parameter you're sending from ClinIntelAI!

### Current Code (WRONG):
```javascript
// In /api/stkpush route
CallBackURL: "https://daraja-node.vercel.app/api/callback", // ← HARDCODED!
```

### What You're Sending:
```javascript
// From ClinIntelAI
body: JSON.stringify({
  phone: formattedPhone,
  amount: amount.toString(),
  accountNumber: hospitalId,
  callbackUrl: "https://your-app.com/api/payments/callback" // ← IGNORED!
})
```

---

## Solution: Update Daraja Server

You need to modify the Daraja server `/api/stkpush` route to use the `callbackUrl` parameter.

### File to Update: `routes/index.js` (or wherever your stkpush route is)

### Change This:

```javascript
router.post('/api/stkpush', (req, res) => {
  let phoneNumber = req.body.phone;
  const accountNumber = req.body.accountNumber || 'TEST001';
  const amount = req.body.amount || '1';
  
  // ... phone validation ...

  getAccessToken()
    .then((accessToken) => {
      const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
      const auth = "Bearer " + accessToken;
      const timestamp = moment().format("YYYYMMDDHHmmss");
      const password = new Buffer.from(
        "174379" +
        "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919" +
        timestamp
      ).toString("base64");

      axios
        .post(
          url,
          {
            BusinessShortCode: "174379",
            Password: password,
            Timestamp: timestamp,
            TransactionType: "CustomerPayBillOnline",
            Amount: "1",
            PartyA: phoneNumber,
            PartyB: "174379",
            PhoneNumber: phoneNumber,
            CallBackURL: "https://daraja-node.vercel.app/api/callback", // ← WRONG!
            AccountReference: accountNumber,
            TransactionDesc: "Mpesa Daraja API stk push test",
          },
```

### To This:

```javascript
router.post('/api/stkpush', (req, res) => {
  let phoneNumber = req.body.phone;
  const accountNumber = req.body.accountNumber || 'TEST001';
  const amount = req.body.amount || '1';
  const callbackUrl = req.body.callbackUrl || 'https://daraja-node.vercel.app/api/callback'; // ← NEW!
  
  // Validate phone number
  if (!phoneNumber) {
    return res.status(400).json({
      msg: "Phone number is required",
      status: false
    });
  }

  // Format phone number
  if (phoneNumber.startsWith("+254")) {
    phoneNumber = phoneNumber.slice(1);
  } else if (phoneNumber.startsWith("0")) {
    phoneNumber = "254" + phoneNumber.slice(1);
  } else if (!phoneNumber.startsWith("254")) {
    phoneNumber = "254" + phoneNumber;
  }

  // Validate formatted phone number
  if (!/^254\d{9}$/.test(phoneNumber)) {
    return res.status(400).json({
      msg: "Invalid phone number format. Must be Kenyan phone number",
      status: false,
      example: "Format: 0712345678 or +254712345678 or 254712345678"
    });
  }

  console.log("Processing payment request for:", {
    phoneNumber,
    accountNumber,
    amount,
    callbackUrl // ← LOG IT!
  });

  getAccessToken()
    .then((accessToken) => {
      const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
      const auth = "Bearer " + accessToken;
      const timestamp = moment().format("YYYYMMDDHHmmss");
      const password = new Buffer.from(
        "174379" +
        "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919" +
        timestamp
      ).toString("base64");

      axios
        .post(
          url,
          {
            BusinessShortCode: "174379",
            Password: password,
            Timestamp: timestamp,
            TransactionType: "CustomerPayBillOnline",
            Amount: "1",
            PartyA: phoneNumber,
            PartyB: "174379",
            PhoneNumber: phoneNumber,
            CallBackURL: callbackUrl, // ← USE THE PARAMETER!
            AccountReference: accountNumber,
            TransactionDesc: "Mpesa Daraja API stk push test",
          },
          {
            headers: {
              Authorization: auth,
            },
          }
        )
        .then((response) => {
          console.log("STK Push Response:", response.data);
          console.log("Callback will be sent to:", callbackUrl); // ← CONFIRM!
          
          // ... rest of the code ...
```

---

## Quick Fix Steps

### 1. Update Daraja Server Code

```bash
cd /home/jimmie/github/daraja/daraja-node

# Edit routes/index.js (or your main route file)
code routes/index.js
```

Find this line:
```javascript
CallBackURL: "https://daraja-node.vercel.app/api/callback",
```

Replace with:
```javascript
const callbackUrl = req.body.callbackUrl || 'https://daraja-node.vercel.app/api/callback';
```

Then use it:
```javascript
CallBackURL: callbackUrl,
```

### 2. Add Logging

Add this after getting the request body:
```javascript
console.log("=== STK PUSH REQUEST ===");
console.log("Phone:", phoneNumber);
console.log("Amount:", amount);
console.log("Account:", accountNumber);
console.log("Callback URL:", callbackUrl); // ← IMPORTANT!
console.log("========================");
```

### 3. Deploy Updated Daraja Server

```bash
# If using Vercel
vercel --prod

# Or git push if auto-deployed
git add .
git commit -m "Fix: Use dynamic callback URL from request body"
git push
```

---

## Alternative: Proxy Approach (If You Can't Modify Daraja)

If you can't modify the Daraja server, create a proxy route that forwards callbacks:

### In Daraja Server, add this route:

```javascript
// Forward callback to client app
router.post("/api/callback", async (req, res) => {
  console.log("=== STK PUSH CALLBACK RECEIVED ===");
  
  try {
    const callbackData = req.body;
    
    // Log it
    console.log("Callback Data:", JSON.stringify(callbackData, null, 2));
    
    // Find the transaction to get the original callback URL
    const stkCallback = callbackData.Body.stkCallback;
    const checkoutRequestID = stkCallback.CheckoutRequestID;
    
    // Find transaction in memory
    const transaction = global.stkTransactions?.find(
      t => t.checkoutRequestID === checkoutRequestID
    );
    
    // If transaction has a custom callback URL, forward to it
    if (transaction && transaction.customCallbackUrl) {
      console.log("Forwarding callback to:", transaction.customCallbackUrl);
      
      try {
        await axios.post(transaction.customCallbackUrl, callbackData, {
          headers: { 'Content-Type': 'application/json' }
        });
        console.log("Callback forwarded successfully");
      } catch (error) {
        console.error("Error forwarding callback:", error.message);
      }
    }
    
    // Process locally as well
    // ... existing callback processing code ...
    
    // Return success to M-Pesa
    res.json({
      ResultCode: 0,
      ResultDesc: "Callback received successfully"
    });

  } catch (error) {
    console.error("Error processing callback:", error);
    res.json({
      ResultCode: 0,
      ResultDesc: "Callback received"
    });
  }
});
```

### Store custom callback URL when creating transaction:

```javascript
// In /api/stkpush route
const transaction = {
  merchantRequestID: response.data.MerchantRequestID,
  checkoutRequestID: response.data.CheckoutRequestID,
  responseCode: response.data.ResponseCode,
  responseDescription: response.data.ResponseDescription,
  customerMessage: response.data.CustomerMessage,
  phoneNumber: phoneNumber,
  accountReference: accountNumber,
  amount: "1",
  customCallbackUrl: callbackUrl, // ← STORE IT!
  status: 'pending',
  timestamp: new Date().toISOString()
};

global.stkTransactions.push(transaction);
```

---

## Testing

### 1. Check Daraja Server Logs

After making payment, check Daraja logs:
```bash
vercel logs daraja-node.vercel.app --follow
```

You should see:
```
=== STK PUSH REQUEST ===
Callback URL: https://your-clinintelai-app.vercel.app/api/payments/callback
```

### 2. Check M-Pesa Request

Use Postman or curl to verify:
```bash
curl -X POST https://daraja-node.vercel.app/api/stkpush \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "0712345678",
    "amount": "1",
    "accountNumber": "TEST123",
    "callbackUrl": "https://webhook.site/your-unique-url"
  }'
```

Go to webhook.site to see if callback arrives there.

---

## Expected Flow After Fix

```
1. ClinIntelAI sends STK Push request
   ↓
   POST https://daraja-node.vercel.app/api/stkpush
   Body: {
     phone: "254712345678",
     amount: "1",
     accountNumber: "hosp-123",
     callbackUrl: "https://clinintelai.vercel.app/api/payments/callback" ✅
   }

2. Daraja Server forwards to M-Pesa
   ↓
   POST https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest
   Body: {
     ...
     CallBackURL: "https://clinintelai.vercel.app/api/payments/callback" ✅
     ...
   }

3. User completes payment on phone
   ↓

4. M-Pesa sends callback
   ↓
   POST https://clinintelai.vercel.app/api/payments/callback ✅
   Body: { ... transaction details ... }

5. ClinIntelAI processes callback
   ↓
   - Update payment status
   - Activate subscription
   - User gets dashboard access ✅
```

---

## Summary

**The problem**: Daraja server ignores your `callbackUrl` parameter.

**The fix**: 
1. **Best**: Update Daraja server to use `req.body.callbackUrl`
2. **Alternative**: Add proxy forwarding in Daraja callback handler

**Action required**: You need to modify the Daraja server code and redeploy it.

---

## Quick Commands

```bash
# Navigate to Daraja project
cd /home/jimmie/github/daraja/daraja-node

# Edit the route file
code routes/index.js  # or wherever your routes are

# Find and replace
# FROM: CallBackURL: "https://daraja-node.vercel.app/api/callback",
# TO: CallBackURL: req.body.callbackUrl || "https://daraja-node.vercel.app/api/callback",

# Deploy
vercel --prod
```
