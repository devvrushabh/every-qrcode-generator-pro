import { UAParser } from 'ua-parser-js';
import crypto from 'crypto';

export interface ParsedAgentInfo {
  deviceType: 'Desktop' | 'Mobile' | 'Tablet';
  os: string;
  browser: string;
  ipHash: string;
}

export function parseScanAgent(userAgentString: string, ipAddress: string = ''): ParsedAgentInfo {
  const parser = new UAParser(userAgentString);
  const result = parser.getResult();

  let deviceType: 'Desktop' | 'Mobile' | 'Tablet' = 'Desktop';
  if (result.device.type === 'mobile') deviceType = 'Mobile';
  else if (result.device.type === 'tablet') deviceType = 'Tablet';
  else if (/Mobile|Android|iP(hone|od)/i.test(userAgentString)) deviceType = 'Mobile';

  const os = result.os.name || 'Unknown OS';
  const browser = result.browser.name || 'Unknown Browser';

  // Compute non-reversible hash of IP for privacy compliance
  const ipHash = crypto
    .createHash('sha256')
    .update(ipAddress + 'qrcraft-salt')
    .digest('hex')
    .substring(0, 16);

  return {
    deviceType,
    os,
    browser,
    ipHash,
  };
}
