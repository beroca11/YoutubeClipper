@echo off
echo 🧹 Clearing Vite cache...
echo.

REM Kill any running Node processes
taskkill /f /im node.exe >nul 2>&1

REM Clear Vite cache
if exist "node_modules\.vite" (
    rmdir /s /q "node_modules\.vite"
    echo ✅ Vite cache cleared
) else (
    echo ℹ️  No Vite cache found
)

REM Clear TypeScript cache
if exist "node_modules\typescript\tsbuildinfo" (
    del "node_modules\typescript\tsbuildinfo"
    echo ✅ TypeScript cache cleared
) else (
    echo ℹ️  No TypeScript cache found
)

echo.
echo 🚀 Cache cleared! You can now run 'npm run dev'
echo. 