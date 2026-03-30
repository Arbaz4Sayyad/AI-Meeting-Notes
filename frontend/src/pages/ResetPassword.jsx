import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { authApi } from '../api/client';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing password reset token.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await authApi.resetPassword({ 
        token, 
        newPassword: password 
      });
      
      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login', { state: { message: 'Password reset successful. You can now login.' } });
        }, 3000);
      } else {
        setError(data.message || 'Reset failed. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. The link may have expired.');
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
          <h2 className="text-xl font-semibold text-white mb-2">Reset Password</h2>
          
          {success ? (
            <div className="space-y-4">
              <div className="bg-teal-500/20 text-teal-200 px-4 py-3 rounded-lg text-sm">
                Password reset successful! Redirecting to login...
              </div>
              <p className="text-teal-100 text-sm text-center">
                Click <Link to="/login" className="text-teal-400 hover:text-teal-300 underline">here</Link> if you are not redirected.
              </p>
            </div>
          ) : (
            <>
              <p className="text-teal-100 text-sm mb-6">Choose a new, secure password for your account.</p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-500/20 text-red-200 px-4 py-3 rounded-lg text-sm">{error}</div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-teal-100 mb-1">New Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-12 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-teal-200 hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-teal-100 mb-1">Confirm New Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loading || !token}
                  className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-500 text-white font-medium rounded-lg transition disabled:opacity-50"
                >
                  {loading ? 'Updating password...' : 'Update Password'}
                </button>
              </form>
            </>
          )}

          {!success && (
            <div className="mt-8 text-center text-sm">
              <Link to="/login" className="text-teal-400 hover:text-teal-300 font-medium">
                Back to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
