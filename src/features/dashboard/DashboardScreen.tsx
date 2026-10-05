// src/features/dashboard/DashboardScreen.tsx
import React, { useEffect, useState } from 'react';
import { maskKey } from '../../utils/crypto/crypto';
import { useAccess } from '../../auth/AuthProvider';
import { getGeminiKey, removeGeminiKey } from '../../settings/apiKeyStorage';
import { clearUsageStats, getUsageStats } from '../../usage/UsageTracker';

export const DashboardScreen: React.FC = () => {
  const { setAccessState } = useAccess();
  const [key, setKey] = useState<string>('');
  const [usage, setUsage] = useState<any>(null);

  useEffect(() => {
    const storedKey = getGeminiKey();
    setKey(storedKey ?? '');
    setUsage(getUsageStats());
  }, []);

  const handleReplace = () => {
    removeGeminiKey();
    setAccessState('api_key_required');
  };

  const handleClearStats = () => {
    clearUsageStats();
    setUsage(null);
  };

  return (
    <div className="min-h-screen bg-[#0B0C0E] text-[#F5F5F5] p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="mb-2">Gemini API Key: {key ? maskKey(key) : 'Not set'}</p>
      {key && (
        <button onClick={handleReplace} className="px-4 py-2 bg-white text-black rounded mb-2">
          Replace Key
        </button>
      )}
      <button onClick={handleClearStats} className="px-4 py-2 bg-white text-black rounded mb-4">
        Clear Usage Stats
      </button>
      {usage && (
        <pre className="bg-[#1a1b1d] p-2 rounded w-full max-w-md overflow-x-auto text-sm">
          {JSON.stringify(usage, null, 2)}
        </pre>
      )}
    </div>
  );
};
