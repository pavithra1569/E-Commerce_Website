# Google OAuth Setup Guide for ShopSphere

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API (or Google Identity API)

## Step 2: Configure OAuth Consent Screen

1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type
3. Fill in the required information:
   - App name: ShopSphere
   - User support email: your-email@gmail.com
   - Developer contact information: your-email@gmail.com
4. Add authorized domains: `localhost` (for development)
5. Save and continue

## Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized JavaScript origins:
   - `http://localhost:3002`
   - `http://localhost:3001`
5. Add authorized redirect URIs:
   - `http://localhost:3002`
   - `http://localhost:3001`
6. Click "Create"
7. Copy the Client ID and Client Secret

## Step 4: Update Environment Variables

### Frontend (.env)
```env
REACT_APP_GOOGLE_CLIENT_ID=your_actual_google_client_id_here
REACT_APP_API_URL=http://localhost:5000
```

### Backend (.env)
```env
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret_here
PORT=5000

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_actual_google_client_id_here
GOOGLE_CLIENT_SECRET=your_actual_google_client_secret_here

# Email Configuration (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password_here

# Frontend URL
FRONTEND_URL=http://localhost:3002
```

## Step 5: Test the Integration

1. Restart both frontend and backend servers
2. Go to the login page
3. Click "Sign in with Google"
4. You should see the Google OAuth popup

## Troubleshooting

### Common Issues:

1. **"Google OAuth is not configured" error**
   - Make sure you've replaced `your_google_client_id_here` with your actual Client ID
   - Restart the frontend server after updating .env

2. **"redirect_uri_mismatch" error**
   - Check that your authorized origins and redirect URIs match your local development URLs
   - Make sure you're using the correct port (3002 for frontend)

3. **"invalid_client" error**
   - Verify that your Client ID and Client Secret are correct
   - Make sure the Google+ API is enabled in your Google Cloud project

### Current Status:
- ✅ Google OAuth component is ready
- ✅ Backend authentication handler is configured
- ❌ Google Client ID needs to be set up (currently using placeholder)
- ❌ Environment variables need real values

Once you complete the Google Cloud setup and update the environment variables, Google OAuth will work perfectly!
