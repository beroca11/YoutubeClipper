# Authentication Setup Guide

This guide will help you set up Firebase Authentication for your YouTube Clipper app.

## Prerequisites

- A Firebase project (create one at [Firebase Console](https://console.firebase.google.com/))
- Node.js and npm installed

## Firebase Setup

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter a project name (e.g., "youtube-clipper")
4. Follow the setup wizard

### 2. Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable "Email/Password" authentication
5. Click "Save"

### 3. Get Firebase Configuration

1. In your Firebase project, click the gear icon next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (</>) to add a web app
5. Register your app with a nickname
6. Copy the configuration object

### 4. Environment Variables

Create a `.env` file in the `client` directory with your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

Replace the values with your actual Firebase configuration.

## Features Included

### ✅ Authentication Components
- **SignIn.tsx** - Professional sign-in form with validation
- **SignUp.tsx** - User registration with password requirements
- **ForgotPassword.tsx** - Password reset functionality
- **ProtectedRoute.tsx** - Route protection based on auth status

### ✅ Security Features
- Form validation using Zod schemas
- Password strength requirements
- Email format validation
- Protected routes
- Secure token management

### ✅ User Experience
- Loading states during authentication
- Success/error toast notifications
- Responsive design with Tailwind CSS
- User profile dropdown in header
- Automatic redirects

### ✅ Technical Implementation
- Firebase Authentication integration
- React Hook Form for form management
- React Router for navigation
- Context API for global auth state
- TypeScript for type safety

## Usage

### Sign In
- Navigate to `/signin`
- Enter email and password
- Form validates input and shows errors
- Success redirects to home page

### Sign Up
- Navigate to `/signup`
- Enter name, email, and password
- Password must meet strength requirements
- Account creation with display name

### Password Reset
- Click "Forgot your password?" on sign-in page
- Enter email address
- Reset link sent to email
- User can try again if needed

### Protected Routes
- Home page requires authentication
- Auth pages redirect if already signed in
- Loading spinner during auth state check

## Customization

### Styling
The authentication pages use a consistent design with:
- Red color scheme matching your app
- Gradient backgrounds
- Card-based layouts
- Responsive design

### Validation Rules
Password requirements can be modified in `client/src/lib/validation.ts`:
- Minimum 8 characters
- Must contain uppercase, lowercase, and number
- Custom error messages

### Toast Notifications
Toast configuration is in `App.tsx`:
- Success messages (green)
- Error messages (red)
- Custom duration and positioning

## Security Best Practices

1. **Environment Variables**: Never commit Firebase keys to version control
2. **Password Requirements**: Enforce strong passwords
3. **Rate Limiting**: Firebase handles this automatically
4. **HTTPS**: Always use HTTPS in production
5. **Token Management**: Firebase handles token refresh automatically

## Troubleshooting

### Common Issues

1. **Firebase not initialized**: Check environment variables
2. **Authentication not working**: Verify Firebase project settings
3. **CORS errors**: Ensure Firebase Auth domain is configured
4. **Environment variables not loading**: Restart development server

### Development vs Production

- Development: Uses Firebase Auth emulator if available
- Production: Uses live Firebase services
- Environment variables must be set for both

## Next Steps

Consider adding these features:
- Social authentication (Google, GitHub)
- Email verification
- Account deletion
- Profile management
- Session persistence
- Multi-factor authentication

## Support

For Firebase-specific issues, refer to the [Firebase Documentation](https://firebase.google.com/docs/auth). 