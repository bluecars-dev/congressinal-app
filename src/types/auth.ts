export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
  givenName?: string;
  familyName?: string;
}

export interface GoogleAuthToken {
  accessToken: string;
  expiresAt: number; // Unix timestamp ms
  scope: string;
  tokenType: string;
}

export type AuthStatus = 'loading' | 'unauthenticated' | 'authenticating' | 'authorized' | 'error';

export interface AuthContextType {
  status: AuthStatus;
  user: GoogleUser | null;
  token: GoogleAuthToken | null;
  error: string | null;
  isDemoMode: boolean;
  login: () => void;
  logout: () => void;
  enterDemoMode: () => void;
  revokeAccess: () => Promise<void>;
}
