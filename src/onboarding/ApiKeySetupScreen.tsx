// src/onboarding/ApiKeySetupScreen.tsx
import React, { useState, useEffect } from 'react';
import { getGeminiKey, setGeminiKey, removeGeminiKey } from '../settings/apiKeyStorage';
import { useAccess } from '../auth/AuthProvider';

/** Simple client‑side validation: attempt a tiny Gemini generateContent request. */
async function validateGeminiKey(key: string): Promise<boolean> {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-8b:generateContent?key=${encodeURIComponent(
        key
      )}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: 'ping' }] }] }),
      }
    );
    if (!response.ok) return false;
    const data = await response.json();
    // The API returns a "candidates" array on success.
    return Array.isArray((data as any).candidates);
  } catch {
    return false;
  }
}

export const ApiKeySetupScreen: React.FC = () => {
  const { setAccessState } = useAccess();
  const [key, setKey] = useState<string>(getGeminiKey() ?? '');
  const [testing, setTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<string>('');

  const handleSave = async () => {
    if (!key) return;
    setGeminiKey(key);
    setAccessState('ready');
  };

  const handleTest = async () => {
    if (!key) return;
    setTesting(true);
    setTestResult('');
    const ok = await validateGeminiKey(key);
    setTestResult(ok ? '✅ Valid Gemini key' : '❌ Invalid Gemini key');
    setTesting(false);
  };

  const handleClear = () => {
    removeGeminiKey();
    setKey('');
    setAccessState('api_key_required');
  };

  return (
    <div className="min-h-screen bg-[#0B0C0E] text-[#F5F5F5] flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl mb-4 font-bold">Gemini API Key Setup</h1>
      <input
        type="password"
        placeholder="Enter your Gemini API key"
        className="w-full max-w-md p-2 rounded bg-[#1A1B1E] text-[#F5F5F5] placeholder-[#A6A7AB] mb-3"
        value={key}
        onChange={(e) => setKey(e.target.value)}
      />
      <div className="flex gap-3 mb-3">
        <button
          type="button"
          className="px-4 py-2 bg-white text-black rounded disabled:opacity-50"
          disabled={!key || testing}
          onClick={handleTest}
        >
          {testing ? 'Testing…' : 'Test Key'}
        </button>
        <button
          type="button"
          className="px-4 py-2 bg-white text-black rounded disabled:opacity-50"
          disabled={!key}
          onClick={handleSave}
        >
          Save & Continue
        </button>
        <button
          type="button"
          className="px-4 py-2 bg-white text-black rounded"
          onClick={handleClear}
        >
          Remove Key
        </button>
      </div>
      {testResult && <p className="mt-2 text-sm">{testResult}</p>}
    </div>
  );
};
