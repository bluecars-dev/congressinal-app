import { GoogleAuthToken, GoogleUser } from '../types/auth';

// Google Gemini API OAuth scopes (generative-language.retriever for Gemini API access)
export const GEMINI_OAUTH_SCOPES = [
  'https://www.googleapis.com/auth/generative-language.retriever',
  'openid',
  'profile',
  'email',
].join(' ');

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: GoogleTokenResponse) => void;
            error_callback?: (error: any) => void;
            prompt?: string;
          }) => GoogleTokenClient;
          revoke: (accessToken: string, done?: () => void) => void;
        };
      };
    };
  }
}

export interface GoogleTokenResponse {
  access_token: string;
  expires_in: number; // in seconds
  scope: string;
  token_type: string;
  error?: string;
  error_description?: string;
  error_uri?: string;
}

export interface GoogleTokenClient {
  requestAccessToken: (overrideConfig?: { prompt?: string }) => void;
}

const TOKEN_STORAGE_KEY = 'verify_product_google_token';
const USER_STORAGE_KEY = 'verify_product_google_user';

export class GoogleOAuthService {
  private static tokenClient: GoogleTokenClient | null = null;
  private static clientId: string = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

  public static getClientId(): string {
    return this.clientId;
  }

  public static isConfigured(): boolean {
    return Boolean(this.clientId && this.clientId.trim().length > 0 && !this.clientId.includes('YOUR_CLIENT_ID'));
  }

  public static setClientId(id: string): void {
    this.clientId = id.trim();
    this.tokenClient = null; // Recreate token client with new client ID
  }

  public static async waitForGoogleScript(): Promise<boolean> {
    if (window.google?.accounts?.oauth2) return true;

    for (let i = 0; i < 30; i++) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      if (window.google?.accounts?.oauth2) return true;
    }
    return false;
  }

  public static async initClient(
    onSuccess: (token: GoogleAuthToken, user: GoogleUser) => void,
    onError: (err: string) => void
  ): Promise<boolean> {
    const ready = await this.waitForGoogleScript();
    if (!ready) {
      onError('Google Identity Services SDK failed to load. Please check your internet connection.');
      return false;
    }

    if (!this.isConfigured()) {
      return false;
    }

    try {
      this.tokenClient = window.google!.accounts.oauth2.initTokenClient({
        client_id: this.clientId,
        scope: GEMINI_OAUTH_SCOPES,
        prompt: 'consent',
        callback: async (response: GoogleTokenResponse) => {
          if (response.error) {
            onError(response.error_description || response.error || 'Google authorization failed');
            return;
          }

          const token: GoogleAuthToken = {
            accessToken: response.access_token,
            expiresAt: Date.now() + response.expires_in * 1000,
            scope: response.scope,
            tokenType: response.token_type || 'Bearer',
          };

          this.saveStoredToken(token);

          // Fetch user profile info with the token
          try {
            const user = await this.fetchUserProfile(token.accessToken);
            this.saveStoredUser(user);
            onSuccess(token, user);
          } catch (e) {
            // Even if userinfo fails, token is valid for Gemini
            const fallbackUser: GoogleUser = {
              id: 'google-user-' + Date.now(),
              email: 'authorized.user@google.com',
              name: 'Google User',
            };
            this.saveStoredUser(fallbackUser);
            onSuccess(token, fallbackUser);
          }
        },
        error_callback: (err: any) => {
          onError(err?.message || 'OAuth popup closed or encountered an error.');
        },
      });
      return true;
    } catch (e: any) {
      onError(e.message || 'Failed to initialize Google OAuth client');
      return false;
    }
  }

  public static requestToken(): void {
    if (!this.tokenClient) {
      throw new Error('Google OAuth client not initialized');
    }
    this.tokenClient.requestAccessToken({ prompt: 'consent' });
  }

  public static async fetchUserProfile(accessToken: string): Promise<GoogleUser> {
    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user profile: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      id: data.sub,
      email: data.email,
      name: data.name || data.email,
      picture: data.picture,
      givenName: data.given_name,
      familyName: data.family_name,
    };
  }

  public static saveStoredToken(token: GoogleAuthToken): void {
    sessionStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(token));
  }

  public static getStoredToken(): GoogleAuthToken | null {
    try {
      const raw = sessionStorage.getItem(TOKEN_STORAGE_KEY);
      if (!raw) return null;
      const token = JSON.parse(raw) as GoogleAuthToken;
      if (Date.now() >= token.expiresAt - 60000) {
        // Expired or within 1 minute of expiring
        this.clearStorage();
        return null;
      }
      return token;
    } catch {
      return null;
    }
  }

  public static saveStoredUser(user: GoogleUser): void {
    sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  }

  public static getStoredUser(): GoogleUser | null {
    try {
      const raw = sessionStorage.getItem(USER_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  public static clearStorage(): void {
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    sessionStorage.removeItem(USER_STORAGE_KEY);
  }

  public static async revokeToken(token: string): Promise<void> {
    return new Promise((resolve) => {
      if (window.google?.accounts?.oauth2?.revoke) {
        window.google.accounts.oauth2.revoke(token, () => {
          this.clearStorage();
          resolve();
        });
      } else {
        this.clearStorage();
        resolve();
      }
    });
  }
}
