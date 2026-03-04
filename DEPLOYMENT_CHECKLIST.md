# ✅ COMPLETE DEPLOYMENT CHECKLIST

## Your Render Backend Service
**Expected URL:** `https://stumarto-backend.onrender.com`

Check Render Dashboard here: https://render.com/dashboard

---

## ✅ REQUIRED ACTIONS (Complete ALL 3)

### ACTION 1: Create Supabase Tables
**Status:** ⏳ PENDING

1. Go to: https://app.supabase.com → Your Project
2. Click **SQL Editor → New query**
3. Copy and paste the SQL schema from `backend/init_supabase.sql` (shown above)
4. Click **Run**
5. Verify: You should see 4 new tables: `users`, `products`, `carts`, `orders`

**Why:** Without tables, registration/login API calls will fail.

---

### ACTION 2: Verify Render Backend is Live
**Status:** ⏳ PENDING

1. Go to: https://render.com/dashboard
2. Find your service: `stumarto-backend`
3. Check **Status**: should be ✅ "Live" (green)
4. Check **Logs**: should show `Server is running on port`
5. Copy your **Service URL** (e.g., `https://stumarto-backend-xxxxx.onrender.com`)

**If not live yet:**
- Wait 2-3 minutes (first deploy takes time)
- Check logs for errors
- Verify environment variables are set (SUPABASE_URL, SUPABASE_KEY, etc.)

---

### ACTION 3: Update Vercel Frontend
**Status:** ⏳ PENDING

1. Go to: https://vercel.com/dashboard
2. Select your **stumarto** project
3. **Settings → Environment Variables**
4. Find/Add `VITE_API_BASE_URL` with value = **Your Render URL**
   - Example: `https://stumarto-backend-abc123.onrender.com`
5. Click **Save**
6. Go to **Deployments** → Click **Redeploy** on the latest deployment

**Why:** Frontend needs to know where the backend API is located.

---

## 🧪 TESTING CHECKLIST

After completing all 3 actions above, test:

```powershell
# 1. Backend is live
$backendUrl = "https://stumarto-backend.onrender.com"  # ← UPDATE with your actual Render URL
Invoke-WebRequest -Uri "$backendUrl/" | Select-Object -Expand Content

# 2. Test registration (should return user + token)
$body = @{
  name = "Test User"
  email = "test@example.com"
  password = "testpass123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "$backendUrl/api/auth/register" `
  -Method POST `
  -Body $body `
  -ContentType "application/json" | Select-Object -Expand Content
```

---

## 🎯 FINAL STEP: Go Live

Once all tests pass:

1. Visit your **Vercel frontend URL** (e.g., `https://stumarto.vercel.app`)
2. Try **Sign Up** → should register in Supabase
3. Try **Login** → should authenticate and get a token
4. Browse products, add to cart, etc. → all API calls go to Render backend

---

## 📊 FINAL ARCHITECTURE

```
┌─────────────────────┐
│  Your Local Dev     │
│  (VS Code)          │
│  - Backend runs     │
│  - Port 5000        │
└─────────────────────┘

         ↓ (Push commits)

┌─────────────────────┐
│  GitHub             │
│  (sujaeet-sharmas)  │
│  Repository         │
└─────────────────────┘

         ↓ (Auto-deploys)

┌─────────────────────────────────────────┐
│ PRODUCTION DEPLOYMENT                   │
├─────────────────────────────────────────┤
│ Backend: Render                         │
│  - URL: stuttarto-backend.onrender.com  │
│  - Node.js + Express                    │
│  - Auto-deploys on git push             │
├─────────────────────────────────────────┤
│ Frontend: Vercel                        │
│  - URL: stumarto.vercel.app             │
│  - React + Vite                         │
│  - Points to Render backend URL         │
├─────────────────────────────────────────┤
│ Database: Supabase (PostgreSQL)         │
│  - Tables: users, products, carts,      │
│    orders                               │
│  - Real-time & secure                   │
└─────────────────────────────────────────┘
```

---

## 🆘 TROUBLESHOOTING

| Issue | Solution |
|-------|----------|
| Render shows "Not Found" | Service still deploying—wait 2-3 mins |
| Render shows build error | Check logs; verify `backend/package.json` exists |
| "Could not find table" error | Run SQL schema in Supabase SQL Editor |
| Frontend says "Failed to fetch" | Check `VITE_API_BASE_URL` in Vercel env vars |
| Auth not working | Ensure Supabase tables exist; verify SUPABASE_KEY in Render |

---

## ✨ STATUS

- [x] Backend code ready with Supabase
- [x] Render service configured
- [ ] **Supabase tables created** ← Complete this NOW
- [ ] **Render backend verified live** ← Complete this NOW
- [ ] **Vercel frontend updated** ← Complete this NOW

**Estimated time: 5 minutes**

Go through the checklist above and you'll be LIVE! 🚀
