<#
Auto-deploy helper
- Creates a GitHub repo under your account (if it doesn't exist)
- Pushes current repo to GitHub
- Opens Render and Supabase pages to finish deploy

This script prompts for your GitHub Personal Access Token (PAT) and GitHub username.
Do NOT paste tokens into chat. Run this locally and follow prompts.
#>

Write-Host "=== Stumarto AutoDeploy Helper ===" -ForegroundColor Cyan

# Prompt for GitHub PAT and username
$githubToken = Read-Host -Prompt "Paste your GitHub Personal Access Token (PAT)" -AsSecureString
$githubTokenPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToCoTaskMemUnicode($githubToken))
$githubUser = Read-Host -Prompt "Enter your GitHub username"

# Repo details
$repoName = "stumarto---school-marketplace"
$repoFullName = "${githubUser}/${repoName}"

# Check if repo exists
Write-Host "Checking if repository $repoFullName exists..." -ForegroundColor Yellow
$headers = @{ Authorization = "token $githubTokenPlain"; "User-Agent" = "$githubUser-automator" }
$status = Invoke-RestMethod -Uri "https://api.github.com/repos/$repoFullName" -Headers $headers -Method GET -ErrorAction SilentlyContinue
if ($status) {
    Write-Host "Repository already exists on GitHub." -ForegroundColor Green
} else {
    Write-Host "Repository not found. Creating repository on your account..." -ForegroundColor Yellow
    $body = @{ name = $repoName; description = "School Marketplace (deployed)"; private = $false } | ConvertTo-Json
    try {
        $create = Invoke-RestMethod -Uri "https://api.github.com/user/repos" -Headers $headers -Method POST -Body $body -ContentType "application/json"
        Write-Host "Repository created: $($create.html_url)" -ForegroundColor Green
    } catch {
        Write-Host "Failed to create repository. Error: $_" -ForegroundColor Red
        exit 1
    }
}

# Set remote and push
$remoteUrlWithCred = "https://$githubUser:$githubTokenPlain@github.com/$repoFullName.git"
Write-Host "Setting remote origin to $remoteUrlWithCred (temporary, includes token)" -ForegroundColor Yellow
git remote remove origin 2>$null
git remote add origin $remoteUrlWithCred

Write-Host "Pushing to GitHub (this may take a moment)..." -ForegroundColor Yellow
$push = git push -u origin main 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "Push successful! Repository is live at: https://github.com/$repoFullName" -ForegroundColor Green
} else {
    Write-Host "Push failed. Output:" -ForegroundColor Red
    Write-Host $push
    Write-Host "Attempting to push current branch as 'main'..." -ForegroundColor Yellow
    git branch -M main
    $push2 = git push -u origin main 2>&1
    if ($LASTEXITCODE -eq 0) { Write-Host "Push successful on second try." -ForegroundColor Green } else { Write-Host $push2; exit 1 }
}

# Reset remote to non-token URL
git remote set-url origin "https://github.com/$repoFullName.git"

# Open Render dashboard and Supabase SQL editor in default browser
Write-Host "Opening Render dashboard and Supabase SQL editor in your browser..." -ForegroundColor Cyan
Start-Process "https://render.com/dashboard"
Start-Process "https://app.supabase.com"

Write-Host "\nNEXT STEPS:" -ForegroundColor Green
Write-Host "1) In Render dashboard: Create a new Web Service -> connect the GitHub repo: $repoFullName -> set Root Directory to 'backend' -> Build: 'npm install' Start: 'npm start'" -ForegroundColor Cyan
Write-Host "2) In Supabase: Open SQL Editor and run the contents of 'backend/init_supabase.sql' to create tables." -ForegroundColor Cyan
Write-Host "3) After Render deploy finishes, copy the service URL and add it to Vercel as VITE_API_BASE_URL then redeploy frontend." -ForegroundColor Cyan

Write-Host "Auto-push finished." -ForegroundColor Green
