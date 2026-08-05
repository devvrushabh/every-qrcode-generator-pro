import React from 'react';
import { checkQRSafety } from '../../lib/safety-checker';
import { QRCustomization } from '../../types/qr';
import { ShieldCheck, AlertTriangle, XCircle } from 'lucide-react';
import { clsx } from 'clsx';

interface SafetyWarningBannerProps {
  customization: QRCustomization;
}

export const SafetyWarningBanner: React.FC<SafetyWarningBannerProps> = ({ customization }) => {
  const result = checkQRSafety(customization);

  if (result.status === 'OPTIMAL' && result.warnings.length === 0) {
    return (
      <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-medium">
        <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <span>Optimal Scan Reliability (Score {result.score}%). Ready for print download.</span>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'p-3.5 rounded-xl border text-xs space-y-1.5 transition-colors',
        result.status === 'CRITICAL'
          ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
          : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200'
      )}
    >
      <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[11px]">
        {result.status === 'CRITICAL' ? (
          <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
        ) : (
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
        )}
        <span>Scan Reliability Advisory ({result.score}% Score)</span>
      </div>
      <ul className="list-disc list-inside space-y-1 pl-1 text-[11px] font-normal leading-relaxed">
        {result.warnings.map((w, idx) => (
          <li key={idx}>{w}</li>
        ))}
      </ul>
    </div>
  );
};
