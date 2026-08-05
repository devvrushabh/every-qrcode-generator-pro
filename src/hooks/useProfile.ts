import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { profileService, Profile } from '../services/profileService';

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await profileService.getProfile(user.id);
      setProfile(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (updates: { full_name?: string; avatar_url?: string }) => {
    if (!user) return null;
    setError(null);
    const updated = await profileService.updateProfile(user.id, updates);
    if (updated) setProfile(updated);
    return updated;
  };

  const uploadAvatar = async (file: File) => {
    if (!user) return null;
    setError(null);
    const avatarUrl = await profileService.uploadAvatar(user.id, file);
    if (avatarUrl) {
      return await updateProfile({ avatar_url: avatarUrl });
    }
    return null;
  };

  return {
    profile,
    loading,
    error,
    refreshProfile: fetchProfile,
    updateProfile,
    uploadAvatar,
  };
}
