#!/bin/bash

# ClinIntelAI RBAC Setup Script
# Run this after fixing your database connection

echo "=================================="
echo "ClinIntelAI RBAC Setup Script"
echo "=================================="
echo ""

# Step 1: Check database connection
echo "Step 1: Testing database connection..."
if npx prisma db push --help > /dev/null 2>&1; then
    echo "✅ Prisma CLI is working"
else
    echo "❌ Prisma CLI not found. Run: npm install"
    exit 1
fi

echo ""
echo "Step 2: Pushing schema to database..."
echo "⚠️  This will reset your database and delete all data!"
read -p "Are you sure you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Setup cancelled."
    exit 0
fi

# Push schema
npx prisma db push --accept-data-loss

if [ $? -eq 0 ]; then
    echo "✅ Database schema pushed successfully!"
else
    echo "❌ Database push failed. Check your DATABASE_URL in .env file"
    exit 1
fi

# Generate Prisma Client
echo ""
echo "Step 3: Generating Prisma Client..."
npx prisma generate

if [ $? -eq 0 ]; then
    echo "✅ Prisma Client generated successfully!"
else
    echo "❌ Prisma Client generation failed"
    exit 1
fi

echo ""
echo "=================================="
echo "✅ Setup Complete!"
echo "=================================="
echo ""
echo "Next steps:"
echo "1. Start dev server: pnpm dev"
echo "2. Visit: http://localhost:3000/auth/register"
echo "3. Register a hospital (hospital name, email, password)"
echo "4. Login as hospital admin"
echo "5. Create doctors from Hospital Management"
echo ""
echo "📖 For detailed guide, see: RBAC_IMPLEMENTATION_GUIDE.md"
echo ""
