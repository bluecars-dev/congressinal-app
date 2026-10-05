// src/auth/AuthGuard.tsx
import React from 'react';
import { useAuth } from './AuthProvider';
import { LoginScreen } from './LoginScreen';

export const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { status } = useAuth();

  // If the user is not authorized, show the login screen.
  if (status !== 'authorized') {
    return <LoginScreen />;
  }

  // Authorized – render the protected content.
  return <>{children}</>;
};
