@echo off
echo.
echo ========================================
echo   Google OAuth Quick Setup - ShopSphere
echo ========================================
echo.

echo Step 1: Get your Google OAuth credentials
echo.
echo 1. Go to: https://console.cloud.google.com/
echo 2. Create project "ShopSphere"
echo 3. Enable Google Identity API
echo 4. Create OAuth 2.0 credentials:
echo    - Type: Web application
echo    - Origins: http://localhost:3000
echo    - Redirect: http://localhost:5000/api/auth/google/callback
echo.

set /p CLIENT_ID="Enter your Google Client ID: "
set /p CLIENT_SECRET="Enter your Google Client Secret: "
set /p EMAIL="Enter your email: "

echo.
echo Updating environment files...

:: Update frontend .env
powershell -Command "(Get-Content 'frontend\.env') -replace 'REACT_APP_GOOGLE_CLIENT_ID=.*', 'REACT_APP_GOOGLE_CLIENT_ID=%CLIENT_ID%' | Set-Content 'frontend\.env'"

:: Update backend .env
powershell -Command "(Get-Content 'backend\.env') -replace 'GOOGLE_CLIENT_ID=.*', 'GOOGLE_CLIENT_ID=%CLIENT_ID%' | Set-Content 'backend\.env'"
powershell -Command "(Get-Content 'backend\.env') -replace 'GOOGLE_CLIENT_SECRET=.*', 'GOOGLE_CLIENT_SECRET=%CLIENT_SECRET%' | Set-Content 'backend\.env'"
powershell -Command "(Get-Content 'backend\.env') -replace 'EMAIL_USER=.*', 'EMAIL_USER=%EMAIL%' | Set-Content 'backend\.env'"

:: Generate JWT secret if needed
powershell -Command "if ((Get-Content 'backend\.env') -match 'JWT_SECRET=your_jwt_secret_here') { $jwt = [System.Web.Security.Membership]::GeneratePassword(64, 0); (Get-Content 'backend\.env') -replace 'JWT_SECRET=.*', \"JWT_SECRET=$jwt\" | Set-Content 'backend\.env'; Write-Host 'Generated secure JWT secret' }"

echo.
echo ✅ Environment files updated!
echo.
echo Restarting servers...
taskkill /f /im node.exe 2>nul

echo Starting backend...
start "ShopSphere Backend" cmd /k "cd /d backend && node app.js"
timeout /t 3 /nobreak >nul

echo Starting frontend...
start "ShopSphere Frontend" cmd /k "cd /d frontend && npm start"

echo.
echo 🎉 Google OAuth is now configured!
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Try logging in with Google!
echo.
pause
