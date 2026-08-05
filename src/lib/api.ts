import { QRCodeData, QRTypeID, QRCustomization } from '../types/qr';
import { AnalyticsSummary } from '../types/analytics';
import { PRESET_TEMPLATES } from './templates';

const STORAGE_KEY_QRS = 'qrcraft-qrcodes';
const STORAGE_KEY_FOLDERS = 'qrcraft-folders';

export interface FolderData {
  id: string;
  name: string;
  qrCount?: number;
  createdAt: string;
}

const DEMO_QRS: QRCodeData[] = [
  {
    id: 'qr-1',
    name: 'Official Company Website',
    type: 'url',
    mode: 'dynamic',
    shortCode: 'web-v1',
    destinationUrl: 'https://qrcraft.app',
    content: { url: 'https://qrcraft.app', utmSource: 'qr', utmMedium: 'print' },
    customization: PRESET_TEMPLATES[0].customization,
    status: 'ACTIVE',
    createdAt: '2026-08-01T10:00:00.000Z',
    scansCount: 1420,
  },
  {
    id: 'qr-2',
    name: 'Guest Wi-Fi Lounge',
    type: 'wifi',
    mode: 'static',
    shortCode: 'wifi-guest',
    content: { ssid: 'QRCraft-Guest', password: 'SuperSecureWiFi2026', security: 'WPA2', hidden: false },
    customization: PRESET_TEMPLATES[1].customization,
    status: 'ACTIVE',
    createdAt: '2026-08-02T14:30:00.000Z',
    scansCount: 489,
  },
  {
    id: 'qr-3',
    name: 'Executive vCard Profile',
    type: 'vcard',
    mode: 'dynamic',
    shortCode: 'alex-card',
    destinationUrl: 'https://qrcraft.app/card/alex',
    content: {
      firstName: 'Alex',
      lastName: 'Rivera',
      company: 'QRCraft Technologies',
      jobTitle: 'Product Director',
      phone: '+1 (555) 019-2834',
      email: 'alex@qrcraft.app',
      website: 'https://qrcraft.app',
      address: '100 Silicon Ave, San Francisco, CA',
    },
    customization: PRESET_TEMPLATES[2].customization,
    status: 'ACTIVE',
    createdAt: '2026-08-03T09:15:00.000Z',
    scansCount: 890,
  },
  {
    id: 'qr-4',
    name: 'Summer Menu PDF',
    type: 'pdf',
    mode: 'dynamic',
    shortCode: 'menu-pdf',
    destinationUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000',
    content: { title: 'Summer Menu', mediaUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000' },
    customization: PRESET_TEMPLATES[3].customization,
    status: 'ACTIVE',
    createdAt: '2026-08-04T16:00:00.000Z',
    scansCount: 2310,
  },
];

const DEMO_FOLDERS: FolderData[] = [
  { id: 'f-1', name: 'Marketing Campaigns', qrCount: 2, createdAt: '2026-08-01T10:00:00.000Z' },
  { id: 'f-2', name: 'Office & Facilities', qrCount: 1, createdAt: '2026-08-02T12:00:00.000Z' },
  { id: 'f-3', name: 'Events & Expos', qrCount: 1, createdAt: '2026-08-03T15:00:00.000Z' },
];

function getLocalQRs(): QRCodeData[] {
  const data = localStorage.getItem(STORAGE_KEY_QRS);
  if (!data) {
    localStorage.setItem(STORAGE_KEY_QRS, JSON.stringify(DEMO_QRS));
    return DEMO_QRS;
  }
  return JSON.parse(data);
}

function saveLocalQRs(qrs: QRCodeData[]) {
  localStorage.setItem(STORAGE_KEY_QRS, JSON.stringify(qrs));
}

function getLocalFolders(): FolderData[] {
  const data = localStorage.getItem(STORAGE_KEY_FOLDERS);
  if (!data) {
    localStorage.setItem(STORAGE_KEY_FOLDERS, JSON.stringify(DEMO_FOLDERS));
    return DEMO_FOLDERS;
  }
  return JSON.parse(data);
}

function saveLocalFolders(folders: FolderData[]) {
  localStorage.setItem(STORAGE_KEY_FOLDERS, JSON.stringify(folders));
}

export const api = {
  // File Upload API
  async uploadFile(fileName: string, fileData: string): Promise<{ url: string; fileName: string; size: number }> {
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName, fileData }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback data URL for standalone mode
    }
    return {
      url: fileData, // Data URL fallback
      fileName: fileName,
      size: Math.round(fileData.length * 0.75),
    };
  },

  // QR Codes API
  async getQRCodes(): Promise<QRCodeData[]> {
    try {
      const res = await fetch('/api/qr');
      if (res.ok) return await res.json();
    } catch {
      // Fallback local
    }
    return getLocalQRs();
  },

  async getQRCodeById(id: string): Promise<QRCodeData | null> {
    try {
      const res = await fetch(`/api/qr/${id}`);
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    const list = getLocalQRs();
    return list.find((q) => q.id === id) || null;
  },

  async createQRCode(qr: Partial<QRCodeData>): Promise<QRCodeData> {
    const shortCode = qr.mode === 'dynamic' ? Math.random().toString(36).substring(2, 8) : undefined;
    const newQR: QRCodeData = {
      id: 'qr-' + Math.random().toString(36).substring(2, 9),
      name: qr.name || 'Untitled QR Code',
      type: qr.type || 'url',
      mode: qr.mode || 'static',
      shortCode,
      destinationUrl: qr.destinationUrl || (qr.content as any)?.url || (qr.content as any)?.mediaUrl || 'https://qrcraft.app',
      content: qr.content || { url: 'https://qrcraft.app' },
      customization: qr.customization || PRESET_TEMPLATES[0].customization,
      folderId: qr.folderId,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      scansCount: 0,
    };

    try {
      const res = await fetch('/api/qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newQR),
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback local
    }

    const list = getLocalQRs();
    list.unshift(newQR);
    saveLocalQRs(list);
    return newQR;
  },

  async updateQRCode(id: string, updates: Partial<QRCodeData>): Promise<QRCodeData> {
    try {
      const res = await fetch(`/api/qr/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }

    const list = getLocalQRs();
    const idx = list.findIndex((q) => q.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates };
      saveLocalQRs(list);
      return list[idx];
    }
    throw new Error('QR Code not found');
  },

  async deleteQRCode(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/qr/${id}`, { method: 'DELETE' });
      if (res.ok) return true;
    } catch {
      // Fallback
    }

    let list = getLocalQRs();
    list = list.filter((q) => q.id !== id);
    saveLocalQRs(list);
    return true;
  },

  // Folders API
  async getFolders(): Promise<FolderData[]> {
    try {
      const res = await fetch('/api/folders');
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return getLocalFolders();
  },

  async createFolder(name: string): Promise<FolderData> {
    const newFolder: FolderData = {
      id: 'f-' + Math.random().toString(36).substring(2, 7),
      name,
      qrCount: 0,
      createdAt: new Date().toISOString(),
    };
    try {
      const res = await fetch('/api/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    const folders = getLocalFolders();
    folders.push(newFolder);
    saveLocalFolders(folders);
    return newFolder;
  },

  async deleteFolder(id: string): Promise<boolean> {
    try {
      await fetch(`/api/folders/${id}`, { method: 'DELETE' });
    } catch {
      // Fallback
    }
    let folders = getLocalFolders();
    folders = folders.filter((f) => f.id !== id);
    saveLocalFolders(folders);
    return true;
  },

  // Analytics API
  async getAnalytics(qrId?: string): Promise<AnalyticsSummary> {
    try {
      const url = qrId ? `/api/qr/${qrId}/analytics` : '/api/analytics/overview';
      const res = await fetch(url);
      if (res.ok) return await res.json();
    } catch {
      // Fallback mock analytics
    }

    const dates = ['Aug 1', 'Aug 2', 'Aug 3', 'Aug 4', 'Aug 5', 'Aug 6'];
    const scansOverTime = dates.map((date, index) => ({
      date,
      scans: 450 + index * 320 + Math.floor(Math.random() * 100),
      unique: 310 + index * 210,
    }));

    return {
      totalScans: 5109,
      uniqueScans: 3840,
      scansToday: 910,
      scansThisWeek: 3420,
      scansThisMonth: 5109,
      activeQRCodes: 4,
      scansOverTime,
      devicesBreakdown: [
        { name: 'Mobile', value: 3820 },
        { name: 'Desktop', value: 980 },
        { name: 'Tablet', value: 309 },
      ],
      osBreakdown: [
        { name: 'iOS', value: 2450 },
        { name: 'Android', value: 1680 },
        { name: 'Windows', value: 610 },
        { name: 'macOS', value: 369 },
      ],
      browserBreakdown: [
        { name: 'Safari', value: 2310 },
        { name: 'Chrome', value: 2190 },
        { name: 'Firefox', value: 410 },
        { name: 'Edge', value: 199 },
      ],
      countryBreakdown: [
        { country: 'United States', scans: 2410 },
        { country: 'United Kingdom', scans: 980 },
        { country: 'Germany', scans: 640 },
        { country: 'Canada', scans: 510 },
        { country: 'Japan', scans: 310 },
      ],
      topReferrers: [
        { referrer: 'Direct Camera Scan', scans: 3950 },
        { referrer: 'google.com', scans: 610 },
        { referrer: 'instagram.com', scans: 340 },
        { referrer: 'twitter.com', scans: 209 },
      ],
    };
  },
};
