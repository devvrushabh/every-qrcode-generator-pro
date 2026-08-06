import React, { useState } from 'react';
import { QRCustomization } from '../../types/qr';
import { getQRCodeBlob } from '../../lib/qr-generator';
import { Button } from '../ui/Button';
import {
  Share2,
  X,
  Copy,
  Check,
  Send,
  MessageSquare,
  Twitter,
  Facebook,
  Linkedin,
  Mail,
  ExternalLink,
  Smartphone,
} from 'lucide-react';

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  payloadText: string;
  customization: QRCustomization;
  qrName?: string;
}

export const SocialShareModal: React.FC<SocialShareModalProps> = ({
  isOpen,
  onClose,
  payloadText,
  customization,
  qrName = 'qrcraft-code',
}) => {
  const [copied, setCopied] = useState(false);
  const [isSharingNative, setIsSharingNative] = useState(false);

  if (!isOpen) return null;

  const shareTitle = `QR Code: ${qrName}`;
  const shareText = `Check out this QR Code generated with Every QRCode Generator Pro: ${payloadText}`;
  const shareUrl = payloadText.startsWith('http') ? payloadText : window.location.href;

  const handleCopyPayload = async () => {
    try {
      await navigator.clipboard.writeText(payloadText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy payload text:', err);
    }
  };

  const handleNativeShare = async () => {
    setIsSharingNative(true);
    try {
      const blob = await getQRCodeBlob(payloadText, customization, 1024);
      const filename = `${qrName.replace(/\s+/g, '-')}-qrcode.png`;

      if (blob && navigator.canShare) {
        const file = new File([blob], filename, { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: shareTitle,
            text: shareText,
            files: [file],
          });
          setIsSharingNative(false);
          return;
        }
      }

      if (navigator.share) {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } else {
        handleCopyPayload();
      }
    } catch (err) {
      // AbortError occurs if user cancels system share dialog
      if ((err as Error).name !== 'AbortError') {
        console.error('Native share error:', err);
      }
    } finally {
      setIsSharingNative(false);
    }
  };

  const socialLinks = [
    {
      name: 'WhatsApp',
      icon: <MessageSquare className="w-5 h-5 text-emerald-500" />,
      bgColor: 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400',
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`,
    },
    {
      name: 'Twitter / X',
      icon: <Twitter className="w-5 h-5 text-sky-500" />,
      bgColor: 'bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 dark:text-sky-400',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
    },
    {
      name: 'Facebook',
      icon: <Facebook className="w-5 h-5 text-blue-600" />,
      bgColor: 'bg-blue-600/10 hover:bg-blue-600/20 text-blue-700 dark:text-blue-400',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: 'LinkedIn',
      icon: <Linkedin className="w-5 h-5 text-indigo-600" />,
      bgColor: 'bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-700 dark:text-indigo-400',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: 'Telegram',
      icon: <Send className="w-5 h-5 text-cyan-500" />,
      bgColor: 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400',
      href: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
    },
    {
      name: 'Email',
      icon: <Mail className="w-5 h-5 text-amber-500" />,
      bgColor: 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400',
      href: `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareText)}`,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#6451F8]/10 text-[#6451F8] flex items-center justify-center font-bold">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                Share QR Code
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Share QR code image or payload across apps
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Native Mobile Share Sheet Button */}
        <div className="space-y-2">
          <Button
            variant="gradient"
            size="lg"
            className="w-full font-bold shadow-md shadow-[#6451F8]/20 flex items-center justify-center gap-2 text-white"
            leftIcon={isSharingNative ? <Share2 className="w-5 h-5 animate-spin" /> : <Smartphone className="w-5 h-5" />}
            isLoading={isSharingNative}
            onClick={handleNativeShare}
          >
            Open System Share Sheet
          </Button>
          <p className="text-[11px] text-center text-slate-400">
            Share image directly via WhatsApp, Instagram, Telegram, Drive & more
          </p>
        </div>

        {/* Direct Social Share Platform Grid */}
        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Direct Social Share
          </span>
          <div className="grid grid-cols-3 gap-2.5">
            {socialLinks.map((platform) => (
              <a
                key={platform.name}
                href={platform.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border border-transparent transition-all hover:scale-105 active:scale-95 ${platform.bgColor}`}
              >
                {platform.icon}
                <span className="text-[11px] font-bold mt-1.5 truncate max-w-full">
                  {platform.name}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Copy Link / Payload Section */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300 block">
            QR Data Payload / URL
          </span>
          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <input
              type="text"
              readOnly
              value={payloadText}
              className="flex-1 bg-transparent text-xs font-mono text-slate-700 dark:text-slate-300 outline-none truncate"
            />
            <Button
              variant={copied ? 'gradient' : 'outline'}
              size="sm"
              onClick={handleCopyPayload}
              leftIcon={copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            >
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
