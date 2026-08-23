import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban, 
  PlusCircle, 
  UploadCloud, 
  FileCode2, 
  BarChart2, 
  Sparkles,
  LogOut,
  ChevronLeft,
  ChevronRight,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { name: 'All Meetings', to: '/meetings', icon: FolderKanban },
    { name: 'New Meeting', to: '/create-meeting', icon: PlusCircle },
    { name: 'Upload Audio', to: '/upload-audio', icon: UploadCloud },
    { name: 'Templates', to: '/templates', icon: FileCode2 },
    { name: 'Analytics', to: '/analytics', icon: BarChart2 },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-white dark:bg-[#0e111a] border-r border-slate-200 dark:border-[#1e2436] transition-all duration-200 ease-in-out ${
          collapsed ? 'w-16' : 'w-60'
        } ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Workspace Brand / Header */}
        <div className="h-14 flex items-center justify-between px-3.5 border-b border-slate-200 dark:border-[#1e2436]">
          <Link to="/dashboard" className="flex items-center gap-2.5 min-w-0 overflow-hidden">
            <div className="w-7 h-7 rounded-md bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center shrink-0 font-bold text-xs tracking-wider">
              M
            </div>
            {!collapsed && (
              <span className="font-semibold text-sm tracking-tight text-slate-900 dark:text-white truncate">
                Meeting AI
              </span>
            )}
          </Link>

          {/* Desktop collapse toggle */}
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-2.5 py-2 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-100 dark:bg-[#1a1e2d] text-slate-900 dark:text-white font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#141722] hover:text-slate-900 dark:hover:text-slate-200'
                  } ${collapsed ? 'justify-center px-0' : ''}`
                }
                title={collapsed ? item.name : undefined}
              >
                <Icon className="w-4 h-4 shrink-0 text-slate-500 dark:text-slate-400" />
                {!collapsed && <span>{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* User profile & footer */}
        <div className="p-2 border-t border-slate-200 dark:border-[#1e2436] space-y-1">
          <div
            className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md ${
              collapsed ? 'justify-center px-0' : ''
            }`}
          >
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold shrink-0">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-slate-900 dark:text-slate-100 truncate leading-tight">
                  {user?.name || 'User'}
                </p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate leading-tight mt-0.5">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={logout}
            className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-xs font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors ${
              collapsed ? 'justify-center px-0' : ''
            }`}
            title={collapsed ? "Log out" : undefined}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Log out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
