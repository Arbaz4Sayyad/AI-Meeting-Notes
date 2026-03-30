import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../api/client';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const { data } = await authApi.forgotPassword({ email });
      if (data.success) {
        setMessage('If an account exists with this email, you will receive a reset link shortly.');
      } else {
        setError(data.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset link. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">Meeting AI</h1>
          <p className="text-teal-200 mt-2">Smart meeting notes with AI</p>
        </div>
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/10">
          <h2 className="text-xl font-semibold text-white mb-2">Forgot Password</h2>
          <p className="text-teal-100 text-sm mb-6">Enter your email and we&apos;ll send you a link to reset your password.</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/20 text-red-200 px-4 py-3 rounded-lg text-sm">{error}</div>
            )}
            {message && (
              <div className="bg-teal-500/20 text-teal-200 px-4 py-3 rounded-lg text-sm">{message}</div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-teal-100 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="you@example.com"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading || message}
              className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-500 text-white font-medium rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Sending link...' : 'Send Reset Link'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm">
            <Link to="/login" className="text-teal-400 hover:text-teal-300 font-medium flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
