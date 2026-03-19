import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200/50 dark:border-slate-700/50 px-6 py-4 sticky top-0 z-50 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Link 
            to="/dashboard" 
            className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent tracking-tight hover:from-teal-700 hover:to-blue-700 transition-all duration-200"
          >
            Meeting AI
          </Link>
          
          <div className="hidden md:flex items-center">
            <Link
              to="/create-meeting"
              className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg hover:text-white hover:border-transparent hover:bg-gradient-to-r hover:from-teal-500 hover:to-blue-500 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Create Meeting
            </Link>
            <Link
              to="/upload-audio"
              className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg hover:text-white hover:border-transparent hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Upload Audio
            </Link>
            <Link
              to="/templates"
              className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg hover:text-white hover:border-transparent hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-500 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Templates
            </Link>
            <Link
              to="/analytics"
              className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg hover:text-white hover:border-transparent hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-500 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Analytics
            </Link>
            <Link
              to="/meetings"
              className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg hover:text-white hover:border-transparent hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-500 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              All Meetings
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200 transform hover:scale-105"
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{user?.name}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</span>
          </div>
          
          <div className="w-px h-6 bg-slate-300 dark:bg-slate-600"></div>
          
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
}
