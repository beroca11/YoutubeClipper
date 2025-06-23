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
- `clear-cache.bat` - Clear Vite cache (fixes 504 errors)

## URLs

- Local: http://localhost:5000
- Network: http://0.0.0.0:5000

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