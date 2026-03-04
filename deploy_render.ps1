<#
Render Backend Deploy via CLI (simpler approach - create via API or dashboard)
Since Render CLI needs authentication, I'll use API approach
#>

Write-Host "=== Render Backend Deployment ===" -ForegroundColor Cyan

$renderApiKey = Read-Host -Prompt "Paste your Render API key (get from render.com/account/api-keys)"
$supabaseUrl = Read-Host -Prompt "Enter SUPABASE_URL (from Supabase project settings)"
$supabaseKey = Read-Host -Prompt "Enter SUPABASE_KEY (service_role key)"
$jwtSecret = Read-Host -Prompt "Enter JWT_SECRET (leave blank for auto-generate)"

if ([string]::IsNullOrWhiteSpace($jwtSecret)) {
    $jwtSecret = -join ((97..122) + (65..90) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
}

Write-Host "Creating Render service..." -ForegroundColor Yellow

$body = @{
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
        @{ key = "SUPABASE_URL"; value = $supabaseUrl }
        @{ key = "SUPABASE_KEY"; value = $supabaseKey }
        @{ key = "JWT_SECRET"; value = $jwtSecret }
        @{ key = "ADMIN_EMAIL"; value = "admin@stumarto.com" }
        @{ key = "ADMIN_PASSWORD"; value = "admin123" }
    )
    autoDeploy = $true
} | ConvertTo-Json -Depth 10

$headers = @{ Authorization = "Bearer $renderApiKey" }

try {
    $response = Invoke-RestMethod -Uri "https://api.render.com/v1/services" -Headers $headers -Method POST -Body $body -ContentType "application/json" -ErrorAction Stop
    Write-Host "Service created: $($response.id)" -ForegroundColor Green
    Write-Host "Backend will be live at: https://$($response.slug).onrender.com" -ForegroundColor Cyan
    $backendUrl = "https://$($response.slug).onrender.com"
    Write-Host "Save this URL for Vercel env vars: $backendUrl" -ForegroundColor Yellow
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Next: Create Supabase tables by running backend/init_supabase.sql in Supabase SQL editor" -ForegroundColor Green
Start-Process "https://render.com/dashboard"
Start-Process "https://app.supabase.com"
