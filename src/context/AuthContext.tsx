import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { authService, AuthResponse } from '../services/authService';
import { profileService, Profile } from '../services/profileService';
import { isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  isAuthenticated: boolean;
  isConfigured: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<AuthResponse>;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signInWithGoogle: () => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
  updatePassword: (newPassword: string) => Promise<{ error?: string }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUserProfile = async (userId: string) => {
    try {
      const p = await profileService.getProfile(userId);
      setProfile(p);
    } catch (err) {
      console.warn('Failed to fetch user profile:', err);
    }
  };

  useEffect(() => {
    let isMounted = true;
    let authSubscription: { unsubscribe: () => void } | null = null;

    // Safely attempt session restoration with error isolation
    authService
      .getSession()
      .then(async (initialSession) => {
        if (!isMounted) return;
        setSession(initialSession);
        setUser(initialSession?.user || null);

        if (initialSession?.user) {
          await fetchUserProfile(initialSession.user.id);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.warn('Supabase auth session notice:', err);
        if (isMounted) setLoading(false);
      });

    // Subscribe to auth state changes
    try {
      const { data: authListener } = authService.onAuthStateChange(async (_event, newSession) => {
        if (!isMounted) return;
        setSession(newSession);
        setUser(newSession?.user || null);

        if (newSession?.user) {
          await fetchUserProfile(newSession.user.id);
        } else {
          setProfile(null);
        }
        setLoading(false);
      });
      authSubscription = authListener.subscription;
    } catch (err) {
      console.warn('Auth state change listener notice:', err);
      if (isMounted) setLoading(false);
    }

    return () => {
      isMounted = false;
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    setLoading(true);
    const res = await authService.signUp(email, password, fullName);
    if (res.user) {
      setUser(res.user);
      setSession(res.session);
      await fetchUserProfile(res.user.id);
    }
    setLoading(false);
    return res;
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const res = await authService.signIn(email, password);
    if (res.user) {
      setUser(res.user);
      setSession(res.session);
      await fetchUserProfile(res.user.id);
    }
    setLoading(false);
    return res;
  };

  const signInWithGoogle = async () => {
    return await authService.signInWithGoogle();
  };

  const signOut = async () => {
    setLoading(true);
    await authService.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setLoading(false);
  };

  const resetPassword = async (email: string) => {
    return await authService.resetPassword(email);
  };

  const updatePassword = async (newPassword: string) => {
    return await authService.updatePassword(newPassword);
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchUserProfile(user.id);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        isAuthenticated: Boolean(user),
        isConfigured: isSupabaseConfigured,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        resetPassword,
        updatePassword,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
