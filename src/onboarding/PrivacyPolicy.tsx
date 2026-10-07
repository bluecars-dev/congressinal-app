import React from 'react';

interface PrivacyPolicyProps {
  onAgree: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onAgree }) => {
  const [agreed, setAgreed] = React.useState(false);

  return (
    <div className="min-h-screen bg-[#0B0C0E] text-[#F5F5F5] flex flex-col">
      <main className="w-full max-w-2xl mx-auto px-6 py-10 flex-1">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="text-sm text-[#A6A7AB] hover:text-white transition-colors mb-8"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-semibold mb-3">
          Privacy & Terms
        </h1>

        <p className="text-[#A6A7AB] mb-8">
          Please review how Evident handles your information before continuing.
        </p>

        <section className="space-y-7 text-sm leading-6">
          <div>
            <h2 className="text-lg font-medium mb-2">Data Collected</h2>

            <ul className="list-disc list-inside text-[#C5C6C9] space-y-1">
              <li>
                Product images you capture for analysis.
              </li>
              <li>
                Your Gemini API key, stored locally in your browser.
              </li>
              <li>
                Usage statistics such as scan counts and token estimates,
                stored locally for your reference.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-medium mb-2">
              Third-Party Services
            </h2>

            <ul className="list-disc list-inside text-[#C5C6C9] space-y-1">
              <li>
                Gemini is accessed directly from your browser using your API key.
              </li>
              <li>
                Diffbot is accessed through a Supabase Edge Function. Its API
                credentials are kept server-side.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-medium mb-2">
              Safety & Disclaimers
            </h2>

            <p className="text-[#C5C6C9]">
              Evident provides informational counterfeit-risk assessments.
              Results should not be treated as definitive proof of authenticity
              or as professional advice.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium mb-2">
              Local Storage
            </h2>

            <p className="text-[#C5C6C9]">
              Information stored by Evident remains in your browser's local
              storage unless a feature explicitly requires communication with
              an external service.
            </p>
          </div>
        </section>

        <div className="border-t border-white/10 mt-10 pt-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 w-4 h-4 accent-white"
            />

            <span className="text-sm text-[#C5C6C9] leading-5">
              I have read and agree to the Privacy Policy and understand how
              Evident processes information.
            </span>
          </label>
        </div>

        <button
          type="button"
          disabled={!agreed}
          onClick={onAgree}
          className={`w-full mt-6 py-3 rounded-lg font-medium transition-colors ${
            agreed
              ? 'bg-white text-black hover:bg-[#E5E5E5]'
              : 'bg-[#242529] text-[#66676B] cursor-not-allowed'
          }`}
        >
          Continue
        </button>

        <p className="text-xs text-[#66676B] text-center mt-4">
          Version v1.0.0
        </p>
      </main>
    </div>
  );
};