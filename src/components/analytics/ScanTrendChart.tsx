import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../ui/Card';

interface ScanTrendChartProps {
  data: Array<{ date: string; scans: number; unique: number }>;
}

export const ScanTrendChart: React.FC<ScanTrendChartProps> = ({ data }) => {
  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white text-base">Scan Performance Over Time</h4>
          <p className="text-xs text-slate-500">Total scans vs unique scanners</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <span className="flex items-center gap-1.5 text-brand-600 dark:text-brand-400">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-500" /> Total Scans
          </span>
          <span className="flex items-center gap-1.5 text-indigo-500">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" /> Unique Users
          </span>
        </div>
      </div>

      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="scansGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="uniqueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#818cf8" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#1e293b',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '12px',
              }}
            />
            <Area type="monotone" dataKey="scans" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#scansGrad)" />
            <Area type="monotone" dataKey="unique" stroke="#818cf8" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#uniqueGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
