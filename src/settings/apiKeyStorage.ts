// src/settings/apiKeyStorage.ts
// Simple wrapper around localStorage for storing the user's Gemini API key.
// The key is stored in plain text for simplicity; in a production app you would encrypt it.

const GEMINI_KEY_STORAGE = 'gemini_api_key';

/** Retrieve the stored Gemini API key, or undefined if not set. */
export const getGeminiKey = (): string | undefined => {
  const key = localStorage.getItem(GEMINI_KEY_STORAGE);
  return key || undefined;
};

/** Store a new Gemini API key. */
export const setGeminiKey = (key: string): void => {
  localStorage.setItem(GEMINI_KEY_STORAGE, key);
};

/** Remove the stored Gemini API key. */
export const removeGeminiKey = (): void => {
  localStorage.removeItem(GEMINI_KEY_STORAGE);
};

/** Validate a Gemini API key by making a lightweight request.
 * Returns true if the key is accepted, false otherwise.
 */
export const validateGeminiKey = async (key: string): Promise<boolean> => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Hello' }] }],
        }),
      }
    );
    return response.ok;
  } catch (e) {
    console.error('Gemini key validation error:', e);
    return false;
  }
};
