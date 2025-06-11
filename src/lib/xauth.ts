// PKCE utilities and X OAuth2 login helpers

// Generate a random string for code_verifier
export function generateCodeVerifier(length = 128) {
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '').substring(0, length);
}

// Generate a code_challenge from code_verifier (SHA256, base64url)
export async function generateCodeChallenge(codeVerifier: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  const base64 = btoa(String.fromCharCode(...new Uint8Array(digest)));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Build the X OAuth2 authorization URL
export async function getXAuthUrl() {
  const X_CLIENT_ID = 'eFI1UkZmMXgzUzEzNzhrOGVwYV86MTpjaQ';
  const X_REDIRECT_URI = 'http://localhost:5173';
  const X_SCOPE = 'tweet.read users.read follows.read offline.access';
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  sessionStorage.setItem('x_code_verifier', codeVerifier);
  const url = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${X_CLIENT_ID}&redirect_uri=${encodeURIComponent(X_REDIRECT_URI)}&scope=${encodeURIComponent(X_SCOPE)}&state=state&code_challenge=${codeChallenge}&code_challenge_method=S256`;
  return url;
} 