# PowerShell helper to deploy to Railway locally
# Usage: .\scripts\deploy-railway.ps1 -ProjectId <railway-project-id>

param(
  [Parameter(Mandatory=$true)]
  [string]$ProjectId
)

if (-not (Get-Command railway -ErrorAction SilentlyContinue)) {
  Write-Host "Railway CLI not found. Install with: npm i -g @railway/cli" -ForegroundColor Yellow
  exit 1
}

Write-Host "Building frontend..."
npm run build

Write-Host "Logging into Railway (you will be prompted if not already logged in)..."
railway login

Write-Host "Deploying to Railway project: $ProjectId"
railway up --projectId $ProjectId --detach
