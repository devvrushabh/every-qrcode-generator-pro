import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProfile } from '../../hooks/useProfile';
import { ThemeToggle } from '../ui/ThemeToggle';
import {
  LayoutDashboard,
  QrCode,
  Folder,
  Settings,
  Sparkles,
  LogOut,
  User as UserIcon,
} from 'lucide-react';

export const DashboardSidebar: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { profile } = useProfile();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navItems = [
    { label: 'Overview', path: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'QR Codes', path: '/dashboard/qr-codes', icon: <QrCode className="w-4 h-4" /> },
    { label: 'Folders', path: '/dashboard/folders', icon: <Folder className="w-4 h-4" /> },
    { label: 'Settings', path: '/dashboard/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-64 shrink-0 hidden md:block py-6 pr-6 border-r border-slate-200 dark:border-slate-800 space-y-6">
      {/* Create New QR CTA Button */}
      <div className="px-2">
        <button
          onClick={() => navigate('/dashboard/qr-codes/new')}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#6451F8] to-indigo-600 hover:from-[#523ee0] hover:to-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-[#6451F8]/20 transition-transform active:scale-[0.98]"
        >
          <Sparkles className="w-4 h-4" /> Create QR Code
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="space-y-1 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/dashboard'}
            className={({ isActive }: { isActive: boolean }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                isActive
                  ? 'bg-[#6451F8] text-white shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white'
              }`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Profile Card Footer */}
      <div className="pt-6 border-t border-slate-200 dark:border-slate-800 px-2 space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Theme</span>
          <ThemeToggle size="sm" />
        </div>

        <div className="flex items-center gap-3 p-2 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt="Avatar"
              className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-[#6451F8]/10 text-[#6451F8] border border-[#6451F8]/20 flex items-center justify-center font-bold text-xs">
              {(profile?.full_name || user?.email || 'U')[0].toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
              {profile?.full_name || user?.email?.split('@')[0] || 'User'}
            </p>
            <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" /> Sign Out
        </button>
      </div>
    </aside>
  );
};
