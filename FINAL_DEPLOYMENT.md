# 🚀 STUMARTO DEPLOYMENT - FINAL CHECKLIST

**GitHub Repo:** https://github.com/Devloper2003/Stumarto ✅ PUSHED

---

## ✅ COMPLETED
- [x] Code pushed to GitHub
- [x] Backend configured with Supabase
- [x] Environment variables ready
- [x] Deployment scripts created

---

## 📋 REMAINING STEPS (3 Quick Tasks)

### **TASK 1: Deploy Backend to Render** (5 minutes)

Run in VS Code terminal (workspace root):
```powershell
.\render_deploy.ps1
```

When prompted, provide:
- Render API key (from render.com/account/api-keys)
- SUPABASE_URL (from your Supabase project settings)
- SUPABASE_KEY (service_role key, NOT publishable)
- JWT_SECRET (any random string, e.g., "my-secret-key-123")
- ADMIN_EMAIL (default: admin@stumarto.com)
- ADMIN_PASSWORD (default: admin123)

Script will:
- Create Render Web Service via API
- Set all environment variables
- Show your service URL (e.g., https://stumarto-backend.onrender.com)
- Open Render dashboard

Expected output:
```
Service created successfully!
Service will be live at: https://stumarto-backend-xxxxx.onrender.com
```

---

### **TASK 2: Create Supabase Tables** (2 minutes)

1. In Supabase dashboard (already open in browser tab)
2. **SQL Editor** → **New query**
3. Copy entire file: `backend/init_supabase.sql`
4. Paste into SQL editor
5. Click **Run**

You should see 4 tables created:
- users
- products
- carts
- orders

---

### **TASK 3: Deploy Frontend to Vercel** (3 minutes)

1. Go to vercel.com/dashboard
2. Select your project (or create new from Devloper2003/Stumarto)
3. **Settings** → **Environment Variables**
4. Add:
   ```
   VITE_API_BASE_URL = https://stumarto-backend-xxxxx.onrender.com
   ```
   (Replace with your actual Render URL from Task 1)
5. Save
6. Go to **Deployments** → Click **Redeploy** on latest deployment

---

## 🧪 VERIFY IT'S LIVE

After all 3 tasks, test in terminal:

```powershell
# Replace with your Render URL
$backend = "https://stumarto-backend-xxxxx.onrender.com"

# Test backend
Invoke-WebRequest -Uri "$backend/" | Select-Object -Expand Content

# Test register endpoint
$body = @{
  name = "Test Admin"
  email = "admin@test.com"
  password = "test123"
  role = "admin"
} | ConvertTo-Json

Invoke-WebRequest -Uri "$backend/api/auth/register" `
  -Method POST `
  -Body $body `
  -ContentType "application/json" | Select-Object -Expand Content
```

Expected: Returns JSON with user info and token.

---

## 📊 FINAL ARCHITECTURE

```
Frontend (Vercel)          →  API calls to  →  Backend (Render)  →  Database (Supabase)
stumarto.vercel.app              /api/...          onrender.com          PostgreSQL
```

---

## 🎯 WHAT TO DO NOW

1. Run `.\render_deploy.ps1` in terminal
2. Run SQL in Supabase
3. Update Vercel env var
4. Test endpoints
5. ✅ LIVE!

**ALL AUTOMATED — No manual Render service creation in UI needed** (the script creates it via API).

---

## 🆘 TROUBLESHOOTING

| Problem | Solution |
|---------|----------|
| "Invalid API key" | Go to render.com → Account → API Keys → Generate new |
| "Could not find table users" | Run backend/init_supabase.sql in Supabase SQL editor |
| Backend returns 502 | Wait 1-2 mins for Render to finish deploying; check logs |
| Frontend shows "Failed to fetch" | Verify VITE_API_BASE_URL is set in Vercel and matches your Render URL |
| Supabase key rejected | Make sure you're using **service_role** key, not the publishable key |

---

**Time estimate: 10 minutes to complete all tasks and be LIVE** 🚀
