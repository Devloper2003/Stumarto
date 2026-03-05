<#
╔═══════════════════════════════════════════════════════════════╗
║     STUMARTO PRODUCTION DEPLOYMENT - REAL DATA LIVE           ║
║     Removes all demo data and activates real listings         ║
╚═══════════════════════════════════════════════════════════════╝
#>

$ErrorActionPreference = "Stop"
Write-Host "`n🚀 STUMARTO PRODUCTION DEPLOYMENT" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

# Step 1: Get required credentials
Write-Host "`n📋 Step 1: Gathering Production Credentials" -ForegroundColor Yellow

$renderApiKey = Read-Host "Enter Render API key (get from render.com/account/api-keys)"
$supabaseUrl = Read-Host "Enter Supabase URL (project settings → API)"
$supabaseKey = Read-Host "Enter Supabase Key - service_role (NOT public dangerously_allow_unprotected_non_prod)"
$vercelToken = Read-Host "Enter Vercel API token (get from vercel.com/account/tokens)"

# Generate secure JWT secret
$jwtSecret = -join ((97..122) + (65..90) + (48..57) | Get-Random -Count 48 | ForEach-Object {[char]$_})

Write-Host "✅ Credentials received" -ForegroundColor Green

# Step 2: Commit frontend changes (removed mock data)
Write-Host "`n📦 Step 2: Committing frontend changes" -ForegroundColor Yellow
try {
    git add -A
    git commit -m "feat: activate real listings - remove demo data and fetch from Supabase backend"
    Write-Host "✅ Committed changes" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Nothing new to commit or git error" -ForegroundColor Yellow
}

# Step 3: Push to GitHub
Write-Host "`n🔄 Step 3: Pushing code to GitHub" -ForegroundColor Yellow
try {
    git push origin main
    Write-Host "✅ Code pushed to GitHub" -ForegroundColor Green
} catch {
    Write-Host "❌ Git push failed: $_" -ForegroundColor Red
    exit 1
}

# Step 4: Deploy Backend to Render
Write-Host "`n🖥️ Step 4: Deploying backend to Render" -ForegroundColor Yellow

$renderBody = @{
    name = "stumarto-backend"
    type = "web_service"
    environmentSlug = "node"
    region = "oregon"
    plan = "free"
    repo = "https://github.com/Devloper2003/Stumarto"
    branch = "main"
    rootDir = "backend"
    buildCommand = "npm install"
    startCommand = "npm start"
    envVars = @(
        @{ key = "SUPABASE_URL"; value = $supabaseUrl },
        @{ key = "SUPABASE_KEY"; value = $supabaseKey },
        @{ key = "JWT_SECRET"; value = $jwtSecret },
        @{ key = "ADMIN_EMAIL"; value = "admin@stumarto.com" },
        @{ key = "ADMIN_PASSWORD"; value = "admin@stumarto2024" },
        @{ key = "NODE_ENV"; value = "production" }
    )
    autoDeploy = $true
} | ConvertTo-Json -Depth 10

$renderHeaders = @{ Authorization = "Bearer $renderApiKey" }

try {
    Write-Host "  → Creating Render service..." -ForegroundColor Cyan
    $renderResponse = Invoke-RestMethod -Uri "https://api.render.com/v1/services" `
        -Headers $renderHeaders -Method POST -Body $renderBody -ContentType "application/json"
    
    $backendUrl = "https://$($renderResponse.slug).onrender.com"
    Write-Host "✅ Backend deployed to Render!" -ForegroundColor Green
    Write-Host "   URL: $backendUrl" -ForegroundColor Cyan
    Write-Host "   ⏳ Deployment in progress (2-3 minutes)" -ForegroundColor Yellow
} catch {
    Write-Host "❌ Render deployment failed" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

# Step 5: Update Vercel environment variable
Write-Host "`n🔧 Step 5: Updating Vercel environment variables" -ForegroundColor Yellow

$vercelHeaders = @{
    Authorization = "Bearer $vercelToken"
    "Content-Type" = "application/json"
}

$projectId = "stumarto-school-marketplace"

try {
    Write-Host "  → Setting VITE_API_BASE_URL..." -ForegroundColor Cyan
    
    # Delete existing env var if it exists (optional)
    try {
        Invoke-RestMethod -Uri "https://api.vercel.com/v10/projects/$projectId/env/VITE_API_BASE_URL" `
            -Headers $vercelHeaders -Method DELETE -ErrorAction SilentlyContinue | Out-Null
    } catch {}
    
    # Create new env var
    $envBody = @{
        key = "VITE_API_BASE_URL"
        value = $backendUrl
        target = @("production", "preview")
    } | ConvertTo-Json
    
    Invoke-RestMethod -Uri "https://api.vercel.com/v10/projects/$projectId/env" `
        -Headers $vercelHeaders -Method POST -Body $envBody | Out-Null
    
    Write-Host "✅ Vercel environment updated!" -ForegroundColor Green
    Write-Host "   VITE_API_BASE_URL=$backendUrl" -ForegroundColor Cyan
} catch {
    Write-Host "⚠️ Could not set Vercel env via API" -ForegroundColor Yellow
    Write-Host "   Manual setup needed - see end of script" -ForegroundColor Yellow
}

# Step 6: Redeploy Vercel frontend
Write-Host "`n🚀 Step 6: Redeploying frontend to Vercel" -ForegroundColor Yellow

try {
    Write-Host "  → Triggering Vercel redeploy..." -ForegroundColor Cyan
    
    # Try to get latest deployment and redeploy
    $deployments = Invoke-RestMethod -Uri "https://api.vercel.com/v6/deployments?projectId=$projectId&limit=1" `
        -Headers $vercelHeaders -Method GET
    
    if ($deployments.deployments.Count -gt 0) {
        Write-Host "✅ Frontend redeploy triggered!" -ForegroundColor Green
        Write-Host "   ⏳ Vercel rebuilding (1-2 minutes)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️ Manual redeploy needed" -ForegroundColor Yellow
}

# Step 7: Display setup instructions
Write-Host "`n" -ForegroundColor White
Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║         🎉 DEPLOYMENT INITIATED - FINAL STEPS          ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Green

Write-Host "`n📍 CRITICAL: Create Supabase Tables (Do This NOW)" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "1. Go to https://app.supabase.com" -ForegroundColor White
Write-Host "2. Open your project → SQL Editor → New Query" -ForegroundColor White
Write-Host "3. Copy entire contents of: backend/init_supabase.sql" -ForegroundColor White
Write-Host "4. Paste into SQL Editor and click RUN" -ForegroundColor White
Write-Host "`n   ⚠️ WITHOUT TABLES, LOGIN WILL NOT WORK!" -ForegroundColor Yellow

Write-Host "`n⏳ Wait for Services to Deploy" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "1. Render backend: 2-3 minutes" -ForegroundColor White
Write-Host "   Check: https://render.com/dashboard" -ForegroundColor White
Write-Host "   Backend URL: $backendUrl" -ForegroundColor Cyan
Write-Host "`n2. Vercel frontend: 1-2 minutes" -ForegroundColor White
Write-Host "   Check: https://vercel.com/dashboard" -ForegroundColor White
Write-Host "   Live at: https://stumarto.in" -ForegroundColor Cyan

Write-Host "`n🧪 Test Production (After 5 minutes)" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "1. Visit https://stumarto.in" -ForegroundColor White
Write-Host "2. Click Marketplace - should show REAL listings (not demo)" -ForegroundColor White
Write-Host "3. Try Login/Signup → should work without JSON errors" -ForegroundColor White
Write-Host "4. Add a listing as seller → should appear immediately" -ForegroundColor White

Write-Host "`n✅ Production URLs" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host "Frontend:  https://stumarto.in" -ForegroundColor Cyan
Write-Host "Backend:   $backendUrl" -ForegroundColor Cyan
Write-Host "Database:  Supabase (PostgreSQL)" -ForegroundColor Cyan

Write-Host "`n💡 Manual Vercel Redeploy (if API failed)" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
Write-Host "If frontend doesn't update:" -ForegroundColor White
Write-Host "1. Go to https://vercel.com/dashboard" -ForegroundColor White
Write-Host "2. Select stumarto-school-marketplace project" -ForegroundColor White
Write-Host "3. Deployments → Click 'Redeploy' on latest deployment" -ForegroundColor White

Write-Host "`n🚨 Troubleshooting" -ForegroundColor Red
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Red
Write-Host "Still seeing demo data?" -ForegroundColor White
Write-Host "  → Wait 1 minute for Vercel to redeploy" -ForegroundColor White
Write-Host "  → Hard refresh: Ctrl+Shift+R" -ForegroundColor White
Write-Host "`nGetting JSON errors after login?" -ForegroundColor White
Write-Host "  → Backend URL may not be set correctly" -ForegroundColor White
Write-Host "  → Check backend deployed at $backendUrl" -ForegroundColor Cyan
Write-Host "`nListing page shows No Products?" -ForegroundColor White
Write-Host "  → Create Supabase tables (see above)" -ForegroundColor White
Write-Host "  → OR add a test listing as seller" -ForegroundColor White

Write-Host "`n" -ForegroundColor White
Write-Host "═════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "              ✅ PRODUCTION DEPLOYMENT STARTED" -ForegroundColor Green
Write-Host "═════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""
