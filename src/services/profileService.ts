import { supabase } from '../lib/supabase';
import { Database } from '../types/database.types';

export type Profile = Database['public']['Tables']['profiles']['Row'];

export const profileService = {
  async getProfile(userId: string): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Profile does not exist yet, attempt to create it
          return await this.createProfile(userId);
        }
        console.error('Error fetching profile:', error);
        return null;
      }
      return data;
    } catch (err) {
      console.error('Profile fetch exception:', err);
      return null;
    }
  },

  async createProfile(userId: string, fullName?: string, avatarUrl?: string): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          user_id: userId,
          full_name: fullName || '',
          avatar_url: avatarUrl || '',
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating profile:', error);
        return null;
      }
      return data;
    } catch (err) {
      console.error('Profile creation exception:', err);
      return null;
    }
  },

  async updateProfile(userId: string, updates: { full_name?: string; avatar_url?: string }): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        return null;
      }
      return data;
    } catch (err) {
      console.error('Profile update exception:', err);
      return null;
    }
  },

  async uploadAvatar(userId: string, file: File): Promise<string | null> {
    try {
      if (file.size > 2 * 1024 * 1024) {
        throw new Error('Avatar file size must be less than 2MB.');
      }
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Avatar image format must be PNG, JPG, or WEBP.');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error('Error uploading avatar:', uploadError);
        return null;
      }

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (err: any) {
      console.error('Avatar upload exception:', err);
      return null;
    }
  },
};
