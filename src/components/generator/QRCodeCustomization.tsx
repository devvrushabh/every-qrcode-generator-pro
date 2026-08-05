import React from 'react';
import { QRCustomization, DotStyle, EyeFrameStyle, EyeDotStyle, ErrorCorrectionLevel } from '../../types/qr';
import { Input } from '../ui/Input';
import { Upload, X, Palette, Eye, ShieldAlert, Image as ImageIcon } from 'lucide-react';
import { clsx } from 'clsx';

interface QRCodeCustomizationProps {
  customization: QRCustomization;
  onChange: (customization: QRCustomization) => void;
}

export const QRCodeCustomizationPanel: React.FC<QRCodeCustomizationProps> = ({ customization, onChange }) => {
  const update = (key: keyof QRCustomization, value: any) => {
    onChange({
      ...customization,
      [key]: value,
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size must be under 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        update('logoUrl', event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const dotStyles: Array<{ id: DotStyle; label: string }> = [
    { id: 'square', label: 'Square' },
    { id: 'rounded', label: 'Rounded' },
    { id: 'dots', label: 'Dots' },
    { id: 'extra-rounded', label: 'Extra Soft' },
    { id: 'classy', label: 'Classy' },
  ];

  const eyeStyles: Array<{ id: EyeFrameStyle; label: string }> = [
    { id: 'square', label: 'Square' },
    { id: 'rounded', label: 'Rounded' },
    { id: 'circle', label: 'Circle' },
  ];

  const ecLevels: Array<{ id: ErrorCorrectionLevel; label: string; desc: string }> = [
    { id: 'L', label: 'L (7%)', desc: 'Low density, high scan speed' },
    { id: 'M', label: 'M (15%)', desc: 'Standard balance (Default)' },
    { id: 'Q', label: 'Q (25%)', desc: 'High reliability for logos' },
    { id: 'H', label: 'H (30%)', desc: 'Maximum error correction' },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        3. Customization & Styling
      </h3>

      {/* Colors & Gradient Section */}
      <div className="space-y-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
          <Palette className="w-4 h-4 text-brand-500" /> Color Palette & Gradient
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Foreground Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={customization.foregroundColor}
                onChange={(e) => update('foregroundColor', e.target.value)}
                className="w-9 h-9 rounded-xl border-none cursor-pointer bg-transparent"
              />
              <Input
                value={customization.foregroundColor}
                onChange={(e) => update('foregroundColor', e.target.value)}
                className="font-mono text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Background Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={customization.backgroundColor}
                onChange={(e) => update('backgroundColor', e.target.value)}
                className="w-9 h-9 rounded-xl border-none cursor-pointer bg-transparent"
              />
              <Input
                value={customization.backgroundColor}
                onChange={(e) => update('backgroundColor', e.target.value)}
                className="font-mono text-xs"
              />
            </div>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-slate-200 dark:border-slate-700">
          <label className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={customization.useGradient}
              onChange={(e) => update('useGradient', e.target.checked)}
              className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
            />
            Enable Dual Color Gradient
          </label>
        </div>

        {customization.useGradient && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Gradient End Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customization.gradientColor}
                  onChange={(e) => update('gradientColor', e.target.value)}
                  className="w-9 h-9 rounded-xl border-none cursor-pointer bg-transparent"
                />
                <Input
                  value={customization.gradientColor}
                  onChange={(e) => update('gradientColor', e.target.value)}
                  className="font-mono text-xs"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Module Shapes & Eyes */}
      <div className="space-y-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
          <Eye className="w-4 h-4 text-brand-500" /> Module Patterns & Eye Frames
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-2">Data Modules Pattern</label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {dotStyles.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => update('dotStyle', s.id)}
                className={clsx(
                  'px-2.5 py-2 rounded-xl text-xs font-semibold border transition-all',
                  customization.dotStyle === s.id
                    ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-2">Eye Frame Shape</label>
            <div className="grid grid-cols-3 gap-1.5">
              {eyeStyles.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => update('eyeFrameStyle', s.id)}
                  className={clsx(
                    'px-2 py-1.5 rounded-lg text-xs font-medium border text-center transition-all',
                    customization.eyeFrameStyle === s.id
                      ? 'bg-brand-600 text-white border-brand-600'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-2">Eye Inner Dot Shape</label>
            <div className="grid grid-cols-3 gap-1.5">
              {eyeStyles.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => update('eyeDotStyle', s.id as EyeDotStyle)}
                  className={clsx(
                    'px-2 py-1.5 rounded-lg text-xs font-medium border text-center transition-all',
                    customization.eyeDotStyle === s.id
                      ? 'bg-brand-600 text-white border-brand-600'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Logo Integration */}
      <div className="space-y-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
            <ImageIcon className="w-4 h-4 text-brand-500" /> Center Logo Overlay
          </div>
          {customization.logoUrl && (
            <button
              type="button"
              onClick={() => update('logoUrl', undefined)}
              className="text-xs text-rose-500 hover:underline flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" /> Remove Logo
            </button>
          )}
        </div>

        {customization.logoUrl ? (
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl border border-slate-200 dark:border-slate-700 bg-white p-1 flex items-center justify-center">
              <img src={customization.logoUrl} alt="Logo Preview" className="max-w-full max-h-full object-contain" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300 font-medium">
                <span>Logo Scale Size</span>
                <span>{Math.round((customization.logoSize || 0.2) * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.35"
                step="0.02"
                value={customization.logoSize || 0.2}
                onChange={(e) => update('logoSize', parseFloat(e.target.value))}
                className="w-full accent-brand-600"
              />
            </div>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-brand-500 cursor-pointer bg-white dark:bg-slate-900 transition-colors">
            <Upload className="w-6 h-6 text-slate-400 mb-1" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Upload Image / Brand Logo</span>
            <span className="text-[10px] text-slate-400">PNG, JPG, SVG up to 2MB</span>
            <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
          </label>
        )}
      </div>

      {/* Margins & Error Correction */}
      <div className="space-y-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
          <ShieldAlert className="w-4 h-4 text-brand-500" /> Quiet Zone & Error Correction
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Quiet Zone Padding</label>
            <select
              value={customization.quietZone ?? 2}
              onChange={(e) => update('quietZone', parseInt(e.target.value))}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 p-2.5 text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
            >
              <option value={0}>0 (No margin - Risk of scan failure)</option>
              <option value={1}>1 (Compact)</option>
              <option value={2}>2 (Recommended Standard)</option>
              <option value={3}>3 (Generous Margin)</option>
              <option value={4}>4 (Maximum Frame Isolation)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Error Correction Level</label>
            <select
              value={customization.errorCorrectionLevel || 'M'}
              onChange={(e) => update('errorCorrectionLevel', e.target.value as ErrorCorrectionLevel)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 p-2.5 text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
            >
              {ecLevels.map((ec) => (
                <option key={ec.id} value={ec.id}>
                  {ec.label} - {ec.desc}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
