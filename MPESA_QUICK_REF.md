# 🚀 Quick Reference - M-Pesa Payment System

## Super Admin Account

**Login Credentials**:
- Email: `jkimunyi@gmail.com`
- Password: `@_Kimunyi123!`
- Role: SUPER_ADMIN

**Seed Script**:
```bash
npx tsx prisma/seed.ts
```

---

## Payment Flow (1 Minute)

### For Hospital Admin:
1. **Login** → Dashboard
2. **See Overlay** → Upgrade Plan screen
3. **Enter Phone** → `0712345678` or `+254712345678`
4. **Click Pay** → M-Pesa STK push sent
5. **Enter PIN** → Complete on phone
6. **Wait** → Auto-refresh on success

### For Super Admin:
1. **Login** → Dashboard
2. **Click Payments** → View all transactions
3. **Filter** → All, Success, Failed, Pending
4. **Monitor** → Real-time payment tracking

---

## Key Files

| File | Purpose |
|------|---------|
| `/prisma/seed.ts` | Super Admin seed data |
| `/lib/services/mpesa-payment.ts` | M-Pesa integration |
| `/app/api/payments/callback/route.ts` | Payment callback handler |
| `/app/api/payments/status/route.ts` | Status checking API |
| `/components/UpgradeOverlay.tsx` | Payment UI for hospitals |
| `/app/dashboard/payments/page.tsx` | Super Admin payment dashboard |
| `/app/dashboard/layout.tsx` | Subscription check integration |

---

## API Endpoints

### Initiate Payment
```http
POST /api/payments
Content-Type: application/json

{
  "phoneNumber": "0712345678",
  "amount": 1
}
```

### Check Status
```http
GET /api/payments/status?checkoutRequestId=CR123456789
```

### Callback (M-Pesa Server)
```http
POST /api/payments/callback
```

---

## Payment Server

**URL**: https://daraja-node.vercel.app

**Endpoints Used**:
- `/api/stkpush` - Initiate STK push
- `/api/callback` - Receive payment results

**Update Callback URL** in Daraja server:
```javascript
CallBackURL: "https://your-domain.vercel.app/api/payments/callback"
```

---

## Testing

### Test Phone Numbers (Sandbox)
- Format: `0712345678` or `+254712345678` or `254712345678`
- PIN: `1234`
- Amount: `KES 1.00`

### Test Expired Subscription
```sql
UPDATE "Hospital" 
SET "subscriptionStatus" = 'EXPIRED' 
WHERE "email" = 'test@hospital.com';
```

### Test Successful Payment
1. Trigger payment from UI
2. Enter PIN on phone
3. Check `/dashboard/payments` (Super Admin)
4. Verify status changed to `SUCCESS`
5. Verify hospital `subscriptionStatus` = `ACTIVE`

---

## User Roles

| Role | Access | Blocked if Unpaid |
|------|--------|-------------------|
| **SUPER_ADMIN** | Everything | ❌ No |
| **HOSPITAL_ADMIN** | Doctors, Patients, Payment | ✅ Yes |
| **DOCTOR** | Patients, Files, Chat | ✅ Yes |

---

## Status Values

### Payment Status
- `PENDING` - Waiting for completion
- `SUCCESS` - Completed successfully
- `FAILED` - Payment failed

### Subscription Status
- `ACTIVE` - Paid and active
- `TRIAL` - Free trial period
- `EXPIRED` - Needs payment
- `SUSPENDED` - Manually suspended
- `PENDING_PAYMENT` - Waiting for payment

---

## Quick Commands

```bash
# Seed Super Admin
npx tsx prisma/seed.ts

# Check database
npx prisma studio

# View payments
# Login as Super Admin → /dashboard/payments

# Test payment
# Login as Hospital Admin → See overlay → Pay

# Check logs
# Console → Look for "M-PESA PAYMENT CALLBACK"
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| No STK push | Check phone number format |
| Payment not updating | Check callback URL in Daraja server |
| Still locked after payment | Check `subscriptionStatus` in database |
| Callback not received | Verify Daraja server callback URL |

---

## Support

- **Email**: jkimunyi@gmail.com
- **Docs**: `MPESA_PAYMENT_IMPLEMENTATION.md`
- **Server**: https://daraja-node.vercel.app

---

**Ready to use!** 🎉
