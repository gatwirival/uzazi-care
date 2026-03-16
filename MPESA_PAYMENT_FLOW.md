# 💳 M-Pesa Payment Flow - Complete Architecture

## Overview

The payment system uses **daraja-node.vercel.app** as an M-Pesa gateway. Your ClinIntelAI app initiates payments and polls for status updates.

---

## 🔄 Payment Flow Diagram

```
┌─────────────────┐
│  ClinIntelAI    │
│  (Your App)     │
└────────┬────────┘
         │
         │ 1. Initiate STK Push
         │    POST /api/payments
         │    { phone, amount, hospitalId }
         ▼
┌─────────────────┐
│  Daraja Server  │
│  (Gateway)      │
└────────┬────────┘
         │
         │ 2. Send STK Push to M-Pesa
         │    { phone, amount, callback }
         ▼
┌─────────────────┐
│     M-Pesa      │
│   (Safaricom)   │
└────────┬────────┘
         │
         │ 3. User enters PIN on phone
         │
         ├─────────────────────┐
         │                     │
         │ 4a. Callback        │ 4b. Store result
         ▼                     ▼
┌─────────────────┐    ┌─────────────────┐
│  Daraja Server  │    │  Daraja Server  │
│   /api/callback │    │   Database      │
└─────────────────┘    └─────────────────┘
                              │
         ┌────────────────────┘
         │
         │ 5. Poll for status
         │    GET /api/stkpush/status/:checkoutRequestId
         ▼
┌─────────────────┐
│  ClinIntelAI    │
│  GET /api/      │
│  payments/status│
└────────┬────────┘
         │
         │ 6. Query Daraja + Update local DB
         │
         ▼
┌─────────────────┐
│   Your Prisma   │
│    Database     │
└─────────────────┘
```

---

## 📝 Detailed Flow

### Step 1: Initiate Payment (ClinIntelAI → Daraja)

**File**: `/app/api/payments/route.ts`

```typescript
POST /api/payments
{
  "phoneNumber": "0712345678",
  "amount": 1
}
```

**What happens**:
1. Creates PENDING payment record in your Prisma database
2. Sends STK push request to Daraja server:
   ```typescript
   {
     phone: "254712345678",
     amount: "1",
     accountNumber: hospitalId,
     callbackUrl: "https://daraja-node.vercel.app/api/callback"
   }
   ```
3. Returns `checkoutRequestId` to frontend

**Prisma Record Created**:
```typescript
{
  checkoutRequestId: "ws_CO_12102025104808140113514156",
  merchantRequestId: "511a-4170-bdf1-a1a5a323ee0711954",
  status: "PENDING",
  amount: 1,
  hospitalId: "bd8cd394-911d-4d1d-be34-310fddb28304"
}
```

---

### Step 2: M-Pesa Processing (Daraja → M-Pesa)

**What happens**:
1. Daraja server forwards request to M-Pesa API
2. M-Pesa sends STK push to user's phone
3. User enters PIN to complete payment

---

### Step 3: M-Pesa Callback (M-Pesa → Daraja)

**What happens**:
1. M-Pesa sends callback to: `https://daraja-node.vercel.app/api/callback`
2. Daraja server receives payment result
3. Daraja server stores result in its database

**Callback Data Example**:
```json
{
  "Body": {
    "stkCallback": {
      "MerchantRequestID": "511a-4170-bdf1-a1a5a323ee0711954",
      "CheckoutRequestID": "ws_CO_12102025104808140113514156",
      "ResultCode": 0,
      "ResultDesc": "The service request is processed successfully.",
      "CallbackMetadata": {
        "Item": [
          { "Name": "Amount", "Value": 1 },
          { "Name": "MpesaReceiptNumber", "Value": "RK1234ABCD" },
          { "Name": "TransactionDate", "Value": 20251012104815 },
          { "Name": "PhoneNumber", "Value": 254113514156 }
        ]
      }
    }
  }
}
```

**Result Codes**:
- `0` = Success
- `1` = Insufficient funds
- `1032` = Cancelled by user
- `1037` = Timeout
- `2001` = Wrong PIN

---

### Step 4: Poll for Status (ClinIntelAI → Daraja)

**File**: `/app/api/payments/status/route.ts`

**What happens**:
1. Frontend polls every 2 seconds:
   ```
   GET /api/payments/status?checkoutRequestId=ws_CO_12102025104808140113514156
   ```

2. Backend checks local database first
3. If status is still `PENDING`, queries Daraja server:
   ```
   GET https://daraja-node.vercel.app/api/stkpush/status/ws_CO_12102025104808140113514156
   ```

4. If Daraja has a result:
   - Updates Payment record in Prisma
   - If successful, activates Hospital subscription
   - Returns updated status to frontend

5. Frontend receives status and either:
   - Continues polling if PENDING
   - Shows success and refreshes page
   - Shows error message

---

## 🗄️ Database Schema

### Payment Table (Your Prisma DB)

```prisma
model Payment {
  id                  String        @id @default(cuid())
  hospitalId          String
  amount              Float
  phoneNumber         String
  merchantRequestId   String?
  checkoutRequestId   String        @unique
  mpesaReceiptNumber  String?
  transactionDate     DateTime?
  status              PaymentStatus @default(PENDING)
  resultCode          String?
  resultDesc          String?
  billingPeriodStart  DateTime?
  billingPeriodEnd    DateTime?
  metadata            Json?
  createdAt           DateTime      @default(now())
  updatedAt           DateTime      @updatedAt

  Hospital Hospital @relation(fields: [hospitalId], references: [id], onDelete: Cascade)
}

enum PaymentStatus {
  PENDING
  SUCCESS
  FAILED
  CANCELLED
  TIMEOUT
}
```

---

## 🔍 Daraja Server API Endpoints

### Base URL
```
https://daraja-node.vercel.app
```

### Endpoints Used

#### 1. Initiate STK Push
```http
POST /api/stkpush
Content-Type: application/json

{
  "phone": "254712345678",
  "amount": "1",
  "accountNumber": "hospital-id-here",
  "callbackUrl": "https://daraja-node.vercel.app/api/callback"
}
```

**Response**:
```json
{
  "msg": "Request successful. Please enter M-PESA PIN to complete transaction",
  "status": true,
  "checkoutRequestId": "ws_CO_12102025104808140113514156",
  "merchantRequestId": "511a-4170-bdf1-a1a5a323ee0711954",
  "responseCode": "0",
  "customerMessage": "Success. Request accepted for processing"
}
```

#### 2. Check Payment Status
```http
GET /api/stkpush/status/:checkoutRequestId
```

**Response** (Pending):
```json
{
  "status": "pending",
  "CheckoutRequestID": "ws_CO_12102025104808140113514156",
  "message": "Payment still pending"
}
```

**Response** (Success):
```json
{
  "status": "success",
  "ResultCode": "0",
  "ResultDesc": "The service request is processed successfully.",
  "MpesaReceiptNumber": "RK1234ABCD",
  "TransactionDate": "20251012104815",
  "CheckoutRequestID": "ws_CO_12102025104808140113514156",
  "MerchantRequestID": "511a-4170-bdf1-a1a5a323ee0711954",
  "Amount": 1,
  "PhoneNumber": "254113514156"
}
```

**Response** (Failed):
```json
{
  "status": "failed",
  "ResultCode": "1032",
  "ResultDesc": "Request cancelled by user",
  "CheckoutRequestID": "ws_CO_12102025104808140113514156"
}
```

#### 3. Get All Transactions (Optional)
```http
GET /api/stkpush/transactions
```

Returns all STK push transactions stored in Daraja server.

---

## 🎯 How It All Works Together

### Initial State
```
Payment DB: PENDING
Hospital DB: PENDING_PAYMENT (no access)
```

### After Successful Payment
```
Payment DB: SUCCESS
  - mpesaReceiptNumber: "RK1234ABCD"
  - resultCode: "0"
  - resultDesc: "Success"
  
Hospital DB: ACTIVE
  - lastPaymentDate: 2025-10-12
  - nextBillingDate: 2025-11-12
  - subscriptionStatus: ACTIVE ← User gets access!
```

---

## 🧪 Testing

### Test with Daraja Sandbox

1. **Initiate payment**:
   ```bash
   curl -X POST http://localhost:3000/api/payments \
     -H "Content-Type: application/json" \
     -H "Cookie: your-session-cookie" \
     -d '{"phoneNumber":"0712345678","amount":1}'
   ```

2. **Check Daraja server status**:
   ```bash
   curl https://daraja-node.vercel.app/api/stkpush/status/ws_CO_12102025104808140113514156
   ```

3. **Check your app status**:
   ```bash
   curl http://localhost:3000/api/payments/status?checkoutRequestId=ws_CO_12102025104808140113514156
   ```

### Sandbox Test Numbers
- Phone: `254113514156` (or any 254... number in sandbox)
- PIN: `1234`
- Amount: `1` (KES 1 for testing)

---

## 🐛 Troubleshooting

### Payment stays PENDING forever

**Cause**: Daraja server hasn't received callback yet or payment was cancelled.

**Fix**:
1. Check Daraja server status:
   ```bash
   curl https://daraja-node.vercel.app/api/stkpush/status/YOUR_CHECKOUT_ID
   ```
2. If it shows success, your status endpoint will update on next poll
3. If it shows pending after 60s, payment likely timed out

### "Payment not found" error

**Cause**: `checkoutRequestId` mismatch between Daraja response and your DB.

**Fix**: Check your logs for the exact `checkoutRequestId` value.

### Subscription not activating

**Cause**: Payment status endpoint not updating Hospital record.

**Fix**: Check server logs for "Hospital X subscription activated" message.

---

## 📊 Monitoring

### What to log:

1. **STK Push initiated**:
   ```
   Initiating STK Push: { phoneNumber, amount, hospitalId, callbackUrl }
   ```

2. **Daraja response**:
   ```
   STK Push Response: { checkoutRequestId, merchantRequestId, status }
   ```

3. **Status poll**:
   ```
   Checking Daraja server for: ws_CO_...
   Daraja server response: { ResultCode, ResultDesc }
   ```

4. **Database update**:
   ```
   Payment ws_CO_... updated to SUCCESS
   Hospital bd8cd394-... subscription activated
   ```

---

## 🎉 Success Indicators

You know it's working when you see:

1. ✅ Payment created in Prisma with PENDING status
2. ✅ STK push received on phone
3. ✅ User enters PIN
4. ✅ Daraja server status shows "success"
5. ✅ Your status endpoint updates payment to SUCCESS
6. ✅ Hospital subscription status changes to ACTIVE
7. ✅ User can access dashboard

---

## 🔐 Production Considerations

1. **Environment Variables**:
   ```env
   MPESA_API_URL=https://daraja-node.vercel.app
   ```

2. **Error Handling**: All critical paths have try-catch blocks

3. **Retry Logic**: Frontend polls up to 30 times (60 seconds)

4. **Transaction Logging**: All payments logged in Prisma

5. **Security**: 
   - Session-based auth required
   - Hospital can only check own payments
   - Super admin can view all

---

## 📚 Related Files

- `/lib/services/mpesa-payment.ts` - Payment service functions
- `/app/api/payments/route.ts` - Initiate payment
- `/app/api/payments/status/route.ts` - Check payment status
- `/components/UpgradeOverlay.tsx` - Payment UI for hospital admin
- `/app/payment-required/page.tsx` - Standalone payment page

---

**Note**: The Daraja server at `https://daraja-node.vercel.app` is a separate service that handles M-Pesa API integration. Your ClinIntelAI app communicates with it via REST API.
