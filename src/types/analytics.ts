export interface ScanRecord {
  id: string;
  qrCodeId: string;
  timestamp: string;
  ipHash?: string;
  country: string;
  city: string;
  deviceType: 'Desktop' | 'Mobile' | 'Tablet';
  os: string;
  browser: string;
  referrer: string;
}

export interface AnalyticsSummary {
  totalScans: number;
  uniqueScans: number;
  scansToday: number;
  scansThisWeek: number;
  scansThisMonth: number;
  activeQRCodes: number;
  scansOverTime: Array<{ date: string; scans: number; unique: number }>;
  devicesBreakdown: Array<{ name: string; value: number }>;
  osBreakdown: Array<{ name: string; value: number }>;
  browserBreakdown: Array<{ name: string; value: number }>;
  countryBreakdown: Array<{ country: string; scans: number }>;
  topReferrers: Array<{ referrer: string; scans: number }>;
}
