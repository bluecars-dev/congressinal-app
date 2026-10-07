// src/features/settings/SettingsScreen.tsx
import type { FC, AnchorHTMLAttributes } from 'react';
import { useAccess } from '../../auth/AuthProvider';
import { removeGeminiKey } from '../../settings/apiKeyStorage';
import { clearUsageStats } from '../../usage/UsageTracker';

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { to: string };

const Link: FC<LinkProps> = ({ to, children, ...props }) => (
  <a href={to} {...props}>{children}</a>
);

export const SettingsScreen: FC = () => {
  const { setAccessState } = useAccess();

  const handleClearKey = () => {
    removeGeminiKey();
    setAccessState('api_key_required');
  };

  const handleClearStats = () => {
    clearUsageStats();
  };

  return (
    <div className="min-h-screen bg-[#0B0C0E] text-[#F5F5F5] p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <button
        onClick={handleClearKey}
        className="px-4 py-2 bg-white text-black rounded mb-2"
      >
        Clear Gemini API Key
      </button>
      <button
        onClick={handleClearStats}
        className="px-4 py-2 bg-white text-black rounded mb-2"
      >
        Clear Usage Stats
      </button>
      <Link to="/privacy-policy" className="mt-4 text-white underline">
        Privacy Policy
      </Link>
    </div>
  );
};
