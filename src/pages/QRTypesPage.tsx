import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ALL_QR_TYPES } from '../components/generator/QRCodeTypeSelector';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ArrowRight, QrCode, Sparkles, CheckCircle2 } from 'lucide-react';
import { QRTypeID } from '../types/qr';

export const QRTypesPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSelectAndGenerate = (typeId: QRTypeID) => {
    navigate(`/generator?type=${typeId}`);
  };

  const mvpTypes = ALL_QR_TYPES.filter((t) => t.category === 'MVP');
  const advancedTypes = ALL_QR_TYPES.filter((t) => t.category === 'Advanced');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 border border-brand-200 dark:border-brand-800 text-xs font-bold">
          <Sparkles className="w-4 h-4 text-amber-500" /> 15 Standard-Compliant Format Encoders
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Explore All Supported QR Code Types
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
          From simple URLs and Wi-Fi networks to vCard business profiles, PDF menus, and smart app downloads — click any QR type to launch the live generator instantly.
        </p>
      </div>

      {/* MVP Essentials Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Essential QR Types</h2>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
            MVP Standard
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mvpTypes.map((t) => (
            <Card key={t.id} hoverable className="p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400 flex items-center justify-center">
                  {t.icon}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">{t.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">{t.description}</p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                onClick={() => handleSelectAndGenerate(t.id)}
              >
                Create {t.name} QR
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Advanced Capabilities Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Advanced & Multi-Media Types</h2>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
            Advanced
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {advancedTypes.map((t) => (
            <Card key={t.id} hoverable className="p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 flex items-center justify-center">
                  {t.icon}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">{t.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">{t.description}</p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                onClick={() => handleSelectAndGenerate(t.id)}
              >
                Create {t.name} QR
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
