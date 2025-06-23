@echo off
echo 🤖 AI Setup for YouTube Clipper
echo ================================
echo.

REM Check if .env file exists
if exist ".env" (
    echo ✅ .env file already exists
    echo.
    echo Current configuration:
    findstr "OPENAI_API_KEY" .env
    echo.
    echo To update your API key, edit the .env file manually.
) else (
    echo 📝 Creating .env file from template...
    copy env.sample .env
    echo.
    echo ⚠️  IMPORTANT: You need to configure your OpenAI API key!
    echo.
    echo 1. Get your API key from: https://platform.openai.com/api-keys
    echo 2. Open the .env file in a text editor
    echo 3. Replace 'your_openai_api_key_here' with your actual API key
    echo 4. Save the file
    echo.
    echo Example:
    echo OPENAI_API_KEY=sk-your-actual-api-key-here
    echo.
    echo 🔒 Your API key will be kept secure and never shared.
    echo.
)

echo 🚀 Ready to start the application?
echo Run: npm run dev
echo.
pause 