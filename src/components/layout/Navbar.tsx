import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { QrCode, Sun, Moon, Laptop, Menu, X, Sparkles, LayoutDashboard, LogOut, AlertCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { user, profile, isAuthenticated, isConfigured, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isDashboard = location.pathname.startsWith('/dashboard');

  const handleGeneratorClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      navigate('/login');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-slate-950/80 border-b border-slate-200/60 dark:border-slate-800/60 transition-colors">
      {!isConfigured && (
        <div className="bg-amber-500 text-slate-950 px-4 py-1.5 text-center text-xs font-extrabold flex items-center justify-center gap-2 shadow-inner">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>
            Supabase Setup Required: Update <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_PUBLISHABLE_KEY</code> in <code>.env</code> with your project keys.
          </span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6451F8] to-indigo-500 flex items-center justify-center text-white shadow-md shadow-[#6451F8]/20 group-hover:scale-105 transition-transform duration-200">
            <QrCode className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg tracking-tight text-slate-950 dark:text-white flex items-center gap-1.5">
              Every QRCode Generator Pro
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        {!isDashboard && (
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600 dark:text-slate-300">
            <Link
              to={isAuthenticated ? "/generator" : "/login"}
              onClick={handleGeneratorClick}
              className="px-3.5 py-2 rounded-lg hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
            >
              QR Generator
            </Link>
            <Link to="/features" className="px-3.5 py-2 rounded-lg hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
              Features
            </Link>
            <Link to="/pricing" className="px-3.5 py-2 rounded-lg hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
              Pricing
            </Link>
          </nav>
        )}

        {/* Controls & Auth CTA */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Theme Dropdown Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setTheme('light')}
              className={`p-1.5 rounded-lg transition-colors ${theme === 'light' ? 'bg-white dark:bg-slate-800 text-amber-500 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              title="Light Mode"
            >
              <Sun className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`p-1.5 rounded-lg transition-colors ${theme === 'dark' ? 'bg-white dark:bg-slate-800 text-brand-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              title="Dark Mode"
            >
              <Moon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTheme('system')}
              className={`p-1.5 rounded-lg transition-colors ${theme === 'system' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              title="System Theme"
            >
              <Laptop className="w-4 h-4" />
            </button>
          </div>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<LayoutDashboard className="w-4 h-4" />}
                onClick={() => navigate('/dashboard')}
              >
                Dashboard
              </Button>

              {/* User Avatar & Profile Badge */}
              <Link to="/dashboard/settings" className="flex items-center gap-2 group">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name || 'User Avatar'}
                    className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700 group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#6451F8]/10 text-[#6451F8] border border-[#6451F8]/20 flex items-center justify-center font-bold text-xs">
                    {(profile?.full_name || user?.email || 'U')[0].toUpperCase()}
                  </div>
                )}
              </Link>

              <button
                onClick={handleSignOut}
                className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="gradient" size="sm" leftIcon={<Sparkles className="w-4 h-4" />}>
                  Create Account
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Menu Toggle */}
        <div className="flex items-center gap-2 sm:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-2 pb-6 space-y-3">
          <nav className="flex flex-col space-y-2 font-medium text-slate-700 dark:text-slate-200">
            <Link
              to={isAuthenticated ? "/generator" : "/login"}
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900"
            >
              QR Generator
            </Link>
            <Link
              to="/features"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900"
            >
              Features
            </Link>
            <Link
              to="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900"
            >
              Pricing
            </Link>
          </nav>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Button onClick={() => { navigate('/dashboard'); setMobileMenuOpen(false); }}>
                  Go to Dashboard
                </Button>
                <Button variant="outline" onClick={() => { handleSignOut(); setMobileMenuOpen(false); }}>
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="gradient" className="w-full">
                    Create Account
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
