#!/bin/bash

# ShipBots - Add Environment Variables to Vercel
# This script helps add Supabase credentials to Vercel

set -e

echo "🔐 ShipBots - Add Environment Variables to Vercel"
echo "=================================================="
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found"
    echo "Install it: npm install -g vercel"
    exit 1
fi

echo "✅ Vercel CLI found"
echo ""

# Check if linked to Vercel
if [ ! -d ".vercel" ]; then
    echo "❌ Not linked to a Vercel project"
    echo "Run: vercel link"
    exit 1
fi

echo "✅ Linked to Vercel project"
echo ""

echo "📋 You'll need these values from your Supabase project:"
echo "Go to: Supabase Dashboard → Settings → API"
echo ""

# Prompt for Supabase URL
echo "1️⃣ Enter your Supabase Project URL:"
echo "   (Format: https://xxxxx.supabase.co)"
read -p "   URL: " SUPABASE_URL

if [ -z "$SUPABASE_URL" ]; then
    echo "❌ Supabase URL required"
    exit 1
fi

# Prompt for Anon Key
echo ""
echo "2️⃣ Enter your Supabase Anon Key (public key):"
read -p "   Key: " SUPABASE_ANON_KEY

if [ -z "$SUPABASE_ANON_KEY" ]; then
    echo "❌ Anon key required"
    exit 1
fi

# Prompt for Service Role Key
echo ""
echo "3️⃣ Enter your Supabase Service Role Key (click 'Reveal' in dashboard):"
read -p "   Key: " SUPABASE_SERVICE_ROLE_KEY

if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "❌ Service role key required"
    exit 1
fi

echo ""
echo "📝 Adding environment variables to Vercel..."
echo "=============================================="

# Add NEXT_PUBLIC_SUPABASE_URL
echo ""
echo "Adding NEXT_PUBLIC_SUPABASE_URL..."
echo "$SUPABASE_URL" | vercel env add NEXT_PUBLIC_SUPABASE_URL production preview development

# Add NEXT_PUBLIC_SUPABASE_ANON_KEY
echo ""
echo "Adding NEXT_PUBLIC_SUPABASE_ANON_KEY..."
echo "$SUPABASE_ANON_KEY" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production preview development

# Add SUPABASE_SERVICE_ROLE_KEY
echo ""
echo "Adding SUPABASE_SERVICE_ROLE_KEY..."
echo "$SUPABASE_SERVICE_ROLE_KEY" | vercel env add SUPABASE_SERVICE_ROLE_KEY production preview development

echo ""
echo "✨ Environment variables added successfully!"
echo ""

# Optionally save to .env.local
echo "💾 Save these to .env.local for local development? (y/n)"
read -p "   " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    cat > .env.local << EOF
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY

# Database URL (for Supabase CLI)
# Format: postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
# DATABASE_URL=postgresql://postgres:your-password@db.xxxxx.supabase.co:5432/postgres
EOF
    echo "✅ Saved to .env.local"
    echo ""
    echo "⚠️ Don't forget to add DATABASE_URL if you need to use Supabase CLI"
fi

echo ""
echo "🚀 Next Steps:"
echo "=============="
echo "1. Redeploy to Vercel:"
echo "   vercel --prod"
echo ""
echo "2. Once deployed, configure in the app:"
echo "   - Settings → ShipHero tab"
echo "   - Add ShipHero refresh token"
echo "   - Sync warehouses"
echo ""
echo "✅ All done!"
echo ""

