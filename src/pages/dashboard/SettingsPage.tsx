import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useProfile } from '../../hooks/useProfile';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import { User, Mail, Lock, Camera, Check, AlertCircle, Sun } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, updatePassword } = useAuth();
  const { profile, loading, updateProfile, uploadAvatar } = useProfile();

  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [isSavingName, setIsSavingName] = useState(false);
  const [nameSavedSuccess, setNameSavedSuccess] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Sync profile data when loaded
  React.useEffect(() => {
    if (profile?.full_name) {
      setFullName(profile.full_name);
    }
  }, [profile]);

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingName(true);
    try {
      await updateProfile({ full_name: fullName });
      setNameSavedSuccess(true);
      setTimeout(() => setNameSavedSuccess(false), 2500);
    } finally {
      setIsSavingName(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingAvatar(true);
    try {
      await uploadAvatar(file);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const res = await updatePassword(newPassword);
      if (res.error) {
        setPasswordError(res.error);
      } else {
        setPasswordSuccess(true);
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setPasswordSuccess(false), 3000);
      }
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Account Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
          Manage your personal profile details, avatar, and security preferences.
        </p>
      </div>

      {/* Profile Section */}
      <Card className="p-6 space-y-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
          <User className="w-5 h-5 text-[#6451F8]" /> Personal Profile
        </h3>

        {/* Avatar Uploader */}
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative group">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="Avatar"
                className="w-20 h-20 rounded-full object-cover border-2 border-[#6451F8] shadow-md"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-[#6451F8]/10 text-[#6451F8] border-2 border-[#6451F8]/30 flex items-center justify-center font-extrabold text-2xl">
                {(fullName || user?.email || 'U')[0].toUpperCase()}
              </div>
            )}
            <label className="absolute bottom-0 right-0 p-1.5 rounded-full bg-[#6451F8] text-white cursor-pointer shadow-lg hover:scale-110 transition-transform">
              <Camera className="w-4 h-4" />
              <input
                type="file"
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
                onChange={handleAvatarChange}
                disabled={isUploadingAvatar}
              />
            </label>
          </div>

          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-bold text-slate-900 dark:text-white text-base">Profile Photo</h4>
            <p className="text-xs text-slate-500">
              Allowed formats: PNG, JPG, or WEBP (Max size: 2MB).
            </p>
            {isUploadingAvatar && <p className="text-xs text-[#6451F8] font-bold animate-pulse">Uploading to Supabase Storage...</p>}
          </div>
        </div>

        {/* Profile Name Form */}
        <form onSubmit={handleUpdateName} className="space-y-4 pt-2">
          <Input
            label="Full Name"
            leftIcon={<User className="w-4 h-4" />}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <Input
            label="Email Address (Read-only)"
            type="email"
            leftIcon={<Mail className="w-4 h-4" />}
            value={user?.email || ''}
            disabled
            className="bg-slate-100 dark:bg-slate-800 opacity-80 cursor-not-allowed"
          />

          <div className="flex justify-end pt-2">
            <Button
              variant="gradient"
              type="submit"
              isLoading={isSavingName}
              leftIcon={nameSavedSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : undefined}
            >
              {nameSavedSuccess ? 'Saved successfully' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Appearance & Theme Section */}
      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
          <Sun className="w-5 h-5 text-[#6451F8]" /> Appearance & Theme
        </h3>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Application Theme</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Choose between Light Mode, Dark Mode, or match your device System settings.
            </p>
          </div>
          <ThemeToggle showLabels />
        </div>
      </Card>

      {/* Security Section */}
      <Card className="p-6 space-y-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
          <Lock className="w-5 h-5 text-[#6451F8]" /> Password & Security
        </h3>

        {passwordError && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{passwordError}</span>
          </div>
        )}

        {passwordSuccess && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>Your password has been updated successfully.</span>
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <Input
            label="New Password"
            type="password"
            placeholder="Minimum 8 characters"
            leftIcon={<Lock className="w-4 h-4" />}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <Input
            label="Confirm New Password"
            type="password"
            placeholder="Re-enter new password"
            leftIcon={<Lock className="w-4 h-4" />}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <div className="flex justify-end pt-2">
            <Button
              variant="outline"
              type="submit"
              isLoading={isUpdatingPassword}
            >
              Update Password
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
