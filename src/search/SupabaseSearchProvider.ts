
import { SearchProvider, WebResearchResult } from './SearchProvider';

export class SupabaseSearchProvider implements SearchProvider {
  private readonly endpoint: string;
  private readonly supabaseKey: string;

  constructor() {
    const baseUrl = (
      import.meta.env.VITE_SUPABASE_URL ||
      import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
      ''
    ).replace(/\/+$/, '');

    this.supabaseKey =
      import.meta.env.VITE_SUPABASE_ANON_KEY ||
      import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      '';

    if (!baseUrl || !this.supabaseKey) {
      throw new Error(
        'Missing Supabase configuration. Check your URL and public key.'
      );
    }

    this.endpoint = `${baseUrl}/web-research`;
  }

  async search(query: string): Promise<WebResearchResult> {
    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': this.supabaseKey,
        'Authorization': `Bearer ${this.supabaseKey}`,
      },
      body: JSON.stringify({ query: query.trim() }),
    });

    if (!response.ok) {
      const details = await response.text();

      throw new Error(
        `Supabase search failed (${response.status}): ${details}`
      );
    }

    return (await response.json()) as WebResearchResult;
  }
}