<#
Render Backend Deploy Script
Requires: Render API key (from render.com/account/api-keys)
Auto-deploys backend to Render using API
#>

Write-Host "=== Render CLI Deploy ===" -ForegroundColor Cyan

# Get Render API key
$renderApiKey = Read-Host -Prompt "Paste your Render API key (from render.com/account/api-keys)" -AsSecureString
$renderApiKeyPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToCoTaskMemUnicode($renderApiKey))

# Get Supabase credentials
$supabaseUrl = Read-Host -Prompt "Enter SUPABASE_URL (from app.supabase.com)"
$supabaseKey = Read-Host -Prompt "Enter SUPABASE_KEY (service_role key)" -AsSecureString
$supabaseKeyPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToCoTaskMemUnicode($supabaseKey))

$jwtSecret = Read-Host -Prompt "Enter JWT_SECRET (random string)" -DefaultValue "stumarto-jwt-secret-key-2024"
$adminEmail = Read-Host -Prompt "Enter ADMIN_EMAIL" -DefaultValue "admin@stumarto.com"
$adminPassword = Read-Host -Prompt "Enter ADMIN_PASSWORD" -DefaultValue "admin123"

Write-Host "Creating/Updating Render service..." -ForegroundColor Yellow

# Check if service exists
$headers = @{ Authorization = "Bearer $renderApiKeyPlain"; "Content-Type" = "application/json" }
$services = Invoke-RestMethod -Uri "https://api.render.com/v1/services" -Headers $headers -Method GET -ErrorAction SilentlyContinue
$existingService = $services.services | Where-Object { $_.name -eq "stumarto-backend" } | Select-Object -First 1

if ($existingService) {
    Write-Host "Service exists (ID: $($existingService.id)). Updating environment variables..." -ForegroundColor Green
    
    # Update the service
    $updateBody = @{
        envVars = @(
            @{ key = "SUPABASE_URL"; value = $supabaseUrl }
            @{ key = "SUPABASE_KEY"; value = $supabaseKeyPlain }
            @{ key = "JWT_SECRET"; value = $jwtSecret }
            @{ key = "ADMIN_EMAIL"; value = $adminEmail }
            @{ key = "ADMIN_PASSWORD"; value = $adminPassword }
        )
    } | ConvertTo-Json
    
    try {
        Invoke-RestMethod -Uri "https://api.render.com/v1/services/$($existingService.id)" -Headers $headers -Method PATCH -Body $updateBody -ContentType "application/json" | Out-Null
        Write-Host "Service updated!" -ForegroundColor Green
    } catch {
        Write-Host "Failed to update service: $_" -ForegroundColor Red
    }
} else {
    Write-Host "Creating new Render service..." -ForegroundColor Yellow
    
    $serviceBody = @{
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
            @{ key = "SUPABASE_KEY"; value = $supabaseKeyPlain }
            @{ key = "JWT_SECRET"; value = $jwtSecret }
            @{ key = "ADMIN_EMAIL"; value = $adminEmail }
            @{ key = "ADMIN_PASSWORD"; value = $adminPassword }
        )
        autoDeploy = $true
    } | ConvertTo-Json
    
    try {
        $newService = Invoke-RestMethod -Uri "https://api.render.com/v1/services" -Headers $headers -Method POST -Body $serviceBody -ContentType "application/json"
        Write-Host "Service created!" -ForegroundColor Green
        Write-Host "Service ID: $($newService.id)" -ForegroundColor Cyan
        Write-Host "Will be live at: https://$($newService.slug).onrender.com" -ForegroundColor Cyan
    } catch {
        Write-Host "Failed to create service: $_" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "Next: Create Supabase tables by running backend/init_supabase.sql in Supabase dashboard" -ForegroundColor Yellow
Write-Host "Then update Vercel frontend's VITE_API_BASE_URL env variable with your Render URL" -ForegroundColor Yellow
