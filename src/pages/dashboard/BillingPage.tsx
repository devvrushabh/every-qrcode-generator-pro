import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Check, Sparkles, CreditCard, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const BillingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Billing & Subscriptions
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
          View your active plan details and available upgrades.
        </p>
      </div>

      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              Active Plan
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Free Forever Plan</h3>
            <p className="text-xs text-slate-500">Unlimited static QR code generation and PNG exports.</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/pricing')}>
            View All Plans
          </Button>
        </div>
      </Card>
    </div>
  );
};
