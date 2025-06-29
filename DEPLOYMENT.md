# YouTube Clipper - Render Deployment Guide

This guide will help you deploy the YouTube Clipper application to Render.

## Prerequisites

1. A Render account (free tier available)
2. Your application code pushed to a Git repository (GitHub, GitLab, etc.)
3. Environment variables configured (see Environment Setup section)

## Quick Deployment

### Option 1: Using render.yaml (Recommended)

1. **Connect your repository to Render:**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" and select "Blueprint"
   - Connect your Git repository
   - Render will automatically detect the `render.yaml` file and deploy your service

2. **Configure environment variables:**
   - In your Render service dashboard, go to "Environment" tab
   - Add all required environment variables (see Environment Setup section)

### Option 2: Manual Setup

1. **Create a new Web Service:**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" and select "Web Service"
   - Connect your Git repository

2. **Configure the service:**
   - **Name:** `youtube-clipper` (or your preferred name)
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Plan:** `Starter` (free tier)

3. **Set environment variables:**
   - Add all required environment variables (see Environment Setup section)

## Environment Setup

### Required Environment Variables

Add these environment variables in your Render service dashboard:

#### Database Configuration
```
DATABASE_URL=your_neon_database_url_here
```

#### Authentication (Firebase)
```
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
```

#### AI Services (OpenAI)
```
OPENAI_API_KEY=your_openai_api_key
```

#### Session Configuration
```
SESSION_SECRET=your_session_secret_here
```

#### Optional Environment Variables
```
NODE_ENV=production
PORT=5000
```

### Getting Environment Variables

1. **Database (Neon):**
   - Sign up at [neon.tech](https://neon.tech)
   - Create a new project
   - Copy the connection string from the dashboard

2. **Firebase:**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create a new project or use existing one
   - Go to Project Settings > General
   - Scroll down to "Your apps" section
   - Copy the configuration values

3. **OpenAI:**
   - Sign up at [OpenAI](https://platform.openai.com)
   - Go to API Keys section
   - Create a new API key

4. **Session Secret:**
   - Generate a random string (you can use `openssl rand -base64 32`)

## Database Setup

After deployment, you need to set up your database schema:

1. **Option 1: Using Render Shell**
   - Go to your service dashboard
   - Click "Shell" tab
   - Run: `npm run db:push`

2. **Option 2: Local Setup**
   - Clone your repository locally
   - Set up your environment variables
   - Run: `npm run db:push`

## Custom Domain (Optional)

1. In your Render service dashboard, go to "Settings" tab
2. Scroll down to "Custom Domains"
3. Add your domain and follow the DNS configuration instructions

## Monitoring and Logs

- **Logs:** Available in the "Logs" tab of your service dashboard
- **Metrics:** Basic metrics available in the "Metrics" tab
- **Health Checks:** Render automatically monitors your service health

## Troubleshooting

### Common Issues

1. **Build Failures:**
   - Check the build logs in Render dashboard
   - Ensure all dependencies are properly listed in `package.json`
   - Verify Node.js version compatibility

2. **Runtime Errors:**
   - Check the runtime logs
   - Verify all environment variables are set correctly
   - Ensure database connection is working

3. **Port Issues:**
   - Render automatically sets the `PORT` environment variable
   - The application is configured to use this port automatically

### Performance Optimization

1. **Enable Auto-Deploy:** Set up automatic deployments from your main branch
2. **Use Caching:** Consider implementing Redis for session storage
3. **CDN:** For production, consider using a CDN for static assets

## Security Considerations

1. **Environment Variables:** Never commit sensitive data to your repository
2. **HTTPS:** Render automatically provides HTTPS for custom domains
3. **Rate Limiting:** Consider implementing rate limiting for API endpoints
4. **Input Validation:** Ensure all user inputs are properly validated

## Support

- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com)
- [YouTube Clipper Issues](https://github.com/your-repo/issues)

## Cost Optimization

- **Free Tier:** Includes 750 hours/month of runtime
- **Starter Plan:** $7/month for always-on service
- **Pro Plan:** $25/month for better performance and features

For development and testing, the free tier should be sufficient. 