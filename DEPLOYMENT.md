# GitHub Pages Deployment Guide - Stumarto

## Setup Instructions

### 1. GitHub Repository Setup
```bash
# Initialize git repo (if not already done)
git init
git add .
git commit -m "Initial commit"

# Add remote (replace YOUR_USERNAME and YOUR_REPO)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### 2. Configure GitHub Pages
1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under "Build and deployment":
   - Select **Deploy from a branch**
   - Choose branch: **gh-pages**
   - Click Save

### 3. Add Secrets (for API Key)
1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add: `GEMINI_API_KEY` with your Google Gemini API key value

### 4. Deploy Options

#### Option A: Automatic Deployment (Recommended)
The GitHub Actions workflow (`.github/workflows/deploy.yml`) will automatically:
- Build your project on every push to `main` or `master`
- Deploy to GitHub Pages automatically
- No manual steps needed!

Just push to main branch:
```bash
git push origin main
```

#### Option B: Manual Deployment (Local)
```bash
# Install gh-pages package
npm install --save-dev gh-pages

# Deploy
npm run deploy
```

### 5. Access Your Site
After deployment, your site will be available at:
- `https://YOUR_USERNAME.github.io/YOUR_REPO/`

## Project Structure After Build
```
dist/
  ├── index.html
  ├── index.js (and other bundled files)
  └── assets/
```

## Environment Variables
- `GEMINI_API_KEY`: Your Google Gemini API key (set in GitHub Secrets)

## Troubleshooting

### Build Fails
- Check Node.js version compatibility (18+ recommended)
- Ensure all dependencies are installed: `npm install`
- Verify `GEMINI_API_KEY` is set in GitHub Secrets

### Routes Not Working
- GitHub Pages requires the `base` path to be set correctly
- It's already configured in `vite.config.ts` with the repository name
- Make sure you're accessing `https://username.github.io/repo-name/`

### Assets Not Loading
- Check the browser console for 404 errors
- The `base` path in `vite.config.ts` handles this automatically

## Files Modified for Deployment
- `vite.config.ts` - Added base path and build optimization
- `package.json` - Added deploy script
- `main.html` - Cleaned up for Vite build process
- `.github/workflows/deploy.yml` - Automatic deployment workflow

## Next Steps
1. Configure GitHub Secrets with your API key
2. Push to main branch
3. Check GitHub Actions for build status
4. Visit your deployed site URL
