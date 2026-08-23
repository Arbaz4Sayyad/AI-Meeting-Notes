import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu, Sun, Moon, Github, Search, Plus, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import Button from '../ui/Button';

export default function TopHeader({ setMobileOpen, onSearchClick }) {
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();

  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path.startsWith('/meetings/') && path.endsWith('/summary')) return { title: 'Meeting Summary', parent: 'Meetings', parentTo: '/meetings' };
    if (path.startsWith('/meetings/')) return { title: 'Meeting Workspace', parent: 'Meetings', parentTo: '/meetings' };
    if (path === '/dashboard') return { title: 'Dashboard' };
    if (path === '/meetings') return { title: 'Meetings Directory' };
    if (path === '/create-meeting') return { title: 'New Meeting' };
    if (path === '/upload-audio') return { title: 'Audio Transcription' };
    if (path === '/templates') return { title: 'Meeting Templates' };
    if (path === '/analytics') return { title: 'Productivity Analytics' };
    return { title: 'Workspace' };
  };

  const breadcrumb = getBreadcrumb();

  return (
    <header className="h-14 bg-white/90 dark:bg-[#0e111a]/90 backdrop-blur-xs border-b border-slate-200 dark:border-[#1e2436] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        {/* Mobile sidebar toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumb path */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
          {breadcrumb.parent && (
            <>
              <Link to={breadcrumb.parentTo} className="hover:text-slate-900 dark:hover:text-white transition-colors">
                {breadcrumb.parent}
              </Link>
              <span className="text-slate-300 dark:text-slate-600">/</span>
            </>
          )}
          <span className="text-slate-900 dark:text-white font-semibold">{breadcrumb.title}</span>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        {/* Theme toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
          title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* GitHub link */}
        <a
          href="https://github.com/Arbaz4Sayyad/AI-Meeting-Notes"
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
          title="View on GitHub"
        >
          <Github className="w-4 h-4" />
        </a>

        {/* Quick New Meeting Action */}
        <Link to="/create-meeting" className="hidden sm:block">
          <Button size="sm" icon={Plus}>
            New Meeting
          </Button>
        </Link>
      </div>
    </header>
  );
}
