<#
Render Deploy Script - Automatic Render Service Creation and Deployment
Requires: Render API key (from render.com/account/api-keys)
#>

Write-Host "=== Render Auto-Deploy ===" -ForegroundColor Cyan

# Get Render API key
$renderApiKey = Read-Host -Prompt "Paste your Render API key (from render.com/account/api-keys)" -AsSecureString
$renderApiKeyPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToCoTaskMemUnicode($renderApiKey))

# Service configuration
$serviceName = "stumarto-backend"
$repoUrl = "https://github.com/Devloper2003/Stumarto"
$region = "oregon"
$branch = "main"
$rootDir = "backend"

Write-Host "Creating Render service '$serviceName'..." -ForegroundColor Yellow

# Render API call to create Web Service
$headers = @{ Authorization = "Bearer $renderApiKeyPlain"; "Content-Type" = "application/json" }

# Get environment variables for Render service
Write-Host "You will need these environment variables for the service:" -ForegroundColor Cyan
Write-Host "  SUPABASE_URL" -ForegroundColor White
Write-Host "  SUPABASE_KEY (service_role)" -ForegroundColor White
Write-Host "  JWT_SECRET" -ForegroundColor White
Write-Host "  ADMIN_EMAIL" -ForegroundColor White
Write-Host "  ADMIN_PASSWORD" -ForegroundColor White

$supabaseUrl = Read-Host -Prompt "Enter SUPABASE_URL"
$supabaseKey = Read-Host -Prompt "Enter SUPABASE_KEY (service_role key)"
$jwtSecret = Read-Host -Prompt "Enter JWT_SECRET (random string)"
$adminEmail = Read-Host -Prompt "Enter ADMIN_EMAIL" -DefaultValue "admin@stumarto.com"
$adminPassword = Read-Host -Prompt "Enter ADMIN_PASSWORD" -DefaultValue "admin123"

Write-Host "Creating service via Render API..." -ForegroundColor Yellow

# Build the request body
$serviceBody = @{
    name = $serviceName
    type = "web_service"
    environmentSlug = "node"
    region = $region
    plan = "free"
    repo = $repoUrl
    branch = $branch
    rootDir = $rootDir
    buildCommand = "npm install"
    startCommand = "npm start"
    envVars = @(
        @{ key = "SUPABASE_URL"; value = $supabaseUrl }
        @{ key = "SUPABASE_KEY"; value = $supabaseKey }
        @{ key = "JWT_SECRET"; value = $jwtSecret }
        @{ key = "ADMIN_EMAIL"; value = $adminEmail }
        @{ key = "ADMIN_PASSWORD"; value = $adminPassword }
    )
    autoDeploy = $true
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "https://api.render.com/v1/services" -Headers $headers -Method POST -Body $serviceBody -ContentType "application/json" -ErrorAction Stop
    Write-Host "Service created successfully!" -ForegroundColor Green
    Write-Host "Service ID: $($response.id)" -ForegroundColor Cyan
    Write-Host "Service Name: $($response.name)" -ForegroundColor Cyan
    Write-Host "Check status at: https://render.com/dashboard" -ForegroundColor Cyan
    Write-Host "Service will be live at: https://$($response.slug).onrender.com" -ForegroundColor Cyan
    
    # Wait for service to start deploying
    Write-Host "Waiting for deployment to start (typically 30-60 seconds)..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
    
    # Open Render dashboard
    Start-Process "https://render.com/dashboard"
    
} catch {
    Write-Host "Failed to create service. Error:" -ForegroundColor Red
    Write-Host $_.Exception.Message
    Write-Host ""
    Write-Host "Alternative: Create manually at https://render.com/dashboard -> New -> Web Service" -ForegroundColor Yellow
    Write-Host "Set Root Directory to 'backend' and add the environment variables above." -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Next: Open Supabase and run backend/init_supabase.sql in SQL editor..." -ForegroundColor Green
Start-Process "https://app.supabase.com"
