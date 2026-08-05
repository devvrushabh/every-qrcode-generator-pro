import {
  QRTypeID,
  QRPayload,
  URLPayload,
  TextPayload,
  EmailPayload,
  PhonePayload,
  SMSPayload,
  VCardPayload,
  WifiPayload,
  LocationPayload,
  MultiUrlPayload,
  SocialPayload,
  WhatsAppPayload,
  MediaPayload,
  AppDownloadPayload,
} from '../types/qr';

export function buildQRPayload(type: QRTypeID, payload: QRPayload): string {
  switch (type) {
    case 'url': {
      const p = payload as URLPayload;
      let target = p.url?.trim() || '';
      if (target && !/^https?:\/\//i.test(target)) {
        target = 'https://' + target;
      }
      
      if (target && (p.utmSource || p.utmMedium || p.utmCampaign)) {
        const urlObj = new URL(target);
        if (p.utmSource) urlObj.searchParams.set('utm_source', p.utmSource);
        if (p.utmMedium) urlObj.searchParams.set('utm_medium', p.utmMedium);
        if (p.utmCampaign) urlObj.searchParams.set('utm_campaign', p.utmCampaign);
        target = urlObj.toString();
      }
      return target || 'https://qrcraft.app';
    }

    case 'text': {
      const p = payload as TextPayload;
      return p.text || 'Welcome to QRCraft!';
    }

    case 'email': {
      const p = payload as EmailPayload;
      const email = p.email || 'hello@example.com';
      const subject = encodeURIComponent(p.subject || '');
      const message = encodeURIComponent(p.message || '');
      return `mailto:${email}?subject=${subject}&body=${message}`;
    }

    case 'phone': {
      const p = payload as PhonePayload;
      const cleanPhone = (p.phone || '').replace(/[^0-9+]/g, '');
      return `tel:${cleanPhone || '+15550199823'}`;
    }

    case 'sms': {
      const p = payload as SMSPayload;
      const cleanPhone = (p.phone || '').replace(/[^0-9+]/g, '');
      const msg = p.message || '';
      return `smsto:${cleanPhone}:${msg}`;
    }

    case 'vcard': {
      const p = payload as VCardPayload;
      const vcard = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `N:${p.lastName || ''};${p.firstName || ''};;;`,
        `FN:${(p.firstName + ' ' + p.lastName).trim() || 'Contact Name'}`,
        p.company ? `ORG:${p.company}` : '',
        p.jobTitle ? `TITLE:${p.jobTitle}` : '',
        p.phone ? `TEL;TYPE=CELL:${p.phone}` : '',
        p.email ? `EMAIL:${p.email}` : '',
        p.website ? `URL:${p.website.startsWith('http') ? p.website : 'https://' + p.website}` : '',
        p.address ? `ADR:;;${p.address};;;;` : '',
        'END:VCARD',
      ]
        .filter(Boolean)
        .join('\n');
      return vcard;
    }

    case 'wifi': {
      const p = payload as WifiPayload;
      const ssid = (p.ssid || 'MyWiFiNetwork').replace(/([\\;:,"])/g, '\\$1');
      const password = (p.password || '').replace(/([\\;:,"])/g, '\\$1');
      const security = p.security || 'WPA';
      const hidden = p.hidden ? 'true' : 'false';
      return `WIFI:S:${ssid};T:${security};P:${password};H:${hidden};;`;
    }

    case 'location': {
      const p = payload as LocationPayload;
      const lat = p.latitude?.trim() || '37.7749';
      const lng = p.longitude?.trim() || '-122.4194';
      return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    }

    case 'social': {
      const p = payload as SocialPayload;
      // In production SaaS, points to hosted profile page
      return `https://qrcraft.app/p/social?title=${encodeURIComponent(p.title || 'My Profiles')}`;
    }

    case 'multi_url': {
      const p = payload as MultiUrlPayload;
      return `https://qrcraft.app/p/multi?title=${encodeURIComponent(p.title || 'My Links')}`;
    }

    case 'whatsapp': {
      const p = payload as WhatsAppPayload;
      const cleanPhone = (p.phone || '').replace(/[^0-9]/g, '');
      const msg = encodeURIComponent(p.message || '');
      return `https://wa.me/${cleanPhone}?text=${msg}`;
    }

    case 'pdf':
    case 'image':
    case 'video': {
      const p = payload as MediaPayload;
      let url = p.mediaUrl?.trim() || 'https://qrcraft.app';
      if (url && !/^https?:\/\//i.test(url)) url = 'https://' + url;
      return url;
    }

    case 'app_download': {
      const p = payload as AppDownloadPayload;
      let url = p.fallbackUrl?.trim() || p.iosUrl || p.androidUrl || 'https://qrcraft.app';
      if (url && !/^https?:\/\//i.test(url)) url = 'https://' + url;
      return url;
    }

    default:
      return 'https://qrcraft.app';
  }
}

export function validateQRPayload(type: QRTypeID, payload: QRPayload): { isValid: boolean; error?: string } {
  switch (type) {
    case 'url': {
      const p = payload as URLPayload;
      if (!p.url?.trim()) return { isValid: false, error: 'Please enter a URL' };
      const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/i;
      if (!urlPattern.test(p.url.trim())) {
        return { isValid: false, error: 'Please enter a valid URL (e.g. https://example.com)' };
      }
      return { isValid: true };
    }

    case 'email': {
      const p = payload as EmailPayload;
      if (!p.email?.trim()) return { isValid: false, error: 'Please enter an email address' };
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(p.email.trim())) {
        return { isValid: false, error: 'Please enter a valid email address' };
      }
      return { isValid: true };
    }

    case 'phone':
    case 'sms':
    case 'whatsapp': {
      const p = payload as PhonePayload;
      if (!p.phone?.trim()) return { isValid: false, error: 'Please enter a phone number' };
      if (p.phone.replace(/[^0-9]/g, '').length < 5) {
        return { isValid: false, error: 'Please enter a valid phone number with country code' };
      }
      return { isValid: true };
    }

    case 'wifi': {
      const p = payload as WifiPayload;
      if (!p.ssid?.trim()) return { isValid: false, error: 'Network SSID name is required' };
      if (p.security !== 'nopass' && !p.password) {
        return { isValid: false, error: 'Password is required for encrypted networks' };
      }
      return { isValid: true };
    }

    case 'vcard': {
      const p = payload as VCardPayload;
      if (!p.firstName?.trim() && !p.lastName?.trim() && !p.company?.trim()) {
        return { isValid: false, error: 'Please enter a name or company' };
      }
      return { isValid: true };
    }

    default:
      return { isValid: true };
  }
}
