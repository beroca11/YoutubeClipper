# Render Deployment Troubleshooting Guide

This guide helps resolve common issues when deploying YouTube Clipper to Render.

## 🔍 Common Error: npm error code 127

### What it means:
- **Error 127** = "Command not found"
- Usually indicates missing dependencies or build tools

### Solutions:

#### 1. **Updated Build Configuration** ✅
We've already fixed this by:
- Moving `esbuild` from `devDependencies` to `dependencies`
- Using `npm ci` instead of `npm install` for more reliable builds
- Splitting build into separate client and server steps

#### 2. **Check Render Logs**
In your Render dashboard:
1. Go to your service
2. Click "Logs" tab
3. Look for specific error messages

#### 3. **Verify Environment Variables**
Make sure these are set in Render:
```
NODE_ENV=production
PORT=5000
DATABASE_URL=your_database_url
FIREBASE_API_KEY=your_firebase_key
# ... other required env vars
```

#### 4. **Force Rebuild**
If the issue persists:
1. Go to your Render service dashboard
2. Click "Manual Deploy"
3. Select "Clear build cache & deploy"

## 🛠️ Build Process Breakdown

### What happens during build:
1. **Install Dependencies**: `npm ci`
2. **Build Client**: `vite build` → `dist/public/`
3. **Build Server**: `esbuild server/index.ts` → `dist/index.js`

### Expected Output:
```
dist/
├── index.js          # Server bundle
└── public/           # Client assets
    ├── index.html
    └── assets/
        ├── index-*.css
        └── index-*.js
```

## 🔧 Manual Debugging Steps

### 1. **Test Build Locally**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm ci

# Test build
npm run build

# Verify output
ls -la dist/
```

### 2. **Check Dependencies**
```bash
# Verify esbuild is available
npx esbuild --version

# Verify vite is available
npx vite --version
```

### 3. **Use Build Verification Script**
```bash
node verify-build.js
```

## 🚨 Common Issues & Fixes

### Issue: "esbuild: command not found"
**Fix**: ✅ Already fixed - moved esbuild to dependencies

### Issue: "vite: command not found"
**Fix**: ✅ Already fixed - vite is in devDependencies but npm ci installs it

### Issue: "Module not found" errors
**Fix**: 
1. Check if all dependencies are in package.json
2. Ensure no missing imports in code
3. Verify TypeScript compilation

### Issue: "Port already in use"
**Fix**: ✅ Already fixed - using `process.env.PORT || 5000`

### Issue: "Database connection failed"
**Fix**: 
1. Verify `DATABASE_URL` is set correctly
2. Check if database is accessible from Render
3. Ensure database schema is set up

## 📋 Pre-Deployment Checklist

Before deploying to Render:

- [ ] **Local build works**: `npm run build` succeeds
- [ ] **Dependencies correct**: esbuild in dependencies, not devDependencies
- [ ] **Environment variables**: All required vars documented
- [ ] **Database ready**: Schema pushed, connection string ready
- [ ] **Health check**: `/health` endpoint returns 200
- [ ] **Port configuration**: Uses `process.env.PORT`

## 🔄 Deployment Process

### Automatic (Blueprint):
1. Push code to GitHub
2. Connect repository to Render Blueprint
3. Configure environment variables
4. Deploy

### Manual:
1. Create Web Service in Render
2. Connect repository
3. Set build command: `npm ci && npm run build`
4. Set start command: `npm start`
5. Configure environment variables
6. Deploy

## 📞 Getting Help

### Render Support:
- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com)

### Debug Commands:
```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Verify package.json
npm run check

# Test build locally
npm run build

# Test production start
npm start
```

## 🎯 Quick Fix Summary

If you're still getting error 127:

1. **Push the updated code** (with esbuild in dependencies)
2. **Clear build cache** in Render dashboard
3. **Redeploy** with manual deploy option
4. **Check logs** for specific error messages

The main fix was moving `esbuild` from `devDependencies` to `dependencies` since Render needs it during the build process. 