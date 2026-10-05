import React from 'react';
import { useAuth } from './AuthProvider';
import { GoogleSignInButton } from '../components/GoogleSignInButton';
import { GoogleOAuthService } from './GoogleOAuth';


export const LoginScreen: React.FC = () => {
  const { login, status } = useAuth();

  const handleGoogleClick = () => {
    login();
  };

  return (
    <div className="min-h-screen bg-[#0B0C0E] text-[#F5F5F5] flex flex-col justify-between px-6 py-14 max-w-md mx-auto select-none">
      {/* Brand Header */}
      <div className="pt-10">
        <h1 className="text-4xl font-semibold tracking-tight leading-[1.1] text-[#F5F5F5]">
          VERIFY<br />PRODUCT
        </h1>

        <p className="mt-5 text-base text-[#A6A7AB] font-normal leading-relaxed">
          Evidence before<br />assumptions.
        </p>
      </div>

      {/* Main Sign-In Action */}
      <div className="w-full space-y-4 my-auto py-8">


        <GoogleSignInButton
          onClick={handleGoogleClick}

        />

        <p className="text-center text-xs text-[#A6A7AB] pt-1">
          Sign in to authorize product analysis.
        </p>
      </div>

      {/* Minimal Footer */}
      <div className="pt-6 border-t border-white/[0.06] flex items-center justify-between text-xs text-[#A6A7AB]/60">
        <span>Authenticity &amp; evidence investigation</span>
        <span>&copy; {new Date().getFullYear()}</span>
      </div>
    </div>
  );
};
