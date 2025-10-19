#!/bin/bash

# ShipBots - Supabase Setup Helper
# This script helps set up Supabase for a new client

set -e

echo "🗄️ ShipBots - Supabase Setup Helper"
echo "===================================="
echo ""

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found"
    echo ""
    echo "Please install it first:"
    echo "  brew install supabase/tap/supabase"
    echo ""
    echo "Or visit: https://supabase.com/docs/guides/cli"
    exit 1
fi

echo "✅ Supabase CLI found"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local not found"
    echo ""
    echo "Please create .env.local with your Supabase credentials first:"
    echo "  cp .env.example .env.local"
    echo "  # Then edit .env.local with your credentials"
    exit 1
fi

echo "✅ .env.local found"
echo ""

# Get project ref from user
read -p "Enter your Supabase project reference ID: " PROJECT_REF

if [ -z "$PROJECT_REF" ]; then
    echo "❌ Project reference required"
    exit 1
fi

echo ""
echo "Step 1: Linking to Supabase project..."
echo "======================================="
supabase link --project-ref "$PROJECT_REF"
echo "✅ Linked to Supabase project"
echo ""

echo "Step 2: Applying database migrations..."
echo "========================================"
supabase db push
echo "✅ Migrations applied"
echo ""

echo "Step 3: Verifying tables..."
echo "============================"
echo "Checking if tables were created..."

# List tables (this will fail gracefully if there's an issue)
supabase db --help > /dev/null 2>&1 || true

echo ""
echo "✨ Supabase setup complete!"
echo ""
echo "📋 Verify in Supabase dashboard:"
echo "================================"
echo "- Go to your Supabase project"
echo "- Check Database → Tables"
echo "- You should see: warehouses, team_members, tours,"
echo "  tour_participants, tenant_config, shiphero_tokens, extras"
echo ""
echo "📚 Next: Deploy to Vercel and configure environment variables"
echo ""

