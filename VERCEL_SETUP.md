# Vercel Setup Instructions

Your project is now linked to Vercel! 🎉

**Project URL:** https://vercel.com/mikeazimi-dischubcoms-projects/shipbots

## ⚠️ Next Steps Required

The deployment failed because environment variables are missing. Follow these steps:

### 1. Add Environment Variables to Vercel

Go to: https://vercel.com/mikeazimi-dischubcoms-projects/shipbots/settings/environment-variables

Add these variables:

#### Required Variables

| Variable Name | Where to Find It |
|---------------|------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard → Settings → API → anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Settings → API → service_role key (click "Reveal") |

#### Important Settings

For each variable:
- ✅ Select **Production**
- ✅ Select **Preview**
- ✅ Select **Development**
- Click **Save**

### 2. Redeploy

After adding environment variables, redeploy:

```bash
cd /Users/mikeazimi/Desktop/apps_do_not_delete/shipbots
vercel --prod
```

Or simply:
- Go to Vercel dashboard
- Click "Redeploy" on the failed deployment

### 3. Connect to Existing Vercel Project (Optional)

If you want to use your existing **shipper_demo** project instead:

1. Delete the current `.vercel` directory:
   ```bash
   rm -rf .vercel
   ```

2. Re-link to shipper_demo:
   ```bash
   vercel link --project=shipper_demo
   ```

3. Deploy:
   ```bash
   vercel --prod
   ```

### 4. Automatic Deployments from GitHub

To enable automatic deployments when you push to GitHub:

1. Go to: https://vercel.com/mikeazimi-dischubcoms-projects/shipbots
2. Click **Settings** → **Git**
3. Click **Connect Git Repository**
4. Select: `mostafa-azimi/ship_demo`
5. Every push to master will auto-deploy! 🚀

## Current Status

- ✅ Code pushed to GitHub: https://github.com/mostafa-azimi/ship_demo
- ✅ Linked to Vercel project: **shipbots**
- ⏳ Waiting for environment variables to be added
- ⏳ Ready to redeploy once configured

## Quick Links

- **Vercel Project:** https://vercel.com/mikeazimi-dischubcoms-projects/shipbots
- **GitHub Repo:** https://github.com/mostafa-azimi/ship_demo
- **Vercel Settings:** https://vercel.com/mikeazimi-dischubcoms-projects/shipbots/settings

---

**Need help?** See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for complete instructions.

