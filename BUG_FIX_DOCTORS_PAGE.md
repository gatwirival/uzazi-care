# 🐛 Bug Fix: Server Component Event Handlers Error

## Problem

Both the `/dashboard/doctors` and `/dashboard/hospitals` pages were showing this error:

```
⨯ Error: Event handlers cannot be passed to Client Component props.
  <button className=... onClick={function onClick} children=...>
                                ^^^^^^^^^^^^^^^^^^
If you need interactivity, consider converting part of this to a Client Component.
```

## Root Cause

Both pages were **Server Components** (default in Next.js 14 App Router) but contained interactive elements with `onClick` handlers (delete buttons). Server Components cannot have event handlers because they run on the server and generate static HTML.

## Solution

Split each page into two parts:
1. **Server Component** (`page.tsx`) - Handles data fetching with Prisma
2. **Client Component** (`DoctorsClient.tsx` / `HospitalsClient.tsx`) - Handles UI and interactivity

### Architecture

```
┌─────────────────────────────────────────┐
│ page.tsx (Server Component)             │
│ ✓ Fetches data from database            │
│ ✓ Validates user permissions            │
│ ✓ Serializes data for client            │
│ ✓ Passes data to Client Component       │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│ *Client.tsx (Client Component)          │
│ ✓ Renders table/cards with data         │
│ ✓ Handles delete button clicks          │
│ ✓ Shows loading states                  │
│ ✓ Manages user interactions             │
└─────────────────────────────────────────┘
```

## Files Changed

### 1. Doctors Management

#### `/app/dashboard/doctors/page.tsx`
**Before**: 200+ lines with UI and data fetching mixed
**After**: ~60 lines, focused on data fetching only

```typescript
export default async function DoctorsPage() {
  // Fetch data on server
  const doctors = await prisma.user.findMany({...});
  
  // Serialize dates for client component
  const serializedDoctors = doctors.map(doctor => ({
    ...doctor,
    lastLogin: doctor.lastLogin?.toISOString() || null,
    patientCount: doctor._count.Patient,
  }));
  
  // Pass to client component
  return <DoctorsClient doctors={serializedDoctors} hospitalName={hospital.name} />;
}
```

#### `/app/dashboard/doctors/DoctorsClient.tsx` (NEW)
**Purpose**: Client-side UI with interactivity

```typescript
"use client";

export default function DoctorsClient({ doctors, hospitalName }: Props) {
  const [deleting, setDeleting] = useState<string | null>(null);
  
  const handleDelete = async (doctor: Doctor) => {
    // Handle deletion with loading state
  };
  
  return (
    // UI with interactive buttons
  );
}
```

### 2. Hospital Management

#### `/app/dashboard/hospitals/page.tsx`
**Before**: 300+ lines with statistics, table, and data fetching
**After**: ~50 lines, focused on data fetching only

```typescript
export default async function HospitalsPage() {
  // Fetch hospitals
  const hospitals = await prisma.hospital.findMany({...});
  
  // Serialize data
  const serializedHospitals = hospitals.map(hospital => ({
    ...hospital,
    nextBillingDate: hospital.nextBillingDate?.toISOString() || null,
    userCount: hospital._count.User,
    patientCount: hospital._count.Patient,
  }));
  
  return <HospitalsClient hospitals={serializedHospitals} />;
}
```

#### `/app/dashboard/hospitals/HospitalsClient.tsx` (NEW)
**Purpose**: Client-side UI with statistics cards, table, and interactivity

```typescript
"use client";

export default function HospitalsClient({ hospitals }: Props) {
  const [deleting, setDeleting] = useState<string | null>(null);
  
  // Calculate statistics
  const activeCount = hospitals.filter(h => h.subscriptionStatus === "ACTIVE").length;
  const trialCount = hospitals.filter(h => h.subscriptionStatus === "TRIAL").length;
  
  const handleDelete = async (hospital: Hospital) => {
    // Handle deletion with loading state
  };
  
  return (
    // Statistics cards + table with interactive buttons
  );
}
```

## Benefits

✅ **Separation of Concerns**: Data fetching separate from UI rendering
✅ **Better Performance**: Server Components are faster, only UI is client-side
✅ **Type Safety**: TypeScript interfaces ensure data contract
✅ **Loading States**: Client component can show "Deleting..." state
✅ **Error Handling**: Better error messages with try/catch in client
✅ **Router Refresh**: Uses `router.refresh()` to update list after delete (no full page reload)

## Key Changes

### 1. **Data Serialization**
Converted `Date` objects to ISO strings for client components:
```typescript
lastLogin: doctor.lastLogin?.toISOString() || null
nextBillingDate: hospital.nextBillingDate?.toISOString() || null
```

### 2. **Delete Handler with Loading State**
```typescript
const [deleting, setDeleting] = useState<string | null>(null);

const handleDelete = async (item: Doctor | Hospital) => {
  if (!confirm("Are you sure?")) return;
  
  setDeleting(item.id);
  try {
    const response = await fetch(`/api/.../[${item.id}`, { method: "DELETE" });
    if (response.ok) router.refresh(); // Re-fetch server data
    else alert("Failed to delete");
  } catch (error) {
    alert("Failed to delete");
  } finally {
    setDeleting(null);
  }
};
```

### 3. **Router Refresh**
Instead of `window.location.reload()`:
```typescript
import { useRouter } from "next/navigation";
const router = useRouter();
router.refresh(); // Re-fetches Server Component data without full reload
```

### 4. **Disabled State on Buttons**
```typescript
<button
  disabled={deleting === item.id}
  onClick={() => handleDelete(item)}
>
  {deleting === item.id ? "Deleting..." : "Delete"}
</button>
```

## Testing Checklist

### Doctors Page (`/dashboard/doctors`)
- [x] Page loads without errors
- [x] Doctor list displays correctly  
- [x] Hospital name shown in header
- [x] "Add Doctor" button works
- [x] Edit links work
- [x] Delete button shows confirmation
- [x] Delete button shows "Deleting..." state
- [x] List refreshes after successful delete
- [x] Error alerts show on delete failure

### Hospitals Page (`/dashboard/hospitals`)
- [x] Page loads without errors
- [x] Statistics cards display correctly (Total, Active, Trial, Expired)
- [x] Hospital list with all columns (Name, Email, Users, Patients, Status, Billing)
- [x] "Add Hospital" button works
- [x] Edit links work
- [x] Delete button shows confirmation
- [x] Delete button shows "Deleting..." state
- [x] List refreshes after successful delete
- [x] Error alerts show on delete failure

## Files Created

1. `/app/dashboard/doctors/DoctorsClient.tsx` - Doctor management UI (220 lines)
2. `/app/dashboard/hospitals/HospitalsClient.tsx` - Hospital management UI (350 lines)

## Files Modified

1. `/app/dashboard/doctors/page.tsx` - Reduced from 200+ to ~60 lines
2. `/app/dashboard/hospitals/page.tsx` - Reduced from 300+ to ~50 lines

## Next.js Best Practices Applied

1. **Server Components by Default**: Fetch data on server for better performance
2. **Client Components for Interactivity**: Only use "use client" when needed
3. **Data Serialization**: Convert non-serializable types (Date) to strings
4. **Router Refresh**: Efficient re-fetching without full page reload
5. **TypeScript Interfaces**: Type-safe props between server and client
6. **Loading States**: Better UX with disabled states and loading text

## Related Documentation

- [Next.js Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Next.js Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components)
- [When to use Server vs Client Components](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns)
- [useRouter in App Router](https://nextjs.org/docs/app/api-reference/functions/use-router)

## Summary

✅ **Fixed**: Event handler errors in both doctors and hospitals pages
✅ **Created**: 2 new Client Components for interactivity
✅ **Improved**: Better separation of concerns, loading states, error handling
✅ **Performance**: Server-side data fetching with client-side interactivity
✅ **Ready**: Both pages now work correctly without errors
