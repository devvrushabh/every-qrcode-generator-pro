import { QRCustomization } from '../types/qr';

export interface SafetyCheckResult {
  score: number; // 0 - 100
  status: 'OPTIMAL' | 'WARNING' | 'CRITICAL';
  warnings: string[];
  contrastRatio: number;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    return {
      r: parseInt(cleanHex[0] + cleanHex[0], 16),
      g: parseInt(cleanHex[1] + cleanHex[1], 16),
      b: parseInt(cleanHex[2] + cleanHex[2], 16),
    };
  }
  if (cleanHex.length === 6) {
    return {
      r: parseInt(cleanHex.substring(0, 2), 16),
      g: parseInt(cleanHex.substring(2, 4), 16),
      b: parseInt(cleanHex.substring(4, 6), 16),
    };
  }
  return null;
}

function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export function checkQRSafety(customization: QRCustomization): SafetyCheckResult {
  const warnings: string[] = [];
  let score = 100;

  // 1. Contrast Check
  const fgRgb = hexToRgb(customization.foregroundColor) || { r: 0, g: 0, b: 0 };
  const bgRgb = hexToRgb(customization.backgroundColor) || { r: 255, g: 255, b: 255 };

  const fgLum = getLuminance(fgRgb.r, fgRgb.g, fgRgb.b);
  const bgLum = getLuminance(bgRgb.r, bgRgb.g, bgRgb.b);

  const l1 = Math.max(fgLum, bgLum);
  const l2 = Math.min(fgLum, bgLum);
  const contrastRatio = (l1 + 0.05) / (l2 + 0.05);

  // QR codes need foreground darker than background for most camera scanners!
  if (fgLum > bgLum) {
    score -= 30;
    warnings.push('Light foreground on dark background may cause scanning issues on older devices.');
  }

  if (contrastRatio < 2.5) {
    score -= 40;
    warnings.push(`Low color contrast (${contrastRatio.toFixed(1)}:1). Make foreground darker or background lighter.`);
  } else if (contrastRatio < 4.5) {
    score -= 15;
    warnings.push(`Moderate color contrast (${contrastRatio.toFixed(1)}:1). Higher contrast ensures instant scanning.`);
  }

  // 2. Logo Size vs Error Correction Level
  if (customization.logoUrl) {
    const ec = customization.errorCorrectionLevel;
    const maxLogoSizeMap: Record<string, number> = {
      L: 0.12, // 12%
      M: 0.20, // 20%
      Q: 0.28, // 28%
      H: 0.35, // 35%
    };
    const maxAllowed = maxLogoSizeMap[ec] || 0.2;

    if (customization.logoSize > maxAllowed) {
      score -= 25;
      warnings.push(
        `Logo size (${Math.round(customization.logoSize * 100)}%) is too large for Error Correction level '${ec}'. Switch EC level to 'H' or decrease logo size.`
      );
    }
  }

  // 3. Quiet Zone Check
  if (customization.quietZone === 0) {
    score -= 15;
    warnings.push('Zero Quiet Zone margin may prevent phone cameras from recognizing QR borders.');
  }

  let status: 'OPTIMAL' | 'WARNING' | 'CRITICAL' = 'OPTIMAL';
  if (score < 50) status = 'CRITICAL';
  else if (score < 85 || warnings.length > 0) status = 'WARNING';

  return {
    score: Math.max(0, score),
    status,
    warnings,
    contrastRatio: Number(contrastRatio.toFixed(2)),
  };
}
