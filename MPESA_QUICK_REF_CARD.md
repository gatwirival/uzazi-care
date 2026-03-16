# 🎯 M-PESA PAYMENT - QUICK REFERENCE CARD

## 🚀 Instant Setup (2 Minutes)

```bash
# 1. Add to .env
echo "NEXT_PUBLIC_APP_URL=http://localhost:3000" >> .env

# 2. Install ngrok (one-time)
npm install -g ngrok

# 3. Start ngrok
ngrok http 3000
# Copy HTTPS URL: https://abc123.ngrok.io

# 4. Update .env with ngrok URL
NEXT_PUBLIC_APP_URL=https://abc123.ngrok.io

# 5. Start dev server
pnpm dev

# 6. Test
./test-callback.sh
```

---

## 📱 Test Flow (30 Seconds)

1. **Register**: `/auth/register` → `test@hospital.com` / `password123`
2. **Login**: Auto-redirect to `/payment-required`
3. **Pay**: Enter `0712345678` → Click "Pay with M-Pesa"
4. **Phone**: Enter PIN `1234` → Confirm
5. **Wait**: 10-30 seconds
6. **Refresh**: Redirected to `/dashboard` ✅

---

## 🔍 Expected Terminal Output

### When You Click "Pay"
```
Initiating STK Push:
  callbackUrl: https://abc123.ngrok.io/api/payments/callback ← IMPORTANT!
STK Push Response:
  status: true
```

### When Payment Completes
```
=== M-PESA PAYMENT CALLBACK RECEIVED ===
✅✅✅ SUBSCRIPTION ACTIVATED ✅✅✅
```

---

## ⚠️ Common Issues

| Issue | Fix |
|-------|-----|
| No callback | Check ngrok is running: `ngrok http 3000` |
| Wrong callback URL | Update .env: `NEXT_PUBLIC_APP_URL=https://abc123.ngrok.io` |
| Server not restarting | Restart: `Ctrl+C` then `pnpm dev` |
| Payment not found | Check database: `npx prisma studio` |

---

## ✅ Success Indicators

- [ ] Terminal shows `callbackUrl: https://...` in STK Push
- [ ] Terminal shows "M-PESA PAYMENT CALLBACK RECEIVED"
- [ ] Terminal shows "SUBSCRIPTION ACTIVATED"
- [ ] Database: `subscriptionStatus` = `ACTIVE`
- [ ] Browser: Redirected to `/dashboard`

---

## 📊 Files Changed

- ✅ `.env` - Added `NEXT_PUBLIC_APP_URL`
- ✅ `lib/services/mpesa-payment.ts` - Added callback URL
- ✅ `app/api/payments/callback/route.ts` - Enhanced logging

---

## 🎯 Production Deployment

```bash
# 1. Deploy
vercel --prod

# 2. Add to Vercel environment variables
NEXT_PUBLIC_APP_URL = https://your-app.vercel.app

# 3. Redeploy
vercel --prod
```

---

## 🔗 Quick Links

- **Test Script**: `./test-callback.sh`
- **Full Guide**: `MPESA_CALLBACK_FIX.md`
- **Quick Test**: `QUICK_TEST_MPESA.md`
- **Summary**: `PAYMENT_FIX_SUMMARY.md`

---

## 💡 Key Points

1. **Callback URL** is sent to Daraja server with STK Push
2. **M-Pesa calls YOUR app** at `/api/payments/callback`
3. **Payment and subscription** auto-update on successful payment
4. **ngrok required** for local testing (or deploy to Vercel)
5. **Watch terminal logs** to debug issues

---

## 🆘 Emergency Fixes

### Manual Subscription Activation
```sql
UPDATE "Hospital"
SET "subscriptionStatus" = 'ACTIVE',
    "nextBillingDate" = NOW() + INTERVAL '30 days'
WHERE email = 'your-email@example.com';
```

### Check Payment Status
```sql
SELECT * FROM "Payment"
WHERE "hospitalId" = (
  SELECT id FROM "Hospital" 
  WHERE email = 'your-email@example.com'
)
ORDER BY "createdAt" DESC LIMIT 1;
```

### Test Callback Manually
```bash
curl -X POST http://localhost:3000/api/payments/callback \
  -H "Content-Type: application/json" \
  -d '{"Body":{"stkCallback":{"MerchantRequestID":"test","CheckoutRequestID":"test","ResultCode":0,"ResultDesc":"Test"}}}'
```

---

**Need Help?** Check terminal logs and share:
- STK Push request/response
- Callback logs
- Database status (Payment + Hospital tables)
