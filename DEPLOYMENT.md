# 🚀 Deployment Guide - ProTrain.AI

## Quick Deployment Checklist

### 📝 Before Deployment

1. **Update Frontend Configuration** (`client/src/config/api.js`):
   ```javascript
   export const API_BASE_URL = import.meta.env.VITE_API_BASE || 'https://your-backend-url.onrender.com';
   ```

2. **Update Backend Configuration** (`server/.env`):
   ```env
   PORT=5000
   CLIENT_ORIGIN=https://your-frontend-url.vercel.app
   GEMINI_API_KEY=your-key
   MONGODB_URI=your-mongodb-uri
   NODE_ENV=production
   ```

---

## 🎯 Frontend Deployment (Vercel)

### Step 1: Prepare Frontend
```bash
cd client
npm install
npm run build  # Test build locally
```

### Step 2: Deploy to Vercel
```bash
# Install Vercel CLI (if not installed)
npm install -g vercel

# Deploy
vercel deploy --prod
```

### Step 3: Set Environment Variables in Vercel Dashboard
- Go to Vercel Project Settings → Environment Variables
- Add: `VITE_API_BASE` = `https://your-backend-url.onrender.com`

### Alternative: Connect GitHub
1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Select your GitHub repo
4. Set root directory: `client`
5. Add environment variable: `VITE_API_BASE`
6. Deploy!

---

## 🔧 Backend Deployment (Render)

### Step 1: Prepare Backend
```bash
cd server
npm install
# Test locally
npm start
```

### Step 2: Create Render Web Service
1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `protrain-backend`
   - **Region**: Choose closest to users
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

### Step 3: Set Environment Variables in Render
Go to Environment tab and add:
```
GEMINI_API_KEY=your-google-ai-api-key
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/protrain
PORT=5000
CLIENT_ORIGIN=https://your-frontend.vercel.app
NODE_ENV=production
```

### Step 4: Deploy
- Click "Create Web Service"
- Wait for deployment (5-10 minutes)
- Copy the URL (e.g., `https://protrain-backend.onrender.com`)

---

## 💾 Database Setup (MongoDB Atlas)

### Step 1: Create Free Cluster
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create new cluster (M0 Free Tier)
4. Choose region closest to your backend

### Step 2: Configure Access
1. **Database Access** → Add New User
   - Username: `protrain`
   - Password: Generate strong password
   - Role: `Atlas Admin`

2. **Network Access** → Add IP Address
   - Click "Allow Access from Anywhere" (`0.0.0.0/0`)
   - Or add specific IPs if you know them

### Step 3: Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy connection string:
   ```
   mongodb+srv://protrain:<password>@cluster.mongodb.net/
   ```
4. Replace `<password>` with your actual password
5. Add database name: `mongodb+srv://protrain:pass@cluster.mongodb.net/protrain`

---

## 🔄 Update Configuration After Deployment

### 1. Update Frontend Config
**File**: `client/src/config/api.js`

```javascript
// BEFORE (Development)
export const API_BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

// AFTER (Production) - Update default to your backend URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE || 'https://protrain-backend.onrender.com';
```

### 2. Commit and Push
```bash
git add client/src/config/api.js
git commit -m "chore: Update API URL for production"
git push origin main
```

### 3. Vercel Auto-Deploys
- Vercel detects the push and auto-deploys
- Or manually redeploy in Vercel dashboard

---

## ✅ Post-Deployment Verification

### Test Checklist
- [ ] Frontend loads at `https://your-app.vercel.app`
- [ ] Landing page displays correctly
- [ ] Navigate to Lessons Hub
- [ ] Click on a lesson
- [ ] Start conversation - AI responds
- [ ] Click Evaluate - gets feedback
- [ ] Check browser console for errors
- [ ] Test voice input (Chrome/Edge)
- [ ] Test on mobile device

### Test API Endpoints
```bash
# Health check
curl https://your-backend.onrender.com/

# Test simulate (should return 400 without message)
curl -X POST https://your-backend.onrender.com/api/simulate \
  -H "Content-Type: application/json"
```

---

## 🐛 Troubleshooting

### Problem: CORS Error
**Error**: `Access to fetch blocked by CORS policy`

**Solution**:
1. Check `CLIENT_ORIGIN` in Render environment variables
2. Must exactly match your Vercel URL (include `https://`)
3. No trailing slash
4. Restart Render service after changing

### Problem: API Returns 401/403
**Error**: `Unauthorized` or `Forbidden`

**Solution**:
1. Verify `GEMINI_API_KEY` is correct
2. Check API key quotas at [Google AI Studio](https://aistudio.google.com/app/apikey)
3. Regenerate key if needed

### Problem: MongoDB Connection Failed
**Error**: `MongooseError: Could not connect`

**Solution**:
1. Check `MONGODB_URI` format
2. Verify password doesn't contain special characters (use URL encoding)
3. Check Network Access in Atlas (allow `0.0.0.0/0`)
4. Verify user has correct permissions

### Problem: 500 Server Error
**Error**: Generic server error

**Solution**:
1. Check Render logs (Dashboard → Logs tab)
2. Look for specific error messages
3. Common issues:
   - Missing environment variables
   - MongoDB connection timeout
   - Gemini API rate limit

### Problem: Frontend Can't Reach Backend
**Error**: `Failed to fetch` or `Network error`

**Solution**:
1. Verify backend URL is correct in `client/src/config/api.js`
2. Check backend is running (visit URL in browser)
3. Check CORS configuration
4. Verify Render service didn't sleep (free tier sleeps after inactivity)

---

## 💰 Cost Breakdown (Free Tier)

| Service | Free Tier | Limits |
|---------|-----------|--------|
| **Vercel** | ✅ Free | 100 GB bandwidth/month |
| **Render** | ✅ Free | 750 hours/month, sleeps after 15min inactivity |
| **MongoDB Atlas** | ✅ Free | 512 MB storage, shared cluster |
| **Google Gemini** | ✅ Free | 15 requests/min, 1500 requests/day |

**Total Monthly Cost**: $0 🎉

### Upgrade Options (If Needed)
- **Vercel Pro**: $20/month - No sleep, more bandwidth
- **Render Starter**: $7/month - No sleep, always-on
- **MongoDB M10**: $0.08/hour - Dedicated cluster, more storage

---

## 🔐 Security Checklist

- [ ] API keys stored in environment variables (not in code)
- [ ] `.env` files in `.gitignore`
- [ ] CORS configured to specific frontend URL
- [ ] MongoDB password is strong
- [ ] MongoDB IP whitelist configured
- [ ] HTTPS enabled (automatic with Vercel/Render)
- [ ] Rate limiting enabled (optional: add express-rate-limit)

---

## 🔄 Continuous Deployment

### GitHub → Vercel (Frontend)
- Automatic: Push to `main` branch → Vercel deploys
- Preview: Push to other branches → Preview deployments

### GitHub → Render (Backend)
- Automatic: Push to `main` branch → Render deploys
- Manual: Click "Manual Deploy" in Render dashboard

### Disable Auto-Deploy
- **Vercel**: Settings → Git → Disable "Automatic Deployments"
- **Render**: Settings → Build & Deploy → Disable "Auto-Deploy"

---

## 📊 Monitoring

### Vercel Analytics
1. Go to Vercel Dashboard → Analytics
2. View:
   - Page views
   - Load times
   - Errors
   - Countries

### Render Logs
1. Go to Render Dashboard → Logs
2. View real-time server logs
3. Filter by date/level

### MongoDB Metrics
1. Go to Atlas Dashboard → Metrics
2. View:
   - Connection count
   - Operations/second
   - Storage usage

---

## 🎯 Performance Tips

### Frontend Optimization
- Enable Vercel's compression
- Use lazy loading for components
- Optimize images (use WebP)
- Enable caching headers

### Backend Optimization
- Add response caching (Redis optional)
- Use connection pooling (MongoDB)
- Implement rate limiting
- Compress responses

### Database Optimization
- Create indexes on frequently queried fields
- Use projection (only fetch needed fields)
- Implement pagination for large datasets

---

## 📞 Support Resources

- **Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **Render**: [render.com/docs](https://render.com/docs)
- **MongoDB Atlas**: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
- **Google Gemini**: [ai.google.dev/docs](https://ai.google.dev/docs)

---

## 🎉 You're Live!

Your ProTrain.AI platform is now deployed and accessible worldwide!

- **Frontend**: `https://protrain.vercel.app`
- **Backend**: `https://protrain-backend.onrender.com`
- **Database**: MongoDB Atlas Cloud

Share your hackathon project with the world! 🚀
