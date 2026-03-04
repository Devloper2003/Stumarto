<#
Vercel CLI Deploy Script
Requires: Vercel API token (from vercel.com/account/tokens)
#>

Write-Host "=== Vercel CLI Deploy ===" -ForegroundColor Cyan

# Get Vercel token
$vercelToken = Read-Host -Prompt "Paste your Vercel API token (from vercel.com/account/tokens)" -AsSecureString
$vercelTokenPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToCoTaskMemUnicode($vercelToken))

# Check if Vercel CLI is installed
$vercelCheck = & vercel --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

# Deploy to Vercel (production)
Write-Host "Deploying to Vercel (production)..." -ForegroundColor Cyan
$env:VERCEL_TOKEN = $vercelTokenPlain
vercel --prod --confirm

if ($LASTEXITCODE -eq 0) {
    Write-Host "Vercel deployment successful!" -ForegroundColor Green
    Write-Host "Check: https://vercel.com/dashboard" -ForegroundColor Cyan
} else {
    Write-Host "Vercel deployment failed." -ForegroundColor Red
    exit 1
}
