<#
=== STUMARTO COMPLETE DEPLOYMENT ===
Master script that:
1. Vercel deploy (frontend)
2. Render deploy (backend)
3. Open Supabase for SQL execution
4. Verify live endpoints
#>

Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  STUMARTO - COMPLETE LIVE DEPLOYMENT  ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Step 1: Vercel Deploy
Write-Host "STEP 1: Deploy Frontend to Vercel" -ForegroundColor Green
$deployVercel = Read-Host -Prompt "Deploy to Vercel? (y/n)" -DefaultValue "y"
if ($deployVercel -eq "y") {
    Write-Host "Get your Vercel token from: vercel.com/account/tokens"
    .\vercel_deploy.ps1
    $vercelDeployed = $true
} else {
    $vercelDeployed = $false
}

Write-Host ""

# Step 2: Render Deploy
Write-Host "STEP 2: Deploy Backend to Render" -ForegroundColor Green
$deployRender = Read-Host -Prompt "Deploy to Render? (y/n)" -DefaultValue "y"
if ($deployRender -eq "y") {
    Write-Host "Get your Render API key from: render.com/account/api-keys"
    .\render_cli_deploy.ps1
    $renderDeployed = $true
} else {
    $renderDeployed = $false
}

Write-Host ""

# Step 3: Supabase SQL
Write-Host "STEP 3: Create Supabase Tables" -ForegroundColor Green
$setupSupabase = Read-Host -Prompt "Open Supabase to run SQL? (y/n)" -DefaultValue "y"
if ($setupSupabase -eq "y") {
    Write-Host "Opening Supabase SQL Editor..." -ForegroundColor Yellow
    Start-Process "https://app.supabase.com"
    Write-Host "Once in Supabase:" -ForegroundColor Yellow
    Write-Host "  1. SQL Editor → New query" -ForegroundColor White
    Write-Host "  2. Copy from: backend/init_supabase.sql" -ForegroundColor White
    Write-Host "  3. Paste and Run" -ForegroundColor White
    Write-Host "Press Enter once you've run the SQL..." -ForegroundColor Cyan
    Read-Host
}

Write-Host ""

# Step 4: Update Vercel Env Var
if ($vercelDeployed -eq $true) {
    Write-Host "STEP 4: Update Vercel Environment Variable" -ForegroundColor Green
    $renderUrl = Read-Host -Prompt "Enter your Render service URL (e.g., https://stumarto-backend.onrender.com)"
    if ($renderUrl) {
        Write-Host "Go to: https://vercel.com/dashboard" -ForegroundColor Yellow
        Write-Host "Settings → Environment Variables" -ForegroundColor Yellow
        Write-Host "Add: VITE_API_BASE_URL = $renderUrl" -ForegroundColor Cyan
        Write-Host "Redeploy frontend" -ForegroundColor Yellow
        Write-Host "Press Enter when done..." -ForegroundColor Cyan
        Read-Host
    }
}

Write-Host ""

# Step 5: Verification
Write-Host "STEP 5: Verification" -ForegroundColor Green
if ($renderUrl) {
    Write-Host "Testing endpoints..." -ForegroundColor Yellow
    
    # Test backend
    try {
        $response = Invoke-WebRequest -Uri "$renderUrl/" -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ Backend is LIVE at: $renderUrl" -ForegroundColor Green
        }
    } catch {
        Write-Host "⚠️  Backend not responding yet (may still be starting)" -ForegroundColor Yellow
    }
    
    # Test auth endpoint
    try {
        $body = @{
            name = "Admin"
            email = "admin@stumarto.com"
            password = "admin123"
            role = "admin"
        } | ConvertTo-Json
        
        $authResponse = Invoke-WebRequest -Uri "$renderUrl/api/auth/register" -Method POST -Body $body -ContentType "application/json" -ErrorAction SilentlyContinue
        if ($authResponse.StatusCode -eq 201) {
            Write-Host "✅ Auth API is LIVE" -ForegroundColor Green
        }
    } catch {
        Write-Host "Note: Auth may fail if Supabase tables not created yet" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║  DEPLOYMENT COMPLETE - SITE SHOULD    ║" -ForegroundColor Green
Write-Host "║  BE LIVE ON VERCEL + RENDER!          ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "Deployed services:" -ForegroundColor Cyan
Write-Host "  Frontend: https://vercel.com/dashboard" -ForegroundColor White
Write-Host "  Backend: https://render.com/dashboard" -ForegroundColor White
Write-Host "  Database: https://app.supabase.com" -ForegroundColor White
