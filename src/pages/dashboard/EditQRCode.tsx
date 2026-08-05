import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { QRCodeData } from '../../types/qr';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, Save, Check, RefreshCw } from 'lucide-react';

export const EditQRCode: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [qr, setQr] = useState<QRCodeData | null>(null);
  const [name, setName] = useState('');
  const [destinationUrl, setDestinationUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function loadQR() {
      if (id) {
        const item = await api.getQRCodeById(id);
        if (item) {
          setQr(item);
          setName(item.name);
          setDestinationUrl(item.destinationUrl || (item.content as any).url || 'https://qrcraft.app');
        }
      }
    }
    loadQR();
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setIsSaving(true);
    try {
      await api.updateQRCode(id, {
        name,
        destinationUrl,
      });
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        navigate('/dashboard/qr-codes');
      }, 1000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!qr) return <div className="p-8 text-center text-sm text-slate-500">Loading QR code details...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button
        onClick={() => navigate('/dashboard/qr-codes')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white"
      >
        <ArrowLeft className="w-4 h-4" /> Back to QR Codes
      </button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Edit Dynamic QR Destination
          </h1>
          <p className="text-xs text-slate-500">
            Short Code: <span className="font-mono text-brand-600 dark:text-brand-400">/r/{qr.shortCode}</span> (The QR image remains unchanged)
          </p>
        </div>
      </div>

      <Card className="p-6 space-y-6">
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="QR Campaign Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label="Dynamic Target Destination URL *"
            placeholder="https://example.com/new-landing-page"
            value={destinationUrl}
            onChange={(e) => setDestinationUrl(e.target.value)}
            helperText="Scanner cameras will be redirected to this updated URL instantly without needing a new printed QR code!"
            required
          />

          <div className="pt-4 flex items-center justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => navigate('/dashboard/qr-codes')}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="gradient"
              isLoading={isSaving}
              leftIcon={savedSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
            >
              {savedSuccess ? 'Changes Saved!' : 'Save Destination'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
