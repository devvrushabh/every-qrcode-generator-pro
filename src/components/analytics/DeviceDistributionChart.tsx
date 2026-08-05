import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card } from '../ui/Card';

interface DeviceDistributionChartProps {
  devices: Array<{ name: string; value: number }>;
  os: Array<{ name: string; value: number }>;
}

const COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ec4899'];

export const DeviceDistributionChart: React.FC<DeviceDistributionChartProps> = ({ devices, os }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Device Types */}
      <Card className="space-y-3">
        <h4 className="font-bold text-slate-900 dark:text-white text-base">Device Breakdown</h4>
        <div className="h-56 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={devices} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                {devices.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#1e293b',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-4 text-xs font-semibold">
          {devices.map((d, idx) => (
            <span key={idx} className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
              {d.name} ({d.value})
            </span>
          ))}
        </div>
      </Card>

      {/* Operating System */}
      <Card className="space-y-3">
        <h4 className="font-bold text-slate-900 dark:text-white text-base">Operating System Distribution</h4>
        <div className="h-56 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={os} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                {os.map((entry, index) => (
                  <Cell key={`cell-os-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#1e293b',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap justify-center gap-3 text-xs font-semibold">
          {os.map((o, idx) => (
            <span key={idx} className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[(idx + 2) % COLORS.length] }} />
              {o.name} ({o.value})
            </span>
          ))}
        </div>
      </Card>
    </div>
  );
};
