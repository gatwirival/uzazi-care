#!/bin/bash

# ClinIntelAI Setup Script
# This script helps you set up the project quickly

echo "🏥 ClinIntelAI - Setup Script"
echo "=============================="
echo ""

# Check if .env exists
if [ -f .env ]; then
    echo "✅ .env file already exists"
else
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please update .env with your actual values:"
    echo "   - DATABASE_URL (from Neon dashboard)"
    echo "   - DIRECT_URL (from Neon dashboard - optional for Neon)"
    echo "   - ENCRYPTION_KEY (generate with: openssl rand -base64 32)"
    echo "   - NEXTAUTH_SECRET (generate with: openssl rand -base64 32)"
    echo ""
    read -p "Press Enter to continue once you've updated .env..."
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
pnpm exec prisma generate

# Push schema to database
echo "🗄️  Would you like to push the schema to your database now? (y/n)"
read -p "> " push_db

if [ "$push_db" = "y" ]; then
    echo "Pushing schema to database..."
    pnpm exec prisma db push
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Ensure your .env file has correct values"
echo "2. Run 'pnpm dev' to start the development server"
echo "3. Visit http://localhost:3000 to see your app"
echo ""
echo "Optional commands:"
echo "- 'pnpm exec prisma studio' to open Prisma Studio (database GUI)"
echo "- 'pnpm exec prisma db push' to sync database schema"
echo ""
echo "Happy coding! 🚀"
