# YouTube Clipper

A fast, modern web application for creating and downloading YouTube video clips with AI-powered suggestions and advanced video editing features.

## Quick Start

### Option 1: Simple Start (Recommended)
```bash
# Windows
dev.bat

# Or PowerShell
.\dev.ps1
```

### Option 2: Manual Start
```bash
npm install
npm run dev
npm run open
```

## Deployment

### Render Deployment (Recommended)

The easiest way to deploy YouTube Clipper is using Render:

#### Quick Deploy
1. **Using Blueprint (Recommended):**
   - Fork or push this repository to GitHub
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Blueprint"
   - Connect your repository
   - Render will automatically detect the `render.yaml` configuration

2. **Manual Setup:**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your repository
   - Set build command: `npm install && npm run build`
   - Set start command: `npm start`

#### Environment Variables
Configure these in your Render service dashboard:
- `DATABASE_URL` - Your Neon database connection string
- `FIREBASE_API_KEY` - Firebase API key
- `FIREBASE_AUTH_DOMAIN` - Firebase auth domain
- `FIREBASE_PROJECT_ID` - Firebase project ID
- `FIREBASE_STORAGE_BUCKET` - Firebase storage bucket
- `FIREBASE_MESSAGING_SENDER_ID` - Firebase messaging sender ID
- `FIREBASE_APP_ID` - Firebase app ID
- `OPENAI_API_KEY` - OpenAI API key
- `SESSION_SECRET` - Random session secret

#### Deployment Scripts
```bash
# Linux/Mac
./deploy-render.sh

# Windows
deploy-render.bat
```

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## Performance Optimizations

### Frontend
- Vite Fast Refresh for instant hot reload
- Dependency pre-bundling for faster startup
- Code splitting for optimized bundles
- React Query caching with 5-minute stale time

### Backend
- Video caching to avoid re-downloading
- Conditional logging (development only)
- Optimized FFmpeg processing
- In-memory storage for speed

### Development
- Cross-platform scripts
- Auto-browser opening
- Clear status messages
- TypeScript strict mode

## Available Scripts

- `npm run dev` - Start development server
- `npm run dev:open` - Start server and open browser
- `npm run open` - Open browser to localhost:5000
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run deploy:render` - Build and start for Render deployment
- `clear-cache.bat` - Clear Vite cache (fixes 504 errors)

## URLs

- Local: http://localhost:5000
- Network: http://0.0.0.0:5000
- Health Check: http://localhost:5000/health

## Troubleshooting

### 504 (Outdated Optimize Dep) Error
If you see a 504 error with "Outdated Optimize Dep", run:
```bash
clear-cache.bat
npm run dev
```

### Port Already in Use
If port 5000 is already in use:
```bash
taskkill /f /im node.exe
npm run dev
``` 