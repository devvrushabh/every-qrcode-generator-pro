import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { QRCodeTypeSelector } from '../components/generator/QRCodeTypeSelector';
import { QRCodeForm } from '../components/generator/QRCodeForm';
import { QRCodeCustomizationPanel } from '../components/generator/QRCodeCustomization';
import { QRCodePreview } from '../components/generator/QRCodePreview';
import { TemplateSelector } from '../components/generator/TemplateSelector';
import { PRESET_TEMPLATES } from '../lib/templates';
import { QRTypeID, QRPayload, QRCustomization, QRModeType } from '../types/qr';
import { buildQRPayload } from '../lib/payload-builders';
import { qrService } from '../services/qrService';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Sparkles, Check, ArrowLeft, Loader2 } from 'lucide-react';

export const GeneratorPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const { user, isAuthenticated } = useAuth();

  // Protect generator page: redirect unauthenticated users to Login
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const [qrName, setQrName] = useState('My QR Code');
  const [selectedType, setSelectedType] = useState<QRTypeID>('url');
  const [mode, setMode] = useState<QRModeType>('static');
  const [payload, setPayload] = useState<QRPayload>({ url: 'https://everyqrcode.app' });
  const [customization, setCustomization] = useState<QRCustomization>(PRESET_TEMPLATES[0].customization);
  
  const [activeTab, setActiveTab] = useState<'content' | 'style' | 'templates'>('content');
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(Boolean(id));
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Load existing QR code if editing (/dashboard/qr-codes/:id)
  useEffect(() => {
    if (!id || !user) return;
    let isMounted = true;
    setIsInitialLoading(true);

    qrService.getQRCodeById(id).then((qr) => {
      if (!isMounted) return;
      if (qr) {
        setQrName(qr.name);
        setSelectedType(qr.type as QRTypeID);
        setMode(qr.mode as QRModeType);
        
        try {
          // Attempt JSON parse or fallback
          if (qr.payload.startsWith('{')) {
            setPayload(JSON.parse(qr.payload));
          } else {
            setPayload({ url: qr.payload, text: qr.payload });
          }
        } catch {
          setPayload({ url: qr.payload });
        }

        if (qr.configuration && typeof qr.configuration === 'object') {
          setCustomization(qr.configuration as any);
        }
      }
      setIsInitialLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [id, user]);

  const payloadText = buildQRPayload(selectedType, payload);

  const handleSaveQR = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      if (id) {
        // Update existing QR code
        await qrService.updateQRCode(id, {
          name: qrName,
          type: selectedType,
          mode: mode,
          payload: payload,
          configuration: customization,
        });
      } else {
        // Create new QR code
        await qrService.createQRCode(user.id, {
          name: qrName,
          type: selectedType,
          mode: mode,
          payload: payload,
          configuration: customization,
        });
      }

      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        navigate('/dashboard/qr-codes');
      }, 1200);
    } catch (error) {
      console.error('Failed to save QR code:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAuthenticated) return null;

  if (isInitialLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-[#6451F8]" />
        <p className="text-sm font-semibold text-slate-500">Loading saved QR configuration...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex items-center gap-3">
          {id && (
            <button
              onClick={() => navigate('/dashboard/qr-codes')}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Back to saved QR codes"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {id ? `Edit: ${qrName}` : 'Interactive QR Code Studio'}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
              Create, customize, and export static or dynamic vector QR codes in real time.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Input
            placeholder="QR Code Name..."
            value={qrName}
            onChange={(e) => setQrName(e.target.value)}
            className="w-48"
          />
          <Button
            variant="gradient"
            isLoading={isSaving}
            leftIcon={savedSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Sparkles className="w-4 h-4" />}
            onClick={handleSaveQR}
          >
            {savedSuccess ? 'Saved to Account!' : id ? 'Update QR Code' : 'Save QR Code'}
          </Button>
        </div>
      </div>

      {/* Main Two-Column Editor Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Editor & Configuration */}
        <div className="lg:col-span-7 space-y-6">
          {/* QR Type Selection Grid */}
          <Card className="p-6">
            <QRCodeTypeSelector selectedType={selectedType} onSelectType={(type) => setSelectedType(type)} />
          </Card>

          {/* Navigation Tabs (Content, Customization, Preset Templates) */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            <button
              onClick={() => setActiveTab('content')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'content'
                  ? 'bg-[#6451F8] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              1. Content & Parameters
            </button>
            <button
              onClick={() => setActiveTab('style')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'style'
                  ? 'bg-[#6451F8] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              2. Custom Branding & Colors
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'templates'
                  ? 'bg-[#6451F8] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              3. Preset Templates
            </button>
          </div>

          {/* Tab Content Panels */}
          <Card className="p-6">
            {activeTab === 'content' && (
              <QRCodeForm type={selectedType} payload={payload} onChange={setPayload} />
            )}

            {activeTab === 'style' && (
              <QRCodeCustomizationPanel customization={customization} onChange={setCustomization} />
            )}

            {activeTab === 'templates' && (
              <TemplateSelector onSelectTemplate={(tmpl) => setCustomization(tmpl)} />
            )}
          </Card>
        </div>

        {/* RIGHT COLUMN: Real-Time Live Preview & Download */}
        <div className="lg:col-span-5">
          <QRCodePreview
            payloadText={payloadText}
            customization={customization}
            mode={mode}
            onModeChange={setMode}
            qrName={qrName}
            onSave={handleSaveQR}
          />
        </div>
      </div>
    </div>
  );
};
