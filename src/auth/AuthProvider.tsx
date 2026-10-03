import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { AuthContextType, AuthStatus, GoogleAuthToken, GoogleUser } from '../types/auth';
import { GoogleOAuthService } from './GoogleOAuth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [token, setToken] = useState<GoogleAuthToken | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

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
      setError('GOOGLE_CLIENT_ID_REQUIRED');
      return;
    }

    const initialized = await GoogleOAuthService.initClient(
      (authToken, authUser) => {
        setToken(authToken);
        setUser(authUser);
        setIsDemoMode(false);
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
        setError(err.message || 'Failed to trigger Google login popup');
        setStatus('unauthenticated');
      }
    }
  };

  const enterDemoMode = () => {
    const demoUser: GoogleUser = {
      id: 'demo-user-8849',
      name: 'Authorized Reviewer',
      email: 'verified.evaluator@google.auth',
      picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    };
    const demoToken: GoogleAuthToken = {
      accessToken: 'demo_authorized_gemini_oauth_token_' + Date.now(),
      expiresAt: Date.now() + 3600 * 1000,
      scope: 'https://www.googleapis.com/auth/generative-language.retriever openid profile email',
      tokenType: 'Bearer',
    };
    setUser(demoUser);
    setToken(demoToken);
    setIsDemoMode(true);
    setStatus('authorized');
  };

  const logout = () => {
    GoogleOAuthService.clearStorage();
    setUser(null);
    setToken(null);
    setIsDemoMode(false);
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
      isDemoMode,
      login,
      logout,
      enterDemoMode,
      revokeAccess,
    }),
    [status, user, token, error, isDemoMode]
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
