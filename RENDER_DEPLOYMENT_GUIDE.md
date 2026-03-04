# 🚀 Render Deployment Guide for Stumarto Backend

This guide walks you through deploying the backend to Render and connecting it to your Vercel frontend.

---

## Step 1: Ensure GitHub Authentication

Your local repo is already linked to GitHub, but we need to authenticate to push:

### Option A: Use GitHub Personal Access Token (Recommended)

1. Go to [GitHub Settings → Developer Settings → Personal access tokens](https://github.com/settings/tokens)
2. Click **Generate new token (classic)**
3. Select scopes: `repo` (all)
4. Copy the token
5. In your terminal:
   ```powershell
   git config --global credential.helper wincred  # on Windows
   git push origin main
   # When prompted for password, use the PAT token (not your password)
   ```

### Option B: Use GitHub CLI

1. Install: `choco install gh` (or from [github.com/cli/cli](https://github.com/cli/cli))
2. Authenticate: `gh auth login`
3. Push: `git push origin main`

---

## Step 2: Verify Code is Pushed

Once authenticated:

```powershell
git push origin main
# Should see: "main -> main" (success)
```

Check on GitHub: https://github.com/sujaeet-sharmas/stumarto---school-marketplace

---

## Step 3: Create Render Service

### Via Render Dashboard (Web UI)

1. Go to [render.com](https://render.com) → **Dashboard**
2. Click **+ New > Web Service**
3. **Connect GitHub** (if not already connected)
4. Select: `stumarto---school-marketplace` repo
5. Fill in:
   - **Name**: `stumarto-backend`
   - **Environment**: Node
   - **Region**: Oregon (or choose nearest)
   - **Branch**: `main`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `backend`
6. Click **Advanced** and add environment variables:

   | Key               | Value                                      | 
   |-------------------|--------------------------------------------|
   | `SUPABASE_URL`    | (from your Supabase project settings)       |
   | `SUPABASE_KEY`    | (service_role key from Supabase API)        |
   | `JWT_SECRET`      | `your-random-secret-string-here`            |
   | `ADMIN_EMAIL`     | `admin@stumarto.com`                        |
   | `ADMIN_PASSWORD`  | `admin123`                                  |

7. Click **Create Web Service**
8. Wait for deployment (logs will show `Server is running on port...`)

### Via Render CLI (Alternative)

After installing the Render CLI and authenticating, you could also use:

```powershell
render deploy --file .render.yaml
```

(Not available in this session, but manual dashboard is faster anyway.)

---

## Step 4: Get Your Render Backend URL

Once deployed, Render will show a URL like:

```
https://stumarto-backend.onrender.com
```

Copy this URL — you'll use it in the next step.

---

## Step 5: Update Vercel Frontend

1. Go to your **Vercel Project → Settings → Environment Variables**
2. Add a new variable:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: `https://stumarto-backend.onrender.com`
   - **Environments**: Production + Preview

3. Click **Save**
4. Redeploy the frontend:
   - Push a commit to main (e.g., update a comment), OR
   - Click **Deployments → …dots → Redeploy**

---

## Step 6: Initialize Supabase Tables

Before testing, you must create the database tables. In your **Supabase Project**:

1. Go to **SQL Editor → New query**
2. Copy the entire contents of `backend/init_supabase.sql` (from your repo)
3. Paste into the SQL editor
4. Click **Run**

Tables are now created:
- `users`
- `products`
- `carts`
- `orders`

---

## Step 7: Test Endpoints

Once everything is deployed:

1. **Test backend is live**:
   ```powershell
   curl https://stumarto-backend.onrender.com/
   # Should return: {"success": true, "message": "School Marketplace API is running!", …}
   ```

2. **Test registration**:
   ```powershell
   $body = @{
     name = "Test User"
     email = "test@example.com"
     password = "testpass123"
   } | ConvertTo-Json
   
   Invoke-WebRequest -Uri "https://stumarto-backend.onrender.com/api/auth/register" `
     -Method POST `
     -Body $body `
     -ContentType "application/json" | Select-Object -Expand Content
   ```

3. **Visit your live Vercel frontend**:
   - Try signing up or logging in
   - Check that requests go to your Render backend (not localhost)

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **Render shows "Build failed"** | Check logs for missing env vars or npm errors. Verify `backend/package.json` exists. |
| **"Could not find table 'public.users'"** | Run the SQL from `init_supabase.sql` in Supabase SQL editor. |
| **Vercel app says "Failed to fetch"** | Ensure `VITE_API_BASE_URL` is set in Vercel env vars and matches the Render URL. |
| **Frontend still using localhost** | Clear browser cache and hard-refresh (Ctrl+Shift+R). |

---

## Summary

✅ Code pushed to GitHub  
✅ Render service deployed (auto-deploys on new pushes)  
✅ Vercel updated with backend URL  
✅ Supabase tables created  
✅ Backend now live at `https://stumarto-backend.onrender.com`  
✅ Frontend on Vercel talking to backend  

Your marketplace is now running in production!
