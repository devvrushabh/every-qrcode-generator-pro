import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { folderService, Folder } from '../services/folderService';

export function useFolders() {
  const { user } = useAuth();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFolders = useCallback(async () => {
    if (!user) {
      setFolders([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await folderService.getUserFolders(user.id);
      setFolders(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch folders');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  const createFolder = async (name: string) => {
    if (!user) return null;
    const newFolder = await folderService.createFolder(user.id, name);
    if (newFolder) {
      setFolders((prev) => [newFolder, ...prev]);
    }
    return newFolder;
  };

  const renameFolder = async (folderId: string, name: string) => {
    const updated = await folderService.renameFolder(folderId, name);
    if (updated) {
      setFolders((prev) => prev.map((f) => (f.id === folderId ? updated : f)));
    }
    return updated;
  };

  const deleteFolder = async (folderId: string) => {
    const success = await folderService.deleteFolder(folderId);
    if (success) {
      setFolders((prev) => prev.filter((f) => f.id !== folderId));
    }
    return success;
  };

  return {
    folders,
    loading,
    error,
    refreshFolders: fetchFolders,
    createFolder,
    renameFolder,
    deleteFolder,
  };
}
