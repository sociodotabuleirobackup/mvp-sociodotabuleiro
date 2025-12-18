#!/bin/bash

echo "🚀 Setting up Sócio do Tabuleiro - Complete Database"

# 1. Install dependencies
echo "📦 Installing dependencies..."
cd packages/db && npm install

# 2. Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# 3. Run migrations
echo "🗄️ Running migrations..."
npx prisma migrate dev --name init_complete_schema

# 4. Apply RLS policies manually
echo "🔒 Apply RLS policies manually in Supabase SQL Editor:"
echo "   Copy content from packages/db/prisma/rls-policies.sql"

# 5. Seed database
echo "🌱 Seeding database..."
npx prisma db seed

echo "✅ Setup complete!"
echo ""
echo "📌 Next steps:"
echo "   1. Apply RLS policies in Supabase SQL Editor"
echo "   2. Run: pnpm dev:api (from root)"
echo "   3. Test: curl http://localhost:3001/healthz"