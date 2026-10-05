// src/usage/UsageTracker.ts
// Minimal stub implementation for usage tracking.

// Returns a placeholder usage stats object. In a real app this would read from storage.
export function getUsageStats(): any {
  // Example shape – adjust as needed for UI rendering.
  return {
    callsMade: 0,
    lastCall: null,
  };
}

// Clears usage statistics. Here it's a no‑op placeholder.
export function clearUsageStats(): void {
  // No persistent storage in this stub – nothing to clear.
}
