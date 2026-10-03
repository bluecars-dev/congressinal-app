import React from 'react';
import { useAuth } from '../auth/AuthProvider';
import { LogOut, ShieldX, X, User } from 'lucide-react';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose }) => {
  const { user, logout, revokeAccess } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
      <div className="w-full max-w-sm glass-panel rounded-3xl p-6 border border-white/15 space-y-5 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-sm text-[#F5F5F5]">Account</h3>
          <button
            onClick={onClose}
            className="text-[#A6A7AB] hover:text-[#F5F5F5] text-xs font-mono p-1"
            aria-label="Close account menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Card */}
        <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/08 flex items-center gap-3.5">
          {user?.picture ? (
            <img
              src={user.picture}
              alt={user.name || 'Account avatar'}
              className="w-10 h-10 rounded-full object-cover border border-white/10"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xs font-mono font-medium text-[#F5F5F5]">
              {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4 text-[#A6A7AB]" />}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="text-xs font-medium text-[#F5F5F5] truncate">
              {user?.name || 'Google User'}
            </div>
            <div className="text-[11px] font-mono text-[#A6A7AB] truncate">
              {user?.email}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={() => {
              onClose();
              logout();
            }}
            className="w-full py-2.5 rounded-xl glass-panel-subtle text-xs text-[#F5F5F5] hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5 text-[#A6A7AB]" />
            <span>Sign out</span>
          </button>

          <button
            type="button"
            onClick={async () => {
              onClose();
              await revokeAccess();
            }}
            className="w-full py-2.5 rounded-xl text-xs text-[#FB7185]/80 hover:text-[#FB7185] hover:bg-[#FB7185]/10 transition-colors flex items-center justify-center gap-2"
          >
            <ShieldX className="w-3.5 h-3.5" />
            <span>Disconnect &amp; revoke access</span>
          </button>
        </div>

        {/* Privacy Note */}
        <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-[#A6A7AB]">
          <span>Privacy &amp; Data Ethics</span>
          <span>&copy; {new Date().getFullYear()}</span>
        </div>
      </div>
    </div>
  );
};
