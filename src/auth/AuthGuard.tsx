import React from 'react';
import { useAuth } from './AuthProvider';
import { LoginScreen } from './LoginScreen';

export const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { status } = useAuth();

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0B0C0E] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <span className="text-xs font-mono text-[#A6A7AB]">VERIFY PRODUCT</span>
        </div>
      </div>
    );
  }

  if (status !== 'authorized') {
    return <LoginScreen />;
  }

  return <>{children}</>;
};
