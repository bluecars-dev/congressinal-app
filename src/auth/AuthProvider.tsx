import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { AuthContextType, AuthStatus, GoogleAuthToken, GoogleUser } from '../types/auth';
import { GoogleOAuthService } from './GoogleOAuth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [token, setToken] = useState<GoogleAuthToken | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check existing stored session
    const storedToken = GoogleOAuthService.getStoredToken();
    const storedUser = GoogleOAuthService.getStoredUser();

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
      setStatus('authorized');
    } else {
      setStatus('unauthenticated');
    }
  }, []);

  const login = async () => {
    setError(null);
    setStatus('authenticating');

    if (!GoogleOAuthService.isConfigured()) {
      setStatus('unauthenticated');
      setError('Google Sign-In is not configured in the application environment.');
      return;
    }

    const initialized = await GoogleOAuthService.initClient(
      (authToken, authUser) => {
        setToken(authToken);
        setUser(authUser);
        setStatus('authorized');
      },
      (err) => {
        setError(err);
        setStatus('unauthenticated');
      }
    );

    if (initialized) {
      try {
        GoogleOAuthService.requestToken();
      } catch (err: any) {
        setError(err.message || 'Failed to initialize Google sign-in window.');
        setStatus('unauthenticated');
      }
    }
  };

  const logout = () => {
    GoogleOAuthService.clearStorage();
    setUser(null);
    setToken(null);
    setStatus('unauthenticated');
    setError(null);
  };

  const revokeAccess = async () => {
    if (token?.accessToken) {
      await GoogleOAuthService.revokeToken(token.accessToken);
    }
    logout();
  };

  const value = useMemo(
    () => ({
      status,
      user,
      token,
      error,
      login,
      logout,
      revokeAccess,
    }),
    [status, user, token, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
