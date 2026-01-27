# 🚀 Deploy Stumarto in 5 Minutes

## ✅ What's Already Done

Your project is **100% ready for GitHub Pages**! Here's what we've configured:

- ✅ Vite optimized with GitHub Pages base path
- ✅ GitHub Actions CI/CD workflow
- ✅ npm deploy script configured
- ✅ Git repository initialized locally
- ✅ All files committed and ready to push

## 🎯 Next Steps (Do These Now!)

### Step 1: Create GitHub Repository
1. Go to [github.com/new](https://github.com/new)
2. **Name:** `stumarto`
3. **Visibility:** Public (required for free GitHub Pages)
4. **DO NOT** check "Add .gitignore" or "Add README"
5. Click **"Create repository"**

### Step 2: Push to GitHub
Copy and paste these commands in your terminal:

```powershell
cd "C:\Users\Shivam Sharma\Downloads\stumarto"
git remote add origin https://github.com/YOUR_USERNAME/stumarto.git
git branch -M main
git push -u origin main
```

> Replace `YOUR_USERNAME` with your actual GitHub username

### Step 3: Configure GitHub Pages
1. Go to your repo → **Settings**
2. Click **Pages** (left sidebar)
3. Under "Build and deployment":
   - Source: **Deploy from a branch**
   - Branch: **gh-pages** ← Important!
4. Click **Save**

### Step 4: Add API Key Secret
1. Go to your repo → **Settings**
2. Click **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. **Name:** `GEMINI_API_KEY`
5. **Value:** [Paste your Gemini API key]
6. Click **Add secret**

### Step 5: Deploy! 
Just push any changes to `main` branch:

```powershell
git push origin main
```

GitHub Actions will automatically:
- ✅ Install dependencies
- ✅ Build the project
- ✅ Deploy to GitHub Pages
- ⏱️ Takes ~2-3 minutes

## 🌐 Access Your Site

After deployment (check Actions tab for status):

```
https://YOUR_USERNAME.github.io/stumarto/
```

## 📊 Check Deployment Status

1. Go to your repo → **Actions** tab
2. You'll see "Deploy to GitHub Pages" workflow
3. Green ✅ = Success, Red ❌ = Check logs for errors

## 🐛 Troubleshooting

**Pages not deployed?**
- Check Actions tab for build errors
- Verify gh-pages branch exists (Settings → Pages)

**Static files missing?**
- Vite base path is auto-configured ✓

**API not working?**
- Verify GEMINI_API_KEY is added to Secrets ✓

## 📁 Local Development

```powershell
# Install dependencies
npm install

# Run locally
npm run dev

# Build locally
npm run build
```

## 📚 Useful Commands

```powershell
# Check git status
git status

# View commits
git log --oneline

# Make a new commit
git add .
git commit -m "Your message"
git push origin main

# Manual deploy (if needed)
npm run deploy
```

---

**You're all set! 🎉 Complete the 5 steps above and your site will be live!**
