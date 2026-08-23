import React, { useEffect } from 'react';
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
      navigate('/login');
    }
  }, [location, login, navigate]);

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b0d13] flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-slate-900 dark:border-white border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-500 font-medium">Completing authentication...</p>
      </div>
    </div>
  );
}
