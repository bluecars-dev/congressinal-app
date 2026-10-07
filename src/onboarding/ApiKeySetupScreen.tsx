// src/onboarding/ApiKeySetupScreen.tsx

import React, { useState } from 'react';
import {
  getGeminiKey,
  setGeminiKey,
  removeGeminiKey,
} from '../settings/apiKeyStorage';
import { useAccess } from '../auth/AuthProvider';

async function validateGeminiKey(key: string): Promise<boolean> {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(
        key
      )}`
    );

    if (!response.ok) {
      return false;
    }

    const data = await response.json();

    return Array.isArray(data.models);
  } catch {
    return false;
  }
}

export const ApiKeySetupScreen: React.FC = () => {
  const { setAccessState } = useAccess();

  const [key, setKey] = useState<string>(getGeminiKey() ?? '');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<
    'success' | 'error' | ''
  >('');

  const handleTest = async () => {
    if (!key.trim()) return;

    setTesting(true);
    setTestResult('');

    const ok = await validateGeminiKey(key.trim());

    setTestResult(ok ? 'success' : 'error');
    setTesting(false);
  };

  const handleSave = () => {
    if (!key.trim() || testResult !== 'success') return;

    setGeminiKey(key.trim());
    setAccessState('ready');
  };

  const handleClear = () => {
    removeGeminiKey();
    setKey('');
    setTestResult('');
    setAccessState('api_key_required');
  };

  return (
    <div className="min-h-screen bg-[#0B0C0E] text-[#F5F5F5] flex items-center justify-center px-6 py-10">
      <main className="w-full max-w-md">

        {/* Header */}
        <div className="mb-8">
          <p className="text-[11px]  tracking-widest text-[#A6A7AB] uppercase mb-3">
            One-time setup
          </p>

          <h1 className="text-3xl font-semibold tracking-tight">
            Connect Evident to Gemini
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#A6A7AB]">
            Evident uses Google's Gemini AI to investigate products and
            identify potential counterfeit indicators.
          </p>
        </div>

        {/* Why this is needed */}
        <div className="border border-white/10 rounded-xl p-5 mb-6">
      <h2 className="text-sm font-medium mb-3">
  Why do I need this?
</h2>

<p className="text-sm text-[#A6A7AB] leading-6">
Evident acts as a mailman between your browser and Gemini. Your Gemini
key lets it send your product photo to Google’s AI and return the analysis. Evident does store or get to see any information about your product or your key. It only exists in your browser.
</p>

<h2 className="text-sm font-medium mb-3">
  Is it safe?
</h2>

<p className="text-sm text-[#A6A7AB] leading-6">
Your Gemini key and app data stay in your browser. 
Evident never sends your key or information to any server. 
You can remove it at any time using the dashboard.
</p>


        </div>

        {/* Setup instructions */}
        <div className="mb-7">
          <h2 className="text-sm font-medium mb-4">
            Get your key
          </h2>

          <div className="space-y-4">

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-7 h-7 rounded-full border border-white/15 flex items-center justify-center text-xs">
                1
              </div>

              <div>
                <p className="text-sm font-medium">
                  Open Google AI Studio
                </p>

                <a
                  href="https://aistudio.google.com/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-1 text-sm text-white underline underline-offset-4"
                >
                  Open AI Studio →
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-7 h-7 rounded-full border border-white/15 flex items-center justify-center text-xs">
                2
              </div>

              <div>
                <p className="text-sm font-medium">
                  Create an API key
                </p>

                <p className="text-xs text-[#A6A7AB] mt-1 leading-5">
                  Follow Google's instructions to create a key.
                  You don't need to change any advanced settings.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-7 h-7 rounded-full border border-white/15 flex items-center justify-center text-xs">
                3
              </div>

              <div>
                <p className="text-sm font-medium">
                  Copy and paste the key below
                </p>

                <p className="text-xs text-[#A6A7AB] mt-1 leading-5">
                  It usually looks like a long combination of letters
                  and numbers.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* API Key */}
        <div>
          <label
            htmlFor="gemini-key"
            className="block text-sm font-medium mb-2"
          >
            Your Gemini key
          </label>

          <input
            id="gemini-key"
            type="password"
            autoComplete="off"
            placeholder="Paste your key here"
            value={key}
            onChange={(e) => {
              setKey(e.target.value);
              setTestResult('');
            }}
            className="w-full px-4 py-3 rounded-lg bg-[#151619] border border-white/10 text-[#F5F5F5] placeholder-[#66676B] outline-none focus:border-white/30 transition-colors"
          />
        </div>

        {/* Security explanation */}
        <div className="mt-4 p-4 rounded-lg bg-white/[0.03] border border-white/[0.08]">
          <p className="text-xs text-[#A6A7AB] leading-5">
            <span className="text-[#F5F5F5] font-medium">
              Your key stays in your browser.
            </span>{' '}
            Evident stores it locally and does not require you to create
            an Evident account.
          </p>
        </div>

        {/* Test result */}
        {testResult === 'success' && (
          <div className="mt-4 p-3 rounded-lg border border-white/15 text-sm text-[#F5F5F5]">
            ✓ Connection successful
          </div>
        )}

        {testResult === 'error' && (
          <div className="mt-4 p-3 rounded-lg border border-[#FB7185]/30 text-sm text-[#FB7185]">
            We couldn't connect with this key. Check that you copied
            the entire key and try again.
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 space-y-3">

          <button
            type="button"
            disabled={!key.trim() || testing}
            onClick={handleTest}
            className="w-full py-3.5 rounded-full bg-white text-black font-semibold text-sm hover:bg-[#ECECEC] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {testing ? 'Checking connection…' : 'Test Connection'}
          </button>

          {testResult === 'success' && (
            <button
              type="button"
              onClick={handleSave}
              className="w-full py-3.5 rounded-full border border-white/15 text-[#F5F5F5] font-medium text-sm hover:bg-white/[0.06] transition-colors"
            >
              Continue to Evident
            </button>
          )}

          {getGeminiKey() && (
            <button
              type="button"
              onClick={handleClear}
              className="w-full py-2 text-xs text-[#66676B] hover:text-[#A6A7AB] transition-colors"
            >
              Remove saved key
            </button>
          )}

        </div>

        <p className="text-[11px] text-[#66676B] text-center mt-6 leading-5">
          You only need to complete this setup once on this browser.
        </p>

      </main>
    </div>
  );
};