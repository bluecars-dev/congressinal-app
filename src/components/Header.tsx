import React, { useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { AccountModal } from './AccountModal';
import { ShieldCheck } from 'lucide-react';

export const Header: React.FC = () => {
  const { user } = useAuth();
  const [showAccount, setShowAccount] = useState(false);

  return (
    <>
      <header className="w-full flex items-center justify-between px-6 pt-5 pb-3">
        {/* Logo / App Name */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#E5E7EB]" />
          <span className="text-[12px] font-mono tracking-widest text-[#F5F5F5] uppercase font-medium">
            Verify Product
          </span>
        </div>

        {/* Minimal Account Indicator: "Signed in with Google" */}
        <button
          type="button"
          onClick={() => setShowAccount(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel-subtle text-[11px] font-mono text-[#A6A7AB] hover:text-[#F5F5F5] transition-colors border border-white/08 hover:border-white/15"
          title="Account settings"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[#4ADE80]" />
          <span>Signed in with Google</span>
          {user?.picture ? (
            <img
              src={user.picture}
              alt="Avatar"
              className="w-4 h-4 rounded-full object-cover ml-0.5"
            />
          ) : (
            <span className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-[9px] text-white">
              {user?.name?.[0] || 'G'}
            </span>
          )}
        </button>
      </header>

      <AccountModal
        isOpen={showAccount}
        onClose={() => setShowAccount(false)}
      />
    </>
  );
};
