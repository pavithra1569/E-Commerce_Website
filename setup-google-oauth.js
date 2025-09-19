#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setupGoogleOAuth() {
  console.log('\n🚀 Google OAuth Setup for ShopSphere\n');
  console.log('This script will help you configure Google OAuth for your ecommerce site.\n');

  // Step 1: Guide through Google Cloud Console
  console.log('📋 STEP 1: Google Cloud Console Setup');
  console.log('Please complete these steps in Google Cloud Console:');
  console.log('1. Go to https://console.cloud.google.com/');
  console.log('2. Create a new project or select existing one');
  console.log('3. Enable Google Identity API');
  console.log('4. Go to "APIs & Services" > "OAuth consent screen"');
  console.log('5. Choose "External" user type');
  console.log('6. Fill in app details:');
  console.log('   - App name: ShopSphere');
  console.log('   - User support email: your-email@gmail.com');
  console.log('   - Developer contact: your-email@gmail.com');
  console.log('7. Add authorized domains: localhost');
  console.log('8. Go to "APIs & Services" > "Credentials"');
  console.log('9. Click "Create Credentials" > "OAuth 2.0 Client IDs"');
  console.log('10. Choose "Web application"');
  console.log('11. Add authorized JavaScript origins:');
  console.log('    - http://localhost:3000');
  console.log('    - http://localhost:3001');
  console.log('    - http://localhost:3002');
  console.log('12. Add authorized redirect URIs:');
  console.log('    - http://localhost:5000/api/auth/google/callback');
  console.log('13. Click "Create" and copy the credentials\n');

  await question('Press Enter when you have completed the Google Cloud Console setup...');

  // Step 2: Get credentials from user
  console.log('\n📝 STEP 2: Enter Your Google OAuth Credentials');
  const clientId = await question('Enter your Google Client ID: ');
  const clientSecret = await question('Enter your Google Client Secret: ');
  const userEmail = await question('Enter your email for notifications: ');

  if (!clientId || !clientSecret || !userEmail) {
    console.log('❌ All fields are required. Please run the script again.');
    rl.close();
    return;
  }

  // Step 3: Update environment files
  console.log('\n⚙️  STEP 3: Updating Environment Files');

  try {
    // Update frontend .env
    const frontendEnvPath = path.join(__dirname, 'frontend', '.env');
    let frontendEnv = fs.readFileSync(frontendEnvPath, 'utf8');
    frontendEnv = frontendEnv.replace(
      /REACT_APP_GOOGLE_CLIENT_ID=.*/,
      `REACT_APP_GOOGLE_CLIENT_ID=${clientId}`
    );
    fs.writeFileSync(frontendEnvPath, frontendEnv);
    console.log('✅ Updated frontend/.env');

    // Update backend .env
    const backendEnvPath = path.join(__dirname, 'backend', '.env');
    let backendEnv = fs.readFileSync(backendEnvPath, 'utf8');
    backendEnv = backendEnv.replace(
      /GOOGLE_CLIENT_ID=.*/,
      `GOOGLE_CLIENT_ID=${clientId}`
    );
    backendEnv = backendEnv.replace(
      /GOOGLE_CLIENT_SECRET=.*/,
      `GOOGLE_CLIENT_SECRET=${clientSecret}`
    );
    backendEnv = backendEnv.replace(
      /EMAIL_USER=.*/,
      `EMAIL_USER=${userEmail}`
    );
    
    // Generate a secure JWT secret if it's still default
    if (backendEnv.includes('JWT_SECRET=your_jwt_secret_here')) {
      const crypto = require('crypto');
      const jwtSecret = crypto.randomBytes(64).toString('hex');
      backendEnv = backendEnv.replace(
        /JWT_SECRET=.*/,
        `JWT_SECRET=${jwtSecret}`
      );
      console.log('✅ Generated secure JWT secret');
    }

    fs.writeFileSync(backendEnvPath, backendEnv);
    console.log('✅ Updated backend/.env');

    // Step 4: Create restart script
    const restartScript = `@echo off
echo Restarting ShopSphere servers...
echo.
echo Stopping any running processes...
taskkill /f /im node.exe 2>nul
timeout /t 2 /nobreak >nul

echo Starting backend server...
start "Backend" cmd /k "cd /d backend && node app.js"
timeout /t 3 /nobreak >nul

echo Starting frontend server...
start "Frontend" cmd /k "cd /d frontend && npm start"

echo.
echo ✅ Both servers are starting!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Google OAuth is now configured and ready to use!
pause
`;

    fs.writeFileSync(path.join(__dirname, 'restart-servers.bat'), restartScript);
    console.log('✅ Created restart-servers.bat');

    console.log('\n🎉 Google OAuth Setup Complete!');
    console.log('\nNext steps:');
    console.log('1. Run restart-servers.bat to restart both servers');
    console.log('2. Go to http://localhost:3000');
    console.log('3. Try logging in with Google!');
    console.log('\nNote: You may need to add your test users to the OAuth consent screen');
    console.log('if your app is still in testing mode.');

  } catch (error) {
    console.error('❌ Error updating files:', error.message);
  }

  rl.close();
}

// Run the setup
setupGoogleOAuth().catch(console.error);
