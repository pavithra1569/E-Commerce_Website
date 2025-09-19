import { useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

export default function GoogleLoginButton({ onSuccess, buttonText = "Continue with Google" }) {
  const handleGoogleResponse = useCallback(async (response) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: response.credential }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Dispatch auth state change event
        window.dispatchEvent(new CustomEvent('authStateChanged'));
        
        if (data.isNewUser) {
          toast.success(`Welcome to ShopSphere, ${data.user.name}!`);
        } else {
          toast.success(`Welcome back, ${data.user.name}!`);
        }
        
        onSuccess(data);
      } else {
        toast.error(data.error || 'Google login failed');
      }
    } catch (error) {
      console.error('Google login error:', error);
      toast.error('Google login failed. Please try again.');
    }
  }, [onSuccess]);

  useEffect(() => {
    // Check if Google Client ID is configured
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    if (!clientId || clientId === 'your_google_client_id_here') {
      console.warn('Google OAuth not configured. Please set REACT_APP_GOOGLE_CLIENT_ID in .env file');
      return;
    }

    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleResponse,
        });
      }
    };

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [handleGoogleResponse]);

  const handleGoogleLogin = () => {
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    if (!clientId || clientId === 'your_google_client_id_here') {
      // Prompt for email input
      const email = prompt('Enter your email to continue with Google:');
      if (!email) {
        toast.error('Email is required to continue');
        return;
      }

      // Check if user exists in localStorage (simulating existing signup)
      const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const existingUser = existingUsers.find(user => user.email === email);

      let user;
      if (existingUser) {
        user = {
          name: existingUser.name,
          email: existingUser.email,
          avatar: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
          provider: 'google'
        };
        toast.success(`Welcome back, ${user.name}!`);
      } else {
        // New user - extract name from email
        const name = email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1);
        user = {
          name: name,
          email: email,
          avatar: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
          provider: 'google'
        };
        
        // Save new user to localStorage
        existingUsers.push({ name: user.name, email: user.email });
        localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
        toast.success(`Welcome to ShopSphere, ${user.name}!`);
      }
      
      const token = 'google_token_' + Date.now();
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      window.dispatchEvent(new CustomEvent('authStateChanged'));
      
      onSuccess({ user, token, isNewUser: !existingUser });
      return;
    }

    if (window.google) {
      window.google.accounts.id.prompt();
    } else {
      toast.error('Google login is not available. Please try again later.');
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-full shadow-sm bg-white text-gray-700 hover:bg-gray-50 transition-colors font-medium"
    >
      <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      {buttonText}
    </button>
  );
}
