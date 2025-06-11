// Update this page (the content is just a fallback if you fail to update the page)

import { useEffect } from 'react';
import { getXAuthUrl } from '@/lib/xauth';

export default function Index() {
  // On mount, check for OAuth2 code in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    if (code) {
      const codeVerifier = sessionStorage.getItem('x_code_verifier');
      if (codeVerifier) {
        // Call backend to exchange code + code_verifier for token and user info
        fetch(`/api/x/callback?code=${code}&state=${state}&code_verifier=${codeVerifier}`)
          .then(res => res.json())
          .then(data => {
            if (data && data.username) {
              localStorage.setItem('x_user', JSON.stringify(data));
              window.location.replace('/');
            }
          });
      }
    }
  }, []);

  const handleXLogin = async () => {
    const url = await getXAuthUrl();
    window.location.href = url;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-12 text-center">
          <div className="mb-12">
            <h1 className="text-5xl font-bold mb-6 text-gray-900">XTesting</h1>
            <p className="text-xl text-gray-600 leading-relaxed">Predict your tweet engagement before posting</p>
          </div>
          <button
            onClick={handleXLogin}
            className="w-full bg-black hover:bg-gray-800 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 flex items-center justify-center text-lg"
          >
            <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            Continue with X
          </button>
        </div>
      </div>
    </div>
  );
}
