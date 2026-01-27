@echo off
REM Stumarto - GitHub Setup for Windows
REM This script helps you set up GitHub Pages deployment

setlocal enabledelayedexpansion

echo.
echo =======================================================
echo         Stumarto - GitHub Pages Setup
echo =======================================================
echo.

REM Check if git is initialized
if not exist .git (
    echo ERROR: Git is not initialized. Please run 'git init' first.
    pause
    exit /b 1
)

set /p GITHUB_USERNAME="Enter your GitHub username: "
set /p REPO_NAME="Enter repository name [stumarto]: "

if "!REPO_NAME!"=="" set REPO_NAME=stumarto

set GITHUB_URL=https://github.com/!GITHUB_USERNAME!/!REPO_NAME!.git

echo.
echo =======================================================
echo              DEPLOYMENT STEPS
echo =======================================================
echo.
echo 1. CREATE REPOSITORY ON GITHUB
echo    - Go to https://github.com/new
echo    - Repository name: !REPO_NAME!
echo    - Choose Public or Private
echo    - DO NOT initialize with README or .gitignore
echo    - Click 'Create repository'
echo.
echo 2. CONNECT TO GITHUB (Run these commands)
echo    git remote add origin !GITHUB_URL!
echo    git branch -M main
echo    git push -u origin main
echo.
echo 3. CONFIGURE GITHUB PAGES
echo    - Go to Settings ^> Pages
echo    - Deploy from a branch
echo    - Branch: gh-pages
echo    - Save
echo.
echo 4. ADD API KEY SECRET
echo    - Settings ^> Secrets and variables ^> Actions
echo    - New repository secret
echo    - Name: GEMINI_API_KEY
echo    - Value: [Your Gemini API Key]
echo.
echo 5. MONITOR DEPLOYMENT
echo    - Go to Actions tab
echo    - Watch the workflow
echo.
echo =======================================================
echo After deployment: https://!GITHUB_USERNAME!.github.io/!REPO_NAME!/
echo =======================================================
echo.
pause
