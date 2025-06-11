import React, { useState, useEffect } from 'react';
import { GoogleAuth } from './components/GoogleAuth';
import { AuthenticatedApp } from './components/AuthenticatedApp';
import { authService, User } from './services/auth';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleGoogleSuccess = async (googleToken: string) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await authService.verifyGoogleToken(googleToken);
      
      if (response.success && response.user) {
        setUser(response.user);
        setToken(googleToken);
      } else {
        setError(response.error || 'Authentication failed');
      }
    } catch (error) {
      setError('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = (error: string) => {
    setError(error);
    setIsLoading(false);
  };

  const handleLogout = () => {
    setUser(null);
    setToken('');
    setError('');
  };

  // Demo mode - skip authentication for now
  const handleDemoMode = () => {
    const demoUser: User = {
      email: 'demo@example.com',
      name: 'Demo User',
      picture: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      isOwner: true
    };
    setUser(demoUser);
    setToken('demo-token');
  };

  if (user && token) {
    return <AuthenticatedApp user={user} token={token} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-800">
      <div className="max-w-md w-full space-y-8 p-8 bg-dark-700 rounded-xl shadow-xl">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-white">W</span>
          </div>
          <h2 className="text-3xl font-bold text-white">Watch Together</h2>
          <p className="mt-2 text-sm text-dark-300">
            Secure live streaming with friends
          </p>
        </div>
        
        {error && (
          <div className="bg-error-500/10 text-error-500 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <GoogleAuth
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            disabled={isLoading}
          />
          
          {/* Demo Mode Button */}
          <button
            onClick={handleDemoMode}
            className="w-full py-3 px-4 border border-dark-500 rounded-lg shadow-sm text-sm font-medium text-white bg-dark-600 hover:bg-dark-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dark-400 transition-colors"
          >
            Continue in Demo Mode
          </button>
          
          {isLoading && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
              <p className="text-sm text-dark-300 mt-2">Authenticating...</p>
            </div>
          )}
        </div>

        <div className="text-center">
          <p className="text-xs text-dark-400">
            Secure authentication powered by Google OAuth2
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;