// src/auth/AuthProvider.tsx
// Provides access state handling for privacy consent and Gemini API key.
import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { AppAccessState } from '../types/appAccessState';
import { getPrivacyConsent } from '../settings/privacyStorage';
import { getGeminiKey } from '../settings/apiKeyStorage';

// ----- Access Context (onboarding flow) -----
export type AccessContextType = {
  accessState: AppAccessState;
  setAccessState: React.Dispatch<React.SetStateAction<AppAccessState>>;
};

const AccessContext = createContext<AccessContextType | undefined>(undefined);

export const AccessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accessState, setAccessState] = useState<AppAccessState>('privacy_required');

  // Initialise based on stored consent and Gemini key
  useEffect(() => {
    const consent = getPrivacyConsent();
    if (!consent) {
      setAccessState('privacy_required');
      return;
    }
    const apiKey = getGeminiKey();
    setAccessState(apiKey ? 'ready' : 'api_key_required');
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

// ----- Simple stub auth hook (UI components) -----
export const useAuth = () => {
  // In a real app this would interface with Google OAuth or similar.
  // Here we provide minimal shape required by the UI components.
  const login = () => console.log('login stub');
  const logout = () => console.log('logout stub');
  const revokeAccess = async () => console.log('revokeAccess stub');

  return {
    user: { name: 'Demo User', email: 'demo@example.com', picture: undefined },
    status: 'authorized' as const,
    error: null,
    login,
    logout,
    revokeAccess,
  };
};
