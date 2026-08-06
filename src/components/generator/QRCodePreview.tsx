import React, { useEffect, useRef, useState } from 'react';
import { QRCustomization, QRModeType } from '../../types/qr';
import { createQRCodeInstance, downloadQRCode } from '../../lib/qr-generator';
import { SafetyWarningBanner } from './SafetyWarningBanner';
import { SocialShareModal } from './SocialShareModal';
import { Button } from '../ui/Button';
import { Download, Sparkles, Zap, Shield, Check, FileDown, Layers, Share2 } from 'lucide-react';
import { clsx } from 'clsx';

interface QRCodePreviewProps {
  payloadText: string;
  customization: QRCustomization;
  mode: QRModeType;
  onModeChange: (mode: QRModeType) => void;
  qrName?: string;
  onSave?: () => void;
}

export const QRCodePreview: React.FC<QRCodePreviewProps> = ({
  payloadText,
  customization,
  mode,
  onModeChange,
  qrName = 'qrcraft-code',
  onSave,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [downloadSize, setDownloadSize] = useState<number>(1024);
  const [downloadFormat, setDownloadFormat] = useState<'png' | 'svg'>('png');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';

    const qrInstance = createQRCodeInstance(payloadText, customization, 260);
    qrInstance.append(containerRef.current);
  }, [payloadText, customization]);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadQRCode(payloadText, customization, downloadFormat, downloadSize, qrName.replace(/\s+/g, '-'));
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (error) {
      console.error('Download error:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-6 sticky top-24">
      {/* Header & Mode Switcher */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-[#6451F8]" /> Live QR Preview
          </h3>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Sync
          </span>
        </div>

        {/* QR Mode selector (Static vs Dynamic) */}
        <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => onModeChange('static')}
            className={clsx(
              'px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5',
              mode === 'static'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            )}
          >
            <Shield className="w-3.5 h-3.5" /> Static QR
          </button>
          <button
            type="button"
            onClick={() => onModeChange('dynamic')}
            className={clsx(
              'px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5',
              mode === 'dynamic'
                ? 'bg-[#6451F8] text-white shadow-sm font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            )}
          >
            <Layers className="w-3.5 h-3.5" /> Dynamic QR (Tracked)
          </button>
        </div>
      </div>

      {/* Live Canvas Viewport */}
      <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
        <div
          ref={containerRef}
          className="p-3 bg-white rounded-2xl shadow-md border border-slate-100 flex items-center justify-center transition-all duration-300"
        />
        <p className="mt-3 text-[11px] text-slate-400 font-mono tracking-tight text-center truncate max-w-xs">
          {payloadText}
        </p>
      </div>

      {/* Real-time Safety Warning Banner */}
      <SafetyWarningBanner customization={customization} />

      {/* Download Format & Dimension Controls */}
      <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold uppercase text-slate-500 mb-1">Export Format</label>
            <select
              value={downloadFormat}
              onChange={(e) => setDownloadFormat(e.target.value as 'png' | 'svg')}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 p-2 text-xs bg-white dark:bg-slate-900 font-semibold"
            >
              <option value="png">PNG Raster Image</option>
              <option value="svg">SVG Vector Graphics</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase text-slate-500 mb-1">Resolution Size</label>
            <select
              value={downloadSize}
              onChange={(e) => setDownloadSize(parseInt(e.target.value))}
              disabled={downloadFormat === 'svg'}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 p-2 text-xs bg-white dark:bg-slate-900 font-semibold disabled:opacity-50"
            >
              <option value={512}>512 x 512 px (Standard)</option>
              <option value={1024}>1024 x 1024 px (HD Print)</option>
              <option value={2048}>2048 x 2048 px (4K Ultra)</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <Button
            variant="gradient"
            size="lg"
            className="w-full font-bold shadow-lg shadow-[#6451F8]/25 text-white"
            leftIcon={downloadSuccess ? <Check className="w-5 h-5 text-emerald-300" /> : <FileDown className="w-5 h-5" />}
            isLoading={isDownloading}
            onClick={handleDownload}
          >
            {downloadSuccess ? 'Downloaded!' : `Download ${downloadFormat.toUpperCase()}`}
          </Button>

          {onSave && (
            <Button variant="secondary" size="lg" className="w-full sm:w-auto" onClick={onSave}>
              Save QR
            </Button>
          )}
        </div>

        {/* Social Share Button placed below PNG download button */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <Button
            variant="outline"
            size="lg"
            className="w-full font-bold border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
            leftIcon={<Share2 className="w-5 h-5 text-[#6451F8]" />}
            onClick={() => setIsShareModalOpen(true)}
          >
            Share QR Code
          </Button>
        </div>

        <SocialShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          payloadText={payloadText}
          customization={customization}
          qrName={qrName}
        />
      </div>
    </div>
  );
};

