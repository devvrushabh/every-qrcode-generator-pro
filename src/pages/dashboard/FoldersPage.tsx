import React, { useState } from 'react';
import { useFolders } from '../../hooks/useFolders';
import { useQRCodes } from '../../hooks/useQRCodes';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Folder, Plus, Edit2, Trash2, QrCode, Check, X, AlertTriangle } from 'lucide-react';

export const FoldersPage: React.FC = () => {
  const { folders, loading, createFolder, renameFolder, deleteFolder } = useFolders();
  const { allQRCodes } = useQRCodes();

  const [newFolderName, setNewFolderName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    setIsCreating(true);
    try {
      await createFolder(newFolderName);
      setNewFolderName('');
    } finally {
      setIsCreating(false);
    }
  };

  const handleRenameSubmit = async (folderId: string) => {
    if (!editName.trim()) return;
    await renameFolder(folderId, editName);
    setEditingFolderId(null);
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    await deleteFolder(deleteTargetId);
    setDeleteTargetId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Campaign Folders
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Organize your QR codes into marketing campaigns and custom project categories.
          </p>
        </div>
      </div>

      {/* Create Folder Card */}
      <Card className="p-5">
        <form onSubmit={handleCreate} className="flex flex-col sm:flex-row items-end gap-3">
          <div className="flex-1 w-full">
            <Input
              label="New Folder Name"
              placeholder="e.g. Summer Marketing 2026, Office WiFi, Restaurant Menus..."
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              required
            />
          </div>
          <Button
            variant="gradient"
            type="submit"
            isLoading={isCreating}
            leftIcon={<Plus className="w-4 h-4" />}
            className="w-full sm:w-auto"
          >
            Create Folder
          </Button>
        </form>
      </Card>

      {/* Folder Grid */}
      {loading ? (
        <Card className="p-16 text-center text-slate-400 text-sm animate-pulse">
          Loading folders from database...
        </Card>
      ) : folders.length === 0 ? (
        <Card className="p-16 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Folder className="w-8 h-8 text-indigo-500" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">No folders yet.</h3>
            <p className="text-xs text-slate-500">Create your first folder above to organize your QR codes.</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {folders.map((folder) => {
            const assignedQRCount = allQRCodes.filter((q) => q.folder_id === folder.id).length;
            const isEditing = editingFolderId === folder.id;

            return (
              <Card key={folder.id} hoverable className="p-5 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 flex items-center justify-center">
                      <Folder className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                      <QrCode className="w-3.5 h-3.5 text-[#6451F8]" /> {assignedQRCount} QR Codes
                    </span>
                  </div>

                  {isEditing ? (
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-2 text-xs bg-white dark:bg-slate-900"
                        autoFocus
                      />
                      <button
                        onClick={() => handleRenameSubmit(folder.id)}
                        className="p-2 rounded-lg bg-emerald-500 text-white"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingFolderId(null)}
                        className="p-2 rounded-lg bg-slate-200 text-slate-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg truncate">{folder.name}</h3>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      setEditingFolderId(folder.id);
                      setEditName(folder.name);
                    }}
                    className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
                    title="Rename Folder"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTargetId(folder.id)}
                    className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Delete Folder"
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
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Delete folder?</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Deleting this folder will unassign any QR codes inside it. Your QR codes will not be deleted.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setDeleteTargetId(null)}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={handleDelete}>
                Delete Folder
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
