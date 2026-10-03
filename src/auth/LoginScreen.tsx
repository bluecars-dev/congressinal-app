import React from 'react';
import { useAuth } from './AuthProvider';
import { GoogleSignInButton } from '../components/GoogleSignInButton';
import { GoogleOAuthService } from './GoogleOAuth';
import { AlertCircle } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { login, status, error } = useAuth();

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
        {error && (
          <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-[#E5E7EB] flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#FB7185]" />
            <div className="leading-snug text-[#A6A7AB]">
              {error === 'GOOGLE_CLIENT_ID_REQUIRED'
                ? 'Google Sign-In is not configured in the application environment.'
                : error}
            </div>
          </div>
        )}

        <GoogleSignInButton
          onClick={handleGoogleClick}
          loading={status === 'authenticating'}
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
