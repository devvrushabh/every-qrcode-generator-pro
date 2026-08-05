import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { AnalyticsSummary } from '../../types/analytics';
import { QRCodeData } from '../../types/qr';
import { AnalyticsOverviewCards } from '../../components/analytics/AnalyticsOverviewCards';
import { ScanTrendChart } from '../../components/analytics/ScanTrendChart';
import { DeviceDistributionChart } from '../../components/analytics/DeviceDistributionChart';
import { ArrowLeft, Calendar, Download } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const QRCodeAnalytics: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [qr, setQr] = useState<QRCodeData | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [dateFilter, setDateFilter] = useState('7d');

  useEffect(() => {
    async function loadData() {
      if (id) {
        const [item, stats] = await Promise.all([api.getQRCodeById(id), api.getAnalytics(id)]);
        setQr(item);
        setAnalytics(stats);
      }
    }
    loadData();
  }, [id]);

  if (!analytics) return <div className="p-8 text-center text-sm text-slate-500">Loading analytics dataset...</div>;

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/dashboard/qr-codes')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white"
      >
        <ArrowLeft className="w-4 h-4" /> Back to All QR Codes
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Scan Analytics: {qr?.name || 'Campaign'}
          </h1>
          <p className="text-xs text-slate-500 font-mono">
            Redirect URL: {qr?.destinationUrl || 'https://qrcraft.app'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-800 p-2 text-xs bg-white dark:bg-slate-900 font-semibold"
          >
            <option value="today">Today</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
        </div>
      </div>

      <AnalyticsOverviewCards summary={analytics} />
      <ScanTrendChart data={analytics.scansOverTime} />
      <DeviceDistributionChart devices={analytics.devicesBreakdown} os={analytics.osBreakdown} />
    </div>
  );
};
