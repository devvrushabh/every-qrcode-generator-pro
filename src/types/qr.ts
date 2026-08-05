export type QRTypeID =
  | 'url'
  | 'text'
  | 'email'
  | 'phone'
  | 'sms'
  | 'vcard'
  | 'wifi'
  | 'location'
  | 'social'
  | 'multi_url'
  | 'whatsapp'
  | 'pdf'
  | 'image'
  | 'video'
  | 'app_download';

export type QRModeType = 'static' | 'dynamic';

export type DotStyle = 'square' | 'dots' | 'rounded' | 'extra-rounded' | 'classy';
export type EyeFrameStyle = 'square' | 'rounded' | 'circle';
export type EyeDotStyle = 'square' | 'rounded' | 'circle';
export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export interface QRCustomization {
  foregroundColor: string;
  backgroundColor: string;
  useGradient: boolean;
  gradientType: 'linear' | 'radial';
  gradientColor: string;
  dotStyle: DotStyle;
  eyeFrameStyle: EyeFrameStyle;
  eyeDotStyle: EyeDotStyle;
  eyeOuterColor: string;
  eyeInnerColor: string;
  logoUrl?: string;
  logoSize: number; // 0.1 to 0.4
  logoMargin: number;
  quietZone: number; // 0 to 4
  errorCorrectionLevel: ErrorCorrectionLevel;
}

export interface QRTemplate {
  id: string;
  name: string;
  description: string;
  customization: QRCustomization;
  previewBg: string;
}

// Payload Types
export interface URLPayload {
  url: string;
  campaignName?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export interface TextPayload {
  text: string;
}

export interface EmailPayload {
  email: string;
  subject: string;
  message: string;
}

export interface PhonePayload {
  phone: string;
}

export interface SMSPayload {
  phone: string;
  message: string;
}

export interface VCardPayload {
  firstName: string;
  lastName: string;
  company: string;
  jobTitle: string;
  phone: string;
  email: string;
  website: string;
  address: string;
}

export interface WifiPayload {
  ssid: string;
  password: string;
  security: 'WPA' | 'WPA2' | 'WPA3' | 'nopass';
  hidden: boolean;
}

export interface LocationPayload {
  latitude: string;
  longitude: string;
  locationName: string;
}

export interface MultiUrlItem {
  id: string;
  title: string;
  url: string;
  icon?: string;
}

export interface MultiUrlPayload {
  title: string;
  description: string;
  links: MultiUrlItem[];
}

export interface SocialLinkItem {
  platform: string;
  url: string;
}

export interface SocialPayload {
  title: string;
  bio: string;
  links: SocialLinkItem[];
}

export interface WhatsAppPayload {
  phone: string;
  message: string;
}

export interface MediaPayload {
  title: string;
  mediaUrl: string;
  description?: string;
}

export interface AppDownloadPayload {
  appName: string;
  iosUrl: string;
  androidUrl: string;
  fallbackUrl: string;
}

export type QRPayload =
  | URLPayload
  | TextPayload
  | EmailPayload
  | PhonePayload
  | SMSPayload
  | VCardPayload
  | WifiPayload
  | LocationPayload
  | MultiUrlPayload
  | SocialPayload
  | WhatsAppPayload
  | MediaPayload
  | AppDownloadPayload;

export interface QRCodeData {
  id?: string;
  name: string;
  type: QRTypeID;
  mode: QRModeType;
  shortCode?: string;
  destinationUrl?: string;
  content: QRPayload;
  customization: QRCustomization;
  folderId?: string;
  status?: 'ACTIVE' | 'PAUSED';
  createdAt?: string;
  scansCount?: number;
}
