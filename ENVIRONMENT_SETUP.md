# Environment Variables Setup

## Required Environment Variables

Your ShipBots demo application requires the following environment variables to function properly:

### Supabase Configuration
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (for server-side operations)

**How to get these values:**
1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to Settings → API
4. Copy the Project URL and API keys

### ShipHero API Configuration
- `SHIPHERO_ACCESS_TOKEN` - Your ShipHero API access token
- `SHIPHERO_REFRESH_TOKEN` - Your ShipHero API refresh token

**How to get these values:**
1. Log into your ShipHero account
2. Go to Settings → API
3. Generate or copy your API tokens

### Optional Configuration
- `ALLOWED_ORIGINS` - Comma-separated list of allowed origins for CORS

## Local Development Setup

1. Copy `env.example` to `.env.local`:
   ```bash
   cp env.example .env.local
   ```

2. Fill in your actual values in `.env.local`

3. Start the development server:
   ```bash
   pnpm dev
   ```

## Vercel Deployment Setup

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add each environment variable with its corresponding value
5. Redeploy your application

## Important Notes

- Never commit `.env.local` or any file containing actual environment variables
- The `NEXT_PUBLIC_` prefix makes variables available in the browser
- Variables without this prefix are only available on the server side
- Make sure to set the same environment variables in all deployment environments (Preview, Development, Production)
