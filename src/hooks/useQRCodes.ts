import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { qrService, QRCodeRow, CreateQRCodeInput } from '../services/qrService';

export type SortOption = 'newest' | 'oldest' | 'name_asc' | 'name_desc';

export function useQRCodes() {
  const { user } = useAuth();
  const [qrCodes, setQRCodes] = useState<QRCodeRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedMode, setSelectedMode] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedFolderId, setSelectedFolderId] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  const fetchQRCodes = useCallback(async () => {
    if (!user) {
      setQRCodes([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await qrService.getUserQRCodes(user.id);
      setQRCodes(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch QR codes');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchQRCodes();
  }, [fetchQRCodes]);

  const filteredQRCodes = useMemo(() => {
    return qrCodes
      .filter((qr) => {
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = qr.name.toLowerCase().includes(q);
          const matchPayload = qr.payload.toLowerCase().includes(q);
          if (!matchName && !matchPayload) return false;
        }
        // Type filter
        if (selectedType !== 'all' && qr.type !== selectedType) return false;
        // Mode filter
        if (selectedMode !== 'all' && qr.mode !== selectedMode) return false;
        // Status filter
        if (selectedStatus !== 'all' && qr.status !== selectedStatus) return false;
        // Folder filter
        if (selectedFolderId !== 'all') {
          if (selectedFolderId === 'none' && qr.folder_id !== null) return false;
          if (selectedFolderId !== 'none' && qr.folder_id !== selectedFolderId) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        if (sortBy === 'oldest') {
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        }
        if (sortBy === 'name_asc') {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === 'name_desc') {
          return b.name.localeCompare(a.name);
        }
        return 0;
      });
  }, [qrCodes, searchQuery, selectedType, selectedMode, selectedStatus, selectedFolderId, sortBy]);

  const createQRCode = async (input: CreateQRCodeInput) => {
    if (!user) return null;
    const newQR = await qrService.createQRCode(user.id, input);
    if (newQR) {
      setQRCodes((prev) => [newQR, ...prev]);
    }
    return newQR;
  };

  const updateQRCode = async (qrId: string, updates: Partial<CreateQRCodeInput>) => {
    const updated = await qrService.updateQRCode(qrId, updates);
    if (updated) {
      setQRCodes((prev) => prev.map((q) => (q.id === qrId ? updated : q)));
    }
    return updated;
  };

  const deleteQRCode = async (qrId: string) => {
    const success = await qrService.deleteQRCode(qrId);
    if (success) {
      setQRCodes((prev) => prev.filter((q) => q.id !== qrId));
    }
    return success;
  };

  const duplicateQRCode = async (qrId: string) => {
    const duplicated = await qrService.duplicateQRCode(qrId);
    if (duplicated) {
      setQRCodes((prev) => [duplicated, ...prev]);
    }
    return duplicated;
  };

  return {
    qrCodes: filteredQRCodes,
    allQRCodes: qrCodes,
    loading,
    error,
    refreshQRCodes: fetchQRCodes,
    searchQuery,
    setSearchQuery,
    selectedType,
    setSelectedType,
    selectedMode,
    setSelectedMode,
    selectedStatus,
    setSelectedStatus,
    selectedFolderId,
    setSelectedFolderId,
    sortBy,
    setSortBy,
    createQRCode,
    updateQRCode,
    deleteQRCode,
    duplicateQRCode,
  };
}
