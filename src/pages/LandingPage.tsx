import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  QrCode,
  Sparkles,
  Zap,
  BarChart3,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Globe,
  Smartphone,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ALL_QR_TYPES } from '../components/generator/QRCodeTypeSelector';
import { QRCodePreview } from '../components/generator/QRCodePreview';
import { PRESET_TEMPLATES } from '../lib/templates';
import { QRTypeID, QRPayload, QRCustomization } from '../types/qr';
import { buildQRPayload } from '../lib/payload-builders';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [selectedType, setSelectedType] = useState<QRTypeID>('url');
  const [payload, setPayload] = useState<QRPayload>({ url: 'https://everyqrcode.app' });
  const [customization, setCustomization] = useState<QRCustomization>(PRESET_TEMPLATES[0].customization);

  const payloadText = buildQRPayload(selectedType, payload);

  const handleCreateClick = () => {
    if (isAuthenticated) {
      navigate('/generator');
    } else {
      navigate('/login');
    }
  };

  const faqs = [
    {
      q: 'What is the difference between Static and Dynamic QR codes?',
      a: 'Static QR codes encode data directly into the pattern and cannot be changed after printing. Dynamic QR codes route through a short URL, allowing you to edit the destination URL anytime without changing the QR image, as well as tracking live scan analytics!',
    },
    {
      q: 'Can I customize the QR code with my company logo and brand colors?',
      a: 'Yes! Every QRCode Generator Pro allows you to upload custom logos, change foreground/background colors, set dual-color gradients, customize eye frame shapes, and select module dot patterns.',
    },
    {
      q: 'Are high-resolution vector SVG downloads supported?',
      a: 'Yes, PRO and Business plans support crisp SVG vector exports as well as high-res PNG downloads up to 2048x2048 pixels for professional print materials.',
    },
    {
      q: 'Is scan analytics privacy-compliant?',
      a: 'Absolutely. We do not store raw IP addresses. All scan metrics use hashed IPs, aggregating only country, city, device type, OS, and browser information.',
    },
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#6451F8]/10 text-[#6451F8] dark:bg-brand-950 dark:text-brand-300 border border-[#6451F8]/20 text-xs font-extrabold">
                <Sparkles className="w-4 h-4 text-amber-500" /> Next-Gen Enterprise QR SaaS
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-[1.1]">
                Create QR Codes That Connect <span className="bg-gradient-to-r from-[#6451F8] via-[#523ee0] to-[#3730a3] bg-clip-text text-transparent font-black">Offline to Online</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
                Create, customize, manage, and track static and dynamic QR codes from one simple, ultra-fast platform.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Button
                  variant="gradient"
                  size="lg"
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                  onClick={handleCreateClick}
                >
                  Create QR Code Now
                </Button>
                <Link to="/features">
                  <Button variant="outline" size="lg">
                    Explore Features
                  </Button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-600 dark:text-slate-400 font-bold">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-500" /> No credit card required</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-500" /> Unlimited static QRs</span>
              </div>
            </div>

            {/* Hero Right Interactive Generator Preview */}
            <div className="lg:col-span-6">
              <QRCodePreview
                payloadText={payloadText}
                customization={customization}
                mode="dynamic"
                onModeChange={() => {}}
                qrName="Hero Demo Code"
                onSave={handleCreateClick}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 15 QR Types Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            15 Supported QR Content Types
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            From URLs and Wi-Fi networks to vCards and multi-link landing pages, Every QRCode Generator Pro has standard-compliant encoders for every requirement.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ALL_QR_TYPES.map((t) => (
            <Card key={t.id} hoverable className="flex items-start gap-4 p-5">
              <div className="w-10 h-10 rounded-xl bg-[#6451F8]/10 text-[#6451F8] dark:bg-brand-950 dark:text-brand-400 flex items-center justify-center shrink-0">
                {t.icon}
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                  {t.name}
                  {t.category === 'Advanced' && (
                    <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                      Advanced
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{t.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Feature Showcase 1: Dynamic QR Codes */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-950 text-brand-300 border border-brand-800 text-xs font-bold">
                <Layers className="w-4 h-4 text-brand-400" /> Editable Destinations
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Update Target URLs Anytime Without Re-Printing
              </h2>
              <p className="text-slate-400 leading-relaxed text-base">
                Printed thousands of brochures or menu cards? Dynamic QR codes route through secure short links (`/r/:shortCode`), allowing you to change the destination URL in real time whenever your campaigns evolve.
              </p>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" /> 0% downtime instant routing redirects
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Complete privacy-compliant scan metrics
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Short codes keep QR patterns clean & scannable
                </li>
              </ul>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold border-b border-slate-700 pb-3">
                <span>Dynamic Short Code Router</span>
                <span className="text-emerald-400">ACTIVE 200 OK</span>
              </div>
              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-700">
                  <span className="text-slate-500">Scanned QR Code:</span>
                  <p className="text-brand-400 font-bold mt-1">https://everyqrcode.app/r/launch-2026</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-700">
                  <span className="text-slate-500">Target Destination (Editable):</span>
                  <p className="text-emerald-400 font-bold mt-1">https://example.com/summer-promotion</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8" id="faq">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Got questions about static vs dynamic QR codes or print resolution? We have answers.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <Card key={idx} className="p-6 space-y-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#6451F8] shrink-0" /> {faq.q}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pl-6">{faq.a}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};
