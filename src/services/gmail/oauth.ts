import { OAUTH_SCOPE } from './types';

/**
 * Get the OAuth URL for authentication
 */
export function getAuthUrl(
  clientId: string,
  redirectUri: string,
  state?: string
): string {
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: OAUTH_SCOPE,
    access_type: 'offline',
    prompt: 'consent',
  });

  if (state) {
    params.append('state', state);
  }

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

type TokenResponse = {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
};

async function requestTokens(
  body: Record<string, string>,
  failure: string
): Promise<TokenResponse> {
  const response = await fetch('/api/auth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`${failure}: ${error}`);
  }

  return response.json();
}

export function exchangeCodeForToken(
  code: string,
  redirectUri: string
): Promise<TokenResponse> {
  return requestTokens(
    { grant_type: 'authorization_code', code, redirect_uri: redirectUri },
    'Token exchange failed'
  );
}

export function refreshToken(refreshToken: string): Promise<TokenResponse> {
  return requestTokens(
    { grant_type: 'refresh_token', refresh_token: refreshToken },
    'Token refresh failed'
  );
}
