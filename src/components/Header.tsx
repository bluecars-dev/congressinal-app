import React, { useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { AccountModal } from './AccountModal';
import { ChevronDown, User } from 'lucide-react';

export const Header: React.FC = () => {
  const { user } = useAuth();
  const [showAccount, setShowAccount] = useState(false);

  return (
    <>
      <header className="w-full flex items-center justify-end px-6 pt-5 pb-3">
        {/* Elegant small account avatar control on the right */}
        <button
          type="button"
          onClick={() => setShowAccount(true)}
          className="flex items-center gap-1.5 p-1 rounded-full hover:bg-white/[0.06] active:scale-95 transition-all text-[#A6A7AB] hover:text-[#F5F5F5]"
          aria-label="Account menu"
        >
          {user?.picture ? (
            <img
              src={user.picture}
              alt={user.name || 'Account'}
              className="w-7 h-7 rounded-full object-cover border border-white/15"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs font-mono text-[#F5F5F5] border border-white/10">
              {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5 text-[#A6A7AB]" />}
            </div>
          )}
          <ChevronDown className="w-3.5 h-3.5 text-[#A6A7AB] pr-0.5" />
        </button>
      </header>

      <AccountModal
        isOpen={showAccount}
        onClose={() => setShowAccount(false)}
      />
    </>
  );
};
