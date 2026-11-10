const TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';

function field(body: Record<string, unknown>, key: string): string | null {
  const value = body[key];
  return typeof value === 'string' && value.length > 0 ? value : null;
}

export async function POST(req: Request) {
  const clientId = process.env.NEXT_PUBLIC_GMAIL_CLIENT_ID;
  const clientSecret = process.env.GMAIL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return Response.json({ error: 'OAuth is not configured' }, { status: 500 });
  }

  let body: Record<string, unknown>;
  try {
    const parsed = await req.json();
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      throw new Error('Invalid body');
    }
    body = parsed;
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const grantType = field(body, 'grant_type');
  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
  });

  if (grantType === 'authorization_code') {
    const code = field(body, 'code');
    const redirectUri = field(body, 'redirect_uri');
    if (!code || !redirectUri) {
      return Response.json(
        { error: 'code and redirect_uri are required' },
        { status: 400 }
      );
    }
    params.set('grant_type', grantType);
    params.set('code', code);
    params.set('redirect_uri', redirectUri);
  } else if (grantType === 'refresh_token') {
    const refreshToken = field(body, 'refresh_token');
    if (!refreshToken) {
      return Response.json(
        { error: 'refresh_token is required' },
        { status: 400 }
      );
    }
    params.set('grant_type', grantType);
    params.set('refresh_token', refreshToken);
  } else {
    return Response.json({ error: 'Unsupported grant_type' }, { status: 400 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });
  } catch {
    return Response.json({ error: 'Token endpoint unreachable' }, { status: 502 });
  }

  const data = await upstream.json().catch(() => null);

  if (!upstream.ok) {
    return Response.json(
      {
        error: data?.error ?? 'token_request_failed',
        error_description: data?.error_description,
      },
      { status: upstream.status }
    );
  }

  return Response.json(data, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
