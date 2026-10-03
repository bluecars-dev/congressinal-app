import { SearchProvider, WebResearchResult } from './SearchProvider';

/**
 * SupabaseSearchProvider implements the abstract SearchProvider using a Supabase Edge Function.
 * It POSTs the research query to the function endpoint and returns the normalized result.
 */
export class SupabaseSearchProvider implements SearchProvider {
  private endpoint: string;

  constructor() {
    // The base Supabase URL should be provided via environment variable.
    // For local development you can set NEXT_PUBLIC_SUPABASE_URL in a .env file.
    const baseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || '';

    if (!baseUrl) {
      console.warn('Supabase URL not configured; using relative path for dev.');
    }
    this.endpoint = `${baseUrl ? baseUrl.replace(/\/+$/, '') : ''}/functions/v1/web-research`;
  }

  async search(query: string): Promise<WebResearchResult> {
    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Supabase search failed (${response.status}): ${errText}`);
    }

    const result = (await response.json()) as WebResearchResult;
    return result;
  }
}
