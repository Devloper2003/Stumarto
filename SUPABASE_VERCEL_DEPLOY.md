# 🚀 SUPABASE + VERCEL DEPLOYMENT - LIVE UPDATE

## ✅ What's Been Done

1. ✅ **Supabase Environment Variables Added**
   - Frontend: `.env` has Supabase URLs
   - Backend: `backend/.env` has Supabase keys

2. ✅ **Supabase Client Created**
   - `backend/supabaseClient.js` - Core Supabase connection
   - `backend/supabaseService.js` - Database service functions

3. ✅ **Backend Server Updated**
   - Supabase initialization logging added
   - Server detects Supabase configuration
   - API endpoint shows Supabase status

4. ✅ **Vercel Configuration Updated**
   - `vercel.json` includes Supabase environment variables
   - Ready for deployment

## 🔐 Supabase Credentials

```
URL: https://tmlalbctqzzhlufowfei.supabase.co
PUBLIC KEY: sb_publishable_xrL4jNZwEPAEhWozNVbqgw_IkUMDu2t
```

---

## 📋 DEPLOY TO VERCEL - OPTION 1: Via Web Dashboard

### Step 1: Go to Vercel Settings
1. Visit: https://vercel.com/dashboard
2. Select your project: `stumarto---school-marketplace`
3. Go to: **Settings** → **Environment Variables**

### Step 2: Add Supabase Variables (7 variables)

**Add these exactly:**

| Variable Name | Value |
|---|---|
| `SUPABASE_URL` | `https://tmlalbctqzzhlufowfei.supabase.co` |
| `SUPABASE_KEY` | `sb_publishable_xrL4jNZwEPAEhWozNVbqgw_IkUMDu2t` |
| `EXPO_PUBLIC_SUPABASE_URL` | `https://tmlalbctqzzhlufowfei.supabase.co` |
| `EXPO_PUBLIC_SUPABASE_KEY` | `sb_publishable_xrL4jNZwEPAEhWozNVbqgw_IkUMDu2t` |
| `VITE_SUPABASE_URL` | `https://tmlalbctqzzhlufowfei.supabase.co` |
| `VITE_SUPABASE_KEY` | `sb_publishable_xrL4jNZwEPAEhWozNVbqgw_IkUMDu2t` |
| `NODE_ENV` | `production` |

### Step 3: Redeploy
1. Go to **Deployments** tab
2. Click "Redeploy" on latest commit
3. Wait ~5 minutes for deployment

### Step 4: Check Logs
1. Click on deployment
2. Go to **Logs** tab
3. Look for: `✅ Supabase Configured`

---

## 🖥️ DEPLOY TO VERCEL - OPTION 2: Via CLI (Terminal)

### Step 1: Install Vercel CLI
```powershell
npm install -g vercel
```

### Step 2: Login to Vercel
```powershell
vercel login
```

### Step 3: Set Environment Variables via CLI
```powershell
cd "c:\Users\Shivam Sharma\Downloads\stumarto---school-marketplace"

# Add Supabase variables
vercel env add SUPABASE_URL
# Enter: https://tmlalbctqzzhlufowfei.supabase.co
# Select: Production

vercel env add SUPABASE_KEY
# Enter: sb_publishable_xrL4jNZwEPAEhWozNVbqgw_IkUMDu2t
# Select: Production

vercel env add EXPO_PUBLIC_SUPABASE_URL
# Enter: https://tmlalbctqzzhlufowfei.supabase.co
# Select: Production

vercel env add EXPO_PUBLIC_SUPABASE_KEY
# Enter: sb_publishable_xrL4jNZwEPAEhWozNVbqgw_IkUMDu2t
# Select: Production

vercel env add VITE_SUPABASE_URL
# Enter: https://tmlalbctqzzhlufowfei.supabase.co
# Select: Production

vercel env add VITE_SUPABASE_KEY
# Enter: sb_publishable_xrL4jNZwEPAEhWozNVbqgw_IkUMDu2t
# Select: Production
```

### Step 4: Redeploy
```powershell
vercel deploy --prod
```

---

## 🌐 DEPLOY TO VERCEL - OPTION 3: Git Push (Recommended)

### Step 1: Set Git Remote (if not set)
```powershell
cd "c:\Users\Shivam Sharma\Downloads\stumarto---school-marketplace"

# Check current remote
git remote -v

# If no remote, add it (replace YOUR-REPO-URL)
git remote set-url origin YOUR-REPO-URL
```

### Step 2: Push to Main Branch
```powershell
git add .
git commit -m "Add Supabase integration with all environment variables"
git push origin main
```

**Result:** Vercel auto-deploys within 2-5 minutes

### Step 3: Check Deployment
- Go to Vercel Dashboard → Deployments
- Look for your new commit
- See status badge change to ✅ Success

---

## ✨ What Happens After Deployment

Your app will:

1. ✅ Connect to Supabase database
2. ✅ Store all data in Supabase
3. ✅ Access Supabase from backend API
4. ✅ Support real-time database queries
5. ✅ Maintain data persistence

---

## 🧪 Test Supabase Connection

### Test 1: Check Root Endpoint
```powershell
# Replace YOUR-VERCEL-URL with actual URL
$response = Invoke-WebRequest -Uri "https://YOUR-VERCEL-URL.vercel.app/"
$response.Content | ConvertFrom-Json
```

**Expected response:**
```json
{
  "success": true,
  "message": "School Marketplace API is running!",
  "supabase": "✅ Connected"
}
```

### Test 2: Check Backend Logs
1. Vercel Dashboard → Your Project → Deployments
2. Click latest deployment → Logs
3. Look for: `✅ Supabase Configured`

### Test 3: Try Login
1. Visit your Vercel URL
2. Login: `admin@stumarto.com` / `admin123`
3. If works, Supabase is connected! ✅

---

## 📊 Environment Variables Summary

**Frontend (.env):**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_KEY`

**Backend (backend/.env):**
- `SUPABASE_URL`
- `SUPABASE_KEY`
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_KEY`

**Vercel Dashboard (7 variables in Production):**
- All of the above

---

## 🎯 Next Steps

### Quick Checklist
- [ ] Add 7 Supabase variables to Vercel
- [ ] Redeploy on Vercel
- [ ] Check deployment logs for "✅ Supabase Configured"
- [ ] Test login on production URL
- [ ] Verify data in Supabase dashboard

### Future: Create Supabase Tables
In Supabase dashboard, create these tables:
- `users` - User accounts
- `products` - Product listings
- `orders` - Orders
- `cart` - Shopping cart

Then update `supabaseService.js` to fully use them.

---

## 🆘 Troubleshooting

### "Supabase not configured" in logs?
- Check all 7 env variables are added to Vercel
- Redeploy after adding variables
- Wait 5 minutes for deployment to complete

### Login still using mock data?
- Supabase tables might not exist yet
- Backend falls back to mock mode
- Create tables in Supabase dashboard

### Can't see logs?
- Vercel Dashboard → Deployments → Click your deployment
- Scroll down to "Logs" section
- Refresh page if logs don't load

---

## 📱 Supabase Dashboard

Access your Supabase project:
https://app.supabase.com

You can:
- View all database tables
- Run real-time queries
- Manage authentication
- Check database size and usage

---

**🎉 Ready to go live! Pick one deployment option above and you'll be ready!**
