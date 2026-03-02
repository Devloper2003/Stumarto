# 🚀 SUPABASE DEPLOYMENT - TERMINAL COMMANDS

## ⚡ FASTEST WAY TO DEPLOY (5 Minutes)

### Step 1: Navigate to Project in PowerShell
```powershell
cd "c:\Users\Shivam Sharma\Downloads\stumarto---school-marketplace"
```

### Step 2: Run the Deployment Script
```powershell
powershell -ExecutionPolicy Bypass -File deploy-supabase.ps1
```

Or simply:
```powershell
.\deploy-supabase.ps1
```

### Step 3: Follow Interactive Menu
The script will:
1. Check for Vercel CLI (install if needed)
2. Build your project
3. Ask you which method to use:
   - **Option 1:** Auto-deploy with CLI (recommended)
   - **Option 2:** Show environment variables to add manually
   - **Option 3:** Just verify configuration

### Step 4: If You Choose Option 1:
- It will prompt you to login to Vercel
- Add all 6 Supabase environment variables
- Deploy to production
- Show you the deployment URL

---

## 🔧 MANUAL CLI COMMANDS

If you prefer to do it step-by-step:

### Install Vercel CLI
```powershell
npm install -g vercel
```

### Login to Vercel
```powershell
vercel login
```

### Navigate to Project
```powershell
cd "c:\Users\Shivam Sharma\Downloads\stumarto---school-marketplace"
```

### Build Project
```powershell
npm run build
```

### Add Environment Variables (one by one)
```powershell
vercel env add SUPABASE_URL
# Enter: https://tmlalbctqzzhlufowfei.supabase.co
# Choose: Production

vercel env add SUPABASE_KEY
# Enter: sb_publishable_xrL4jNZwEPAEhWozNVbqgw_IkUMDu2t
# Choose: Production

vercel env add EXPO_PUBLIC_SUPABASE_URL
# Enter: https://tmlalbctqzzhlufowfei.supabase.co
# Choose: Production

vercel env add EXPO_PUBLIC_SUPABASE_KEY
# Enter: sb_publishable_xrL4jNZwEPAEhWozNVbqgw_IkUMDu2t
# Choose: Production

vercel env add VITE_SUPABASE_URL
# Enter: https://tmlalbctqzzhlufowfei.supabase.co
# Choose: Production

vercel env add VITE_SUPABASE_KEY
# Enter: sb_publishable_xrL4jNZwEPAEhWozNVbqgw_IkUMDu2t
# Choose: Production
```

### Deploy to Production
```powershell
vercel deploy --prod
```

---

## ✅ VERIFY DEPLOYMENT

### Wait for Deployment (2-5 minutes)

### Check Status
```powershell
vercel logs <your-deployment-url>
```

### Test API
```powershell
# Replace with your actual Vercel URL
$url = "https://YOUR-PROJECT.vercel.app/"
Invoke-WebRequest -Uri $url | Select-Object -ExpandProperty Content | ConvertFrom-Json
```

**Expected output includes:**
```
supabase : ✅ Connected
```

---

## 📊 WHAT EACH VARIABLE DOES

| Variable | Purpose |
|----------|---------|
| `SUPABASE_URL` | Backend connects to this Supabase project |
| `SUPABASE_KEY` | Backend uses this key to authenticate |
| `EXPO_PUBLIC_SUPABASE_URL` | Frontend can access (public) |
| `EXPO_PUBLIC_SUPABASE_KEY` | Frontend can use (public key) |
| `VITE_SUPABASE_URL` | Vite build system needs this |
| `VITE_SUPABASE_KEY` | Vite build system needs this |

---

## 🎯 TIMELINE

| Step | Time | Command |
|------|------|---------|
| 1. Install CLI | 1 min | `npm install -g vercel` |
| 2. Navigate | 30 sec | `cd "..."` |
| 3. Build | 2-3 min | `npm run build` |
| 4. Add Variables | 2-3 min | `vercel env add ...` (6 times) |
| 5. Deploy | 3-5 min | `vercel deploy --prod` |
| **Total** | **~12 minutes** | **Complete!** |

**Or use the script: ~5 minutes total**

---

## 🆘 TROUBLESHOOTING

### Error: "vercel: command not found"
```powershell
npm install -g vercel
```

### Error: "Not authenticated"
```powershell
vercel logout
vercel login
```

### Error: Repository not found
- Make sure you're in the correct directory
- Use full path: `cd "c:\Users\Shivam Sharma\Downloads\stumarto---school-marketplace"`

### Deployment still running? Check logs
```powershell
# Find your deployment URL first
vercel list

# Then check logs
vercel logs <deployment-url>
```

---

## 📱 AFTER DEPLOYMENT

### Get Your Live URL
```powershell
# The deployment will output a URL like:
# https://stumarto---school-marketplace.vercel.app/

# Test it:
Start-Process "https://YOUR-URL.vercel.app"
```

### Check Backend Logs
```powershell
vercel logs <url>
```

### Look for Success Message
```
✅ Supabase Configured
📍 Supabase Project: https://tmlalb****
```

---

## 💡 QUICK REFERENCE

| Need | Command |
|------|---------|
| Install Vercel | `npm install -g vercel` |
| Login | `vercel login` |
| Navigate | `cd "c:\Users\Shivam Sharma\Downloads\stumarto---school-marketplace"` |
| Build | `npm run build` |
| Add Env Var | `vercel env add KEY_NAME` |
| Deploy | `vercel deploy --prod` |
| Check Logs | `vercel logs URL` |
| See Projects | `vercel list` |
| Redeploy | `vercel deploy --prod` |

---

## 🎉 YOU'RE READY!

### The Fastest Way:
Copy and paste this one command:
```powershell
cd "c:\Users\Shivam Sharma\Downloads\stumarto---school-marketplace"; powershell -ExecutionPolicy Bypass -File deploy-supabase.ps1
```

Then follow the interactive menu and choose option 1.

**That's it! Your app will be live with Supabase in ~10 minutes.** 🚀

---

## 📚 REFERENCE FILES

- `SUPABASE_INTEGRATION_SUMMARY.md` - Complete overview
- `SUPABASE_READY_DEPLOY.md` - Deployment checklist
- `deploy-supabase.ps1` - This is the script to run
- `SUPABASE_VERCEL_DEPLOY.md` - Detailed guide

---

**Questions? Check the documentation files listed above.**

**Ready? Run the script and go live!** ✨
