# PowerShell script to authenticate with GitHub and push to Render
# This script uses Windows Credential Manager to store your GitHub PAT

# Step 1: Get your GitHub PAT (Personal Access Token)
# Go to: https://github.com/settings/tokens
# Create token with 'repo' scope
# Copy the token

Write-Host "🔐 GitHub Authentication Setup for Stumarto Deployment" -ForegroundColor Cyan
Write-Host ""

# Get token from user
$token = Read-Host "Paste your GitHub Personal Access Token (generated from https://github.com/settings/tokens)" -AsSecureString
$tokenPlain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToCoTaskMemUnicodePtr($token))

# Get GitHub username
$username = Read-Host "Enter your GitHub username"

# Configure Git to use the token
Write-Host "⚙️ Configuring Git credentials..." -ForegroundColor Yellow

# Create the remote URL with embedded credentials (temporary)
$repoUrl = "https://$username`:$tokenPlain@github.com/sujaeet-sharmas/stumarto---school-marketplace.git"

# Try to push
Write-Host "📤 Pushing code to GitHub..." -ForegroundColor Yellow
try {
    # Update remote URL temporarily
    git remote set-url origin $repoUrl
    
    # Push
    git push origin main 2>&1
    
    Write-Host "✅ Push successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📍 Your code is now on GitHub:" -ForegroundColor Green
    Write-Host "   https://github.com/sujaeet-sharmas/stumarto---school-marketplace" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ Push failed: $_" -ForegroundColor Red
    exit 1
}

# Reset to HTTPS URL (without token)
git remote set-url origin "https://github.com/sujaeet-sharmas/stumarto---school-marketplace.git"

Write-Host ""
Write-Host "🎯 Next Steps:" -ForegroundColor Green
Write-Host "   1. Go to https://render.com/dashboard" -ForegroundColor Cyan
Write-Host "   2. Create a new Web Service" -ForegroundColor Cyan
Write-Host "   3. Connect your GitHub repo (sujaeet-sharmas/stumarto---school-marketplace)" -ForegroundColor Cyan
Write-Host "   4. Root Directory: 'backend'" -ForegroundColor Cyan
Write-Host "   5. Build: 'npm install', Start: 'npm start'" -ForegroundColor Cyan
Write-Host "   6. Add environment variables (SUPABASE_URL, SUPABASE_KEY, JWT_SECRET, etc.)" -ForegroundColor Cyan
Write-Host "   7. Deploy and get your Render URL" -ForegroundColor Cyan
Write-Host ""
Write-Host "📖 For full instructions, read: RENDER_DEPLOYMENT_GUIDE.md" -ForegroundColor Green
