import React, { useEffect } from 'react';

interface GoogleAuthProps {
  onSuccess: (token: string) => void;
  onError: (error: string) => void;
  buttonText?: string;
  disabled?: boolean;
}

declare global {
  interface Window {
    google: any;
    googleAuthCallback: (response: any) => void;
  }
}

export const GoogleAuth: React.FC<GoogleAuthProps> = ({ 
  onSuccess, 
  onError, 
  buttonText = "Sign in with Google",
  disabled = false 
}) => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!clientId) {
      onError('Google Client ID not configured');
      return;
    }

    // Load Google Identity Services
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response: any) => {
            if (response.credential) {
              onSuccess(response.credential);
            } else {
              onError('Failed to get Google credential');
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        // Render the button
        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-button'),
          {
            theme: 'filled_blue',
            size: 'large',
            text: 'signin_with',
            shape: 'rectangular',
            logo_alignment: 'left',
            width: '100%'
          }
        );
      }
    };

    script.onerror = () => {
      onError('Failed to load Google Sign-In');
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup
      const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [clientId, onSuccess, onError]);

  if (!clientId) {
    return (
      <div className="bg-error-500/10 text-error-500 p-3 rounded-lg text-sm">
        Google authentication not configured. Please set VITE_GOOGLE_CLIENT_ID.
      </div>
    );
  }

  return (
    <div className="w-full">
      <div 
        id="google-signin-button" 
        className={`w-full ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
      />
      {disabled && (
        <p className="text-xs text-dark-400 mt-2 text-center">
          Please wait...
        </p>
      )}
    </div>
  );
};