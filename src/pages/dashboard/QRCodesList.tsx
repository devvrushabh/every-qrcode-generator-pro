import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQRCodes, SortOption } from '../../hooks/useQRCodes';
import { useFolders } from '../../hooks/useFolders';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ALL_QR_TYPES } from '../../components/generator/QRCodeTypeSelector';
import {
  QrCode,
  Search,
  Filter,
  Plus,
  Copy,
  Trash2,
  Edit,
  Folder,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  ArrowUpDown,
  Layers,
} from 'lucide-react';

export const QRCodesList: React.FC = () => {
  const navigate = useNavigate();
  const {
    qrCodes,
    allQRCodes,
    loading,
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
    deleteQRCode,
    duplicateQRCode,
  } = useQRCodes();

  const { folders } = useFolders();

  // Delete modal state
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      const success = await deleteQRCode(deleteTargetId);
      if (success) {
        showNotification('QR code deleted.');
      }
    } finally {
      setIsDeleting(false);
      setDeleteTargetId(null);
    }
  };

  const handleDuplicate = async (qrId: string) => {
    const duplicated = await duplicateQRCode(qrId);
    if (duplicated) {
      showNotification(`Duplicated as "${duplicated.name}"`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Banner Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900 text-white shadow-2xl border border-slate-800 flex items-center gap-3 text-sm animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            My Saved QR Codes
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Manage, duplicate, edit, and export your saved QR code database records.
          </p>
        </div>

        <Button
          variant="gradient"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => navigate('/dashboard/qr-codes/new')}
        >
          Create QR Code
        </Button>
      </div>

      {/* Filter & Search Toolbar */}
      <Card className="p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Input
              placeholder="Search by name or payload..."
              leftIcon={<Search className="w-4 h-4" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Type Selector */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 p-2.5 text-xs bg-white dark:bg-slate-900 font-semibold"
            >
              <option value="all">All QR Types</option>
              {ALL_QR_TYPES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Folder Selector */}
          <div>
            <select
              value={selectedFolderId}
              onChange={(e) => setSelectedFolderId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 p-2.5 text-xs bg-white dark:bg-slate-900 font-semibold"
            >
              <option value="all">All Folders</option>
              <option value="none">Uncategorized</option>
              {folders.map((f) => (
                <option key={f.id} value={f.id}>
                  📁 {f.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Selector */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 p-2.5 text-xs bg-white dark:bg-slate-900 font-semibold"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="name_asc">Sort: Name (A-Z)</option>
              <option value="name_desc">Sort: Name (Z-A)</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Main QR Code Grid */}
      {loading ? (
        <Card className="p-16 text-center text-slate-400 text-sm animate-pulse">
          Loading saved QR codes from Supabase...
        </Card>
      ) : qrCodes.length === 0 ? (
        <Card className="p-16 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <QrCode className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              {allQRCodes.length === 0 ? 'No QR codes yet.' : 'No QR codes match your search criteria.'}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {allQRCodes.length === 0
                ? 'Create your first QR code and save it here to manage and export anytime.'
                : 'Try adjusting your search keywords or clearing your active type and folder filters.'}
            </p>
          </div>
          {allQRCodes.length === 0 && (
            <Button
              variant="gradient"
              size="md"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => navigate('/dashboard/qr-codes/new')}
            >
              Create QR Code
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {qrCodes.map((qr) => {
            const folderName = folders.find((f) => f.id === qr.folder_id)?.name;
            return (
              <Card key={qr.id} hoverable className="p-5 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full bg-[#6451F8]/10 text-[#6451F8] dark:bg-brand-950 dark:text-brand-300">
                      {qr.type}
                    </span>
                    {folderName && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center gap-1">
                        <Folder className="w-3 h-3 text-indigo-500" /> {folderName}
                      </span>
                    )}
                  </div>

                  {/* Title & Payload */}
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base truncate">{qr.name}</h3>
                    <p className="text-xs text-slate-500 font-mono truncate">{qr.payload}</p>
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center gap-1 pt-1">
                    <Calendar className="w-3.5 h-3.5" /> Created {new Date(qr.created_at).toLocaleDateString()}
                  </div>
                </div>

                {/* Bottom Action Bar */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Edit className="w-3.5 h-3.5" />}
                      onClick={() => navigate(`/dashboard/qr-codes/${qr.id}`)}
                    >
                      Edit
                    </Button>
                    <button
                      onClick={() => handleDuplicate(qr.id)}
                      className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
                      title="Duplicate QR Code"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => setDeleteTargetId(qr.id)}
                    className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Delete QR Code"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <Card className="w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Delete this QR code?</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              This action cannot be undone. The QR configuration and associated settings will be permanently removed.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setDeleteTargetId(null)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                isLoading={isDeleting}
                onClick={handleDeleteConfirm}
              >
                Delete
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
