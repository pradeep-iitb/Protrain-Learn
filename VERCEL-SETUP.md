# 🚀 Vercel Deployment - Quick Guide

## Environment Variables for Vercel

When deploying the **frontend** to Vercel, you need to set this environment variable:

### Required Variable:

```
VITE_API_BASE=https://your-backend-url.onrender.com
```

**Example:**
```
VITE_API_BASE=https://protrain-backend.onrender.com
```

---

## How to Set Environment Variables in Vercel

### Method 1: Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com/dashboard)
2. Select your project (e.g., "protrain")
3. Go to **Settings** → **Environment Variables**
4. Add new variable:
   - **Name**: `VITE_API_BASE`
   - **Value**: `https://your-backend-url.onrender.com`
   - **Environments**: Select `Production`, `Preview`, and `Development`
5. Click **Save**
6. **Redeploy** your application (Settings → Deployments → Redeploy)

### Method 2: Vercel CLI

```bash
cd client
vercel env add VITE_API_BASE
# Enter value when prompted: https://your-backend-url.onrender.com
# Select environments: Production, Preview, Development
```

---

## Deployment Steps

### 1. Deploy Backend First (Render)
```bash
# Push your code to GitHub
git push origin main

# Go to Render Dashboard
# Create new Web Service from your GitHub repo
# Set environment variables in Render:
#   - GEMINI_API_KEY
#   - MONGODB_URI
#   - CLIENT_ORIGIN (will be your Vercel URL)
# Copy the Render URL (e.g., https://protrain-backend.onrender.com)
```

### 2. Deploy Frontend (Vercel)
```bash
# Option A: Vercel Dashboard
# 1. Go to vercel.com
# 2. Import your GitHub repo
# 3. Set root directory to: client
# 4. Add environment variable: VITE_API_BASE
# 5. Deploy!

# Option B: Vercel CLI
cd client
vercel deploy --prod
```

### 3. Update Backend CORS
After Vercel deployment, go back to Render:
1. Settings → Environment Variables
2. Update `CLIENT_ORIGIN` to your Vercel URL (e.g., `https://protrain.vercel.app`)
3. Restart service

---

## Verify Deployment

### Check Frontend
1. Open your Vercel URL: `https://protrain.vercel.app`
2. Open browser console (F12)
3. Check for CORS errors
4. Try clicking on lessons
5. Test conversation with AI

### Check Backend
```bash
# Health check
curl https://your-backend.onrender.com/

# Should return: {"ok":true,"service":"protrain-server"}
```

---

## Common Issues

### CORS Error
**Problem**: `Access to fetch blocked by CORS policy`

**Solution**:
- Ensure `CLIENT_ORIGIN` in Render matches your Vercel URL exactly
- No trailing slash
- Include `https://`
- Restart Render service after changing

### Environment Variable Not Working
**Problem**: Frontend still uses localhost URL

**Solution**:
- Verify variable name is exactly `VITE_API_BASE` (case-sensitive)
- Redeploy after adding environment variables
- Clear cache and redeploy
- Check build logs for variable value

### Backend URL Shows as "undefined"
**Problem**: API calls fail with undefined URL

**Solution**:
- Make sure to add `VITE_` prefix (Vite requires this)
- Verify variable is set for Production environment
- Redeploy after adding variables

---

## Production URLs

After deployment, you'll have:

- **Frontend (Vercel)**: `https://protrain.vercel.app` (or custom domain)
- **Backend (Render)**: `https://protrain-backend.onrender.com`
- **Database (MongoDB Atlas)**: Connection string in environment variables

---

## Auto-Deployment

Both platforms support automatic deployment from GitHub:

- **Push to `main`** → Vercel auto-deploys frontend
- **Push to `main`** → Render auto-deploys backend

You can disable this in Settings if needed.

---

## Cost

Everything runs on **FREE tier**:
- ✅ Vercel Free: 100GB bandwidth/month
- ✅ Render Free: 750 hours/month
- ✅ MongoDB Atlas Free: 512MB storage
- ✅ Google Gemini Free: 15 requests/min

**Total: $0/month** 🎉

---

## Need Help?

Check the main `DEPLOYMENT.md` for detailed troubleshooting and advanced configuration.
