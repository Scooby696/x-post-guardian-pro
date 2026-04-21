import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { code, codeVerifier } = body;

    if (!code || !codeVerifier) {
      return Response.json({ error: 'Missing code or codeVerifier' }, { status: 400 });
    }

    const CLIENT_ID = Deno.env.get('TWITTER_CLIENT_ID');
    const CLIENT_SECRET = Deno.env.get('TWITTER_CLIENT_SECRET');
    const REDIRECT_URI = 'https://xpostguardian.pro/oauth-callback';

    // Exchange code for tokens
    const tokenRes = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
        code_verifier: codeVerifier,
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || !tokenData.access_token) {
      return Response.json({ error: 'Token exchange failed', details: tokenData }, { status: 400 });
    }

    const { access_token, refresh_token, expires_in } = tokenData;

    // Fetch user profile from X
    const profileRes = await fetch('https://api.twitter.com/2/users/me?user.fields=name,username,description,public_metrics,profile_image_url', {
      headers: { 'Authorization': `Bearer ${access_token}` },
    });
    const profileData = await profileRes.json();
    const xUser = profileData.data;

    // Fetch recent tweets
    const tweetsRes = await fetch(`https://api.twitter.com/2/users/${xUser.id}/tweets?max_results=20&tweet.fields=created_at,public_metrics,entities`, {
      headers: { 'Authorization': `Bearer ${access_token}` },
    });
    const tweetsData = await tweetsRes.json();
    const tweets = tweetsData.data || [];

    // Store tokens in user profile (via auth.updateMe)
    await base44.auth.updateMe({
      twitter_access_token: access_token,
      twitter_refresh_token: refresh_token || null,
      twitter_token_expires: expires_in ? new Date(Date.now() + expires_in * 1000).toISOString() : null,
      twitter_user_id: xUser.id,
      twitter_username: xUser.username,
      twitter_name: xUser.name,
      twitter_followers: xUser.public_metrics?.followers_count,
    });

    return Response.json({
      success: true,
      profile: xUser,
      tweets,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});