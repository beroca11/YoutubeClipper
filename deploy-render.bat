@echo off
setlocal enabledelayedexpansion

echo 🚀 YouTube Clipper - Render Deployment Script
echo ==============================================

REM Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git is not installed. Please install Git first.
    pause
    exit /b 1
)

REM Check if we're in a git repository
git rev-parse --git-dir >nul 2>&1
if errorlevel 1 (
    echo ❌ Not in a git repository. Please initialize git first:
    echo    git init
    echo    git add .
    echo    git commit -m "Initial commit"
    pause
    exit /b 1
)

REM Check if we have uncommitted changes
git diff-index --quiet HEAD -- >nul 2>&1
if errorlevel 1 (
    echo ⚠️  You have uncommitted changes. Please commit them first:
    echo    git add .
    echo    git commit -m "Your commit message"
    pause
    exit /b 1
)

REM Check if we have a remote repository
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo ⚠️  No remote repository found. Please add your remote:
    echo    git remote add origin ^<your-repo-url^>
    pause
    exit /b 1
)

echo ✅ Git repository is ready

REM Build the application
echo 🔨 Building application...
call npm run build

if errorlevel 1 (
    echo ❌ Build failed
    pause
    exit /b 1
) else (
    echo ✅ Build successful
)

REM Push to remote repository
echo 📤 Pushing to remote repository...
git push origin main

if errorlevel 1 (
    echo ❌ Push failed
    pause
    exit /b 1
) else (
    echo ✅ Push successful
)

echo.
echo 🎉 Deployment initiated!
echo.
echo Next steps:
echo 1. Go to https://dashboard.render.com
echo 2. Create a new Web Service or Blueprint
echo 3. Connect your repository
echo 4. Configure environment variables (see DEPLOYMENT.md)
echo 5. Deploy!
echo.
echo 📖 For detailed instructions, see DEPLOYMENT.md
pause 