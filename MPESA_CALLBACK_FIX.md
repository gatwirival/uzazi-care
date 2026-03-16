# 🔧 M-PESA CALLBACK FIX - Payment Integration Complete

## 🚨 Problem Identified

**Issue**: M-Pesa callbacks were going to `daraja-node.vercel.app` instead of your ClinIntelAI app, so payments succeeded but subscription status was never updated.

**Root Cause**: The Daraja server didn't know where to send callbacks for your app.

---

## ✅ What Was Fixed

### 1. **Added Callback URL to STK Push Request**

**File**: `/lib/services/mpesa-payment.ts`

```typescript
// Now sends your app's callback URL to Daraja server
const callbackUrl = process.env.NEXT_PUBLIC_APP_URL 
  ? `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/callback`
  : 'http://localhost:3000/api/payments/callback';

// Included in STK Push request
body: JSON.stringify({
  phone: formattedPhone,
  amount: amount.toString(),
  accountNumber: hospitalId,
  callbackUrl: callbackUrl, // ← NEW!
})
```

### 2. **Added Environment Variable**

**File**: `.env`

```bash
# Development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Production (when you deploy)
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### 3. **Enhanced Callback Handler with Detailed Logging**

**File**: `/app/api/payments/callback/route.ts`

Now you'll see in your terminal:
```
=== M-PESA PAYMENT CALLBACK RECEIVED ===
Timestamp: 2025-10-12T10:30:45.123Z
📋 Callback Details:
  merchantRequestID: 25505-162427436-1
  checkoutRequestID: ws_CO_07012024170905625768168060
  resultCode: 0
  resultDesc: The service request is processed successfully.

🔍 Searching for payment record...
✅ Payment record found:
  paymentId: cm123abc
  hospitalId: hosp-xyz
  hospitalName: Nyeri General Hospital

💰 Payment Successful:
  amount: 1
  mpesaReceiptNumber: SA77CVC7PZ
  transactionDate: 20240107170703
  phoneNumber: 254768168060

📝 Updating payment record to SUCCESS...
🏥 Activating hospital subscription...

✅✅✅ SUBSCRIPTION ACTIVATED ✅✅✅
Hospital: Nyeri General Hospital
Amount: 1
Receipt: SA77CVC7PZ
Next Billing: 2025-11-11T10:30:45.123Z
==========================================
```

---

## 🧪 Testing Instructions

### Local Development Testing

#### Step 1: Start Dev Server
```bash
# Make sure NEXT_PUBLIC_APP_URL is set in .env
pnpm dev
```

#### Step 2: Expose Localhost to Internet (for M-Pesa callbacks)

**Option A: Using ngrok** (Recommended)
```bash
# Install ngrok
npm install -g ngrok

# Expose port 3000
ngrok http 3000
```

You'll get a URL like: `https://abc123.ngrok.io`

**Update your .env:**
```bash
NEXT_PUBLIC_APP_URL=https://abc123.ngrok.io
```

**Option B: Using Cloudflare Tunnel**
```bash
# Install cloudflared
brew install cloudflared  # macOS
# or download from https://github.com/cloudflare/cloudflared

# Expose port 3000
cloudflared tunnel --url http://localhost:3000
```

**Option C: Deploy to Vercel** (Best for testing)
```bash
vercel --prod
```

Then update .env on Vercel dashboard.

#### Step 3: Register New Hospital
```bash
# Go to: http://localhost:3000/auth/register
# Or use your ngrok/vercel URL

# Register:
Hospital Name: Test Hospital
Email: test@hospital.com
Password: password123
```

#### Step 4: Login and Test Payment
```bash
# Login at: /auth/login

# You'll be redirected to: /payment-required
# Enter phone: 0712345678 (or any test number)
# Click "Pay with M-Pesa"
```

#### Step 5: Watch Terminal Logs

**In your ClinIntelAI terminal, you should see:**
```
Initiating STK Push:
  phoneNumber: 254712345678
  amount: 1
  hospitalId: hosp-xyz
  callbackUrl: http://localhost:3000/api/payments/callback

STK Push Response:
  status: true
  msg: STK push sent successfully
  requestId: ws_CO_07012024170905625768168060
```

**After you complete payment on phone:**
```
=== M-PESA PAYMENT CALLBACK RECEIVED ===
✅✅✅ SUBSCRIPTION ACTIVATED ✅✅✅
```

#### Step 6: Verify Subscription Update
```bash
# Check database
npx prisma studio

# Open Hospital table
# Verify: subscriptionStatus = 'ACTIVE'
# Verify: nextBillingDate is set to +30 days
```

#### Step 7: Access Dashboard
```bash
# Refresh your browser
# You should now be redirected to /dashboard
# No more payment-required page!
```

---

## 🌐 Production Deployment

### Step 1: Deploy to Vercel
```bash
# Push to GitHub
git add .
git commit -m "Fix M-Pesa callback integration"
git push

# Or deploy directly
vercel --prod
```

### Step 2: Set Environment Variable on Vercel

Go to: https://vercel.com/your-project/settings/environment-variables

Add:
```
NEXT_PUBLIC_APP_URL = https://your-app.vercel.app
```

### Step 3: Redeploy
```bash
vercel --prod
```

---

## 📊 Callback Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    M-PESA PAYMENT FLOW                          │
└─────────────────────────────────────────────────────────────────┘

1. User Clicks "Pay with M-Pesa"
   │
   ▼
2. ClinIntelAI calls POST /api/payments
   │
   ▼
3. Create Payment record (status: PENDING)
   │  - merchantRequestId
   │  - checkoutRequestId
   │  - hospitalId
   │
   ▼
4. Call Daraja Server: POST https://daraja-node.vercel.app/api/stkpush
   │  Body:
   │  - phone: 254712345678
   │  - amount: 1
   │  - accountNumber: hospitalId
   │  - callbackUrl: https://your-app.com/api/payments/callback ← NEW!
   │
   ▼
5. Daraja Server → M-Pesa API
   │
   ▼
6. M-Pesa sends STK push to user's phone
   │
   ▼
7. User enters PIN and confirms
   │
   ▼
8. M-Pesa processes payment
   │
   ▼
9. M-Pesa calls callback URL:
   │  POST https://your-app.com/api/payments/callback
   │  Body: {
   │    Body: {
   │      stkCallback: {
   │        MerchantRequestID: "...",
   │        CheckoutRequestID: "...",
   │        ResultCode: 0,
   │        ResultDesc: "Success",
   │        CallbackMetadata: {
   │          Item: [
   │            { Name: "Amount", Value: 1 },
   │            { Name: "MpesaReceiptNumber", Value: "SA77CVC7PZ" },
   │            { Name: "TransactionDate", Value: 20240107170703 },
   │            { Name: "PhoneNumber", Value: 254712345678 }
   │          ]
   │        }
   │      }
   │    }
   │  }
   │
   ▼
10. ClinIntelAI receives callback
    │
    ▼
11. Find Payment record by CheckoutRequestID
    │
    ▼
12. Update Payment status to SUCCESS
    │  - mpesaReceiptNumber
    │  - phoneNumber
    │  - metadata
    │
    ▼
13. Update Hospital subscription
    │  - subscriptionStatus: 'ACTIVE'
    │  - nextBillingDate: +30 days
    │  - isActive: true
    │
    ▼
14. User refreshes page → Redirected to /dashboard ✅
```

---

## 🔍 Debugging Tips

### Check if Callback URL is Reachable

```bash
# Test your callback endpoint
curl -X POST https://your-app.vercel.app/api/payments/callback \
  -H "Content-Type: application/json" \
  -d '{
    "Body": {
      "stkCallback": {
        "MerchantRequestID": "test",
        "CheckoutRequestID": "test",
        "ResultCode": 0,
        "ResultDesc": "Test"
      }
    }
  }'
```

Expected response:
```json
{
  "ResultCode": 0,
  "ResultDesc": "Accepted"
}
```

### Check Vercel Logs

```bash
# Real-time logs
vercel logs --follow

# Or in Vercel Dashboard:
# https://vercel.com/your-project/deployments → Click deployment → Logs
```

### Check Database

```bash
# Check payment records
npx prisma studio

# Or SQL:
SELECT 
  p.id,
  p.status,
  p.amount,
  p."mpesaReceiptNumber",
  p."checkoutRequestId",
  h.name as hospital_name,
  h."subscriptionStatus"
FROM "Payment" p
JOIN "Hospital" h ON h.id = p."hospitalId"
ORDER BY p."createdAt" DESC
LIMIT 10;
```

### Common Issues

| Issue | Solution |
|-------|----------|
| Callback not received | 1. Check NEXT_PUBLIC_APP_URL is set<br>2. Ensure URL is publicly accessible<br>3. Check Daraja server supports custom callback URLs |
| Payment record not found | 1. Check CheckoutRequestID matches<br>2. Verify payment was created before callback |
| Subscription not updating | 1. Check callback handler logs<br>2. Verify resultCode === 0<br>3. Check database connection |

---

## 📝 Summary

✅ **Callback URL**: Now sent to Daraja server
✅ **Environment Variable**: NEXT_PUBLIC_APP_URL added
✅ **Enhanced Logging**: Detailed callback tracking
✅ **Payment Flow**: Register → Pay → Callback → Activate → Dashboard

**Next Steps:**
1. Test locally with ngrok
2. Verify callback is received
3. Check subscription activates
4. Deploy to Vercel
5. Test in production

---

## 🎯 Quick Test Script

```bash
#!/bin/bash

echo "🧪 Testing M-Pesa Payment Flow"
echo "================================"

# 1. Check environment
echo "1️⃣ Checking NEXT_PUBLIC_APP_URL..."
if [ -z "$NEXT_PUBLIC_APP_URL" ]; then
  echo "❌ NEXT_PUBLIC_APP_URL not set!"
  echo "Add to .env: NEXT_PUBLIC_APP_URL=http://localhost:3000"
  exit 1
fi
echo "✅ NEXT_PUBLIC_APP_URL = $NEXT_PUBLIC_APP_URL"

# 2. Start dev server
echo ""
echo "2️⃣ Starting dev server..."
pnpm dev &
DEV_PID=$!
sleep 5

# 3. Test callback endpoint
echo ""
echo "3️⃣ Testing callback endpoint..."
curl -s -X POST http://localhost:3000/api/payments/callback \
  -H "Content-Type: application/json" \
  -d '{"Body":{"stkCallback":{"MerchantRequestID":"test","CheckoutRequestID":"test","ResultCode":0,"ResultDesc":"Test"}}}' \
  | jq .

echo ""
echo "✅ Test complete!"
echo ""
echo "Next: Register a hospital and test payment flow"
echo "Go to: http://localhost:3000/auth/register"

# Cleanup
kill $DEV_PID
```

Save as `test-mpesa-callback.sh` and run:
```bash
chmod +x test-mpesa-callback.sh
./test-mpesa-callback.sh
```
