import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Plus, 
  Upload, 
  Layers, 
  BarChart3, 
  List, 
  LogOut, 
  Sun, 
  Moon,
  ChevronDown
} from 'lucide-react';
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

  const navLinks = [
    { to: '/create-meeting', label: 'Create', icon: Plus, color: 'hover:text-teal-500' },
    { to: '/upload-audio', label: 'Upload', icon: Upload, color: 'hover:text-blue-500' },
    { to: '/templates', label: 'Templates', icon: Layers, color: 'hover:text-purple-500' },
    { to: '/analytics', label: 'Analytics', icon: BarChart3, color: 'hover:text-orange-500' },
    { to: '/meetings', label: 'History', icon: List, color: 'hover:text-teal-500' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 transition-all duration-500">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        <div className="flex items-center gap-10">
          <Link 
            to="/dashboard" 
            className="flex items-center gap-2 group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-teal-500/20 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="text-xl font-black bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent tracking-tighter uppercase">
              Meeting AI
            </span>
          </Link>
          
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-xl text-sm font-bold text-slate-500 dark:text-slate-400 ${link.color} hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-2`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 transition-all shadow-sm"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </motion.button>
          
          <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-2" />
          
          <div className="hidden md:flex flex-col items-end mr-2">
            <span className="text-sm font-black text-slate-800 dark:text-white leading-none mb-1">
              {user?.name}
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
              Pro Member
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-sm font-black shadow-lg shadow-slate-900/10 hover:opacity-90 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Exit</span>
          </motion.button>
        </div>
      </div>
    </nav>
  );
}
