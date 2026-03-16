# 📝 EXACT CODE TO ADD TO DARAJA SERVER

## File: routes/index.js (or your main route file)

### STEP 1: Update STK Push Route

Find this section (around line 75):
```javascript
router.post('/api/stkpush', (req, res) => {
  let phoneNumber = req.body.phone;
  const accountNumber = req.body.accountNumber || 'TEST001';
  const amount = req.body.amount || '1';
```

**ADD THIS LINE** after the amount line:
```javascript
  const callbackUrl = req.body.callbackUrl || 'https://daraja-node.vercel.app/api/callback';
```

So it becomes:
```javascript
router.post('/api/stkpush', (req, res) => {
  let phoneNumber = req.body.phone;
  const accountNumber = req.body.accountNumber || 'TEST001';
  const amount = req.body.amount || '1';
  const callbackUrl = req.body.callbackUrl || 'https://daraja-node.vercel.app/api/callback'; // ← ADD THIS
```

---

### STEP 2: Update Console Log

Find this section (around line 95):
```javascript
  console.log("Processing payment request for:", {
    phoneNumber,
    accountNumber,
    amount
  });
```

**CHANGE TO**:
```javascript
  console.log("Processing payment request for:", {
    phoneNumber,
    accountNumber,
    amount,
    callbackUrl  // ← ADD THIS
  });
```

---

### STEP 3: Update M-Pesa Request

Find this section (around line 108):
```javascript
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
            CallBackURL: "https://daraja-node.vercel.app/api/callback",  // ← FIND THIS LINE
            AccountReference: accountNumber,
            TransactionDesc: "Mpesa Daraja API stk push test",
          },
```

**CHANGE THIS LINE**:
```javascript
CallBackURL: "https://daraja-node.vercel.app/api/callback",
```

**TO**:
```javascript
CallBackURL: callbackUrl,  // ← USE THE VARIABLE
```

---

### STEP 4: Add Confirmation Log

Find this section (around line 125):
```javascript
        .then((response) => {
          console.log("STK Push Response:", response.data);
```

**ADD AFTER** the console.log:
```javascript
          console.log("STK Push Response:", response.data);
          console.log("✅ Callback will be sent to:", callbackUrl);  // ← ADD THIS
```

---

## COMPLETE UPDATED SECTION

Here's how the complete `/api/stkpush` route should look:

```javascript
router.post('/api/stkpush', (req, res) => {
  let phoneNumber = req.body.phone;
  const accountNumber = req.body.accountNumber || 'TEST001';
  const amount = req.body.amount || '1';
  const callbackUrl = req.body.callbackUrl || 'https://daraja-node.vercel.app/api/callback'; // ← NEW

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
    callbackUrl  // ← NEW
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
            CallBackURL: callbackUrl,  // ← CHANGED!
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
          console.log("✅ Callback will be sent to:", callbackUrl);  // ← NEW
          
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
            timestamp: new Date().toISOString()
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

## DEPLOYMENT STEPS

```bash
# 1. Navigate to Daraja project
cd /home/jimmie/github/daraja/daraja-node

# 2. Open the file
code routes/index.js  # or your route file

# 3. Make the changes above

# 4. Test locally (optional)
npm start

# 5. Commit changes
git add .
git commit -m "feat: Support custom callback URL in STK Push"

# 6. Deploy to Vercel
vercel --prod
```

---

## VERIFICATION

After deploying, test with curl:

```bash
curl -X POST https://daraja-node.vercel.app/api/stkpush \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "0712345678",
    "amount": "1",
    "accountNumber": "TEST123",
    "callbackUrl": "https://webhook.site/#!/your-unique-id"
  }'
```

Check webhook.site - you should receive the callback there!

---

## EXPECTED LOGS AFTER FIX

```
Processing payment request for: {
  phoneNumber: '254712345678',
  accountNumber: 'TEST123',
  amount: '1',
  callbackUrl: 'https://clinintelai.vercel.app/api/payments/callback'
}

STK Push Response: {
  MerchantRequestID: '25505-162427436-1',
  CheckoutRequestID: 'ws_CO_07012024170905625768168060',
  ResponseCode: '0',
  ResponseDescription: 'Success. Request accepted for processing',
  CustomerMessage: 'Success. Request accepted for processing'
}

✅ Callback will be sent to: https://clinintelai.vercel.app/api/payments/callback
```

---

## IF YOU CAN'T EDIT DARAJA SERVER

Create a webhook forwarder in ClinIntelAI:

```javascript
// File: /app/api/webhooks/mpesa-proxy/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const callbackData = await request.json();
    
    console.log("=== MPESA PROXY RECEIVED ===");
    console.log(JSON.stringify(callbackData, null, 2));
    
    // Forward to actual callback handler
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/payments/callback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(callbackData)
    });
    
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
  }
}
```

Then use `/api/webhooks/mpesa-proxy` as your callback URL.
