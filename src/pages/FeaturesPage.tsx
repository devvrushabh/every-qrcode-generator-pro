import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Layers,
  BarChart3,
  Palette,
  ShieldCheck,
  Zap,
  Globe,
  FileDown,
  Folder,
  Sparkles,
  QrCode,
  ArrowRight,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export const FeaturesPage: React.FC = () => {
  const navigate = useNavigate();

  const featureCards = [
    {
      icon: <Layers className="w-6 h-6 text-brand-500" />,
      title: 'Dynamic QR Code Routing',
      description: 'Change target destination URLs anytime in real-time without re-printing physical materials or changing the QR code image.',
      bg: 'bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400',
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-indigo-500" />,
      title: 'Privacy-Compliant Analytics',
      description: 'Track scan events over time, unique visitors, device breakdown (Desktop, Mobile, Tablet), OS, browser, referrer, and geographic distribution.',
      bg: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400',
    },
    {
      icon: <Palette className="w-6 h-6 text-amber-500" />,
      title: 'Advanced Custom Branding',
      description: 'Customize foreground/background colors, dual-color gradients, 5 module dot patterns, eye shapes, and custom brand logos with quiet zone controls.',
      bg: 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400',
    },
    {
      icon: <FileDown className="w-6 h-6 text-emerald-500" />,
      title: 'Vector SVG & Ultra HD PNG Export',
      description: 'Download crisp vector SVG files for billboard printing or high-resolution PNG images up to 2048x2048 pixels.',
      bg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-rose-500" />,
      title: 'Real-Time Contrast Safety Checker',
      description: 'Automatic WCAG contrast calculation and logo reliability check before downloading to guarantee 100% camera scanner accuracy.',
      bg: 'bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400',
    },
    {
      icon: <Globe className="w-6 h-6 text-cyan-500" />,
      title: 'PDF & File Upload Hosting',
      description: 'Upload PDF menus, product brochures, and photo galleries directly to host file URLs automatically.',
      bg: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-950 dark:text-cyan-400',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 border border-brand-200 dark:border-brand-800 text-xs font-bold">
          <Zap className="w-4 h-4 text-brand-500" /> Enterprise QR Code Capabilities
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Everything You Need to Connect Offline Audiences to Online Experiences
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
          From editable dynamic redirects and vector exports to live scan analytics and custom brand styling, explore all features built into Every QRCode Generator Pro.
        </p>

        <div className="pt-2 flex justify-center gap-4">
          <Button variant="gradient" size="lg" onClick={() => navigate('/generator')} rightIcon={<ArrowRight className="w-4 h-4" />}>
            Start Creating Free
          </Button>
          <Link to="/pricing">
            <Button variant="outline" size="lg">
              View Plans & Pricing
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featureCards.map((feat, idx) => (
          <Card key={idx} hoverable className="p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${feat.bg}`}>
                {feat.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{feat.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{feat.description}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Detailed Feature Showcase Section */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 lg:p-12 space-y-8">
        <div className="max-w-2xl space-y-3">
          <h2 className="text-3xl font-extrabold tracking-tight">Built for Scale, Speed, and Security</h2>
          <p className="text-slate-400 text-sm">
            Designed for marketing agencies, enterprise brands, and small businesses requiring reliable QR scan redirects.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-800">
          <div className="space-y-2">
            <h4 className="font-bold text-white text-base flex items-center gap-2">
              <Zap className="w-4 h-4 text-brand-400" /> Sub-50ms Global Redirects
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Fast 302 HTTP redirects ensure customers reach your target site without delays.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-white text-base flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" /> SHA-256 IP Hashing
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Fully GDPR & CCPA compliant privacy tracking without storing unhashed personal IP addresses.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-white text-base flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400" /> 100% Standard Compliant
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Scannable on all iOS Camera apps, Android devices, and specialized industrial barcode readers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
