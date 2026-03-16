# 🚀 Multi-Tenant Hospital System - Deployment & Database Setup Guide

## ⚠️ Important: Database Migration Issue

You're experiencing a migration issue because your database is in an inconsistent state. Here's how to fix it:

## 🔧 Database Setup Options

### Option 1: Fresh Database Reset (Recommended for Development)

**WARNING**: This will delete ALL existing data!

```bash
# 1. Drop all tables manually in Neon SQL Editor
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO neondb_owner;
GRANT ALL ON SCHEMA public TO public;

# 2. Then run migrations
npx prisma migrate deploy
npx prisma generate
```

### Option 2: Manual Table Creation (If you want to keep existing data)

Run this SQL in your Neon SQL Editor:

```sql
-- 1. Create Hospital table first
CREATE TABLE IF NOT EXISTS "Hospital" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "address" TEXT,
  "phone" TEXT NOT NULL,
  "email" TEXT,
  "logo" TEXT,
  "website" TEXT,
  "subscriptionPlan" TEXT NOT NULL DEFAULT 'basic',
  "subscriptionStatus" TEXT NOT NULL DEFAULT 'TRIAL',
  "subscriptionStartDate" TIMESTAMP(3),
  "subscriptionEndDate" TIMESTAMP(3),
  "billingPhoneNumber" TEXT NOT NULL,
  "monthlyFee" DECIMAL(65,30) NOT NULL DEFAULT 5000,
  "trialEndsAt" TIMESTAMP(3),
  "lastPaymentDate" TIMESTAMP(3),
  "nextBillingDate" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Hospital_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Hospital_phone_key" ON "Hospital"("phone");
CREATE UNIQUE INDEX "Hospital_email_key" ON "Hospital"("email");
CREATE INDEX "Hospital_subscriptionStatus_idx" ON "Hospital"("subscriptionStatus");
CREATE INDEX "Hospital_billingPhoneNumber_idx" ON "Hospital"("billingPhoneNumber");
CREATE INDEX "Hospital_nextBillingDate_idx" ON "Hospital"("nextBillingDate");

-- 2. Update User table to add new fields
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "hospitalId" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "lastLogin" TIMESTAMP(3);
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "createdBy" TEXT;

-- Update role enum (PostgreSQL doesn't support modifying enums easily, so we'll handle this differently)
-- First, add new roles to existing users as needed

CREATE INDEX IF NOT EXISTS "users_hospitalId_idx" ON "users"("hospitalId");

-- Add foreign key constraint
ALTER TABLE "users" ADD CONSTRAINT "users_hospitalId_fkey" 
  FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- 3. Update Patient table
ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "hospitalId" TEXT;

CREATE INDEX IF NOT EXISTS "patients_hospitalId_idx" ON "patients"("hospitalId");

-- Add foreign key constraint
ALTER TABLE "patients" ADD CONSTRAINT "patients_hospitalId_fkey" 
  FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- 4. Update Inference table
ALTER TABLE "inferences" ADD COLUMN IF NOT EXISTS "doctor_id" TEXT;

CREATE INDEX IF NOT EXISTS "inferences_doctor_id_idx" ON "inferences"("doctor_id");

ALTER TABLE "inferences" ADD CONSTRAINT "inferences_doctor_id_fkey" 
  FOREIGN KEY ("doctor_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- 5. Create Payment table
CREATE TABLE IF NOT EXISTS "payments" (
  "id" TEXT NOT NULL,
  "hospital_id" TEXT NOT NULL,
  "amount" DECIMAL(10,2) NOT NULL,
  "phone_number" TEXT NOT NULL,
  "merchant_request_id" TEXT,
  "checkout_request_id" TEXT,
  "mpesa_receipt_number" TEXT,
  "transaction_date" TIMESTAMP(3),
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "result_code" TEXT,
  "result_desc" TEXT,
  "payment_type" TEXT NOT NULL DEFAULT 'subscription',
  "billing_period" TEXT,
  "metadata" JSONB,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "payments_checkout_request_id_key" ON "payments"("checkout_request_id");
CREATE UNIQUE INDEX IF NOT EXISTS "payments_mpesa_receipt_number_key" ON "payments"("mpesa_receipt_number");
CREATE INDEX IF NOT EXISTS "payments_hospital_id_idx" ON "payments"("hospital_id");
CREATE INDEX IF NOT EXISTS "payments_status_idx" ON "payments"("status");
CREATE INDEX IF NOT EXISTS "payments_created_at_idx" ON "payments"("created_at");

ALTER TABLE "payments" ADD CONSTRAINT "payments_hospital_id_fkey" 
  FOREIGN KEY ("hospital_id") REFERENCES "Hospital"("id") ON DELETE CASCADE ON UPDATE CASCADE;
```

### Option 3: Use Prisma DB Push (Simpler but loses migration history)

```bash
# This will sync the schema without migrations
npx prisma db push --force-reset
npx prisma generate
```

## 📝 After Database Setup

### 1. Generate Prisma Client

```bash
npx prisma generate
```

### 2. Create Super Admin User

Run this in Neon SQL Editor (replace with your details):

```sql
INSERT INTO "users" (id, email, "passwordHash", name, role, "isActive", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid()::text,
  'admin@clinintelai.com',
  '$2a$10$YourHashedPasswordHere', -- Use bcrypt to hash your password
  'Super Admin',
  'SUPER_ADMIN',
  true,
  NOW(),
  NOW()
);
```

Or create via Node.js:

```javascript
const bcrypt = require('bcryptjs');
const password = 'YourSecurePassword123!';
const hash = bcrypt.hashSync(password, 10);
console.log(hash); // Copy this hash to the SQL above
```

### 3. Environment Variables

Update your `.env` file:

```env
# M-Pesa Payment Server
MPESA_API_URL=https://daraja-node.vercel.app

# Existing variables
DATABASE_URL=your_database_url
DIRECT_URL=your_direct_url
DEEPSEEK_API_KEY=your_deepseek_key
ENCRYPTION_KEY=your_encryption_key
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

## 🏥 Creating Your First Hospital

### Method 1: Via Super Admin Dashboard (After UI is built)

1. Login as Super Admin
2. Go to `/admin/hospitals`
3. Click "Add Hospital"
4. Fill in details:
   - Hospital Name
   - Billing Phone Number (for M-Pesa)
   - Admin Name & Email
   - Admin Password
   - Monthly Fee (default: 5000 KES)

### Method 2: Via API

```bash
# Login as Super Admin first to get token
curl -X POST http://localhost:3000/api/hospitals \
  -H "Content-Type: application/json" \
  -H "Cookie: your-session-cookie" \
  -d '{
    "name": "Sample Hospital",
    "address": "123 Medical Street, Nairobi",
    "phone": "254712345678",
    "email": "info@samplehospital.com",
    "billingPhoneNumber": "254712345678",
    "monthlyFee": 5000,
    "subscriptionPlan": "basic",
    "adminName": "Hospital Admin",
    "adminEmail": "admin@samplehospital.com",
    "adminPassword": "SecurePassword123!"
  }'
```

### Method 3: Direct SQL (Quick Test)

```sql
-- 1. Create Hospital
INSERT INTO "Hospital" (
  id, name, phone, email, "billingPhoneNumber", 
  "subscriptionPlan", "subscriptionStatus", "trialEndsAt",
  "createdAt", "updatedAt"
)
VALUES (
  gen_random_uuid()::text,
  'Sample Hospital',
  '254712345678',
  'info@samplehospital.com',
  '254712345678',
  'basic',
  'TRIAL',
  NOW() + INTERVAL '14 days',
  NOW(),
  NOW()
)
RETURNING id; -- Copy this ID

-- 2. Create Hospital Admin (replace HOSPITAL_ID with ID from above)
INSERT INTO "users" (
  id, email, "passwordHash", name, role, "hospitalId", 
  "isActive", "createdAt", "updatedAt"
)
VALUES (
  gen_random_uuid()::text,
  'admin@samplehospital.com',
  '$2a$10$YourHashedPasswordHere', -- Hash with bcrypt
  'Hospital Admin',
  'HOSPITAL_ADMIN',
  'HOSPITAL_ID_HERE',
  true,
  NOW(),
  NOW()
);
```

## 🔐 User Roles & Access

### Super Admin
- **Access**: `/admin/*`
- **Can**:
  - Create/manage hospitals
  - View all payments
  - Suspend/activate hospitals
  - View system statistics
- **Cannot**:
  - Access patient data
  - Upload files
  - Use AI assistants

### Hospital Admin
- **Access**: `/hospital-admin/*`
- **Can**:
  - Create/manage doctors in their hospital
  - Initiate subscription payments
  - View hospital statistics
  - Manage hospital profile
- **Cannot**:
  - Access other hospitals
  - Manage patients (doctors do this)

### Doctor
- **Access**: `/dashboard/*` (existing pages)
- **Can**:
  - Manage patients in their hospital
  - Upload files
  - Use AI assistants
  - Generate reports
- **Cannot**:
  - Create other doctors
  - Access payment/billing

## 💳 Payment Flow

### 1. Hospital Trial Period
- New hospitals get 14-day free trial
- Full access during trial
- After trial: status changes to EXPIRED

### 2. Subscription Payment
1. Hospital Admin goes to `/hospital-admin/billing`
2. Clicks "Pay Subscription"
3. STK Push sent to billing phone number
4. User enters M-Pesa PIN on phone
5. Payment callback updates database
6. Subscription activated for 30 days

### 3. Auto-Renewal
- Run cron job daily: `POST /api/payments/check-expiry`
- Sends payment reminders
- Updates expired subscriptions

### 4. Grace Period
- 3 days after expiration
- System still accessible
- Payment prompt shown

## 🧪 Testing Payment Integration

### Test STK Push

```bash
curl -X POST http://localhost:3000/api/payments \
  -H "Content-Type: application/json" \
  -H "Cookie: hospital-admin-session-cookie" \
  -d '{
    "phoneNumber": "254712345678",
    "amount": 1
  }'
```

### Test Callback (Simulate M-Pesa)

```bash
curl -X POST http://localhost:3000/api/payments/callback \
  -H "Content-Type: application/json" \
  -d '{
    "Body": {
      "stkCallback": {
        "MerchantRequestID": "test-merchant-id",
        "CheckoutRequestID": "ws_CO_test123",
        "ResultCode": 0,
        "ResultDesc": "The service request is processed successfully.",
        "CallbackMetadata": {
          "Item": [
            {"Name": "Amount", "Value": 1},
            {"Name": "MpesaReceiptNumber", "Value": "TEST123ABC"},
            {"Name": "TransactionDate", "Value": 20251011120000},
            {"Name": "PhoneNumber", "Value": 254712345678}
          ]
        }
      }
    }
  }'
```

## 📊 System Architecture

```
┌─────────────┐
│ Super Admin │ → Manages → ┌──────────┐
└─────────────┘              │ Hospital │
                             └────┬─────┘
                                  │
                    ┌─────────────┼─────────────┐
                    ▼             ▼             ▼
              ┌──────────┐  ┌──────────┐  ┌─────────┐
              │Hospital  │  │ Doctors  │  │Payments │
              │  Admin   │  │          │  │         │
              └────┬─────┘  └────┬─────┘  └─────────┘
                   │             │
                   │             ▼
                   │       ┌──────────┐
                   │       │ Patients │
                   │       └────┬─────┘
                   │            │
                   │            ▼
                   │       ┌──────────┐
                   └────→  │  Files   │
                           └────┬─────┘
                                │
                                ▼
                           ┌──────────┐
                           │   AI     │
                           │Assistants│
                           └──────────┘
```

## 🔄 Migration from Single-Tenant

If you have existing data:

```sql
-- 1. Create a default hospital for existing users
INSERT INTO "Hospital" (
  id, name, phone, email, "billingPhoneNumber",
  "subscriptionStatus", "createdAt", "updatedAt"
)
VALUES (
  'default-hospital-id',
  'Legacy Hospital',
  '254700000000',
  'legacy@hospital.com',
  '254700000000',
  'ACTIVE',
  NOW(),
  NOW()
);

-- 2. Associate all existing users with this hospital
UPDATE "users" 
SET "hospitalId" = 'default-hospital-id',
    "isActive" = true
WHERE "hospitalId" IS NULL;

-- 3. Associate all existing patients with this hospital
UPDATE "patients" 
SET "hospitalId" = 'default-hospital-id'
WHERE "hospitalId" IS NULL;

-- 4. Make one existing user a HOSPITAL_ADMIN
UPDATE "users"
SET "role" = 'HOSPITAL_ADMIN'
WHERE "email" = 'your-admin-email@example.com';
```

## 🚨 Troubleshooting

### Issue: "Property 'hospital' does not exist on type 'PrismaClient'"

**Solution**: Regenerate Prisma Client after schema changes
```bash
npx prisma generate
```

### Issue: Migration failed

**Solution**: Use db push for development
```bash
npx prisma db push --force-reset
```

### Issue: Can't connect to database

**Solution**: Check DATABASE_URL and network
```bash
# Test connection
npx prisma db pull
```

## 📱 Next Steps

1. ✅ Database setup complete
2. ⏳ Build Super Admin UI (`/app/admin/*`)
3. ⏳ Build Hospital Admin UI (`/app/hospital-admin/*`)
4. ⏳ Update existing dashboard with access control
5. ⏳ Test payment flow end-to-end
6. ⏳ Deploy to production

## 🎯 Quick Commands Summary

```bash
# Development Setup
npx prisma db push --force-reset  # Reset & sync schema
npx prisma generate               # Generate client
npx prisma studio                 # View data
pnpm dev                          # Start dev server

# Production Deployment
npx prisma migrate deploy         # Run migrations
npx prisma generate               # Generate client
pnpm build                        # Build Next.js
pnpm start                        # Start production server
```

---

**Need Help?** Check the implementation files:
- Schema: `/prisma/schema.prisma`
- Services: `/lib/services/hospital-subscription.ts`, `/lib/services/mpesa-payment.ts`
- API Routes: `/app/api/hospitals/*`, `/app/api/doctors/*`, `/app/api/payments/*`
