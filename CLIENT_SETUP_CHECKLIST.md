# 📋 New Client Setup Checklist

Use this checklist when setting up the warehouse touring app for a new client.

---

## Pre-Setup Information Needed

Before you begin, collect this information from the client:

- [ ] Client name (for naming conventions)
- [ ] ShipHero account access
- [ ] ShipHero Refresh Token (from their ShipHero API settings)
- [ ] ShipHero Vendor ID (for purchase orders)
- [ ] Preferred region for hosting (US, EU, Asia, etc.)
- [ ] Custom domain (optional)
- [ ] Company details (for order addresses)

---

## Step 1: Repository Setup

- [ ] Clone the repository
  ```bash
  git clone https://github.com/mostafa-azimi/touring_app.git [client-name]-touring-app
  cd [client-name]-touring-app
  ```

- [ ] (Optional but recommended) Create new private GitHub repository
  ```bash
  gh repo create [client-name]-touring-app --private --source=. --push
  ```

- [ ] Copy environment variables template
  ```bash
  cp .env.example .env.local
  ```

---

## Step 2: Supabase Project Setup

- [ ] Log into [supabase.com](https://supabase.com)
- [ ] Click "New Project"
- [ ] Enter project details:
  - **Name:** `[client-name]-touring`
  - **Database Password:** Generate strong password (save it!)
  - **Region:** Choose closest to client
- [ ] Wait for project setup (~2 minutes)
- [ ] Save project reference ID (from URL)

---

## Step 3: Get Supabase Credentials

In the new Supabase project dashboard:

- [ ] Navigate to **Settings** → **API**
- [ ] Copy **Project URL**
  - Update `NEXT_PUBLIC_SUPABASE_URL` in `.env.local`
- [ ] Copy **anon public** key
  - Update `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`
- [ ] Click "Reveal" and copy **service_role** key
  - Update `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`
- [ ] Navigate to **Settings** → **Database**
- [ ] Copy connection string
  - Update `DATABASE_URL` in `.env.local`
  - Replace `[YOUR-PASSWORD]` with the database password you saved

---

## Step 4: Database Migration

- [ ] Link Supabase CLI to project
  ```bash
  supabase link --project-ref [your-project-ref]
  ```

- [ ] Apply all database migrations
  ```bash
  supabase db push
  ```

- [ ] Verify migrations applied successfully
  - Check Supabase dashboard → **Database** → **Tables**
  - Should see: warehouses, team_members, tours, tour_participants, tenant_config, shiphero_tokens, extras

---

## Step 5: Verify Local Setup

- [ ] Install dependencies
  ```bash
  pnpm install
  ```

- [ ] Start development server
  ```bash
  pnpm dev
  ```

- [ ] Open http://localhost:3000
- [ ] Verify app loads without errors
- [ ] Check browser console for errors

---

## Step 6: Vercel Deployment

- [ ] Install Vercel CLI (if not already installed)
  ```bash
  npm install -g vercel
  ```

- [ ] Login to Vercel
  ```bash
  vercel login
  ```

- [ ] Initial deployment
  ```bash
  vercel
  ```
  - Link to existing project? **No**
  - Project name: `[client-name]-touring-app`
  - Deploy? **Yes**

- [ ] Note the deployment URL provided

---

## Step 7: Configure Vercel Environment Variables

In Vercel dashboard for the new project:

- [ ] Go to **Settings** → **Environment Variables**
- [ ] Add the following variables:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL` (from .env.local)
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` (from .env.local)
  - [ ] `SUPABASE_SERVICE_ROLE_KEY` (from .env.local)
- [ ] For each variable, select all environments:
  - [ ] Production
  - [ ] Preview
  - [ ] Development
- [ ] Click **Save**

---

## Step 8: Production Deployment

- [ ] Trigger production deployment with environment variables
  ```bash
  vercel --prod
  ```

- [ ] Wait for deployment to complete
- [ ] Note the production URL
- [ ] Test the production deployment

---

## Step 9: Initial App Configuration

- [ ] Open the production URL
- [ ] Navigate to **Settings** (gear icon)

### ShipHero Tab
- [ ] Paste client's ShipHero Refresh Token
- [ ] Click "Generate Access Token"
- [ ] Verify success message

### Tenant Config Tab
- [ ] Update **ShipHero Vendor ID** (for purchase orders)
- [ ] Update **Shop Name** (appears in orders)
- [ ] Update **Company Name** (for addresses)
- [ ] Set **Default Fulfillment Status** (usually "pending")
- [ ] Click **Save Settings**

### Warehouses Tab
- [ ] Click "Sync from ShipHero"
- [ ] Verify client's warehouses appear in the list

### Hosts Tab
- [ ] Add initial tour hosts/guides
  - First Name
  - Last Name
  - Email
- [ ] Click **Add Host**

---

## Step 10: Test Tour Creation

Create a test tour to verify everything works:

- [ ] Click "Schedule Tour" tab
- [ ] Fill in tour details:
  - Date
  - Time
  - Warehouse
  - Host
  - Add test participant
- [ ] Click "Create Tour"
- [ ] Verify tour appears in "View Tours" tab
- [ ] (Optional) Test tour finalization
  - Configure workflow settings
  - Click "Finalize Tour"
  - Verify orders created in ShipHero

---

## Step 11: Custom Domain (Optional)

If client wants custom domain:

- [ ] In Vercel dashboard → **Settings** → **Domains**
- [ ] Click "Add Domain"
- [ ] Enter client's domain (e.g., tours.clientname.com)
- [ ] Follow DNS configuration instructions
- [ ] Verify domain is active

---

## Step 12: Client Handoff

Prepare materials for client:

- [ ] Send production URL
- [ ] Provide login credentials (if applicable)
- [ ] Share user guide/documentation
- [ ] Schedule training session (if needed)
- [ ] Provide support contact information

---

## Step 13: Documentation

Update internal tracking:

- [ ] Add client to deployment spreadsheet
  - Client name
  - Production URL
  - Supabase project URL
  - Vercel project URL
  - Setup date
  - Point of contact

- [ ] Save credentials securely
  - Supabase credentials
  - Database password
  - ShipHero tokens (if provided)

- [ ] Add to monitoring/alerting (if applicable)

---

## Post-Deployment Verification

Within 24-48 hours:

- [ ] Check Vercel deployment logs for errors
- [ ] Verify client can log in and use the app
- [ ] Confirm ShipHero integration is working
- [ ] Address any issues or questions from client

---

## Troubleshooting Common Issues

### Environment Variables Not Working
- Verify they're set in Vercel dashboard
- Ensure all three environments are selected
- Redeploy after adding variables

### Migration Errors
```bash
# Reset and reapply
supabase db reset
supabase db push
```

### ShipHero Token Issues
- Verify refresh token is correct
- Check `SUPABASE_SERVICE_ROLE_KEY` is set
- Look at browser console for error messages
- Verify ShipHero API access in client's ShipHero account

### Warehouses Not Syncing
- Verify ShipHero token is valid
- Check network tab in browser for API errors
- Verify client has warehouses in ShipHero
- Check Supabase database logs

---

## Support Contacts

- **Technical Issues:** [your-email@company.com]
- **ShipHero API:** support@shiphero.com
- **Supabase Support:** https://supabase.com/support
- **Vercel Support:** https://vercel.com/support

---

## Estimated Time

- **Setup Time:** 30-45 minutes
- **Client Training:** 15-30 minutes
- **Total:** ~1 hour per client

---

## Notes

- Save this checklist in your internal documentation
- Update as you learn from each deployment
- Consider creating a script to automate common steps
- Keep track of client-specific customizations

---

**Last Updated:** [Current Date]
**Version:** 1.0

