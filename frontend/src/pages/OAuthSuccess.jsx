import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function OAuthSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const userId = params.get('userId');
    const name = params.get('name');
    const email = params.get('email');

    if (token && userId && name && email) {
      login({
        token,
        userId: parseInt(userId),
        name,
        email
      });
      navigate('/dashboard');
    } else {
      console.error('Missing OAuth callback parameters');
      navigate('/login?error=oauth_failed');
    }
  }, [location, login, navigate]);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-teal-200">Completing sign in...</p>
      </div>
    </div>
  );
}
