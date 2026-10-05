// Replaced AuthProvider with AccessProvider handling privacy consent and Gemini API key.
import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { AppAccessState } from '../types/appAccessState';
import { getPrivacyConsent } from '../settings/privacyStorage';
import { getGeminiKey } from '../settings/apiKeyStorage';

export type AccessContextType = {
  accessState: AppAccessState;
  setAccessState: React.Dispatch<React.SetStateAction<AppAccessState>>;
};

const AccessContext = createContext<AccessContextType | undefined>(undefined);

export const AccessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accessState, setAccessState] = useState<AppAccessState>('privacy_required');

  useEffect(() => {
    const consent = getPrivacyConsent();
    if (!consent) {
      setAccessState('privacy_required');
      return;
    }
    const apiKey = getGeminiKey();
    if (!apiKey) {
      setAccessState('api_key_required');
    } else {
      setAccessState('ready');
    }
  }, []);

  const value = useMemo(() => ({ accessState, setAccessState }), [accessState]);

  return <AccessContext.Provider value={value}>{children}</AccessContext.Provider>;
};

export const useAccess = (): AccessContextType => {
  const context = useContext(AccessContext);
  if (!context) {
    throw new Error('useAccess must be used within AccessProvider');
  }
  return context;
};

// Removed old AuthContext and types – only AccessProvider is exported now.


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
