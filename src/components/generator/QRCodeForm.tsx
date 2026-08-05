import React, { useState } from 'react';
import {
  QRTypeID,
  QRPayload,
  URLPayload,
  TextPayload,
  EmailPayload,
  PhonePayload,
  SMSPayload,
  VCardPayload,
  WifiPayload,
  LocationPayload,
  WhatsAppPayload,
  MediaPayload,
  AppDownloadPayload,
  MultiUrlPayload,
  SocialPayload,
} from '../../types/qr';
import { Input } from '../ui/Input';
import { validateQRPayload } from '../../lib/payload-builders';
import { Plus, Trash2, Upload, FileText, FileCheck, Image as ImageIcon, X, Link as LinkIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { api } from '../../lib/api';

interface QRCodeFormProps {
  type: QRTypeID;
  payload: QRPayload;
  onChange: (payload: QRPayload) => void;
}

export const QRCodeForm: React.FC<QRCodeFormProps> = ({ type, payload, onChange }) => {
  const validation = validateQRPayload(type, payload);
  const [isUploading, setIsUploading] = useState(false);
  const [useCustomUrl, setUseCustomUrl] = useState(false);

  const updateField = (field: string, value: any) => {
    onChange({
      ...payload,
      [field]: value,
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fileType: 'pdf' | 'image') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      alert('File size exceeds maximum limit of 20MB.');
      return;
    }

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const fileData = event.target?.result as string;
        const result = await api.uploadFile(file.name, fileData);

        const targetUrl = result.url.startsWith('http') ? result.url : window.location.origin + result.url;
        
        onChange({
          ...payload,
          mediaUrl: targetUrl,
          title: (payload as MediaPayload).title || file.name.replace(/\.[^/.]+$/, ''),
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Failed to upload file:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          2. Enter Content & Details
        </h3>
        {!validation.isValid && (
          <span className="text-xs text-rose-500 font-medium">{validation.error}</span>
        )}
      </div>

      {/* URL Form */}
      {type === 'url' && (
        <div className="space-y-3">
          <Input
            label="Website URL *"
            placeholder="https://example.com/page"
            value={(payload as URLPayload).url || ''}
            onChange={(e) => updateField('url', e.target.value)}
            error={!validation.isValid ? validation.error : undefined}
          />
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <span className="text-xs font-medium text-slate-500">Optional UTM Parameters</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="Campaign Source"
                placeholder="google, newsletter"
                value={(payload as URLPayload).utmSource || ''}
                onChange={(e) => updateField('utmSource', e.target.value)}
              />
              <Input
                label="Campaign Medium"
                placeholder="qr_code, banner"
                value={(payload as URLPayload).utmMedium || ''}
                onChange={(e) => updateField('utmMedium', e.target.value)}
              />
              <Input
                label="Campaign Name"
                placeholder="summer_sale"
                value={(payload as URLPayload).utmCampaign || ''}
                onChange={(e) => updateField('utmCampaign', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Text Form */}
      {type === 'text' && (
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
            Plain Text Content *
          </label>
          <textarea
            rows={4}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 p-3 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="Enter any text message, coupon code, or note here..."
            value={(payload as TextPayload).text || ''}
            onChange={(e) => updateField('text', e.target.value)}
          />
        </div>
      )}

      {/* Email Form */}
      {type === 'email' && (
        <div className="space-y-3">
          <Input
            label="Recipient Email *"
            placeholder="hello@company.com"
            value={(payload as EmailPayload).email || ''}
            onChange={(e) => updateField('email', e.target.value)}
            error={!validation.isValid ? validation.error : undefined}
          />
          <Input
            label="Email Subject"
            placeholder="Inquiry from QR Code"
            value={(payload as EmailPayload).subject || ''}
            onChange={(e) => updateField('subject', e.target.value)}
          />
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
              Default Body Message
            </label>
            <textarea
              rows={3}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 p-3 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="Pre-fill message text for user..."
              value={(payload as EmailPayload).message || ''}
              onChange={(e) => updateField('message', e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Phone Form */}
      {type === 'phone' && (
        <Input
          label="Phone Number *"
          placeholder="+1 (555) 019-2834"
          value={(payload as PhonePayload).phone || ''}
          onChange={(e) => updateField('phone', e.target.value)}
          error={!validation.isValid ? validation.error : undefined}
        />
      )}

      {/* SMS Form */}
      {type === 'sms' && (
        <div className="space-y-3">
          <Input
            label="Recipient Phone Number *"
            placeholder="+1 (555) 019-2834"
            value={(payload as SMSPayload).phone || ''}
            onChange={(e) => updateField('phone', e.target.value)}
            error={!validation.isValid ? validation.error : undefined}
          />
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
              SMS Body Message
            </label>
            <textarea
              rows={3}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 p-3 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="Hi, I am interested in your products..."
              value={(payload as SMSPayload).message || ''}
              onChange={(e) => updateField('message', e.target.value)}
            />
          </div>
        </div>
      )}

      {/* vCard Form */}
      {type === 'vcard' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="First Name"
              placeholder="Alex"
              value={(payload as VCardPayload).firstName || ''}
              onChange={(e) => updateField('firstName', e.target.value)}
            />
            <Input
              label="Last Name"
              placeholder="Rivera"
              value={(payload as VCardPayload).lastName || ''}
              onChange={(e) => updateField('lastName', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Company / Organization"
              placeholder="QRCraft Inc."
              value={(payload as VCardPayload).company || ''}
              onChange={(e) => updateField('company', e.target.value)}
            />
            <Input
              label="Job Title"
              placeholder="VP of Engineering"
              value={(payload as VCardPayload).jobTitle || ''}
              onChange={(e) => updateField('jobTitle', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Phone Number"
              placeholder="+1 (555) 019-2834"
              value={(payload as VCardPayload).phone || ''}
              onChange={(e) => updateField('phone', e.target.value)}
            />
            <Input
              label="Email Address"
              placeholder="alex@company.com"
              value={(payload as VCardPayload).email || ''}
              onChange={(e) => updateField('email', e.target.value)}
            />
          </div>
          <Input
            label="Website"
            placeholder="https://company.com"
            value={(payload as VCardPayload).website || ''}
            onChange={(e) => updateField('website', e.target.value)}
          />
          <Input
            label="Address"
            placeholder="100 Silicon Valley Way, Suite 400, SF"
            value={(payload as VCardPayload).address || ''}
            onChange={(e) => updateField('address', e.target.value)}
          />
        </div>
      )}

      {/* Wi-Fi Form */}
      {type === 'wifi' && (
        <div className="space-y-3">
          <Input
            label="Network Name (SSID) *"
            placeholder="Office_Guest_WiFi"
            value={(payload as WifiPayload).ssid || ''}
            onChange={(e) => updateField('ssid', e.target.value)}
            error={!validation.isValid ? validation.error : undefined}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Network password"
            value={(payload as WifiPayload).password || ''}
            onChange={(e) => updateField('password', e.target.value)}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                Encryption Security
              </label>
              <select
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 p-2.5 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-500"
                value={(payload as WifiPayload).security || 'WPA'}
                onChange={(e) => updateField('security', e.target.value)}
              >
                <option value="WPA">WPA / WPA2</option>
                <option value="WPA3">WPA3</option>
                <option value="WEP">WEP</option>
                <option value="nopass">None (Open Network)</option>
              </select>
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="hidden-wifi"
                checked={(payload as WifiPayload).hidden || false}
                onChange={(e) => updateField('hidden', e.target.checked)}
                className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
              />
              <label htmlFor="hidden-wifi" className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                Hidden SSID Network
              </label>
            </div>
          </div>
        </div>
      )}

      {/* PDF Document Upload Form */}
      {type === 'pdf' && (
        <div className="space-y-4">
          <Input
            label="PDF Document Title"
            placeholder="e.g., Summer Restaurant Menu, Product Brochure 2026"
            value={(payload as MediaPayload).title || ''}
            onChange={(e) => updateField('title', e.target.value)}
          />

          {!useCustomUrl ? (
            <div className="space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Upload PDF File *
              </label>

              {(payload as MediaPayload).mediaUrl ? (
                <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 rounded-lg bg-rose-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      PDF
                    </div>
                    <div className="flex flex-col truncate">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                        {(payload as MediaPayload).title || 'Uploaded Document.pdf'}
                      </span>
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium truncate flex items-center gap-1">
                        <FileCheck className="w-3.5 h-3.5" /> File Hosted & Ready
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateField('mediaUrl', '')}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-950"
                    title="Remove File"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-brand-500 cursor-pointer bg-white dark:bg-slate-900 transition-colors">
                  <Upload className="w-8 h-8 text-brand-500 mb-2 animate-bounce" />
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {isUploading ? 'Uploading PDF Document...' : 'Click to Upload PDF File'}
                  </span>
                  <span className="text-xs text-slate-400 mt-1">Supports PDF documents up to 20MB</span>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => handleFileUpload(e, 'pdf')}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
              )}

              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setUseCustomUrl(true)}
                  className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 ml-auto"
                >
                  <LinkIcon className="w-3.5 h-3.5" /> Or enter direct PDF web URL instead
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Input
                label="Direct PDF Web URL *"
                placeholder="https://example.com/document.pdf"
                value={(payload as MediaPayload).mediaUrl || ''}
                onChange={(e) => updateField('mediaUrl', e.target.value)}
              />
              <button
                type="button"
                onClick={() => setUseCustomUrl(false)}
                className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
              >
                <Upload className="w-3.5 h-3.5" /> Switch back to File Upload
              </button>
            </div>
          )}
        </div>
      )}

      {/* Image / Gallery Upload Form */}
      {type === 'image' && (
        <div className="space-y-4">
          <Input
            label="Image / Gallery Title"
            placeholder="e.g., Summer Event Poster, Product Showcase"
            value={(payload as MediaPayload).title || ''}
            onChange={(e) => updateField('title', e.target.value)}
          />

          {!useCustomUrl ? (
            <div className="space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Upload Image File *
              </label>

              {(payload as MediaPayload).mediaUrl ? (
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-14 h-14 rounded-lg bg-slate-200 dark:bg-slate-700 border overflow-hidden flex items-center justify-center shrink-0">
                      <img
                        src={(payload as MediaPayload).mediaUrl}
                        alt="Uploaded Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col truncate">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                        {(payload as MediaPayload).title || 'Uploaded Image'}
                      </span>
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium truncate flex items-center gap-1">
                        <FileCheck className="w-3.5 h-3.5" /> Image Hosted & Ready
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateField('mediaUrl', '')}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-950"
                    title="Remove Image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-brand-500 cursor-pointer bg-white dark:bg-slate-900 transition-colors">
                  <ImageIcon className="w-8 h-8 text-brand-500 mb-2 animate-bounce" />
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {isUploading ? 'Uploading Image...' : 'Click to Upload Image File'}
                  </span>
                  <span className="text-xs text-slate-400 mt-1">PNG, JPG, SVG, WebP up to 20MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'image')}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
              )}

              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setUseCustomUrl(true)}
                  className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 ml-auto"
                >
                  <LinkIcon className="w-3.5 h-3.5" /> Or enter direct image web URL instead
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Input
                label="Direct Image Web URL *"
                placeholder="https://example.com/photo.png"
                value={(payload as MediaPayload).mediaUrl || ''}
                onChange={(e) => updateField('mediaUrl', e.target.value)}
              />
              <button
                type="button"
                onClick={() => setUseCustomUrl(false)}
                className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
              >
                <Upload className="w-3.5 h-3.5" /> Switch back to File Upload
              </button>
            </div>
          )}
        </div>
      )}

      {/* Video Form */}
      {type === 'video' && (
        <div className="space-y-3">
          <Input
            label="Video Title"
            placeholder="Video Presentation"
            value={(payload as MediaPayload).title || ''}
            onChange={(e) => updateField('title', e.target.value)}
          />
          <Input
            label="Video Direct or YouTube / Vimeo URL *"
            placeholder="https://youtube.com/watch?v=..."
            value={(payload as MediaPayload).mediaUrl || ''}
            onChange={(e) => updateField('mediaUrl', e.target.value)}
          />
        </div>
      )}

      {/* Location Form */}
      {type === 'location' && (
        <div className="space-y-3">
          <Input
            label="Location Name"
            placeholder="Main Office Headquarters"
            value={(payload as LocationPayload).locationName || ''}
            onChange={(e) => updateField('locationName', e.target.value)}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Latitude"
              placeholder="37.7749"
              value={(payload as LocationPayload).latitude || ''}
              onChange={(e) => updateField('latitude', e.target.value)}
            />
            <Input
              label="Longitude"
              placeholder="-122.4194"
              value={(payload as LocationPayload).longitude || ''}
              onChange={(e) => updateField('longitude', e.target.value)}
            />
          </div>
        </div>
      )}

      {/* WhatsApp Form */}
      {type === 'whatsapp' && (
        <div className="space-y-3">
          <Input
            label="WhatsApp Phone Number *"
            placeholder="+15550192834"
            value={(payload as WhatsAppPayload).phone || ''}
            onChange={(e) => updateField('phone', e.target.value)}
            error={!validation.isValid ? validation.error : undefined}
          />
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
              Default Chat Message
            </label>
            <textarea
              rows={3}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 p-3 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="Hello! I would like to inquire about..."
              value={(payload as WhatsAppPayload).message || ''}
              onChange={(e) => updateField('message', e.target.value)}
            />
          </div>
        </div>
      )}

      {/* App Download */}
      {type === 'app_download' && (
        <div className="space-y-3">
          <Input
            label="App Name"
            placeholder="My Cool App"
            value={(payload as AppDownloadPayload).appName || ''}
            onChange={(e) => updateField('appName', e.target.value)}
          />
          <Input
            label="iOS App Store Link"
            placeholder="https://apps.apple.com/app/id1234567"
            value={(payload as AppDownloadPayload).iosUrl || ''}
            onChange={(e) => updateField('iosUrl', e.target.value)}
          />
          <Input
            label="Google Play Store Link"
            placeholder="https://play.google.com/store/apps/details?id=com.app"
            value={(payload as AppDownloadPayload).androidUrl || ''}
            onChange={(e) => updateField('androidUrl', e.target.value)}
          />
          <Input
            label="Web Fallback Link *"
            placeholder="https://mycompany.com/download"
            value={(payload as AppDownloadPayload).fallbackUrl || ''}
            onChange={(e) => updateField('fallbackUrl', e.target.value)}
          />
        </div>
      )}

      {/* Multi-URL Link Builder */}
      {type === 'multi_url' && (
        <div className="space-y-3">
          <Input
            label="Page Title"
            placeholder="My Featured Links"
            value={(payload as MultiUrlPayload).title || ''}
            onChange={(e) => updateField('title', e.target.value)}
          />
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Links Array
            </label>
            {((payload as MultiUrlPayload).links || []).map((link, idx) => (
              <div key={link.id || idx} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                <Input
                  placeholder="Link Title"
                  className="w-1/3"
                  value={link.title}
                  onChange={(e) => {
                    const newLinks = [...((payload as MultiUrlPayload).links || [])];
                    newLinks[idx].title = e.target.value;
                    updateField('links', newLinks);
                  }}
                />
                <Input
                  placeholder="https://target.com"
                  className="w-2/3"
                  value={link.url}
                  onChange={(e) => {
                    const newLinks = [...((payload as MultiUrlPayload).links || [])];
                    newLinks[idx].url = e.target.value;
                    updateField('links', newLinks);
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const newLinks = ((payload as MultiUrlPayload).links || []).filter((_, i) => i !== idx);
                    updateField('links', newLinks);
                  }}
                  className="p-2 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-950 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => {
                const current = (payload as MultiUrlPayload).links || [];
                updateField('links', [...current, { id: 'l-' + Date.now(), title: 'New Link', url: 'https://example.com' }]);
              }}
            >
              Add Link Item
            </Button>
          </div>
        </div>
      )}

      {/* Social Links Form */}
      {type === 'social' && (
        <div className="space-y-3">
          <Input
            label="Page Header Title"
            placeholder="Connect with Alex"
            value={(payload as SocialPayload).title || ''}
            onChange={(e) => updateField('title', e.target.value)}
          />
          <Input
            label="Short Bio"
            placeholder="Digital Creator & Engineer"
            value={(payload as SocialPayload).bio || ''}
            onChange={(e) => updateField('bio', e.target.value)}
          />
        </div>
      )}
    </div>
  );
};
