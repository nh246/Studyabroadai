# Deploy Frontend to Vercel

## Prerequisites

- GitHub account
- Backend API URL (from backend deployment)

## Steps

### 1. Push to GitHub

```bash
git add .
git commit -m "Deploy to Vercel"
git push origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **New Project**
3. Import your repository
4. **Framework**: Vite
5. **Build Command**: `npm run build`
6. **Output Directory**: `dist`
7. Click **Deploy**

### 3. Add Environment Variable

1. Go to **Settings** → **Environment Variables**
2. Add variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-backend.workers.dev`
3. **Redeploy**

## Using CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

Add environment variable in dashboard after deployment.

## Continuous Deployment

Vercel auto-deploys on every push to `main` branch.

## Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your domain
3. Update DNS records

## Monitor

- Dashboard: https://vercel.com/dashboard
- View logs and analytics

---

For local development, see [README.md](README.md)
