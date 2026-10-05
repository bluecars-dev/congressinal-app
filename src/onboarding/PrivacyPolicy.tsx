import React from 'react';

export const PrivacyPolicy: React.FC = () => (
  <div className="max-w-3xl mx-auto p-6 text-[#F5F5F5] bg-[#0B0C0E] min-h-screen">
    <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
    <p className="mb-2">
      This application processes product images locally on your device and stores data only in your browser's local storage.
    </p>
    <h2 className="text-2xl font-semibold mt-4 mb-2">Data Collected</h2>
    <ul className="list-disc list-inside mb-2">
      <li>Product images you capture for analysis (processed locally, not uploaded).</li>
      <li>Your Gemini API key (stored encrypted in local storage; never sent to any server).</li>
      <li>Usage statistics (scan count, token usage estimates) stored locally for your reference.</li>
    </ul>
    <h2 className="text-2xl font-semibold mt-4 mb-2">Third‑Party Services</h2>
    <ul className="list-disc list-inside mb-2">
      <li>Gemini 3.8 Flash model – accessed directly from the browser using your API key.</li>
      <li>Diffbot – accessed via a Supabase Edge Function; the Diffbot API key is kept secret on the server and never exposed to the client.</li>
    </ul>
    <h2 className="text-2xl font-semibold mt-4 mb-2">Safety & Disclaimers</h2>
    <p className="mb-2">
      The analysis may involve health and safety considerations. Results are for informational purposes only and should not replace professional advice.
    </p>
    <p className="mb-2">
      The app does not store or transmit any personally identifiable information.
    </p>
    <p className="mt-8 text-sm text-gray-400">Version: v1.0.0</p>
  </div>
);
