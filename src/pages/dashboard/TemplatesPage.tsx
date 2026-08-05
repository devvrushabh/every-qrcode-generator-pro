import React from 'react';
import { PRESET_TEMPLATES } from '../../lib/templates';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Palette, Sparkles, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TemplatesPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Design Templates Library
        </h1>
        <p className="text-xs text-slate-500">Save and apply custom design themes across your QR campaigns</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PRESET_TEMPLATES.map((tmpl) => (
          <Card key={tmpl.id} className="p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className={`w-full h-24 rounded-2xl flex items-center justify-center ${tmpl.previewBg}`}>
                <div
                  className="w-10 h-10 rounded-lg border-2"
                  style={{
                    backgroundColor: tmpl.customization.foregroundColor,
                    borderColor: tmpl.customization.backgroundColor,
                  }}
                />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">{tmpl.name}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mt-0.5">{tmpl.description}</p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full"
              leftIcon={<Sparkles className="w-3.5 h-3.5 text-amber-500" />}
              onClick={() => navigate('/dashboard/qr-codes/new')}
            >
              Apply Theme
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};
