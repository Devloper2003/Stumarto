<#
full_deploy.ps1

What it automates (local actions):
- Create GitHub repo under your account if missing (via GitHub API)
- Push local repository to that GitHub repo
- Install Vercel CLI (if missing) and deploy frontend via Vercel CLI using a Vercel token
- Open Render and Supabase dashboards in browser for final Render setup

Security: you will be prompted for tokens locally; do NOT paste tokens in chat.
#>

Write-Host "=== Full Deploy Helper ===" -ForegroundColor Cyan

# Prompt for GitHub PAT and username
$githubToken = Read-Host -Prompt "Paste your GitHub Personal Access Token (PAT)" -AsSecureString
$githubTokenPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToCoTaskMemUnicode($githubToken))
$githubUser = Read-Host -Prompt "Enter your GitHub username"

# Prompt for Vercel token
$vercelToken = Read-Host -Prompt "Paste your Vercel API token (from vercel.com/account/tokens)" -AsSecureString
$vercelTokenPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToCoTaskMemUnicode($vercelToken))

# Repo details
$repoName = "stumarto---school-marketplace"
$repoFullName = "${githubUser}/${repoName}"

# Create repo if missing
Write-Host "Checking GitHub repository $repoFullName..." -ForegroundColor Yellow
$headers = @{ Authorization = "token $githubTokenPlain"; "User-Agent" = "auto-deploy-script" }
try {
    $existing = Invoke-RestMethod -Uri "https://api.github.com/repos/$repoFullName" -Headers $headers -Method GET -ErrorAction Stop
    Write-Host "Repository exists on GitHub." -ForegroundColor Green
} catch {
    Write-Host "Repository not found; creating under your account..." -ForegroundColor Yellow
    $body = @{ name = $repoName; description = "School Marketplace - automated push"; private = $false } | ConvertTo-Json
    try {
        $create = Invoke-RestMethod -Uri "https://api.github.com/user/repos" -Headers $headers -Method POST -Body $body -ContentType "application/json"
        Write-Host "Created: $($create.html_url)" -ForegroundColor Green
    } catch {
        Write-Host "Failed to create repository. Error: $_" -ForegroundColor Red
        exit 1
    }
}

# Setup remote and push
$remoteUrlWithCred = "https://${githubUser}:${githubTokenPlain}@github.com/$repoFullName.git"
Write-Host "Setting git remote to $repoFullName (using temporary tokenized URL)..." -ForegroundColor Yellow
# remove existing origin if present
try { git remote remove origin } catch { }
git remote add origin $remoteUrlWithCred

Write-Host "Pushing local branches to GitHub..." -ForegroundColor Yellow
# Ensure main branch exists
try { git branch -M main } catch { }
$pushOut = git push -u origin main 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Initial push failed, output:" -ForegroundColor Red
    Write-Host $pushOut
    exit 1
}
Write-Host "Push succeeded." -ForegroundColor Green

# Reset origin to non-token URL
git remote set-url origin "https://github.com/$repoFullName.git"

# Deploy frontend to Vercel
Write-Host "\nPreparing Vercel deploy..." -ForegroundColor Cyan
# Install vercel CLI if missing
$vercelCheck = & vercel --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Vercel CLI not found, installing globally (may require admin privileges)..." -ForegroundColor Yellow
    npm install -g vercel
}

# Ask which folder contains frontend (default root)
$frontendDir = Read-Host -Prompt "Enter frontend directory relative to repo root (press Enter for root)",
if ([string]::IsNullOrWhiteSpace($frontendDir)) { $frontendDir = "." }

Push-Location $frontendDir
Write-Host "Deploying frontend folder '$frontendDir' to Vercel (production)..." -ForegroundColor Cyan
# Deploy with Vercel token non-interactively
$vercelCmd = "vercel --prod --token $vercelTokenPlain --confirm"
Write-Host "Running: $vercelCmd" -ForegroundColor Yellow
Invoke-Expression $vercelCmd
Pop-Location

Write-Host "Vercel deploy done (check output above)." -ForegroundColor Green

# Open Render & Supabase dashboards for final steps
Write-Host "Opening Render dashboard and Supabase for final tasks..." -ForegroundColor Cyan
Start-Process "https://render.com/dashboard"
Start-Process "https://app.supabase.com"

Write-Host "\nFINAL: In Render dashboard create a Web Service -> choose GitHub repo: $repoFullName -> set Root Directory 'backend' -> Build: 'npm install' Start: 'npm start'" -ForegroundColor Green
Write-Host "Run the SQL file 'backend/init_supabase.sql' in Supabase SQL editor." -ForegroundColor Green

Write-Host "\nAll automated steps complete. Check Vercel output and Render dashboard to finish Render service creation (Render UI confirmation required)." -ForegroundColor Cyan
