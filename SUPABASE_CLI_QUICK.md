# ⚡ SUPABASE INTEGRATION - QUICK CLI COMMANDS

## 📝 Files Modified

```
✅ .env                           - Added Supabase URLs (frontend)
✅ backend/.env                   - Added Supabase keys
✅ backend/supabaseClient.js      - NEW: Supabase connection
✅ backend/supabaseService.js     - NEW: Database service
✅ backend/server.js              - Updated with Supabase logging
✅ vercel.json                    - Added Supabase env vars
```

---

## 🚀 VERCEL CLI DEPLOYMENT (Fastest Way)

### 1️⃣ Install Vercel CLI
```powershell
npm install -g vercel
```

### 2️⃣ Login to Vercel
```powershell
vercel login
```

### 3️⃣ Add Environment Variables
```powershell
cd "c:\Users\Shivam Sharma\Downloads\stumarto---school-marketplace"

# One command for each variable
vercel env add SUPABASE_URL --value "https://tmlalbctqzzhlufowfei.supabase.co"
vercel env add SUPABASE_KEY --value "sb_publishable_xrL4jNZwEPAEhWozNVbqgw_IkUMDu2t"
vercel env add EXPO_PUBLIC_SUPABASE_URL --value "https://tmlalbctqzzhlufowfei.supabase.co"
vercel env add EXPO_PUBLIC_SUPABASE_KEY --value "sb_publishable_xrL4jNZwEPAEhWozNVbqgw_IkUMDu2t"
vercel env add VITE_SUPABASE_URL --value "https://tmlalbctqzzhlufowfei.supabase.co"
vercel env add VITE_SUPABASE_KEY --value "sb_publishable_xrL4jNZwEPAEhWozNVbqgw_IkUMDu2t"
```

### 4️⃣ Deploy
```powershell
vercel deploy --prod
```

### 5️⃣ Watch Deployment
```powershell
# Copy URL from output and check logs
vercel logs <your-deployment-url>
```

---

## 🔗 SUPABASE CREDENTIALS

```
🌐 URL: https://tmlalbctqzzhlufowfei.supabase.co
🔑 Key: sb_publishable_xrL4jNZwEPAEhWozNVbqgw_IkUMDu2t
```

---

## ✅ TEST LOCALLY FIRST

### Build Frontend
```powershell
npm run build
```

### Start Backend
```powershell
cd backend
npm start
```

### Test API Endpoint
```powershell
$response = Invoke-WebRequest -Uri "http://localhost:5000/"
$response.Content | ConvertFrom-Json | Format-List
```

**Expected:**
```
success           : True
message           : School Marketplace API is running!
timestamp         : 2026-03-01T...
supabase          : ✅ Connected
```

---

## 🎯 DEPLOYMENT OPTIONS

| Option | Time | Terminal | Difficulty |
|--------|------|----------|------------|
| **Vercel CLI** | 5 min | ⭐⭐ | Easy |
| **Web Dashboard** | 10 min | ⭐ | Very Easy |
| **Git Push** | 10 min | ⭐ | Medium |

---

## 📊 STATUS

```
✅ Supabase client ready
✅ Database service ready
✅ Environment configured
✅ Vercel config updated
⏳ Waiting for deployment
```

---

## 🎉 NEXT: Pick one deployment method and run it!

**Recommended: Use Vercel CLI (fastest)**
