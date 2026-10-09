
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

    setPrivacyConsent('v1.1');
    setAccessState('ready');
  };

  if (step === 'welcome') {
    return (
      <div className="min-h-screen bg-[#0B0C0E] text-[#F5F5F5] flex flex-col items-center justify-center px-6">
        <main className="w-full max-w-md">
          <div className="flex justify-center mb-10">
            <img
              src="/evident-logo.png"
              alt="Evident"
              className="w-48 max-w-full h-auto object-contain"
            />
          </div>

          <div className="text-center mb-10">
            <h1 className="text-3xl font-semibold tracking-tight">
              Product investigation, made simple.
            </h1>

            <p className="mt-4 text-[#A6A7AB] leading-6">
              Photograph a product to examine its details, identify potential
              warning signs, and compare findings with supporting information.
            </p>
          </div>

          <div className="border border-white/10 rounded-2xl p-5 mb-6">
            <h2 className="text-sm font-semibold mb-5">How it works</h2>

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
                  <p className="text-[#F5F5F5] font-medium mb-1">Review</p>
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
    <div className="min-h-screen bg-[#0B0C0E] text-[#F5F5F5] flex flex-col items-center px-6 py-8">
      <main className="w-full max-w-md">
        <button
          type="button"
          onClick={() => setStep('welcome')}
          className="text-sm text-[#A6A7AB] hover:text-white transition-colors mb-8"
        >
          ← Back
        </button>

        <div className="mb-7">
          <h1 className="text-3xl font-semibold tracking-tight">
            Privacy Policy & Liability
          </h1>
          <p className="text-[#A6A7AB] text-sm leading-6 mt-3">
            Review how Evident handles information and the limitations of
            its product assessments before continuing.
          </p>
        </div>

        <div className="border border-white/10 rounded-2xl p-5 space-y-6 max-h-[55vh] overflow-y-auto">
  <section>
    <h2 className="text-base font-medium mb-2">
      Your information
    </h2>
    <p className="text-sm text-[#A6A7AB] leading-6">
      Evident does not require you to create an account. Scan history
      and related application data are stored in your browser. This
      does not mean all processing happens locally: information
      needed for an investigation is sent to services that help
      Evident provide its results.
    </p>
  </section>

  <section>
    <h2 className="text-base font-medium mb-2">
      Product photos and analysis
    </h2>
    <p className="text-sm text-[#A6A7AB] leading-6">
      When you submit a product photo, it is sent through Evident's
      processing service to Google's Gemini AI for analysis.
      Supporting product research may also be requested through
      Evident's web-research service, which uses Diffbot. These
      services process information to help generate your report.
      Avoid including faces, addresses, or other personal details
      in photos whenever possible.
    </p>
  </section>

  <section>
    <h2 className="text-base font-medium mb-2">
      Understanding your results
    </h2>
    <p className="text-sm text-[#A6A7AB] leading-6">
      Evident uses AI-generated analysis and available supporting
      information to identify potential warning signs. Results may
      be inaccurate, incomplete, or outdated. A low-risk result
      does not prove that a product is genuine or safe, and a
      high-risk result does not prove that it is counterfeit.
    </p>
  </section>

  <section>
    <h2 className="text-base font-medium mb-2">
      Using Evident responsibly
    </h2>
    <p className="text-sm text-[#A6A7AB] leading-6">
      Evident provides preliminary informational assessments. It
      does not certify authenticity, quality, safety, or regulatory
      compliance and is not a substitute for professional
      authentication, laboratory testing, medical advice, or
      official verification. Independently verify important
      findings before making purchasing, health, or safety
      decisions.
    </p>
  </section>

  <section>
    <h2 className="text-base font-medium mb-2">
      Responsibility and liability
    </h2>
    <div className="text-sm text-[#A6A7AB] leading-6 space-y-3">
      <p>
        By using Evident, you acknowledge that its assessments
        have limitations and that you are responsible for how
        you use the results.
      </p>

      <p>
        To the extent permitted by applicable law, the Terms of
        Use limit Evident's responsibility for losses arising
        from use of the service or reliance on its results.
        Any release of claims or exclusion of liability applies
        only to the extent legally enforceable.
      </p>

      <p>
        Nothing here removes rights or limits liability that
        cannot legally be waived or excluded.
      </p>
    </div>
  </section>

  <section>
    <h2 className="text-base font-medium mb-2">
      Third-party services
    </h2>
    <p className="text-sm text-[#A6A7AB] leading-6">
      Evident relies on third-party services for AI analysis
      and supporting research. Their handling of submitted
      information is subject to their own applicable terms
      and privacy policies. Please review the full Privacy
      Policy for more information about data handling.
    </p>
  </section>

  <Link
    to="https://docs.google.com/document/d/1Q1ObYDh871y7Yd9NTKxL1pSpFQAE6LQ_kRQGaNgQP7Y/edit?tab=t.0"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-block text-sm text-white underline underline-offset-4"
  >
    Read the full Privacy Policy
  </Link>

  <p className="text-xs text-[#A6A7AB] leading-5">
    This overview should be read together with Evident's complete
    Privacy Policy and Terms of Use.
  </p>
</div>
        <label className="flex items-start gap-3 mt-6 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 w-4 h-4 accent-white shrink-0"
          />

          <span className="text-sm text-[#C5C6C9] leading-5">
  I have read and agree to the Privacy Policy and Terms of Use.
  I understand that Evident provides preliminary assessments
  that may not always be accurate, and I agree to the
  responsibility and liability terms described above, to the
  extent permitted by law.
</span>
        </label>

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
          I Agree & Continue
        </button>

        <p className="text-xs text-[#66676B] text-center mt-4">
          Terms version v1.1
        </p>
      </main>
    </div>
  );
};
