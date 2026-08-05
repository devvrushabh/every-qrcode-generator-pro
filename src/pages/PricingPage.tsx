import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, Sparkles, Zap, Shield, HelpCircle, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';

export const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleSelectPlan = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  const plans = [
    {
      id: 'free',
      name: 'Free Forever',
      price: '$0',
      period: 'forever',
      description: 'Essential QR code generation for individuals and quick projects.',
      features: [
        'Unlimited Static QR Codes',
        '15 QR Code Content Types',
        'PNG Raster Exports (512px)',
        'Basic Custom Colors & Logos',
        'WCAG Safety Checker',
      ],
      popular: false,
      buttonText: 'Get Started Free',
      buttonVariant: 'outline' as const,
    },
    {
      id: 'pro',
      name: 'Pro Marketer',
      price: '$12',
      period: 'per month',
      description: 'Ideal for small businesses and creators needing vector SVG export and folders.',
      features: [
        'Everything in Free',
        'High-Res PNG (up to 2048px)',
        'Vector SVG Downloads',
        'Unlimited Campaign Folders',
        'PDF & Gallery File Uploads',
        'Dual-Color Gradients & Soft Dots',
        'Priority Customer Support',
      ],
      popular: true,
      buttonText: 'Upgrade to Pro',
      buttonVariant: 'gradient' as const,
    },
    {
      id: 'enterprise',
      name: 'Enterprise Agency',
      price: '$49',
      period: 'per month',
      description: 'For growing marketing agencies requiring advanced customization and security.',
      features: [
        'Everything in Pro',
        'Unlimited Team Workspace',
        'Custom Logo Clipping',
        'Sub-50ms Global Redirect SLA',
        'Dedicated Account Manager',
        'Custom Domain SSL Certificate',
      ],
      popular: false,
      buttonText: 'Contact Sales',
      buttonVariant: 'outline' as const,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#6451F8]/10 text-[#6451F8] dark:bg-brand-950 dark:text-brand-300 border border-[#6451F8]/20 text-xs font-extrabold">
          <Sparkles className="w-4 h-4 text-amber-500" /> Transparent Pricing
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Simple Plans for Every Stage of Your Business
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
          Create scannable vector QR codes free forever. Upgrade anytime for vector SVG exports and campaign folders.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            hoverable
            className={`p-8 space-y-6 flex flex-col justify-between relative ${
              plan.popular ? 'border-2 border-[#6451F8] shadow-2xl shadow-[#6451F8]/20' : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-[#6451F8] text-white text-[10px] uppercase font-black tracking-wider shadow-md">
                Most Popular Choice
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{plan.name}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{plan.description}</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{plan.price}</span>
                <span className="text-xs text-slate-400 font-medium">/ {plan.period}</span>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                {plan.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button
              variant={plan.buttonVariant}
              size="lg"
              className="w-full font-bold mt-6"
              onClick={handleSelectPlan}
            >
              {plan.buttonText}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};
