# 🔐 RBAC Implementation Guide - Hospital Management System

## ✅ What Has Been Implemented

### 1. **Database Schema Updates** (`/prisma/schema.prisma`)

#### Changes Made:
- ✅ Removed `User.createdBy` self-referential field (simplified structure)
- ✅ Maintained proper relationships: `Hospital` → `User` (1:many)
- ✅ Three user roles: `SUPER_ADMIN`, `HOSPITAL_ADMIN`, `DOCTOR`
- ✅ All users with roles `HOSPITAL_ADMIN` and `DOCTOR` MUST have a `hospitalId`

#### Key Models:
```prisma
model Hospital {
  id                 String             @id @default(uuid())
  name               String
  email              String             @unique
  subscriptionStatus SubscriptionStatus @default(TRIAL)
  // ... 30-day trial by default
  User               User[]             // One-to-many with users
}

model User {
  id          String   @id @default(uuid())
  email       String   @unique
  name        String
  role        UserRole @default(DOCTOR)
  hospitalId  String?  // Required for HOSPITAL_ADMIN and DOCTOR
  Hospital    Hospital? @relation(fields: [hospitalId], references: [id])
}
```

---

### 2. **Hospital Registration** (`/app/api/auth/register/route.ts`)

#### ✅ Implemented Features:
- **Only hospitals can register** (not individual doctors or users)
- Required fields:
  - `hospitalName`: Hospital/Clinic name
  - `email`: Admin email (becomes hospital admin email)
  - `password`: Admin password (min 8 characters)

#### What It Does:
1. Creates a `Hospital` record with:
   - 30-day **FREE TRIAL** automatically
   - Subscription status: `TRIAL`
   - Monthly fee: KES 5,000
2. Auto-creates a `HOSPITAL_ADMIN` user linked to the hospital
3. Validates email uniqueness

#### API Endpoint:
```typescript
POST /api/auth/register
{
  "hospitalName": "City General Hospital",
  "email": "admin@cityhospital.com",
  "password": "SecurePassword123"
}

Response:
{
  "success": true,
  "message": "Hospital registered successfully! You have a 30-day free trial.",
  "hospital": { id, name, email, subscriptionStatus, trialEndsAt },
  "user": { id, email, name, role: "HOSPITAL_ADMIN" }
}
```

---

### 3. **Authentication & Login** (`/lib/auth.ts`)

#### ✅ Enhancements:
- **Hospital association check**: Verifies user belongs to an active hospital
- **Subscription validation**: Checks if hospital subscription allows access
- **Last login tracking**: Updates `lastLogin` timestamp
- **Session includes**:
  - `user.role` (HOSPITAL_ADMIN or DOCTOR)
  - `user.hospitalId`
  - `user.subscriptionStatus`

#### Login Flow:
```
1. User enters email + password
2. System checks:
   - ✅ User exists
   - ✅ Password correct
   - ✅ User is active
   - ✅ Hospital exists and is active
   - ✅ Hospital subscription is valid (TRIAL, ACTIVE, or PENDING_PAYMENT)
3. If all checks pass → Login successful
4. If subscription expired → Error with reason
```

#### Error Messages:
- `"Your account has been deactivated. Please contact your hospital administrator."`
- `"No hospital associated with this account."`
- `"Your hospital account has been suspended. Please contact support."`

---

### 4. **Doctor Creation** (`/app/api/doctors/route.ts`)

#### ✅ RBAC Rules:
- **Only `HOSPITAL_ADMIN` can create doctors**
- Doctors are automatically linked to the admin's hospital
- Cannot create doctors if subscription is `EXPIRED` or `SUSPENDED`

#### API Endpoint:
```typescript
POST /api/doctors
Headers: { Authorization: "Bearer <hospital_admin_token>" }
{
  "name": "Dr. John Smith",
  "email": "john.smith@cityhospital.com",
  "password": "SecurePassword123"
}

Response:
{
  "success": true,
  "message": "Doctor account created successfully",
  "doctor": {
    id, email, name, role: "DOCTOR",
    hospitalId, isActive: true, createdAt
  }
}
```

#### Validation:
- Email must be unique
- Password minimum 8 characters
- Hospital subscription must be TRIAL, ACTIVE, or PENDING_PAYMENT

---

### 5. **Subscription Check Middleware** (`/lib/middleware/subscription-check.ts`)

#### ✅ Functions:

##### `checkSubscriptionAccess(userId: string)`
Returns whether a user has access based on hospital subscription.

**RBAC Rules:**
- **SUPER_ADMIN**: Always has access
- **HOSPITAL_ADMIN**: Access if hospital is ACTIVE or TRIAL
- **DOCTOR**: Access only if hospital subscription is ACTIVE, TRIAL, or PENDING_PAYMENT

**Return Type:**
```typescript
{
  hasAccess: boolean;
  subscriptionStatus: string;
  reason?: string;          // Why access was denied
  trialEndsAt?: Date;      // Trial expiration date
  nextBillingDate?: Date;  // Next payment due date
}
```

##### `requireActiveSubscription(userId: string)`
Helper for API routes to enforce subscription checks.

**Example Usage in API:**
```typescript
export async function GET(request: NextRequest) {
  const session = await auth();
  const access = await requireActiveSubscription(session.user.id);
  
  if (!access.allowed) {
    return NextResponse.json(
      { error: access.error.message },
      { status: access.error.status }
    );
  }
  
  // Continue with logic...
}
```

---

### 6. **Dashboard Layout with Locks** (`/app/dashboard/layout.tsx`)

#### ✅ Implemented:
- **Subscription status banner** showing trial/active/locked state
- **Role-based navigation** items
- **Locked features** for doctors when subscription expires
- **Hospital Admin** gets additional menu items:
  - Hospital Management
  - Manage Doctors
  - Subscription & Billing

#### Visual Indicators:
- 🎁 **Free Trial**: Yellow banner with trial end date
- ✅ **Active**: Green status indicator
- 🔒 **Locked**: Red banner + locked icon on menu items

#### Navigation Items:
```typescript
// For ALL roles
- Dashboard
- Patients
- Files
- AI Assistant

// For HOSPITAL_ADMIN only
- Hospital Management
- Manage Doctors
- Subscription & Billing
```

---

## 🚧 What Still Needs To Be Done

### 1. **Update Registration Page UI** (`/app/auth/register/page.tsx`)
**Status**: ❌ Not Started

**Required Changes:**
- Change form fields from `name, email, password` to `hospitalName, email, password`
- Update labels and placeholders
- Update heading: "Hospital Registration" instead of "User Registration"
- Add helper text: "Register your hospital or clinic to add doctors"

**Example:**
```tsx
<Input 
  label="Hospital/Clinic Name" 
  placeholder="City General Hospital"
  name="hospitalName"
/>
<Input 
  label="Administrator Email" 
  placeholder="admin@hospital.com"
  name="email"
/>
<Input 
  label="Password" 
  type="password"
  placeholder="Minimum 8 characters"
  name="password"
/>
```

---

### 2. **Create Hospital Admin Dashboard** (`/app/dashboard/hospital/page.tsx`)
**Status**: ❌ Not Started

**Required Views:**

#### `/app/dashboard/hospital/page.tsx` - Overview
- Hospital details (name, email, subscription status)
- Quick stats:
  - Number of doctors
  - Number of patients
  - Subscription status
  - Next billing date
- Action buttons:
  - Make Payment
  - Manage Doctors
  - View Payment History

#### `/app/dashboard/hospital/doctors/page.tsx` - Doctor Management
- List all doctors in the hospital
- Show for each doctor:
  - Name, email
  - Status (Active/Inactive)
  - Last login
  - Number of patients
  - Actions: Edit, Deactivate/Activate, Delete
- "Add New Doctor" button

#### `/app/dashboard/hospital/subscription/page.tsx` - Billing
- Current subscription status
- Payment history table
- Make payment button (M-Pesa integration)
- Invoice downloads

---

### 3. **Add RBAC Guards to All API Routes**
**Status**: ❌ Not Started

**Routes That Need Updates:**

#### `/app/api/patients/route.ts`
```typescript
// Add at the start of GET and POST:
const access = await requireActiveSubscription(session.user.id);
if (!access.allowed) {
  return NextResponse.json({ error: access.error.message }, { status: 403 });
}
```

#### `/app/api/files/route.ts`
Same subscription check needed

#### `/app/api/chat/route.ts`
Same subscription check needed

#### `/app/api/reports/route.ts`
Same subscription check needed

**Rule**: ALL doctor-facing endpoints must check subscription before allowing access.

---

### 4. **Database Migration**
**Status**: ❌ Not Started (DB connection issue)

**Steps Required:**
1. Fix your Neon database connection
2. Run: `npx prisma db push --accept-data-loss`
3. Run: `npx prisma generate`
4. Verify tables were created

**How to Check DB Connection:**
```bash
# Test connection
npx prisma db push --help

# If it says "Can't reach database server", check:
1. Neon dashboard - is database active?
2. .env file - is DATABASE_URL correct?
3. Network/firewall - can you reach neon.tech?
```

---

## 🎯 Complete RBAC Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     REGISTRATION FLOW                            │
└─────────────────────────────────────────────────────────────────┘

Hospital registers →
  POST /api/auth/register
  { hospitalName, email, password }
    ↓
  Creates Hospital (TRIAL, 30 days)
    ↓
  Auto-creates HOSPITAL_ADMIN user
    ↓
  Login with email/password
    ↓
  HOSPITAL_ADMIN Dashboard


┌─────────────────────────────────────────────────────────────────┐
│                  HOSPITAL ADMIN FLOW                             │
└─────────────────────────────────────────────────────────────────┘

Hospital Admin logs in →
  Dashboard shows:
    - Hospital info
    - Subscription status (TRIAL)
    - Add Doctor button
    ↓
  Click "Manage Doctors" →
    POST /api/doctors
    { name, email, password }
      ↓
    Doctor account created
      ↓
    Doctor receives credentials
      ↓
    Doctor can login


┌─────────────────────────────────────────────────────────────────┐
│                      DOCTOR FLOW                                 │
└─────────────────────────────────────────────────────────────────┘

Doctor logs in →
  Subscription check runs:
    - Hospital ACTIVE or TRIAL? → ✅ Full Access
    - Hospital EXPIRED? → 🔒 Locked (contact admin)
    - Hospital SUSPENDED? → 🔒 Locked (contact support)
    ↓
  If locked:
    - Red banner shows
    - All menu items disabled
    - Message: "Contact your hospital administrator"
    ↓
  If active:
    - Full access to:
      - Patients
      - Files
      - AI Chat
      - Reports


┌─────────────────────────────────────────────────────────────────┐
│                   SUBSCRIPTION LIFECYCLE                         │
└─────────────────────────────────────────────────────────────────┘

Day 1: Hospital registers
  Status: TRIAL
  Access: ✅ Full (30 days)

Day 15: Trial warning
  Status: TRIAL
  Access: ✅ Full
  Banner: "Trial ends in 15 days"

Day 30: Trial expires
  Status: EXPIRED
  Access: 🔒 Locked for doctors
  Admin: Can make payment

Payment successful:
  Status: ACTIVE
  Access: ✅ Full unlocked
  Next billing: 30 days

Payment failed:
  Status: PENDING_PAYMENT
  Access: ⚠️ Grace period (3 days)

Day 33: Still unpaid
  Status: SUSPENDED
  Access: 🔒 Locked completely
```

---

## 📝 Testing Checklist

### After DB Push:

#### 1. Hospital Registration
- [ ] Go to `/auth/register`
- [ ] Fill form: Hospital name, email, password
- [ ] Submit → Should create hospital + admin
- [ ] Check database: Hospital table has 1 record (TRIAL status)
- [ ] Check database: User table has 1 record (HOSPITAL_ADMIN role)

#### 2. Hospital Admin Login
- [ ] Go to `/auth/login`
- [ ] Login with hospital admin email/password
- [ ] Should redirect to `/dashboard`
- [ ] Top-right should show "🎁 Free Trial"
- [ ] Sidebar should show "Hospital Management" menu items

#### 3. Create Doctor
- [ ] As Hospital Admin, go to `/dashboard/hospital/doctors`
- [ ] Click "Add Doctor"
- [ ] Fill form: Name, email, password
- [ ] Submit → Should create doctor
- [ ] Check database: User table has 2 records now

#### 4. Doctor Login (Trial Active)
- [ ] Logout
- [ ] Login with doctor email/password
- [ ] Should redirect to `/dashboard`
- [ ] All menu items should be accessible
- [ ] No "locked" icons
- [ ] Top-right shows "🎁 Free Trial"

#### 5. Expire Trial (Manual Test)
- [ ] In database, update Hospital:
  ```sql
  UPDATE "Hospital" 
  SET "subscriptionStatus" = 'EXPIRED', 
      "trialEndsAt" = NOW() - INTERVAL '1 day'
  WHERE id = '<hospital_id>';
  ```
- [ ] Logout and login as DOCTOR again
- [ ] Should see red "Access Locked" banner
- [ ] All menu items should have 🔒 lock icon
- [ ] Clicking menu items should not navigate

#### 6. Hospital Admin Can Still Access
- [ ] Login as HOSPITAL_ADMIN
- [ ] Even with EXPIRED status, admin should access dashboard
- [ ] Should see payment/subscription options

---

## 🔑 Key RBAC Rules Summary

### User Roles:
1. **SUPER_ADMIN**: System-wide access (not implemented in this phase)
2. **HOSPITAL_ADMIN**: 
   - Can create/manage doctors
   - Can view all patients in hospital
   - Can make payments
   - Access even when subscription expired (to renew)
3. **DOCTOR**:
   - Can only access if hospital subscription active
   - Can manage own patients
   - Can upload files, chat with AI
   - Gets locked out if subscription expires

### Subscription States:
- **TRIAL** (30 days): Full access for all
- **ACTIVE**: Full access, payment made
- **PENDING_PAYMENT**: Grace period, still accessible
- **EXPIRED**: Doctors locked, admin can access to renew
- **SUSPENDED**: Completely locked, contact support

### Access Matrix:

| Feature | SUPER_ADMIN | HOSPITAL_ADMIN | DOCTOR (Active) | DOCTOR (Expired) |
|---------|-------------|----------------|-----------------|------------------|
| Dashboard | ✅ | ✅ | ✅ | 🔒 |
| Patients | ✅ | ✅ | ✅ | 🔒 |
| Files | ✅ | ✅ | ✅ | 🔒 |
| AI Chat | ✅ | ✅ | ✅ | 🔒 |
| Hospital Management | ✅ | ✅ | ❌ | ❌ |
| Create Doctors | ✅ | ✅ | ❌ | ❌ |
| Payments | ✅ | ✅ | ❌ | ❌ |

---

## 🚀 Next Steps

1. **Fix Database Connection**
   - Check Neon dashboard
   - Verify DATABASE_URL in `.env`
   - Run `npx prisma db push --accept-data-loss`

2. **Update Registration UI**
   - Modify `/app/auth/register/page.tsx`
   - Change fields to hospitalName, email, password

3. **Create Hospital Admin Pages**
   - `/app/dashboard/hospital/page.tsx`
   - `/app/dashboard/hospital/doctors/page.tsx`
   - `/app/dashboard/hospital/subscription/page.tsx`

4. **Add Subscription Guards**
   - Update all API routes to use `requireActiveSubscription()`

5. **Test Complete Flow**
   - Register hospital → Create doctor → Test access → Expire trial → Verify locks

---

## 📞 Support

If you encounter issues:
1. Check this guide first
2. Verify database connection
3. Check console for errors
4. Verify role in database matches expected role

---

**Last Updated**: October 12, 2025  
**Status**: Core RBAC implemented, UI and guards pending
