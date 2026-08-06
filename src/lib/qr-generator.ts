import QRCodeStyling, {
  DrawType,
  TypeNumber,
  Mode,
  ErrorCorrectionLevel,
  DotType,
  CornerSquareType,
  CornerDotType,
} from 'qr-code-styling';
import { QRCustomization } from '../types/qr';

export function createQRCodeInstance(text: string, customization: QRCustomization, size: number = 300): QRCodeStyling {
  // Map customization shapes
  const dotTypeMap: Record<string, DotType> = {
    square: 'square',
    dots: 'dots',
    rounded: 'rounded',
    'extra-rounded': 'extra-rounded',
    classy: 'classy-rounded',
  };

  const eyeFrameMap: Record<string, CornerSquareType> = {
    square: 'square',
    rounded: 'extra-rounded',
    circle: 'dot',
  };

  const eyeDotMap: Record<string, CornerDotType> = {
    square: 'square',
    rounded: 'dot',
    circle: 'dot',
  };

  const dotsOptions: any = {
    color: customization.foregroundColor,
    type: dotTypeMap[customization.dotStyle] || 'square',
  };

  if (customization.useGradient && customization.gradientColor) {
    dotsOptions.gradient = {
      type: customization.gradientType || 'linear',
      rotation: 45,
      colorStops: [
        { offset: 0, color: customization.foregroundColor },
        { offset: 1, color: customization.gradientColor },
      ],
    };
  }

  return new QRCodeStyling({
    width: size,
    height: size,
    type: 'canvas' as DrawType,
    data: text || 'https://qrcraft.app',
    margin: (customization.quietZone ?? 2) * 10,
    qrOptions: {
      typeNumber: 0 as TypeNumber,
      mode: 'Byte' as Mode,
      errorCorrectionLevel: (customization.errorCorrectionLevel || 'M') as ErrorCorrectionLevel,
    },
    image: customization.logoUrl || undefined,
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: customization.logoSize || 0.2,
      margin: customization.logoMargin ?? 2,
      crossOrigin: 'anonymous',
    },
    dotsOptions,
    backgroundOptions: {
      color: customization.backgroundColor || '#ffffff',
    },
    cornersSquareOptions: {
      color: customization.eyeOuterColor || customization.foregroundColor,
      type: eyeFrameMap[customization.eyeFrameStyle] || 'square',
    },
    cornersDotOptions: {
      color: customization.eyeInnerColor || customization.foregroundColor,
      type: eyeDotMap[customization.eyeDotStyle] || 'square',
    },
  });
}

export async function downloadQRCode(
  text: string,
  customization: QRCustomization,
  format: 'png' | 'svg',
  dimension: number = 1024,
  filename: string = 'qrcraft-qrcode'
) {
  const qrInstance = createQRCodeInstance(text, customization, dimension);
  await qrInstance.download({
    name: filename,
    extension: format,
  });
}

export async function getQRCodeBlob(
  text: string,
  customization: QRCustomization,
  dimension: number = 1024
): Promise<Blob | null> {
  try {
    const qrInstance = createQRCodeInstance(text, customization, dimension);
    const rawData = await qrInstance.getRawData('png');
    if (!rawData) return null;
    if (rawData instanceof Blob) return rawData;
    const uint8Array = new Uint8Array(rawData as any);
    return new Blob([uint8Array], { type: 'image/png' });
  } catch (error) {
    console.error('Error extracting QR code blob:', error);
    return null;
  }
}

