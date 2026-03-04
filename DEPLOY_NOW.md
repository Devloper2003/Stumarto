# 🚀 ONE-COMMAND DEPLOYMENT SUMMARY

Your backend code is **ready for Render**. Follow the steps below to go live in **~5 minutes**.

---

## 🎯 What You Have Now

✅ Backend configured with Supabase  
✅ Deployment files created (`.render.yaml`, `init_supabase.sql`)  
✅ Code committed locally  
✅ Helper scripts ready  

---

## 📋 3 Steps to Deploy

### **Step 1: Push to GitHub** (2 min)

Run the deployment helper in VS Code terminal:

```powershell
cd C:\Users\Shivam Sharma\Downloads\stumarto---school-marketplace
.\deploy.ps1
```

The script will ask for:
1. Your GitHub Personal Access Token (from https://github.com/settings/tokens → "Generate new token")
2. Your GitHub username

It will then push your code to GitHub.

### **Step 2: Create Render Service** (2 min)

1. Go to https://render.com/dashboard
2. Click **New → Web Service**
3. Select your repository: `stumarto---school-marketplace`
4. Fill in:

   | Field | Value |
   |-------|-------|
   | Name | `stumarto-backend` |
   | Environment | `Node` |
   | Region | `Oregon` (or nearest) |
   | Branch | `main` |
   | Build Command | `npm install` |
   | Start Command | `npm start` |
   | Root Directory | `backend` |

5. Click **Advanced > Add Environment Variables** and add:

| Key | Value |
|-----|-------|
| `SUPABASE_URL` | (from Supabase > Settings > API) |
| `SUPABASE_KEY` | (service_role key from same) |
| `JWT_SECRET` | `your-random-secret-string` |
| `ADMIN_EMAIL` | `admin@stumarto.com` |
| `ADMIN_PASSWORD` | `admin123` |

6. Click **Create Web Service** and wait for deployment (~2 min)

Render will show your live URL: e.g. `https://stumarto-backend.onrender.com`

### **Step 3: Link Vercel Frontend** (1 min)

1. Go to https://vercel.com/dashboard
2. Select your project
3. **Settings → Environment Variables**
4. Add:

| Name | Value | Environments |
|------|-------|------|
| `VITE_API_BASE_URL` | `https://stumarto-backend.onrender.com` | Production + Preview |

5. Save and redeploy (or push a commit)

---

## ✨ Before Testing

Create the Supabase tables (one-time):

1. Go to your Supabase project → **SQL Editor**
2. Create a **New query**
3. Copy the entire file: `backend/init_supabase.sql` from your repo
4. Paste in Supabase and click **Run**

---

## 🧪 Test It

Once deployed:

```powershell
# Test backend is live
curl https://stumarto-backend.onrender.com/

# Should see:
# {"success": true, "message": "School Marketplace API is running!", …}
```

Visit your **Vercel URL** and try signing up → registration API calls should work! ✅

---

## 📚 Guides Available

- `RENDER_DEPLOYMENT_GUIDE.md` — Full step-by-step guide
- `GITHUB_AUTH_QUICK.md` — GitHub authentication help
- `backend/README.md` — Backend deployment info
- `backend/init_supabase.sql` — Database schema

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| **"Repository not found"** during push | Ensure GitHub PAT has `repo` scope (https://github.com/settings/tokens) |
| **Render says "Build failed"** | Check Render logs for `npm` errors; ensure `backend/package.json` exists |
| **"Could not find table"** error | Run `backend/init_supabase.sql` in Supabase SQL Editor (not executed yet!) |
| **Frontend stuck on "Failed to fetch"** | Clear browser cache + hard refresh (Ctrl+Shift+R); verify Vercel env var is set |

---

## ⏱️ Estimated Time: 5 minutes

✔️ Push to GitHub: 1 min  
✔️ Render setup: 2 min  
✔️ Vercel link: 1 min  
✔️ Supabase tables: 1 min  

**Go live now!** 🚀
