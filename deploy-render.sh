#!/bin/bash

# YouTube Clipper - Render Deployment Script
# This script helps prepare and deploy the application to Render

set -e

echo "🚀 YouTube Clipper - Render Deployment Script"
echo "=============================================="

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Not in a git repository. Please initialize git first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    exit 1
fi

# Check if we have uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo "⚠️  You have uncommitted changes. Please commit them first:"
    echo "   git add ."
    echo "   git commit -m 'Your commit message'"
    exit 1
fi

# Check if we have a remote repository
if ! git remote get-url origin &> /dev/null; then
    echo "⚠️  No remote repository found. Please add your remote:"
    echo "   git remote add origin <your-repo-url>"
    exit 1
fi

echo "✅ Git repository is ready"

# Build the application
echo "🔨 Building application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful"
else
    echo "❌ Build failed"
    exit 1
fi

# Push to remote repository
echo "📤 Pushing to remote repository..."
git push origin main

if [ $? -eq 0 ]; then
    echo "✅ Push successful"
else
    echo "❌ Push failed"
    exit 1
fi

echo ""
echo "🎉 Deployment initiated!"
echo ""
echo "Next steps:"
echo "1. Go to https://dashboard.render.com"
echo "2. Create a new Web Service or Blueprint"
echo "3. Connect your repository"
echo "4. Configure environment variables (see DEPLOYMENT.md)"
echo "5. Deploy!"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT.md" 