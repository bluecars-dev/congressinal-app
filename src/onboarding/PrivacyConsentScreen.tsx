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
    setAccessState('ready');
  };

  if (step === 'welcome') {
    return (
      <div className="min-h-screen bg-[#0B0C0E] text-[#F5F5F5] flex flex-col items-center justify-center px-6">
        <main className="w-full max-w-md">

          {/* Logo */}
          <div className="flex justify-center mb-10">
             <img
  src="/evident-logo.png"
  alt="Evident"
  className="w-[32vw] max-w-[500px] min-w-[380px] h-auto object-contain"
/>
          </div>

          {/* Introduction */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-semibold tracking-tight">
              Product investigation, made simple.
            </h1>

            <p className="mt-4 text-[#A6A7AB] leading-6">
              Photograph a product to examine its details, identify potential
              warning signs, and compare findings with supporting information.
            </p>
          </div>

          {/* How it works */}
          <div className="border border-white/10 rounded-2xl p-5 mb-6">
            <h2 className="text-sm font-semibold mb-5">
              How it works
            </h2>

            <div className="space-y-5 text-sm">
              <div className="flex gap-4">
                <span className="text-[#72747A] font-medium">01</span>
                <div>
                  <p className="text-[#F5F5F5] font-medium mb-1">
                    Photograph
                  </p>
                  <p className="text-[#A6A7AB] leading-5">
                    Take a clear photo of the product you want to investigate.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="text-[#72747A] font-medium">02</span>
                <div>
                  <p className="text-[#F5F5F5] font-medium mb-1">
                    Investigate
                  </p>
                  <p className="text-[#A6A7AB] leading-5">
                    Evident analyzes visible details and gathers supporting
                    product information.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="text-[#72747A] font-medium">03</span>
                <div>
                  <p className="text-[#F5F5F5] font-medium mb-1">
                    Review
                  </p>
                  <p className="text-[#A6A7AB] leading-5">
                    Review potential warning signs and the resulting
                    counterfeit-risk assessment.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setStep('privacy')}
            className="w-full py-3.5 rounded-full bg-white text-black font-semibold text-sm hover:bg-[#ECECEC] active:scale-[0.99] transition-all"
          >
            Get started
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

        {/* Back */}
        <button
          type="button"
          onClick={() => setStep('welcome')}
          className="text-sm text-[#A6A7AB] hover:text-white transition-colors mb-8"
        >
          ← Back
        </button>

        {/* Header */}
        <div className="mb-7">
          <h1 className="text-3xl font-semibold tracking-tight">
            Privacy & consent
          </h1>

          <p className="text-[#A6A7AB] text-sm leading-6 mt-3">
            Before using Evident, please review how your information is
            handled.
          </p>
        </div>

        {/* Privacy Information */}
        <div className="border border-white/10 rounded-2xl p-5 space-y-6 max-h-[55vh] overflow-y-auto">

          <section>
            <h2 className="text-base font-medium mb-2">
              Your information
            </h2>

            <p className="text-sm text-[#A6A7AB] leading-6">
              Evident does not require you to create an account. Application
              data and scan history are stored locally in your browser.
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium mb-2">
              Product images
            </h2>

            <p className="text-sm text-[#A6A7AB] leading-6">
              Product images are sent to Evident's processing service to
              perform the investigation. They are not added to your local
              scan history unless you choose to save the result.
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium mb-2">
              AI analysis
            </h2>

            <p className="text-sm text-[#A6A7AB] leading-6">
              Evident uses Google Gemini to analyze product images and
              information gathered during an investigation. AI-generated
              results may contain errors and should be reviewed carefully.
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium mb-2">
              Supporting information
            </h2>

            <p className="text-sm text-[#A6A7AB] leading-6">
              Evident may retrieve information from third-party sources to
              provide supporting evidence for a product investigation.
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium mb-2">
              Important
            </h2>

            <p className="text-sm text-[#A6A7AB] leading-6">
              Evident provides counterfeit-risk assessments for informational
              purposes. A risk assessment is not a definitive determination
              that a product is authentic or counterfeit.
            </p>
          </section>

          <Link
            to="/privacy-policy"
            className="inline-block text-sm text-white underline underline-offset-4"
          >
            Read the full Privacy Policy
          </Link>
        </div>

        {/* Consent */}
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

        {/* Continue */}
        <button
          type="button"
          disabled={!agreed}
          onClick={handleAgree}
          className={`w-full mt-6 py-3.5 rounded-full font-semibold text-sm transition-all ${
            agreed
              ? 'bg-white text-black hover:bg-[#ECECEC] active:scale-[0.99]'
              : 'bg-[#242529] text-[#66676B] cursor-not-allowed'
          }`}
        >
          Continue
        </button>
      </main>
    </div>
  );
};