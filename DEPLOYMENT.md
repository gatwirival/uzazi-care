# Deploying to Vercel

This guide shows you how to deploy ClinIntelAI to Vercel in production.

## Prerequisites

- GitHub account
- Vercel account (free tier works)
- Neon account (free tier works) or Vercel Postgres

---

## Step 1: Set Up Database

### Option A: Neon (Recommended)

1. Go to [https://neon.tech](https://neon.tech)
2. Sign up/login with GitHub
3. Click **Create Project**
4. Copy the **connection string** - you'll need this for Vercel

### Option B: Vercel Postgres

1. In your Vercel dashboard, go to **Storage**
2. Click **Create Database** → **Postgres**
3. Copy the connection strings

---

## Step 2: Deploy to Vercel

### Quick Deploy (Easiest)

1. Push your code to GitHub

2. Go to [https://vercel.com](https://vercel.com)

3. Click **Import Project** → Select your GitHub repo

4. Vercel will auto-detect Next.js - click **Deploy**

5. **Wait!** The first deploy will fail - this is expected (missing environment variables)

---

## Step 3: Add Environment Variables

In your Vercel project dashboard:

1. Go to **Settings** → **Environment Variables**

2. Add these variables (for all environments: Production, Preview, Development):

```bash
# Database (from Neon or Vercel Postgres)
DATABASE_URL=postgresql://username:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require
DIRECT_URL=postgresql://username:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require

# Authentication (generate secure values)
ENCRYPTION_KEY=<run: openssl rand -base64 32>
NEXTAUTH_SECRET=<run: openssl rand -base64 32>
NEXTAUTH_URL=https://your-project.vercel.app

# Cloudinary (from https://cloudinary.com/console)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Optional
NODE_ENV=production
```

### How to Generate Secure Keys

In your terminal:
```bash
openssl rand -base64 32
```

Copy the output and paste it into Vercel.

---

## Step 4: Initialize Database

After adding environment variables:

1. Go to **Deployments** → Click **Redeploy**

2. Once deployed, you need to create the database tables:

### Option A: Using Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link your project
vercel link

# Run Prisma migration in production
vercel env pull .env.production
pnpm exec prisma db push
```

### Option B: Using Neon SQL Editor

1. Go to your Neon dashboard
2. Open SQL Editor
3. Run this command:
```sql
-- Prisma will auto-create tables on first database query
-- Or you can manually run migrations
```

Actually, **the easiest way**: Just visit your deployed app and try to register a user. Prisma will auto-create the tables on the first database connection.

---

## Step 5: Test Your Deployment

1. Visit `https://your-project.vercel.app`
2. Click **Get Started** or **Sign Up**
3. Create an account
4. Test the features:
   - ✅ User registration
   - ✅ Login
   - ✅ Dashboard access
   - ✅ Create patient
   - ✅ Upload file

---

## Environment Variables Reference

| Variable | Required | Description | Where to Get |
|----------|----------|-------------|--------------|
| `DATABASE_URL` | ✅ Yes | PostgreSQL connection string | Neon or Vercel Postgres |
| `DIRECT_URL` | ⚠️ For migrations | Direct connection (not pooled) | Usually same as DATABASE_URL |
| `ENCRYPTION_KEY` | ✅ Yes | 32-char key for patient data | `openssl rand -base64 32` |
| `NEXTAUTH_SECRET` | ✅ Yes | Secret for session encryption | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | ✅ Yes | Your app's URL | `https://your-project.vercel.app` |
| `CLOUDINARY_CLOUD_NAME` | ✅ Yes | Cloudinary cloud name | cloudinary.com/console |
| `CLOUDINARY_API_KEY` | ✅ Yes | Cloudinary API key | cloudinary.com/console |
| `CLOUDINARY_API_SECRET` | ✅ Yes | Cloudinary API secret | cloudinary.com/console |
| `NODE_ENV` | 🔵 Optional | Environment mode | `production` |

---

## Common Issues

### 1. "Prisma Client Not Found" Error

**Fix:** Add build command in Vercel:
```bash
pnpm exec prisma generate && next build
```

Go to **Settings** → **General** → **Build & Development Settings** → **Build Command**

### 2. Database Connection Fails

**Check:**
- Is your DATABASE_URL correct?
- Did you add `?sslmode=require` to the connection string?
- Is your Neon database active? (Neon pauses databases after inactivity)

### 3. "Cannot fetch data from service" Error

**Fix:** Make sure you pushed the database schema:
```bash
pnpm exec prisma db push
```

### 4. Environment Variables Not Working

**Fix:**
- Make sure variables are added to **all environments** (Production, Preview, Development)
- Redeploy after adding variables
- Check for typos in variable names

---

## Production Checklist

Before going live:

- [ ] Database set up (Neon or Vercel Postgres)
- [ ] All environment variables added in Vercel
- [ ] Secure `ENCRYPTION_KEY` and `NEXTAUTH_SECRET` generated (not default values)
- [ ] `NEXTAUTH_URL` set to your actual domain
- [ ] Cloudinary configured with your own account
- [ ] Database schema pushed (`prisma db push`)
- [ ] Test user registration
- [ ] Test patient creation
- [ ] Test file upload
- [ ] SSL enabled (Vercel does this automatically)
- [ ] Custom domain configured (optional)

---

## Updating Your App

When you push new code to GitHub:

1. Vercel automatically deploys
2. If you changed the database schema, run:
   ```bash
   vercel env pull .env.production
   pnpm exec prisma db push
   ```

---

## Monitoring

- **Logs**: Vercel Dashboard → Your Project → Deployments → View Function Logs
- **Database**: Neon Dashboard → Your Project → Monitoring
- **Errors**: Vercel automatically shows build/runtime errors

---

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Neon Docs: https://neon.tech/docs
- Prisma Docs: https://www.prisma.io/docs
- NextAuth Docs: https://next-auth.js.org/

---

## Advanced: Custom Domain

1. Go to Vercel Dashboard → Your Project → **Settings** → **Domains**
2. Add your domain
3. Update DNS records (Vercel shows you exactly what to add)
4. Update `NEXTAUTH_URL` to your custom domain
5. Redeploy

Done! 🚀
