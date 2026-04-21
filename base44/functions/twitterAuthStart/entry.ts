import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Generate a random string for PKCE code verifier
function generateCodeVerifier() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

// SHA-256 hash for code challenge
async function generateCodeChallenge(verifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(hash)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const CLIENT_ID = Deno.env.get('TWITTER_CLIENT_ID');
    if (!CLIENT_ID) {
      return Response.json({ error: 'Twitter Client ID not configured' }, { status: 500 });
    }
    const REDIRECT_URI = 'https://xpostguardian.pro/oauth-callback';
    const SCOPES = 'tweet.read users.read offline.access';

    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    const state = generateCodeVerifier(); // random state for CSRF protection

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      scope: SCOPES,
      state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    });

    const authUrl = `https://twitter.com/i/oauth2/authorize?${params.toString()}`;

    return Response.json({ authUrl, codeVerifier, state });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});