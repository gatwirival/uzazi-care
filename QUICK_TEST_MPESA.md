# 🚀 QUICK START - Test M-Pesa Payment Now

## ⚡ 5-Minute Setup

### 1. Update .env
```bash
# Add this line to .env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Restart Dev Server
```bash
# Stop current server (Ctrl+C)
pnpm dev
```

### 3. Expose Localhost (For Callbacks)

**Using ngrok** (Easiest):
```bash
# Install
npm install -g ngrok

# Run in new terminal
ngrok http 3000

# Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
# Update .env:
NEXT_PUBLIC_APP_URL=https://abc123.ngrok.io

# Restart: pnpm dev
```

### 4. Test Payment Flow

#### A. Register Hospital
- Go to: http://localhost:3000/auth/register
- Fill:
  - Hospital Name: `Test Hospital`
  - Email: `test@hospital.com`
  - Password: `password123`
- Click Register

#### B. Login
- Go to: http://localhost:3000/auth/login
- Email: `test@hospital.com`
- Password: `password123`

#### C. You'll Be Redirected to Payment Page
- Should see: `/payment-required`
- Status: `PENDING_PAYMENT`
- Enter phone: `0712345678`
- Click: **Pay with M-Pesa**

#### D. Watch Terminal Logs
You should see:
```
Initiating STK Push:
  phoneNumber: 254712345678
  amount: 1
  hospitalId: hosp-xxx
  callbackUrl: https://abc123.ngrok.io/api/payments/callback

STK Push Response:
  status: true
  msg: STK push sent successfully
```

#### E. Complete Payment on Phone
- Check your phone
- Enter M-Pesa PIN
- Confirm payment

#### F. Wait for Callback (10-30 seconds)
Terminal will show:
```
=== M-PESA PAYMENT CALLBACK RECEIVED ===
✅✅✅ SUBSCRIPTION ACTIVATED ✅✅✅
Hospital: Test Hospital
Amount: 1
Receipt: SA77CVC7PZ
```

#### G. Refresh Browser
- You should be redirected to `/dashboard`
- Full access granted! ✅

---

## 🔍 Check Status

### Database
```bash
npx prisma studio

# Check:
# 1. Hospital table → subscriptionStatus = 'ACTIVE'
# 2. Payment table → status = 'SUCCESS'
```

### Payment Status API
```bash
# Get payment status
curl http://localhost:3000/api/subscription-status

# Expected:
{
  "hasAccess": true,
  "subscriptionStatus": "ACTIVE",
  "userRole": "HOSPITAL_ADMIN",
  "hospitalName": "Test Hospital"
}
```

---

## 🐛 Troubleshooting

### Callback Not Received?

**Check ngrok is running:**
```bash
# Should show forwarding URL
ngrok http 3000
```

**Check .env has ngrok URL:**
```bash
# .env should have:
NEXT_PUBLIC_APP_URL=https://abc123.ngrok.io
```

**Check Daraja server supports custom callbacks:**
```bash
# Test Daraja server
curl -X POST https://daraja-node.vercel.app/api/stkpush \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "254712345678",
    "amount": "1",
    "accountNumber": "TEST123",
    "callbackUrl": "https://abc123.ngrok.io/api/payments/callback"
  }'
```

### Payment Record Not Found?

**Check database:**
```bash
npx prisma studio

# Open Payment table
# Look for recent records with PENDING status
```

**Check CheckoutRequestID matches:**
- Compare Payment.checkoutRequestId in database
- With CheckoutRequestID in callback logs

---

## ✅ Success Indicators

- [ ] Terminal shows: "Initiating STK Push"
- [ ] Terminal shows: "STK push sent successfully"
- [ ] Phone receives M-Pesa prompt
- [ ] Terminal shows: "M-PESA PAYMENT CALLBACK RECEIVED"
- [ ] Terminal shows: "SUBSCRIPTION ACTIVATED"
- [ ] Database: Hospital.subscriptionStatus = 'ACTIVE'
- [ ] Database: Payment.status = 'SUCCESS'
- [ ] Browser redirects to /dashboard
- [ ] No more payment-required page

---

## 🎯 Test Script

```bash
#!/bin/bash

# Quick test
echo "Testing M-Pesa callback endpoint..."

curl -X POST http://localhost:3000/api/payments/callback \
  -H "Content-Type: application/json" \
  -d '{
    "Body": {
      "stkCallback": {
        "MerchantRequestID": "test-123",
        "CheckoutRequestID": "test-456",
        "ResultCode": 0,
        "ResultDesc": "Test callback",
        "CallbackMetadata": {
          "Item": [
            {"Name": "Amount", "Value": 1},
            {"Name": "MpesaReceiptNumber", "Value": "TEST123"},
            {"Name": "TransactionDate", "Value": 20240107170703},
            {"Name": "PhoneNumber", "Value": 254712345678}
          ]
        }
      }
    }
  }' | jq .

echo ""
echo "Expected response:"
echo '{"ResultCode":0,"ResultDesc":"Accepted"}'
```

---

## 📞 Support

**If payment still doesn't work:**

1. Check logs: `vercel logs --follow` (if deployed)
2. Check Daraja server: https://daraja-node.vercel.app/
3. Share terminal output showing:
   - STK Push request
   - STK Push response
   - Callback received (or not)
   - Any errors

**Common Issues:**
- ❌ No callback: ngrok not running or wrong URL
- ❌ Payment not found: CheckoutRequestID mismatch
- ❌ Subscription not active: Callback handler error (check logs)
