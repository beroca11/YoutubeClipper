@echo off
echo 🚀 Starting YouTube Clipper Development Server...
echo.
echo 📱 The app will open automatically in your browser
echo 🌐 URL: http://localhost:5000
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start the development server
npm run dev

REM Wait a moment for the server to start
timeout /t 3 /nobreak >nul

REM Open the browser
start http://localhost:5000

echo.
echo ✅ Server started! Browser should open automatically.
echo. 