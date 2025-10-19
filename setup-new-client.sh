#!/bin/bash

# ShipBots - New Client Setup Script
# This script helps automate the setup of a new client deployment

set -e  # Exit on error

echo "🚀 ShipBots - New Client Setup"
echo "=============================="
echo ""

# Check if client name is provided
if [ -z "$1" ]; then
    echo "❌ Error: Client name required"
    echo "Usage: ./setup-new-client.sh <client-name>"
    echo "Example: ./setup-new-client.sh acme-corp"
    exit 1
fi

CLIENT_NAME=$1
PROJECT_DIR="${CLIENT_NAME}-touring-app"

echo "📝 Client Name: $CLIENT_NAME"
echo "📁 Project Directory: $PROJECT_DIR"
echo ""

# Confirm before proceeding
read -p "Continue with setup? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Setup cancelled."
    exit 1
fi

echo ""
echo "Step 1: Cloning repository..."
echo "=============================="
git clone https://github.com/mostafa-azimi/ship_demo.git "$PROJECT_DIR"
cd "$PROJECT_DIR"
echo "✅ Repository cloned"
echo ""

echo "Step 2: Setting up environment..."
echo "================================="
cp .env.example .env.local
echo "✅ Created .env.local (needs to be configured)"
echo ""

echo "Step 3: Installing dependencies..."
echo "=================================="
if command -v pnpm &> /dev/null; then
    pnpm install
    echo "✅ Dependencies installed with pnpm"
else
    npm install
    echo "✅ Dependencies installed with npm"
fi
echo ""

echo "✨ Initial setup complete!"
echo ""
echo "📋 Next Steps:"
echo "============="
echo ""
echo "1. Create Supabase Project:"
echo "   - Go to https://supabase.com"
echo "   - Create new project: ${CLIENT_NAME}-touring"
echo "   - Save project URL and keys"
echo ""
echo "2. Update .env.local with Supabase credentials:"
echo "   - NEXT_PUBLIC_SUPABASE_URL"
echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "   - SUPABASE_SERVICE_ROLE_KEY"
echo "   - DATABASE_URL"
echo ""
echo "3. Link to Supabase and run migrations:"
echo "   cd $PROJECT_DIR"
echo "   supabase link --project-ref <your-project-ref>"
echo "   supabase db push"
echo ""
echo "4. Test locally:"
echo "   pnpm dev"
echo ""
echo "5. Deploy to Vercel:"
echo "   vercel"
echo "   # Then add environment variables in Vercel dashboard"
echo ""
echo "6. Complete setup in app:"
echo "   - Configure ShipHero tokens in Settings"
echo "   - Sync warehouses"
echo "   - Add hosts"
echo ""
echo "📚 See CLIENT_SETUP_CHECKLIST.md for detailed instructions"
echo ""

