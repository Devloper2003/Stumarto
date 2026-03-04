# PowerShell script to authenticate with GitHub and push code

Write-Host "GitHub Authentication for Stumarto Deployment" -ForegroundColor Cyan
Write-Host ""

# Get token from user
$token = Read-Host "Paste your GitHub Personal Access Token (from https://github.com/settings/tokens)"

# Get GitHub username
$username = Read-Host "Enter your GitHub username"

Write-Host "Configuring Git..." -ForegroundColor Yellow

# Create the remote URL with credentials
$repoUrl = "https://${username}:${token}@github.com/sujaeet-sharmas/stumarto---school-marketplace.git"

Write-Host "Pushing code to GitHub..." -ForegroundColor Yellow

# Update remote URL
git remote set-url origin $repoUrl

# Push
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "Push successful!" -ForegroundColor Green
    Write-Host "Code is on GitHub: https://github.com/sujaeet-sharmas/stumarto---school-marketplace" -ForegroundColor Cyan
}
else {
    Write-Host "Push failed!" -ForegroundColor Red
    exit 1
}

# Reset to HTTPS URL (without token)
git remote set-url origin "https://github.com/sujaeet-sharmas/stumarto---school-marketplace.git"

Write-Host ""
Write-Host "Next: Go to Render Dashboard and create Web Service" -ForegroundColor Green
Write-Host "Read: RENDER_DEPLOYMENT_GUIDE.md for full steps" -ForegroundColor Cyan
