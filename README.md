# 🏭 ShipBots - Warehouse Touring App

A Next.js application for managing warehouse tours with ShipHero integration. This app allows you to schedule tours, manage participants, and automatically create demo orders in ShipHero for tour demonstrations.

## 🏗️ Architecture

This app uses a **single-tenant-per-deployment** model:
- ✅ Each customer gets their own dedicated Vercel deployment
- ✅ Each customer gets their own isolated Supabase database
- ✅ **Zero possibility of data mixing** between customers
- ✅ Simple, secure, and scales perfectly

## ✨ Features

- 📅 **Tour Scheduling** - Schedule warehouse tours with date, time, and location
- 👥 **Participant Management** - Track tour attendees with company and contact info
- 🏢 **Warehouse Sync** - Automatically sync warehouses from ShipHero
- 📦 **Order Creation** - Create demo orders in ShipHero for tour demonstrations
- ⚙️ **Configurable Workflows** - Customize order creation workflows per tour
- 🎯 **Host Management** - Assign tour guides/hosts to each tour
- 📊 **Order Tracking** - Track created orders with summaries

## 🚀 Quick Start

### For Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/shipbots.git
   cd shipbots
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   ```

5. **Open http://localhost:3000**

### For New Client Deployment

See [CLIENT_SETUP_CHECKLIST.md](./CLIENT_SETUP_CHECKLIST.md) for a complete step-by-step guide.

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

## 📚 Documentation

- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Complete deployment instructions
- **[CLIENT_SETUP_CHECKLIST.md](./CLIENT_SETUP_CHECKLIST.md)** - Step-by-step client onboarding
- **[SCHEMA.md](./SCHEMA.md)** - Database schema and structure
- **[design.md](./design.md)** - ShipHero design guidelines

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Database:** Supabase (PostgreSQL)
- **Hosting:** Vercel
- **Integration:** ShipHero GraphQL API
- **UI:** React 19, Tailwind CSS, Radix UI
- **Language:** TypeScript

## 🗄️ Database Schema

Key tables:
- `warehouses` - Customer warehouse locations
- `team_members` - Tour hosts/guides
- `tours` - Scheduled tours
- `tour_participants` - Tour attendees
- `tenant_config` - Customer configuration
- `shiphero_tokens` - ShipHero API credentials
- `extras` - Demo customers for additional orders

See [SCHEMA.md](./SCHEMA.md) for complete database documentation.

## 🔐 Environment Variables

Required environment variables:
```env
NEXT_PUBLIC_SUPABASE_URL=       # Your Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=  # Supabase anonymous key
SUPABASE_SERVICE_ROLE_KEY=      # Supabase service role key
DATABASE_URL=                    # PostgreSQL connection string (for CLI)
```

See [.env.example](./.env.example) for complete template.

## 📦 Project Structure

```
shipbots/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── shiphero/      # ShipHero integration endpoints
│   │   └── tours/         # Tour management endpoints
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # UI components (shadcn)
│   ├── settings/         # Settings page components
│   └── *.tsx             # Feature components
├── lib/                   # Utilities and services
│   ├── shiphero/         # ShipHero client and services
│   ├── supabase/         # Supabase client setup
│   └── *.ts              # Utility functions
├── supabase/
│   ├── migrations/       # Database migrations
│   └── config.toml       # Supabase configuration
└── public/               # Static assets
```

## 🔄 Deployment Workflow

1. **Create new Supabase project** for the client
2. **Apply database migrations** using Supabase CLI
3. **Deploy to Vercel** with environment variables
4. **Configure ShipHero integration** in the app settings
5. **Sync warehouses** from ShipHero
6. **Ready to use!**

## 🤝 Contributing

This is a client-specific application. For feature requests or bug reports, please contact the development team.

## 📄 License

Proprietary - All rights reserved

## 🆘 Support

For issues or questions:
- Technical support: [your-email@company.com]
- ShipHero API: support@shiphero.com
- Supabase: https://supabase.com/support
