import React from 'react';
import { AnalyticsSummary } from '../../types/analytics';
import { Card } from '../ui/Card';
import { Eye, Users, Globe, QrCode, TrendingUp } from 'lucide-react';

interface AnalyticsOverviewCardsProps {
  summary: AnalyticsSummary;
}

export const AnalyticsOverviewCards: React.FC<AnalyticsOverviewCardsProps> = ({ summary }) => {
  const cards = [
    {
      title: 'Total Scans',
      value: summary.totalScans.toLocaleString(),
      change: '+14.2% this week',
      icon: <Eye className="w-5 h-5 text-brand-500" />,
      bg: 'bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400',
    },
    {
      title: 'Unique Scanners',
      value: summary.uniqueScans.toLocaleString(),
      change: '+9.8% unique visitors',
      icon: <Users className="w-5 h-5 text-indigo-500" />,
      bg: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400',
    },
    {
      title: 'Active QR Codes',
      value: summary.activeQRCodes.toLocaleString(),
      change: '100% active operational',
      icon: <QrCode className="w-5 h-5 text-emerald-500" />,
      bg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400',
    },
    {
      title: 'Countries Reach',
      value: (summary.countryBreakdown.length || 5).toString(),
      change: 'Global scan distribution',
      icon: <Globe className="w-5 h-5 text-amber-500" />,
      bg: 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <Card key={idx} className="flex items-center justify-between p-5">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{card.title}</span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">{card.value}</div>
            <p className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
              <TrendingUp className="w-3 h-3 text-emerald-500" /> {card.change}
            </p>
          </div>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${card.bg}`}>
            {card.icon}
          </div>
        </Card>
      ))}
    </div>
  );
};
