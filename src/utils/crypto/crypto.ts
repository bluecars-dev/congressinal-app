// src/utils/crypto/crypto.ts
// Simple utility to mask an API key for display.
export function maskKey(key: string): string {
  if (key.length <= 8) return '*'.repeat(key.length);
  const start = key.slice(0, 4);
  const end = key.slice(-4);
  const masked = '*'.repeat(key.length - 8);
  return `${start}${masked}${end}`;
}
