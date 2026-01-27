## 🔧 Fix GitHub Pages 404 Error

### Problem: 404 File not found

Your code is pushed but GitHub Pages isn't deploying yet. Follow these steps:

---

## ✅ Step 1: Go to Repository Settings

1. Go to: https://github.com/Devloper2003/Stumarto/settings
2. Click **"Pages"** in left sidebar

---

## ✅ Step 2: Configure GitHub Pages

Look for **"Build and deployment"** section:

- **Source:** Select "Deploy from a branch"
- **Branch:** Select "main"
- **Folder:** Select "root" 
- Click **"Save"**

(Do NOT select gh-pages yet - let Actions create it)

---

## ✅ Step 3: Add API Secret

1. Go to: https://github.com/Devloper2003/Stumarto/settings/secrets/actions
2. Click **"New repository secret"**
3. Name: `GEMINI_API_KEY`
4. Value: [Your Gemini API Key]
5. Click **"Add secret"**

---

## ✅ Step 4: Trigger Deployment

Go to: https://github.com/Devloper2003/Stumarto/actions

You should see the workflow. If not:

```bash
cd "C:\Users\Shivam Sharma\Downloads\stumarto"
git commit --allow-empty -m "Trigger deployment"
git push origin main
```

---

## ✅ Step 5: Wait for Build

Monitor the Actions tab:
- ✅ Green = Success
- ❌ Red = Check logs

Takes 2-3 minutes.

---

## After Successful Build

Change Pages settings to:
- **Source:** Deploy from a branch
- **Branch:** "gh-pages"
- Click Save

---

## Your Site URL

```
https://Devloper2003.github.io/Stumarto/
```

---

### Still not working?

Check:
- [ ] Pages enabled in Settings
- [ ] GEMINI_API_KEY secret added
- [ ] Actions workflow ran (green checkmark)
- [ ] gh-pages branch exists (after first successful build)
