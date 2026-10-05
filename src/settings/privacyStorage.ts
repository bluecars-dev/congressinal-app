// src/settings/privacyStorage.ts
const PRIVACY_CONSENT_KEY = 'privacy_consent';

export interface PrivacyConsent {
  version: string;
  timestamp: number;
}

export const getPrivacyConsent = (): PrivacyConsent | null => {
  const raw = localStorage.getItem(PRIVACY_CONSENT_KEY);
  return raw ? JSON.parse(raw) : null;
};

export const setPrivacyConsent = (version: string): void => {
  const consent: PrivacyConsent = { version, timestamp: Date.now() };
  localStorage.setItem(PRIVACY_CONSENT_KEY, JSON.stringify(consent));
};

export const clearPrivacyConsent = (): void => {
  localStorage.removeItem(PRIVACY_CONSENT_KEY);
};
