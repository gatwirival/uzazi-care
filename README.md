# ClinIntelAI - Medical Data Management Platform

A Next.js-based platform for medical professionals to manage patient data, upload files, and perform AI-powered analysis.

## 📋 Project Status

### ✅ Phase 1 - Setup & Foundation (COMPLETED)

**Features Implemented:**
- Next.js 15 with App Router, TypeScript, Tailwind CSS v4
- Prisma ORM with Neon PostgreSQL
- Database schema: Users, Patients, Files, Inferences
- API structure with proper routing
- TypeScript types and Prisma-generated types

### ✅ Phase 2 - Core Data Ingestion & Authentication (COMPLETED)

**Features Implemented:**

**Authentication & Security:**
- NextAuth.js v5 integration with credentials provider
- Session management with JWT tokens
- Protected routes with middleware
- End-to-end encryption for sensitive patient data
- Secure password hashing with bcryptjs

**Landing Page & UI:**
- Modern landing page with hero section
- Features showcase
- Login and registration pages
- Responsive design with dark mode support

**Patient Management:**
- Patient onboarding flow with comprehensive form
- Encrypted storage of sensitive data (email, phone, MRN, notes)
- Patient list with search and filtering
- Patient detail views
- CRUD operations with proper authorization

**File Upload & Processing:**
- Cloudinary integration for file storage
- Drag-and-drop file upload
- CSV parsing with metadata extraction
- Support for multiple file types (CSV, Excel, PDF, images)
- File validation and size limits
- Automatic column detection for CSV files

**Dashboard:**
- Authenticated dashboard layout
- Statistics overview (patients, files, analyses)
- Recent patients list
- Navigation and user menu
- Secure sign out functionality

## 🚀 Getting Started

### Local Development

See [ENV_SETUP_GUIDE.md](./ENV_SETUP_GUIDE.md) for local development setup.

### Deploy to Production (Vercel)

**👉 See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete Vercel deployment guide**

Quick deploy:
1. Push to GitHub
2. Import project in Vercel
3. Add environment variables (DATABASE_URL, ENCRYPTION_KEY, etc.)
4. Deploy!

---

## 📁 Project Structure

```
clinintelai/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   └── register/route.ts
│   │   ├── patients/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── files/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   └── analyze/route.ts
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── db/
│   │   ├── index.ts          # Prisma client singleton
│   │   └── schema.sql        # SQL reference (not used with Prisma)
│   └── types/
│       └── index.ts          # TypeScript type definitions
├── prisma/
│   └── schema.prisma         # Database schema
├── .env.example
├── package.json
└── README.md
```

## 🗄️ Database Schema

### Models

- **User**: Doctors and administrators
- **Patient**: Patient records linked to doctors
- **File**: Uploaded files (CSV, images) linked to patients
- **Inference**: AI analysis results linked to files and patients

### Relationships

- User → Patient (one-to-many)
- Patient → File (one-to-many)
- Patient → Inference (one-to-many)
- File → Inference (one-to-many)

## 🔧 API Endpoints

### Authentication

- `POST /api/auth/[...nextauth]` - NextAuth.js authentication endpoints
- `POST /api/auth/register` - Register a new doctor

### Patients (Protected)

- `GET /api/patients` - List all patients (for authenticated doctor)
- `POST /api/patients` - Create a new patient (with encrypted sensitive data)
- `GET /api/patients/[id]` - Get patient details
- `PATCH /api/patients/[id]` - Update patient
- `DELETE /api/patients/[id]` - Delete patient

### Files (Protected)

- `GET /api/files` - List all files (with optional patientId filter)
- `POST /api/files` - Upload a file (multipart/form-data to Cloudinary)
- `GET /api/files/[id]` - Get file details
- `DELETE /api/files/[id]` - Delete file

### Analysis (Protected)

- `POST /api/analyze` - Analyze a file (stub implementation)
- `GET /api/analyze` - List inferences (with optional filters)

## 🔐 Security Features

- **Authentication**: NextAuth.js with secure session management
- **Encryption**: AES-256-CBC encryption for sensitive patient data (email, phone, MRN, notes)
- **Authorization**: Middleware protection for dashboard and API routes
- **Password Hashing**: bcryptjs with salt rounds
- **Session Tokens**: JWT-based authentication

## 📝 Usage Guide

### 1. Create an Account
Navigate to `/auth/register` and create a doctor account.

### 2. Add Patients
Go to Dashboard → Patients → Add Patient to create patient records.

### 3. Upload Files
Navigate to Dashboard → Files → Upload File to upload CSV or medical files.

### 4. View Analytics
Files are automatically parsed (CSV files show row count, columns, sample data).

### 5. Testing with REST Client
Use the `api-tests.http` file with the REST Client VS Code extension for API testing.

## 🎯 Next Steps (Phase 3)

- [ ] Implement AI-powered data analysis
- [ ] Add data visualization dashboards
- [ ] Implement real-time analytics
- [ ] Add export functionality for reports
- [ ] Implement batch file processing
- [ ] Add audit logs for compliance
- [ ] Implement role-based access control (RBAC)
- [ ] Add email notifications

## 🛠️ Development Commands

```bash
# Development
pnpm dev              # Start dev server

# Database
pnpm exec prisma studio           # Open Prisma Studio
pnpm exec prisma db push          # Push schema changes
pnpm exec prisma migrate dev      # Create migration
pnpm exec prisma generate         # Regenerate Prisma Client

# Build
pnpm build            # Build for production
pnpm start            # Start production server
```

## 📦 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Authentication**: NextAuth.js v5
- **File Storage**: Cloudinary
- **Encryption**: AES-256-CBC (Node.js crypto)
- **CSV Parsing**: csv-parse & papaparse
- **Styling**: Tailwind CSS v4
- **Password Hashing**: bcryptjs

## 🔒 Environment Variables

Required environment variables (see `.env.example`):

```env
# Database
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...

# Authentication
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000

# Encryption
ENCRYPTION_KEY=your-32-char-key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## 📝 License

Private project for medical data management.

