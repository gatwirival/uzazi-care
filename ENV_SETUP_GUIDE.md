# Local Development Setup

Quick guide for running ClinIntelAI locally.

## Prerequisites

- Node.js 18+
- pnpm (or npm)
- Database (choose one):
  - Neon (recommended) - [https://neon.tech](https://neon.tech)
  - Vercel Postgres - [https://vercel.com/storage/postgres](https://vercel.com/storage/postgres)
  - Local PostgreSQL

---

## Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and update:

```bash
# Get from Neon dashboard
DATABASE_URL="postgresql://username:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require"

# Generate with: openssl rand -base64 32
ENCRYPTION_KEY=your-generated-key-here
NEXTAUTH_SECRET=your-generated-secret-here

# For local dev
NEXTAUTH_URL=http://localhost:3000

# Get from cloudinary.com/console
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 3. Initialize Database

```bash
# Generate Prisma client
pnpm exec prisma generate

# Create database tables
pnpm exec prisma db push
```

### 4. Start Development Server

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## Useful Commands

```bash
# View/edit database in browser
pnpm exec prisma studio

# Reset database (⚠️ deletes all data)
pnpm exec prisma db push --force-reset

# Check database status
pnpm exec prisma db pull
```

---

## Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for Vercel deployment instructions.

---

## Troubleshooting

### "Cannot fetch data from service" Error

Make sure your `DATABASE_URL` is correct and the database is accessible.

### "Prisma Client Not Found"

Run:
```bash
pnpm exec prisma generate
```

### Database Connection Issues

- Check your connection string has `?sslmode=require`
- Verify your database is active (Neon pauses after inactivity)
- Check firewall/network settings

---

For full deployment guide, see [DEPLOYMENT.md](./DEPLOYMENT.md)

| Option | Pros | Cons | Best For |
|--------|------|------|----------|
| **Prisma Local** | ✅ No signup<br>✅ Instant setup<br>✅ No internet needed | ❌ Must run server<br>❌ Data lost on restart | Quick testing |
| **Neon** | ✅ Free tier<br>✅ Persistent data<br>✅ Production-ready | ❌ Requires signup<br>❌ Internet needed | Development & Production |
| **Supabase** | ✅ Free tier<br>✅ Built-in auth<br>✅ Real-time features | ❌ Requires signup<br>❌ More complex | Advanced features |
| **Local PostgreSQL** | ✅ Full control<br>✅ No internet needed | ❌ Manual setup<br>❌ Requires PostgreSQL install | Offline development |

---

## 🔑 Environment Variables Explained

### Required Variables

| Variable | Description | How to Get |
|----------|-------------|------------|
| `DATABASE_URL` | PostgreSQL connection string | From your database provider |
| `ENCRYPTION_KEY` | Key for encrypting patient data | Run: `openssl rand -base64 32` |
| `NEXTAUTH_SECRET` | Secret for NextAuth.js sessions | Run: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your app's URL | `http://localhost:3000` for local |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DIRECT_URL` | Direct database connection (for migrations) | Same as `DATABASE_URL` |
| `CLOUDINARY_*` | File storage credentials | Already configured |
| `UPLOAD_DIR` | Local file upload directory | `./uploads` |
| `MAX_FILE_SIZE` | Max file size in bytes | `10485760` (10MB) |

---

## 🚨 Troubleshooting

### "Cannot fetch data from service: fetch failed"

**Problem:** Prisma local server is not running.

**Solution:**
```bash
# Start Prisma local server in a separate terminal
pnpm exec prisma dev
```

### "Invalid DATABASE_URL"

**Problem:** Connection string is incorrect or database is not accessible.

**Solutions:**
1. Check if your connection string is correct
2. For Neon: Verify your database is active in the Neon dashboard
3. For local Prisma: Make sure `pnpm exec prisma dev` is running

### "Module not found" or Prisma errors

**Problem:** Prisma client is not generated.

**Solution:**
```bash
# Regenerate Prisma client
pnpm exec prisma generate

# Push schema to database
pnpm exec prisma db push
```

### "Unauthorized" errors in API

**Problem:** ENCRYPTION_KEY or NEXTAUTH_SECRET is missing/wrong.

**Solution:**
```bash
# Generate new keys
openssl rand -base64 32

# Update .env with the generated values
```

---

## 📦 Database Management Commands

```bash
# Generate Prisma client (after schema changes)
pnpm exec prisma generate

# Push schema to database (create/update tables)
pnpm exec prisma db push

# Open Prisma Studio (database GUI)
pnpm exec prisma studio

# Reset database (⚠️ deletes all data)
pnpm exec prisma db push --force-reset

# Check migration status
pnpm exec prisma migrate status
```

---

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] Use a production database (Neon, Supabase, or managed PostgreSQL)
- [ ] Generate **new, unique** `ENCRYPTION_KEY` and `NEXTAUTH_SECRET`
- [ ] Update `NEXTAUTH_URL` to your production domain
- [ ] Update `API_BASE_URL` to your production API URL
- [ ] Set `NODE_ENV=production`
- [ ] Run `pnpm exec prisma db push` to create tables
- [ ] Configure Cloudinary with your own account (optional)
- [ ] Test all authentication flows
- [ ] Verify file uploads work correctly
- [ ] Test patient data encryption/decryption

---

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Neon Documentation](https://neon.tech/docs/introduction)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

## 💡 Pro Tips

1. **Use different databases for development and production** to avoid accidental data loss
2. **Never commit your `.env` file** - it's already in `.gitignore`
3. **Rotate your encryption keys** periodically for security
4. **Backup your production database** regularly
5. **Use Prisma Studio** (`pnpm exec prisma studio`) to visually inspect your data

---

Need help? Check the main [README.md](./README.md) or open an issue!
