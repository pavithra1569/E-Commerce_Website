import { useEffect, useCallback, useRef } from "react";
import toast from "react-hot-toast";

export default function GoogleLoginButton({
  onSuccess,
  buttonText = "Continue with Google",
}) {
  const googleBtnRef = useRef(null);
  const handleGoogleResponse = useCallback(
    async (response) => {
      try {
        if (!response || !response.credential) {
          // Prompt may be suppressed or user dismissed. Show a helpful message.
          const reason = response?.error || response?.type || "No credential returned";
          console.warn("Google prompt did not return credential:", reason);
          toast.error("Google sign-in was cancelled or blocked. Try again.");
          return;
        }

        const res = await fetch(
          `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/auth/google`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: response.credential }),
          }
        );

        const data = await res.json();

        if (res.ok) {
          // Save login info
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));

          // Notify app about login state change
          window.dispatchEvent(new CustomEvent("authStateChanged"));

          // Welcome message
          toast.success(
            data.isNewUser
              ? `Welcome to ShopSphere, ${data.user.name}!`
              : `Welcome back, ${data.user.name}!`
          );

          onSuccess(data);
        } else {
          toast.error(data.error || "Google login failed");
        }
      } catch (error) {
        console.error("Google login error:", error);
        toast.error("Google login failed. Please try again.");
      }
    },
    [onSuccess]
  );

  useEffect(() => {
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.warn(
        "Google OAuth not configured. Please set REACT_APP_GOOGLE_CLIENT_ID in .env file"
      );
      return;
    }

    // Load Google script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleResponse,
          ux_mode: 'popup',
          auto_select: false,
        });

        // Render official Google button as primary or fallback
        if (googleBtnRef.current) {
          window.google.accounts.id.renderButton(googleBtnRef.current, {
            theme: 'outline',
            size: 'large',
            type: 'standard',
            shape: 'pill',
            text: 'continue_with',
            logo_alignment: 'left',
          });
        }
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

    if (!clientId) {
      toast.error("Google login not configured properly");
      return;
    }

    if (window.google && window.google.accounts?.id) {
      // Prompt One Tap manually as a fallback to the rendered button
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          console.warn('One Tap not displayed:', notification.getNotDisplayedReason?.(), notification.getSkippedReason?.());
        }
      });
    } else {
      toast.error("Google login is not available. Please try again later.");
    }
  };

  return (
    <div className="w-full">
      {/* Official Google button */}
      <div ref={googleBtnRef} className="w-full flex justify-center mb-2" />

      {/* Fallback custom button triggers One Tap prompt */}
      <button
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-full shadow-sm bg-white text-gray-700 hover:bg-gray-50 transition-colors font-medium"
      >
        <svg
          className="w-5 h-5 mr-3 flex-shrink-0"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        {buttonText}
      </button>
    </div>
  );
}
