import React from 'react';
import { PRESET_TEMPLATES } from '../../lib/templates';
import { QRCustomization } from '../../types/qr';
import { Sparkles } from 'lucide-react';
import { clsx } from 'clsx';

interface TemplateSelectorProps {
  onSelectTemplate: (customization: QRCustomization) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onSelectTemplate }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        <Sparkles className="w-4 h-4 text-amber-500" /> Preset Designer Templates
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {PRESET_TEMPLATES.map((tmpl) => (
          <button
            key={tmpl.id}
            type="button"
            onClick={() => onSelectTemplate(tmpl.customization)}
            className="group flex flex-col p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-brand-500 dark:hover:border-brand-500 transition-all text-left"
          >
            <div className={clsx('w-full h-8 rounded-lg mb-2 flex items-center justify-center', tmpl.previewBg)}>
              <div
                className="w-4 h-4 rounded-sm border"
                style={{
                  backgroundColor: tmpl.customization.foregroundColor,
                  borderColor: tmpl.customization.backgroundColor,
                }}
              />
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{tmpl.name}</span>
            <span className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{tmpl.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
