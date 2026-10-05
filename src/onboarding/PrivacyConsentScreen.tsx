import React from 'react';
import { useAccess } from '../../auth/AuthProvider';
import { setPrivacyConsent } from '../settings/privacyStorage';
// Use simple anchor instead of react-router-dom Link
const Link = ({ to, children, ...props }) => (<a href={to} {...props}>{children}</a>);

export const PrivacyConsentScreen: React.FC = () => {
  const { setAccessState } = useAccess();

  const handleAgree = () => {
    setPrivacyConsent('v1.0');
    setAccessState('api_key_required');
  };

  return (
    <div className="min-h-screen bg-[#0B0C0E] text-[#F5F5F5] flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold mb-4">Privacy Policy & Consent</h1>
      <p className="mb-4 max-w-md text-center">
        Please review our <Link to="/privacy-policy" className="underline text-white">Privacy Policy</Link>. By clicking “Agree” you accept the terms and allow the app to store data locally.
      </p>
      <button
        onClick={handleAgree}
        className="px-6 py-2 bg-white text-black rounded-full font-medium hover:bg-[#ececec] transition"
      >
        Agree
      </button>
    </div>
  );
};
