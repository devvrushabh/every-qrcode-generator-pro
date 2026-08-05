import React from 'react';
import {
  Globe,
  FileText,
  Mail,
  Phone,
  MessageSquare,
  Contact,
  Wifi,
  MapPin,
  Share2,
  Layers,
  MessageCircle,
  FileSpreadsheet,
  Image as ImageIcon,
  Video,
  Download,
} from 'lucide-react';
import { QRTypeID } from '../../types/qr';
import { clsx } from 'clsx';

export interface QRTypeConfig {
  id: QRTypeID;
  name: string;
  category: 'MVP' | 'Advanced';
  icon: React.ReactNode;
  description: string;
}

export const ALL_QR_TYPES: QRTypeConfig[] = [
  { id: 'url', name: 'Website / URL', category: 'MVP', icon: <Globe className="w-5 h-5" />, description: 'Link to any website page or UTM campaign' },
  { id: 'text', name: 'Plain Text', category: 'MVP', icon: <FileText className="w-5 h-5" />, description: 'Display plain message, code, or announcement' },
  { id: 'email', name: 'Email', category: 'MVP', icon: <Mail className="w-5 h-5" />, description: 'Pre-fill recipient email, subject & body' },
  { id: 'phone', name: 'Phone Call', category: 'MVP', icon: <Phone className="w-5 h-5" />, description: 'Instant dial phone number when scanned' },
  { id: 'sms', name: 'SMS Message', category: 'MVP', icon: <MessageSquare className="w-5 h-5" />, description: 'Send pre-written SMS to phone number' },
  { id: 'vcard', name: 'vCard Contact', category: 'MVP', icon: <Contact className="w-5 h-5" />, description: 'Save complete business contact details' },
  { id: 'wifi', name: 'Wi-Fi Network', category: 'MVP', icon: <Wifi className="w-5 h-5" />, description: 'Connect automatically to Wi-Fi network' },
  { id: 'location', name: 'Map Location', category: 'MVP', icon: <MapPin className="w-5 h-5" />, description: 'Open GPS coordinates or Google Maps location' },
  { id: 'social', name: 'Social Links', category: 'Advanced', icon: <Share2 className="w-5 h-5" />, description: 'Multi-profile social directory landing page' },
  { id: 'multi_url', name: 'Multi-URL', category: 'Advanced', icon: <Layers className="w-5 h-5" />, description: 'Hosted landing page with dynamic links' },
  { id: 'whatsapp', name: 'WhatsApp', category: 'Advanced', icon: <MessageCircle className="w-5 h-5" />, description: 'Start direct WhatsApp chat with message' },
  { id: 'pdf', name: 'PDF Document', category: 'Advanced', icon: <FileSpreadsheet className="w-5 h-5" />, description: 'Direct viewer link for menus & brochures' },
  { id: 'image', name: 'Image / Gallery', category: 'Advanced', icon: <ImageIcon className="w-5 h-5" />, description: 'Show single image or photo gallery' },
  { id: 'video', name: 'Video Link', category: 'Advanced', icon: <Video className="w-5 h-5" />, description: 'Play YouTube, Vimeo, or MP4 video' },
  { id: 'app_download', name: 'App Download', category: 'Advanced', icon: <Download className="w-5 h-5" />, description: 'Smart redirect to iOS App Store / Google Play' },
];

interface QRCodeTypeSelectorProps {
  selectedType: QRTypeID;
  onSelectType: (typeId: QRTypeID) => void;
}

export const QRCodeTypeSelector: React.FC<QRCodeTypeSelectorProps> = ({ selectedType, onSelectType }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          1. Select QR Content Type
        </h3>
        <span className="text-xs text-slate-400">15 Types Available</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
        {ALL_QR_TYPES.map((t) => {
          const isSelected = selectedType === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onSelectType(t.id)}
              className={clsx(
                'group relative flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition-all duration-200 focus:outline-none',
                isSelected
                  ? 'bg-brand-50 border-brand-500 text-brand-700 dark:bg-brand-950/60 dark:border-brand-500 dark:text-brand-300 shadow-sm shadow-brand-500/10 ring-2 ring-brand-500/20'
                  : 'bg-white border-slate-200/80 hover:border-slate-300 text-slate-700 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:border-slate-700'
              )}
            >
              <div
                className={clsx(
                  'w-9 h-9 rounded-lg flex items-center justify-center mb-2 transition-colors',
                  isSelected
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-slate-200 dark:group-hover:bg-slate-700'
                )}
              >
                {t.icon}
              </div>
              <span className="text-xs font-semibold tracking-tight leading-tight line-clamp-1">{t.name}</span>
              
              {t.category === 'Advanced' && (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500" title="Advanced QR Type" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
