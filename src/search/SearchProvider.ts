export interface SearchProvider {
  /**
   * Perform a web search using the provided query string.
   * Returns a normalized result from the backend.
   */
  search(query: string): Promise<WebResearchResult>;
}

export type WebResearchResult = {
  title: string;
  url: string;
  domain: string;
  content: string;
  description?: string;
  images?: string[];
};
