import { supabase } from '../lib/supabase';
import { AuthChangeEvent, Session, User } from '@supabase/supabase-js';

export interface AuthResponse {
  user: User | null;
  session: Session | null;
  error?: string;
}

export const formatAuthError = (error: any): string => {
  if (!error) return '';
  const msg = typeof error === 'string' ? error : error.message || '';
  
  if (msg.includes('Invalid login credentials')) {
    return 'Email or password is incorrect. Please verify your credentials.';
  }
  if (msg.includes('User already registered') || msg.includes('already exists')) {
    return 'An account with this email address already exists. Please sign in instead.';
  }
  if (msg.includes('Password should be at least')) {
    return 'Password does not meet the required security rules. Minimum 8 characters required.';
  }
  if (msg.includes('Network') || msg.includes('Failed to fetch')) {
    return 'Unable to connect to authentication servers. Please check your internet connection.';
  }
  return msg || 'An unexpected authentication error occurred. Please try again.';
};

export const authService = {
  async signUp(email: string, password: string, fullName: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) return { user: null, session: null, error: formatAuthError(error) };
      return { user: data.user, session: data.session };
    } catch (err: any) {
      return { user: null, session: null, error: formatAuthError(err) };
    }
  },

  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) return { user: null, session: null, error: formatAuthError(error) };
      return { user: data.user, session: data.session };
    } catch (err: any) {
      return { user: null, session: null, error: formatAuthError(err) };
    }
  },

  async signInWithGoogle(): Promise<{ error?: string }> {
    try {
      const redirectTo = `${window.location.origin}/dashboard`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          },
        },
      });
      if (error) return { error: formatAuthError(error) };
      return {};
    } catch (err: any) {
      return { error: formatAuthError(err) };
    }
  },

  async signOut(): Promise<{ error?: string }> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) return { error: formatAuthError(error) };
      return {};
    } catch (err: any) {
      return { error: formatAuthError(err) };
    }
  },

  async resetPassword(email: string): Promise<{ error?: string }> {
    try {
      const redirectTo = `${window.location.origin}/reset-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });
      if (error) return { error: formatAuthError(error) };
      return {};
    } catch (err: any) {
      return { error: formatAuthError(err) };
    }
  },

  async updatePassword(newPassword: string): Promise<{ error?: string }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) return { error: formatAuthError(error) };
      return {};
    } catch (err: any) {
      return { error: formatAuthError(err) };
    }
  },

  async getSession(): Promise<Session | null> {
    const { data } = await supabase.auth.getSession();
    return data.session;
  },

  onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },
};
