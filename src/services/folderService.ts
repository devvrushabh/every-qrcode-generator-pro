import { supabase } from '../lib/supabase';
import { Database } from '../types/database.types';

export type Folder = Database['public']['Tables']['folders']['Row'];

export const folderService = {
  async getUserFolders(userId: string): Promise<Folder[]> {
    try {
      const { data, error } = await supabase
        .from('folders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching folders:', error);
        return [];
      }
      return data || [];
    } catch (err) {
      console.error('Folder fetch exception:', err);
      return [];
    }
  },

  async createFolder(userId: string, name: string): Promise<Folder | null> {
    try {
      const { data, error } = await supabase
        .from('folders')
        .insert({
          user_id: userId,
          name: name.trim(),
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating folder:', error);
        return null;
      }
      return data;
    } catch (err) {
      console.error('Folder create exception:', err);
      return null;
    }
  },

  async renameFolder(folderId: string, name: string): Promise<Folder | null> {
    try {
      const { data, error } = await supabase
        .from('folders')
        .update({
          name: name.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', folderId)
        .select()
        .single();

      if (error) {
        console.error('Error renaming folder:', error);
        return null;
      }
      return data;
    } catch (err) {
      console.error('Folder rename exception:', err);
      return null;
    }
  },

  async deleteFolder(folderId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('folders')
        .delete()
        .eq('id', folderId);

      if (error) {
        console.error('Error deleting folder:', error);
        return false;
      }
      return true;
    } catch (err) {
      console.error('Folder delete exception:', err);
      return false;
    }
  },
};
