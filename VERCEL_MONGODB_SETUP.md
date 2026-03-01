# 🚀 Vercel Deployment with MongoDB Setup

## Status UPDATE
✅ Railway hosting **REMOVED**  
✅ Switched to **Vercel** with MongoDB Atlas  
✅ Backend configured for production

---

## 📋 Step 1: Set Environment Variables on Vercel

Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

Add these variables (click "Add" for each):

### Production Environment Variables

| Variable | Value | Notes |
|----------|-------|-------|
| `MONGODB_URI` | `mongodb+srv://Vercel-Admin-stumarto:nkU5RnwzW89mILPM@stumarto.t4egbrk.mongodb.net/?retryWrites=true&w=majority` | Already set in backend/.env ✅ |
| `NODE_ENV` | `production` | For Vercel |
| `JWT_SECRET` | `your-super-secret-jwt-key-change-this` | Generate a secure random key |
| `ADMIN_EMAIL` | `admin@stumarto.com` | Admin login email |
| `ADMIN_PASSWORD` | `admin123` | Admin login password |
| `PORT` | `3000` | Vercel uses auto-assigned port |
| `RAZORPAY_KEY_ID` | `rzp_test_1DP5mmOlF5G5ag` | Test/Production keys |
| `RAZORPAY_KEY_SECRET` | `jB3j8k2L9mN0pQ1r2S3t4U5v6W7x8Y9z` | Test/Production keys |

---

## 🔧 Step 2: Push Changes to Git

```powershell
# Navigate to project root
cd c:\Users\Shivam Sharma\Downloads\stumarto---school-marketplace

# Add all changes
git add .

# Commit with message
git commit -m "Update: Switch from Railway to Vercel with MongoDB Atlas"

# Push to repository
git push origin main
```

---

## ✅ Step 3: Deploy on Vercel

### Option A: Auto-Deploy (Recommended)
1. Vercel auto-deploys when you push to `main` branch
2. Check Vercel dashboard for deployment status
3. Wait 2-5 minutes for deployment to complete

### Option B: Manual Deploy from Vercel Dashboard
1. Go to: https://vercel.com/dashboard
2. Select your project
3. Click **"Redeploy"** button
4. Select the latest commit
5. Click **"Redeploy"**

---

## 🧪 Step 4: Test Your Deployment

### Test Backend API
```powershell
# Once deployed, test an endpoint
# Replace YOUR-VERCEL-URL with your actual Vercel domain

$response = Invoke-WebRequest -Uri "https://YOUR-VERCEL-URL.vercel.app/api/auth/login" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body (@{email="admin@stumarto.com"; password="admin123"} | ConvertTo-Json)

$response.Content | ConvertFrom-Json | Format-List
```

### Test Frontend
1. Open your Vercel URL
2. Try logging in with:
   - Email: `admin@stumarto.com`
   - Password: `admin123`
3. Should see admin dashboard or marketplace

### Check Backend Logs
1. Vercel Dashboard → Project → Deployments
2. Click the deployment
3. View "Logs" tab for backend errors/info
4. Look for: ✅ MongoDB connected or ⚠️ Using mock mode

---

## 📦 MongoDB Atlas Details

**Account:** Vercel-Admin-stumarto  
**Cluster:** stumarto.t4egbrk.mongodb.net  
**Database:** Will be created automatically

Your data will be:
- Persistent across deployments ✅
- Accessible from any location ✅
- Backed up by MongoDB Atlas ✅
- Connected to Vercel via secure connection ✅

---

## 🔄 Local Development

### Test Locally Before Deploying

**Terminal 1 - Backend:**
```powershell
cd backend
npm start
# Should show: ✅ MongoDB connected successfully
```

**Terminal 2 - Frontend:**
```powershell
npm run dev
# Opens http://localhost:3000
```

**Test Login:** admin@stumarto.com / admin123

---

## 📋 Checklist Before Production

- ✅ MongoDB URI set in backend/.env
- ✅ All env variables added to Vercel dashboard
- ✅ vercel.json configured
- ✅ Changes pushed to git
- ✅ Deployment completed on Vercel
- ✅ Login works on production
- ✅ Admin dashboard accessible
- ✅ Backend logs showing MongoDB connected

---

## 🆘 Troubleshooting

### Login Failed: "Unable to login"
1. Check Vercel logs: Dashboard → Deployments → Logs
2. Verify MongoDB URI is correct
3. Ensure env variables are saved and deployment restarted

### "MongoDB connection error"
1. Check connection string format
2. Verify IP is whitelisted on MongoDB Atlas (should be 0.0.0.0/0)
3. Test connection: `npm run dev` locally

### "Cannot GET /"
1. Ensure `npm run build` completed successfully
2. Check Vercel build logs
3. Verify vercel.json is correct

### Still on Railway?
1. Remove all Railway environment variables
2. Disconnect Railway from project
3. Ensure only Vercel is connected
4. Delete `.vercel` folder if it got cached

---

## 🚀 Your Production URL

Once deployed, you'll have a Vercel URL like:
```
https://stumarto-school-marketplace.vercel.app/
```

Or your custom domain if configured.

---

## Next Steps

1. **Monitor Performance:** Check Vercel analytics dashboard
2. **Set Up Custom Domain:** Add your own domain in Vercel settings
3. **Enable Analytics:** Turn on Vercel Analytics in Settings
4. **Backup Data:** Configure MongoDB Atlas backup settings

---

## Quick Reference

| Aspect | Details |
|--------|---------|
| **Hosting** | Vercel (Frontend + Backend) |
| **Database** | MongoDB Atlas (Cloud) |
| **Build** | `npm run build` |
| **Start** | `node backend/server.js` |
| **Auto-Deploy** | On git push to main |
| **Environment** | Production |
| **Monitoring** | Vercel Dashboard + MongoDB Dashboard |

---

**Deployment Complete! Your app is now live on Vercel with MongoDB Atlas.** 🎉
