#!/bin/bash

# ShipBots - Vercel Deployment Helper
# This script helps deploy to Vercel for a new client

set -e

echo "🚀 ShipBots - Vercel Deployment Helper"
echo "======================================="
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "⚠️ Vercel CLI not found"
    echo ""
    read -p "Install Vercel CLI now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        npm install -g vercel
        echo "✅ Vercel CLI installed"
    else
        echo "Please install manually: npm install -g vercel"
        exit 1
    fi
fi

echo "✅ Vercel CLI found"
echo ""

# Check if logged in
echo "Checking Vercel authentication..."
if ! vercel whoami &> /dev/null; then
    echo "⚠️ Not logged in to Vercel"
    echo ""
    vercel login
fi

echo "✅ Authenticated with Vercel"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local not found"
    echo ""
    echo "Please create .env.local with your credentials first"
    exit 1
fi

echo "✅ .env.local found"
echo ""

echo "📋 Environment Variables to Add in Vercel:"
echo "==========================================="
echo ""
echo "After deployment, add these in Vercel dashboard:"
echo "Settings → Environment Variables"
echo ""
echo "Required variables:"
echo "  - NEXT_PUBLIC_SUPABASE_URL"
echo "  - NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "  - SUPABASE_SERVICE_ROLE_KEY"
echo ""
echo "⚠️ Make sure to select all environments:"
echo "  - Production"
echo "  - Preview"
echo "  - Development"
echo ""

read -p "Ready to deploy? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled."
    exit 0
fi

echo ""
echo "Deploying to Vercel..."
echo "======================"
vercel

echo ""
echo "✨ Deployment initiated!"
echo ""
echo "📋 Next Steps:"
echo "=============="
echo "1. Go to Vercel dashboard for your project"
echo "2. Add environment variables (Settings → Environment Variables)"
echo "3. Redeploy: vercel --prod"
echo "4. Test the production URL"
echo "5. Configure ShipHero integration in the app"
echo ""

