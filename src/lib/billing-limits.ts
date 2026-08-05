import { UserPlan, UserProfile } from '../types/auth';

export interface PlanLimits {
  name: string;
  maxDynamicQRs: number;
  maxStaticQRs: number; // -1 for unlimited
  allowSVG: boolean;
  allowFolders: boolean;
  allowTemplates: boolean;
  allowBulkCSV: boolean;
  analyticsHistoryDays: number;
  customLogoAllowed: boolean;
}

export const PLAN_LIMITS: Record<UserPlan, PlanLimits> = {
  FREE: {
    name: 'Free Starter',
    maxDynamicQRs: 2,
    maxStaticQRs: -1, // unlimited
    allowSVG: false,
    allowFolders: false,
    allowTemplates: true,
    allowBulkCSV: false,
    analyticsHistoryDays: 7,
    customLogoAllowed: true,
  },
  PRO: {
    name: 'Pro Creator',
    maxDynamicQRs: 50,
    maxStaticQRs: -1,
    allowSVG: true,
    allowFolders: true,
    allowTemplates: true,
    allowBulkCSV: true,
    analyticsHistoryDays: 90,
    customLogoAllowed: true,
  },
  BUSINESS: {
    name: 'Enterprise Business',
    maxDynamicQRs: 1000,
    maxStaticQRs: -1,
    allowSVG: true,
    allowFolders: true,
    allowTemplates: true,
    allowBulkCSV: true,
    analyticsHistoryDays: 365,
    customLogoAllowed: true,
  },
};

export function canCreateDynamicQR(user: UserProfile | null, currentDynamicCount: number): boolean {
  if (!user) return currentDynamicCount < 2; // Unauthenticated guest limit
  const limit = PLAN_LIMITS[user.plan].maxDynamicQRs;
  return limit === -1 || currentDynamicCount < limit;
}

export function canDownloadSVG(user: UserProfile | null): boolean {
  if (!user) return false;
  return PLAN_LIMITS[user.plan].allowSVG;
}

export function canUseFolders(user: UserProfile | null): boolean {
  if (!user) return false;
  return PLAN_LIMITS[user.plan].allowFolders;
}

export function canUseBulkCSV(user: UserProfile | null): boolean {
  if (!user) return false;
  return PLAN_LIMITS[user.plan].allowBulkCSV;
}
