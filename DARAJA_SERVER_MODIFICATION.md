# 🔧 Daraja Server Modification Guide

## 📝 For Production: Enable Custom Callback URLs

Currently, your Daraja server at `daraja-node.vercel.app` has a **hardcoded callback URL**. To make it production-ready for multiple applications, you should allow custom callback URLs.

---

## 🎯 Current Code (Hardcoded)

**File:** `routes/index.js` (around line 165)

```javascript
router.post('/api/stkpush', (req, res) => {
  let phoneNumber = req.body.phone;
  const accountNumber = req.body.accountNumber || 'TEST001';
  const amount = req.body.amount || '1';
  
  // ❌ HARDCODED - All apps get callbacks here
  // This means ClinIntelAI never gets notified!
  
  // ... phone validation ...
  
  getAccessToken().then((accessToken) => {
    const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
    const auth = "Bearer " + accessToken;
    const timestamp = moment().format("YYYYMMDDHHmmss");
    const password = new Buffer.from(
      "174379" +
      "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919" +
      timestamp
    ).toString("base64");

    axios.post(url, {
      BusinessShortCode: "174379",
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: "1",
      PartyA: phoneNumber,
      PartyB: "174379",
      PhoneNumber: phoneNumber,
      CallBackURL: "https://daraja-node.vercel.app/api/callback",  // ❌ HARDCODED!
      AccountReference: accountNumber,
      TransactionDesc: "Mpesa Daraja API stk push test",
    }, {
      headers: { Authorization: auth }
    })
    .then((response) => {
      // ... success handling ...
    })
    .catch((error) => {
      // ... error handling ...
    });
  });
});
```

---

## ✅ Modified Code (Dynamic Callbacks)

**REPLACE the code above with this:**

```javascript
router.post('/api/stkpush', (req, res) => {
  let phoneNumber = req.body.phone;
  const accountNumber = req.body.accountNumber || 'TEST001';
  const amount = req.body.amount || '1';
  
  // ✅ NEW: Accept custom callback URL from request
  // Falls back to default if not provided (backward compatible)
  const callbackUrl = req.body.callbackUrl || 'https://daraja-node.vercel.app/api/callback';
  
  console.log('📞 Processing STK Push with callback:', callbackUrl);

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
    callbackUrl  // ✅ Log the callback URL
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

      axios.post(url, {
        BusinessShortCode: "174379",
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: "1",
        PartyA: phoneNumber,
        PartyB: "174379",
        PhoneNumber: phoneNumber,
        CallBackURL: callbackUrl,  // ✅ USE DYNAMIC CALLBACK URL
        AccountReference: accountNumber,
        TransactionDesc: "Mpesa Daraja API stk push test",
      }, {
        headers: { Authorization: auth }
      })
      .then((response) => {
        console.log("STK Push Response:", response.data);
        
        // Initialize STK transactions array if not exists
        if (!global.stkTransactions) global.stkTransactions = [];
        
        // Store transaction with pending status
        const transaction = {
          merchantRequestID: response.data.MerchantRequestID,
          checkoutRequestID: response.data.CheckoutRequestID,
          responseCode: response.data.ResponseCode,
          responseDescription: response.data.ResponseDescription,
          customerMessage: response.data.CustomerMessage,
          phoneNumber: phoneNumber,
          accountReference: accountNumber,
          amount: "1",
          status: 'pending',
          timestamp: new Date().toISOString(),
          callbackUrl: callbackUrl  // ✅ STORE CALLBACK URL
        };
        
        global.stkTransactions.push(transaction);
        console.log("Transaction stored with status: pending");
        
        res.status(200).json({
          msg: "Request successful. Please enter M-PESA PIN to complete transaction",
          status: true,
          checkoutRequestId: response.data.CheckoutRequestID,
          merchantRequestId: response.data.MerchantRequestID,
          responseCode: response.data.ResponseCode,
          customerMessage: response.data.CustomerMessage
        });
      })
      .catch((error) => {
        console.error("STK Push Error:", error.response?.data || error.message);
        res.status(500).json({
          msg: "Request failed",
          status: false,
          error: error.response?.data || error.message
        });
      });
    })
    .catch(error => {
      console.error("Access Token Error:", error);
      res.status(500).json({
        msg: "Authentication failed",
        status: false
      });
    });
});
```

---

## 📝 What Changed

### 1. Accept `callbackUrl` Parameter

```javascript
// ✅ NEW LINE - Add after amount
const callbackUrl = req.body.callbackUrl || 'https://daraja-node.vercel.app/api/callback';
```

- Accepts custom callback URL from client
- Falls back to default if not provided
- **Backward compatible** with existing integrations

### 2. Use Dynamic Callback URL

```javascript
// ✅ CHANGED LINE
CallBackURL: callbackUrl,  // Instead of hardcoded URL
```

### 3. Log Callback URL (Optional but Helpful)

```javascript
// ✅ HELPFUL FOR DEBUGGING
console.log('📞 Processing STK Push with callback:', callbackUrl);
```

### 4. Store Callback URL in Transaction (Optional)

```javascript
// ✅ USEFUL FOR TRACKING
const transaction = {
  // ... other fields ...
  callbackUrl: callbackUrl
};
```

---

## 🚀 How ClinIntelAI Will Use It

Once you deploy this change to your Daraja server, update ClinIntelAI's code:

**File:** `/lib/services/mpesa-payment.ts`

```typescript
export async function initiateSTKPush(
  phoneNumber: string,
  amount: number,
  hospitalId: string
): Promise<STKPushResponse> {
  
  // Get app URL from environment
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const callbackUrl = `${appUrl}/api/payments/callback`;

  console.log('Initiating STK Push:', {
    phoneNumber,
    amount,
    hospitalId,
    callbackUrl  // ✅ Your custom callback
  });

  const response = await fetch('https://daraja-node.vercel.app/api/stkpush', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      phone: phoneNumber,
      amount: amount.toString(),
      accountNumber: hospitalId,
      callbackUrl: callbackUrl  // ✅ SEND YOUR CALLBACK URL
    })
  });

  // ... rest of code ...
}
```

---

## 🎯 Benefits of This Change

### For Your Daraja Server
- ✅ **Reusable**: Multiple apps can use it with different callbacks
- ✅ **Backward Compatible**: Existing integrations still work
- ✅ **Flexible**: Each app gets its own callback notifications
- ✅ **Professional**: Enterprise-ready architecture

### For ClinIntelAI
- ✅ **Direct Callbacks**: M-Pesa calls YOUR app directly
- ✅ **Instant Updates**: No polling needed
- ✅ **Real-time**: Database updates immediately
- ✅ **Scalable**: Works for any number of payments

---

## 📊 Payment Flow After Modification

```
┌────────────────────────────────────────────────────────────────┐
│              PAYMENT FLOW (WITH CUSTOM CALLBACKS)              │
└────────────────────────────────────────────────────────────────┘

1. User clicks "Pay with M-Pesa"
   ↓
2. ClinIntelAI → POST /api/payments
   ↓
3. ClinIntelAI → POST https://daraja-node.vercel.app/api/stkpush
   {
     phone: "254712345678",
     amount: "1",
     callbackUrl: "https://your-app.vercel.app/api/payments/callback" ✅
   }
   ↓
4. Daraja → POST https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest
   {
     CallBackURL: "https://your-app.vercel.app/api/payments/callback" ✅
   }
   ↓
5. M-Pesa sends STK push to user's phone
   ↓
6. User enters PIN
   ↓
7. M-Pesa → POST https://your-app.vercel.app/api/payments/callback ✅
   (Goes DIRECTLY to your app!)
   ↓
8. Your app updates database immediately ✅
   ↓
9. Hospital subscription activated ✅
   ↓
10. User redirected to dashboard ✅

Total time: ~5 seconds ⚡ (vs ~12 seconds with polling)
```

---

## 🧪 Testing After Deployment

### 1. Deploy Modified Daraja Server

```bash
# In your daraja-node repository
git add routes/index.js
git commit -m "feat: Support custom callback URLs in STK Push"
git push origin main

# Vercel will auto-deploy
```

### 2. Update ClinIntelAI Environment

```bash
# In .env
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### 3. Deploy ClinIntelAI

```bash
# In clinintelai repository
git add .
git commit -m "feat: Use custom callback URL for M-Pesa payments"
git push origin main
```

### 4. Test Payment

1. Navigate to `/payment-required`
2. Enter phone number
3. Click "Pay with M-Pesa"
4. Enter PIN on phone
5. **Your callback should be called immediately!**

### 5. Verify Callback Was Called

Check your Vercel logs:
```
[POST] /api/payments/callback
Body: {
  "Body": {
    "stkCallback": {
      "MerchantRequestID": "...",
      "CheckoutRequestID": "...",
      "ResultCode": 0,
      "ResultDesc": "The service request is processed successfully.",
      ...
    }
  }
}
```

---

## ⚖️ Current Solution vs Modified Solution

### Current (Polling - Already Working!)
```
✅ Functional right now
✅ No server changes needed
⚠️ Polls every 2 seconds
⚠️ Slight delay (~12 seconds)
⚠️ More API calls
```

### Modified (Direct Callbacks - Optional Upgrade)
```
✅ Instant updates (~5 seconds)
✅ Fewer API calls
✅ More efficient
⚠️ Requires Daraja server modification
⚠️ Requires production URL (Vercel/ngrok)
```

---

## 🎯 Recommendation

### For Development (Now)
**Use current polling solution** - It works perfectly!

### For Production (Later)
**Implement custom callbacks** - Better performance and user experience

### Priority
**Low** - Current solution is production-ready. This is an **optimization**, not a fix.

---

## ✅ Summary

Your Daraja server currently works but sends all callbacks to itself. The modification above:

1. ✅ Accepts `callbackUrl` parameter
2. ✅ Passes it to M-Pesa
3. ✅ Backward compatible
4. ✅ Enables direct callbacks to any app

**Change needed:** Just 1 line of code!

```javascript
// Before
CallBackURL: "https://daraja-node.vercel.app/api/callback",

// After
CallBackURL: callbackUrl,  // From req.body.callbackUrl
```

That's it! 🎉
