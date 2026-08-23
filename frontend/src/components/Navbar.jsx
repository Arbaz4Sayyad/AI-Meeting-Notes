import React from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { 
  Plus, 
  Upload, 
  Layers, 
  BarChart2, 
  List, 
  LogOut, 
  Sun, 
  Moon,
  Github
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Button from './ui/Button';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/meetings', label: 'Meetings' },
    { to: '/create-meeting', label: 'Create' },
    { to: '/upload-audio', label: 'Upload' },
    { to: '/templates', label: 'Templates' },
    { to: '/analytics', label: 'Analytics' },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white dark:bg-[#0e111a] border-b border-slate-200 dark:border-[#1e2436]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-bold text-xs">
              M
            </div>
            <span className="font-semibold text-sm tracking-tight text-slate-900 dark:text-white">
              Meeting AI
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 dark:hover:text-white"
            title={isDarkMode ? "Light mode" : "Dark mode"}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          
          <a
            href="https://github.com/Arbaz4Sayyad/AI-Meeting-Notes"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 dark:hover:text-white"
          >
            <Github className="w-4 h-4" />
          </a>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-1" />

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
