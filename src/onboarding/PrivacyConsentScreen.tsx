import React, { useState } from 'react';
import { useAccess } from '../auth/AuthProvider';
import { setPrivacyConsent } from '../settings/privacyStorage';

type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  to: string;
};

const Link: React.FC<LinkProps> = ({ to, children, ...props }) => (
  <a href={to} {...props}>
    {children}
  </a>
);

export const PrivacyConsentScreen: React.FC = () => {
  const { setAccessState } = useAccess();
  const [step, setStep] = useState<'welcome' | 'privacy'>('welcome');
  const [agreed, setAgreed] = useState(false);

  const handleAgree = () => {
    if (!agreed) return;

    setPrivacyConsent('v1.0');
    setAccessState('api_key_required');
  };

  if (step === 'welcome') {
    return (
      <div className="min-h-screen bg-[#0B0C0E] text-[#F5F5F5] flex flex-col items-center justify-center px-6">
        <main className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="w-14 h-14 mx-auto mb-6 rounded-2xl border border-white/15 flex items-center justify-center">
              <span className="text-xl font-semibold">E</span>
            </div>

            <h1 className="text-4xl font-semibold tracking-tight">
              Welcome to Evident
            </h1>

            <p className="mt-4 text-[#A6A7AB] leading-6">
              Investigate products for potential counterfeit risk using
              AI-powered analysis and supporting evidence.
            </p>
          </div>

          <div className="border border-white/10 rounded-xl p-5 mb-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider mb-4">
              How it works
            </h2>

            <div className="space-y-4 text-sm text-[#A6A7AB]">
              <div>
                <p className="text-[#F5F5F5] mb-1">1. Capture</p>
                <p>
                  Take a photo of the product you want to investigate.
                </p>
              </div>

              <div>
                <p className="text-[#F5F5F5] mb-1">2. Analyze</p>
                <p>
                  Evident examines the product and gathers supporting
                  information.
                </p>
              </div>

              <div>
                <p className="text-[#F5F5F5] mb-1">3. Review</p>
                <p>
                  Receive an evidence-based counterfeit-risk assessment.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setStep('privacy')}
            className="w-full py-3.5 rounded-full bg-white text-black font-semibold text-sm hover:bg-[#ECECEC] transition-colors"
          >
            Get Started
          </button>

          <p className="text-xs text-[#66676B] text-center mt-4">
            Privacy-first product investigation
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0C0E] text-[#F5F5F5] flex flex-col items-center justify-center px-6">
      <main className="w-full max-w-md">
        <button
          type="button"
          onClick={() => setStep('welcome')}
          className="text-sm text-[#A6A7AB] hover:text-white transition-colors mb-8"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-semibold tracking-tight mb-3">
          Privacy & Consent
        </h1>

        <p className="text-[#A6A7AB] text-sm leading-6 mb-7">
          Before using Evident, please review how the application handles
          your information.
        </p>

        <div className="border border-white/10 rounded-xl p-5 space-y-6 max-h-[55vh] overflow-y-auto">
          <section>
            <h2 className="text-base font-medium mb-2">
              Local Data
            </h2>

            <p className="text-sm text-[#A6A7AB] leading-6">
              Evident stores application data and usage information locally
              in your browser.
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium mb-2">
              Product Images
            </h2>

            <p className="text-sm text-[#A6A7AB] leading-6">
              Product images are used to perform your investigation and are
              not retained by Evident as part of your local scan history.
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium mb-2">
              Gemini API Key
            </h2>

            <p className="text-sm text-[#A6A7AB] leading-6">
              Your Gemini API key is stored locally in your browser and is
              used to perform AI analysis.
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium mb-2">
              Third-Party Services
            </h2>

            <p className="text-sm text-[#A6A7AB] leading-6">
              Evident may use third-party services to support product
              investigation and retrieve supporting information.
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium mb-2">
              Important
            </h2>

            <p className="text-sm text-[#A6A7AB] leading-6">
              Evident provides counterfeit-risk assessments for informational
              purposes. An assessment is not a definitive determination of
              authenticity.
            </p>
          </section>

          <Link
            to="/privacy-policy"
            className="inline-block text-sm text-white underline underline-offset-4"
          >
            Read the full Privacy Policy
          </Link>
        </div>

        <label className="flex items-start gap-3 mt-6 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 w-4 h-4 accent-white"
          />

          <span className="text-sm text-[#A6A7AB] leading-5">
            I have read and agree to the Privacy Policy and understand how
            Evident handles my information.
          </span>
        </label>

        <button
          type="button"
          disabled={!agreed}
          onClick={handleAgree}
          className={`w-full mt-6 py-3.5 rounded-full font-semibold text-sm transition-colors ${
            agreed
              ? 'bg-white text-black hover:bg-[#ECECEC]'
              : 'bg-[#242529] text-[#66676B] cursor-not-allowed'
          }`}
        >
          Agree & Continue
        </button>
      </main>
    </div>
  );
};