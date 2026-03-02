@REM ========================================
@REM SUPABASE + VERCEL DEPLOYMENT SCRIPT
@REM ========================================
@REM Run this file from PowerShell to deploy

@ECHO OFF
ECHO.
ECHO ========================================
ECHO SUPABASE VERCEL DEPLOYMENT SCRIPT
ECHO ========================================
ECHO.

REM Check if Vercel CLI is installed
WHERE vercel >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    ECHO Installing Vercel CLI...
    npm install -g vercel
)

ECHO.
ECHO Step 1: Navigate to project
cd /d "c:\Users\Shivam Sharma\Downloads\stumarto---school-marketplace"

ECHO.
ECHO Step 2: Build the project
ECHO Building frontend and backend...
npm run build

ECHO.
ECHO Step 3: Vercel deployment options
ECHO.
ECHO Choose one:
ECHO 1. Deploy with Vercel CLI (recommended)
ECHO 2. Just list environment variables to add
ECHO.
SET /P choice="Enter your choice (1 or 2): "

IF "%choice%"=="1" (
    ECHO.
    ECHO Login to Vercel...
    vercel login
    
    ECHO.
    ECHO Adding Supabase environment variables...
    
    vercel env add SUPABASE_URL --value "https://tmlalbctqzzhlufowfei.supabase.co"
    vercel env add SUPABASE_KEY --value "sb_publishable_xrL4jNZwEPAEhWozNVbqgw_IkUMDu2t"
    vercel env add EXPO_PUBLIC_SUPABASE_URL --value "https://tmlalbctqzzhlufowfei.supabase.co"
    vercel env add EXPO_PUBLIC_SUPABASE_KEY --value "sb_publishable_xrL4jNZwEPAEhWozNVbqgw_IkUMDu2t"
    vercel env add VITE_SUPABASE_URL --value "https://tmlalbctqzzhlufowfei.supabase.co"
    vercel env add VITE_SUPABASE_KEY --value "sb_publishable_xrL4jNZwEPAEhWozNVbqgw_IkUMDu2t"
    
    ECHO.
    ECHO Deploying to production...
    vercel deploy --prod
    
    ECHO.
    ECHO ✅ Deployment complete!
    PAUSE
) ELSE IF "%choice%"=="2" (
    ECHO.
    ECHO Copy these into Vercel Dashboard → Settings → Environment Variables:
    ECHO.
    ECHO SUPABASE_URL = https://tmlalbctqzzhlufowfei.supabase.co
    ECHO SUPABASE_KEY = sb_publishable_xrL4jNZwEPAEhWozNVbqgw_IkUMDu2t
    ECHO EXPO_PUBLIC_SUPABASE_URL = https://tmlalbctqzzhlufowfei.supabase.co
    ECHO EXPO_PUBLIC_SUPABASE_KEY = sb_publishable_xrL4jNZwEPAEhWozNVbqgw_IkUMDu2t
    ECHO VITE_SUPABASE_URL = https://tmlalbctqzzhlufowfei.supabase.co
    ECHO VITE_SUPABASE_KEY = sb_publishable_xrL4jNZwEPAEhWozNVbqgw_IkUMDu2t
    ECHO.
    PAUSE
) ELSE (
    ECHO Invalid choice. Exiting.
    EXIT /B 1
)
