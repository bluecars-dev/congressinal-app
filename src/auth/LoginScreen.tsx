import React, { useState } from 'react';
import { useAuth } from './AuthProvider';
import { GoogleSignInButton } from '../components/GoogleSignInButton';
import { GoogleOAuthService } from './GoogleOAuth';
import { ShieldCheck, Info, KeyRound } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { login, enterDemoMode, status, error } = useAuth();
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [customClientId, setCustomClientId] = useState('');
  const [clientIdSaved, setClientIdSaved] = useState(false);

  const handleGoogleClick = () => {
    if (!GoogleOAuthService.isConfigured()) {
      setShowConfigModal(true);
    } else {
      login();
    }
  };

  const handleSaveClientId = (e: React.FormEvent) => {
    e.preventDefault();
    if (customClientId.trim()) {
      GoogleOAuthService.setClientId(customClientId.trim());
      setClientIdSaved(true);
      setShowConfigModal(false);
      login();
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0C0E] text-[#F5F5F5] flex flex-col justify-between px-6 py-12 max-w-md mx-auto relative select-none">
      {/* Top Brand Tag */}
      <div className="pt-8">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-2 h-2 rounded-full bg-[#E5E7EB] opacity-80" />
          <span className="text-[11px] font-mono tracking-widest text-[#A6A7AB] uppercase">
            Product Screening & Safety
          </span>
        </div>

        <h1 className="text-4xl font-semibold tracking-tight leading-[1.1] text-[#F5F5F5]">
          VERIFY<br />PRODUCT
        </h1>

        <p className="mt-6 text-lg text-[#A6A7AB] font-normal leading-relaxed">
          Evidence before<br />assumptions.
        </p>
      </div>

      {/* Middle Interactive Zone */}
      <div className="w-full space-y-4 my-auto py-8">
        {error && error !== 'GOOGLE_CLIENT_ID_REQUIRED' && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300 flex items-start gap-2.5">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" />
            <div className="leading-snug">{error}</div>
          </div>
        )}

        <GoogleSignInButton
          onClick={handleGoogleClick}
          loading={status === 'authenticating'}
        />

        <p className="text-center text-[13px] text-[#A6A7AB]/80 pt-1">
          Sign in to authorize product analysis.
        </p>

        {/* Seamless Evaluation Mode for rapid review without external Google Cloud setup */}
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={enterDemoMode}
            className="text-xs font-mono text-[#A6A7AB]/60 hover:text-[#E5E7EB] transition-colors underline underline-offset-4 decoration-white/20"
          >
            Or launch pre-authorized reviewer session
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-6 border-t border-white/[0.08] flex items-center justify-between text-xs text-[#A6A7AB]/60">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-[#A6A7AB]" />
          <span>Non-generative Laya WASM &middot; Gemini Grounded</span>
        </div>
        <button
          type="button"
          onClick={() => setShowConfigModal(true)}
          className="text-[11px] font-mono hover:text-[#F5F5F5] transition-colors"
          title="Configure Google OAuth Client ID"
        >
          OAuth Config
        </button>
      </div>

      {/* Google OAuth Client ID Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
          <div className="w-full max-w-sm glass-panel rounded-2xl p-6 border border-white/15 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#E5E7EB]" />
                <h3 className="font-medium text-sm text-[#F5F5F5]">Google OAuth Setup</h3>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="text-[#A6A7AB] hover:text-[#F5F5F5] text-xs font-mono"
              >
                &times; Close
              </button>
            </div>

            <p className="text-xs text-[#A6A7AB] leading-relaxed">
              To connect your live Google Cloud project, enter your OAuth 2.0 Client ID below.
              Required scope: <code className="text-[#F5F5F5] font-mono text-[11px]">generative-language</code>.
            </p>

            <form onSubmit={handleSaveClientId} className="space-y-3">
              <input
                type="text"
                value={customClientId}
                onChange={(e) => setCustomClientId(e.target.value)}
                placeholder="xxxx.apps.googleusercontent.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/15 text-xs text-[#F5F5F5] placeholder-[#A6A7AB]/50 focus:outline-none focus:border-white/40 font-mono"
              />

              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  disabled={!customClientId.trim()}
                  className="flex-1 py-2.5 rounded-xl bg-white text-black font-medium text-xs hover:bg-[#eaeaea] transition-colors disabled:opacity-40"
                >
                  Save & Connect
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowConfigModal(false);
                    enterDemoMode();
                  }}
                  className="px-3.5 py-2.5 rounded-xl bg-white/[0.07] border border-white/10 text-xs text-[#F5F5F5] hover:bg-white/[0.12] transition-colors"
                >
                  Use Review Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
