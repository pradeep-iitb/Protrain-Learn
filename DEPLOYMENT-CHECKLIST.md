# 🚀 Complete Deployment Checklist - ProTrain.AI

## ✅ Pre-Deployment Checklist

### 1. Code Preparation
- [ ] All dependencies in `package.json` (both frontend & backend)
- [ ] Test build locally: `npm run build` in client folder
- [ ] Test backend locally: `npm start` in server folder
- [ ] All environment variables documented
- [ ] `.env` files in `.gitignore`
- [ ] No hardcoded URLs (use config files)

### 2. Configuration Files
- [ ] `render.yaml` configured for backend
- [ ] `client/vercel.json` configured for frontend
- [ ] `client/src/config/api.js` has proper API base URL
- [ ] `server/src/config.js` has all settings centralized

---

## 🔧 Backend Deployment (Render)

### Step 1: Push to GitHub
```bash
git add .
git commit -m "feat: Ready for production deployment"
git push origin main
```

### Step 2: Create Render Service
1. Go to [render.com](https://dashboard.render.com/)
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub repository
4. Render will auto-detect `render.yaml`
5. Click **"Apply"**

### Step 3: Set Environment Variables
Go to **Environment** tab and add:

```env
NODE_ENV = production
PORT = 5000
GEMINI_API_KEY = your-google-ai-api-key
MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/dbname
CLIENT_ORIGIN = https://your-frontend.vercel.app
```

⚠️ **Important**: 
- Don't add trailing slashes
- Use exact production URL
- Set `CLIENT_ORIGIN` after you get Vercel URL

### Step 4: Wait for Deployment
- Takes 5-10 minutes
- Check **Logs** tab for errors
- Once deployed, copy the URL: `https://your-backend.onrender.com`

### Step 5: Test Backend
Visit in browser:
```
https://your-backend.onrender.com/
```
Should return: `{"ok":true,"service":"protrain-server"}`

---

## 🎨 Frontend Deployment (Vercel)

### Step 1: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com/dashboard)
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repository
4. Configure:
   - **Root Directory**: `client`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)

### Step 2: Set Environment Variable
Click **"Environment Variables"** and add:

```env
VITE_API_BASE = https://your-backend.onrender.com
```

⚠️ **Important**:
- Must start with `VITE_` for Vite to expose it
- Use your actual Render backend URL
- No trailing slash

### Step 3: Deploy
- Click **"Deploy"**
- Wait 2-3 minutes
- Copy your Vercel URL: `https://your-app.vercel.app`

### Step 4: Update Backend CORS
Go back to Render:
1. **Environment** tab
2. Update `CLIENT_ORIGIN` with your Vercel URL
3. Save (service will auto-restart)

---

## 🗄️ Database Setup (MongoDB Atlas)

### Step 1: Create Cluster
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account (if not done)
3. Create **M0 Free Tier** cluster
4. Choose region closest to your backend

### Step 2: Create Database User
1. **Database Access** → **Add New Database User**
   - Username: `protrain`
   - Password: Generate strong password
   - Role: `Atlas Admin`

### Step 3: Configure Network Access
1. **Network Access** → **Add IP Address**
2. Click **"Allow Access from Anywhere"** (`0.0.0.0/0`)
   - Or add specific IPs if you know them

### Step 4: Get Connection String
1. Click **"Connect"** on cluster
2. Choose **"Connect your application"**
3. Copy connection string:
   ```
   mongodb+srv://username:<password>@cluster.mongodb.net/
   ```
4. Replace `<password>` with actual password
5. Add database name at end: `mongodb+srv://user:pass@cluster.mongodb.net/protrain`

---

## 🔄 Update Workflow (After Initial Deployment)

### When You Make Code Changes:

#### 1. Update Code Locally
```bash
# Make your changes
git add .
git commit -m "feat: Your change description"
git push origin main
```

#### 2. Automatic Deployments
- ✅ **Vercel**: Auto-deploys on push to main
- ✅ **Render**: Auto-deploys on push to main
- Wait 2-5 minutes for builds

#### 3. Manual Deployment (If Needed)
**Vercel:**
1. Dashboard → Your Project → Deployments
2. Click **"Redeploy"** on latest

**Render:**
1. Dashboard → Your Service
2. **Manual Deploy** → **"Clear build cache & deploy"**

---

## 🐛 Common Issues & Fixes

### Issue 1: CORS Error
**Error**: `Access blocked by CORS policy`

**Fix**:
1. Check `CLIENT_ORIGIN` in Render environment variables
2. Must exactly match Vercel URL (no trailing slash)
3. Include `https://`
4. Restart Render service

### Issue 2: Build Failed on Vercel
**Error**: `Rollup failed to resolve import`

**Fix**:
1. Check all dependencies in `client/package.json`
2. Run `npm install` locally to update `package-lock.json`
3. Commit and push both files

### Issue 3: Backend Not Responding
**Error**: `Connection error` or `Failed to fetch`

**Fix**:
1. Check Render Logs tab for errors
2. Verify environment variables are set
3. Backend might be sleeping (free tier) - visit URL to wake it
4. Check `GEMINI_API_KEY` is valid

### Issue 4: MongoDB Connection Failed
**Error**: `MongooseError: Could not connect`

**Fix**:
1. Check `MONGODB_URI` format is correct
2. Verify password doesn't have special characters (URL encode if needed)
3. Check IP whitelist in Atlas (allow `0.0.0.0/0`)
4. Verify database user has correct permissions

### Issue 5: Environment Variables Not Working
**Error**: `undefined` values in code

**Fix**:
1. **Frontend**: Variable must start with `VITE_`
2. **Backend**: Check `.env` syntax (no spaces around `=`)
3. Redeploy after adding variables
4. Clear cache and redeploy

---

## 📊 Monitoring & Maintenance

### Daily Checks
- [ ] Check Render Logs for errors
- [ ] Monitor Vercel Analytics for traffic
- [ ] Check MongoDB Atlas metrics

### Weekly Tasks
- [ ] Review error logs
- [ ] Check API usage/quotas (Gemini)
- [ ] Monitor database storage

### Monthly Tasks
- [ ] Update dependencies (`npm update`)
- [ ] Review and renew SSL certificates (auto on Vercel/Render)
- [ ] Backup database (MongoDB Atlas)

---

## 🎯 Quick Reference URLs

### Development
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

### Production
- Frontend: `https://protrain-frontend.vercel.app`
- Backend: `https://protrain-backend.onrender.com`
- Database: MongoDB Atlas Cloud

### Dashboards
- Vercel: https://vercel.com/dashboard
- Render: https://dashboard.render.com/
- MongoDB: https://cloud.mongodb.com/
- Google AI: https://aistudio.google.com/

---

## 💰 Cost Breakdown (Free Tier)

| Service | Free Tier Limits | Upgrade Cost |
|---------|------------------|--------------|
| **Vercel** | 100GB bandwidth/month | $20/month (Pro) |
| **Render** | 750 hours/month, sleeps after 15min | $7/month (Starter) |
| **MongoDB Atlas** | 512MB storage, shared cluster | $0.08/hour (M10) |
| **Google Gemini** | 15 req/min, 1500 req/day | Pay as you go |

**Total Monthly Cost**: **$0** 🎉

---

## 🔐 Security Checklist

- [ ] API keys in environment variables (not in code)
- [ ] `.env` files in `.gitignore`
- [ ] CORS configured to specific domains
- [ ] MongoDB password is strong (20+ characters)
- [ ] MongoDB IP whitelist configured
- [ ] HTTPS enabled (automatic with Vercel/Render)
- [ ] No sensitive data in Git history
- [ ] Regular security updates (`npm audit fix`)

---

## 📝 Environment Variables Reference

### Frontend (.env or Vercel)
```env
VITE_API_BASE=https://protrain-backend.onrender.com
```

### Backend (.env or Render)
```env
NODE_ENV=production
PORT=5000
GEMINI_API_KEY=your-api-key
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/protrain
CLIENT_ORIGIN=https://protrain-frontend.vercel.app
```

---

## 🎓 Best Practices

### 1. Version Control
- Always commit before deploying
- Use meaningful commit messages
- Tag releases: `git tag v1.0.0`

### 2. Testing
- Test locally before pushing
- Run `npm run build` to catch build errors
- Test on staging environment if available

### 3. Configuration
- Keep all URLs in config files
- Don't hardcode API endpoints
- Use environment-specific configs

### 4. Documentation
- Keep README.md updated
- Document all environment variables
- Write deployment notes

### 5. Monitoring
- Check logs regularly
- Set up error tracking (optional: Sentry)
- Monitor API quotas

---

## 🆘 Emergency Rollback

If deployment breaks:

### Vercel Rollback:
1. Dashboard → Deployments
2. Find last working deployment
3. Click **"..."** → **"Promote to Production"**

### Render Rollback:
1. Dashboard → Your Service
2. **Manual Deploy** tab
3. Select previous commit from dropdown
4. Click **"Deploy"**

### Git Rollback:
```bash
# See commit history
git log

# Revert to previous commit
git revert HEAD

# Or reset (destructive)
git reset --hard <commit-hash>
git push --force origin main
```

---

## 📞 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **MongoDB Docs**: https://docs.atlas.mongodb.com
- **Gemini AI Docs**: https://ai.google.dev/docs
- **Vite Docs**: https://vitejs.dev/guide/

---

## ✅ Final Deployment Verification

After deployment, test these:

### Frontend Tests:
- [ ] Landing page loads
- [ ] Can navigate to LessonsHub
- [ ] Can click on a lesson
- [ ] Navbar works
- [ ] No console errors (F12)

### Backend Tests:
- [ ] Health check returns OK
- [ ] Can start conversation (simulate endpoint)
- [ ] Can get evaluation (evaluate endpoint)
- [ ] Voice features work

### Integration Tests:
- [ ] Full conversation flow works
- [ ] Evaluation provides feedback
- [ ] Progress saves correctly
- [ ] Voice input/output works
- [ ] All 6 lessons accessible

---

## 🎉 You're Live!

Your ProTrain.AI platform is now live and accessible worldwide!

**Share your project:**
- Production URL: `https://protrain-frontend.vercel.app`
- GitHub Repo: `https://github.com/pradeep-iitb/Protrain`

**For hackathon judges:**
- Demo credentials (if needed)
- Video walkthrough
- Project presentation

Good luck with your hackathon! 🚀
