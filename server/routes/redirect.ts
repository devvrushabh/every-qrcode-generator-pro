import { Router } from 'express';
import { prisma } from '../db';
import { parseScanAgent } from '../utils/user-agent-parser';

const router = Router();

router.get('/:shortCode', async (req, res) => {
  try {
    const { shortCode } = req.params;

    const qr = await prisma.qRCode.findUnique({
      where: { shortCode },
    });

    if (!qr) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head><title>QR Code Not Found | QRCraft</title></head>
        <body style="font-family: sans-serif; text-align: center; padding: 4rem;">
          <h1>404 - QR Code Not Found</h1>
          <p>The QR code link you scanned does not exist or has been removed.</p>
          <a href="/" style="color: #4f46e5; text-decoration: underline;">Go to QRCraft Homepage</a>
        </body>
        </html>
      `);
    }

    if (qr.status !== 'ACTIVE') {
      return res.status(410).send(`
        <!DOCTYPE html>
        <html>
        <head><title>QR Code Deactivated | QRCraft</title></head>
        <body style="font-family: sans-serif; text-align: center; padding: 4rem;">
          <h1>QR Code Deactivated</h1>
          <p>This QR code is currently inactive or paused by its owner.</p>
        </body>
        </html>
      `);
    }

    // Determine target URL
    let targetUrl = qr.destinationUrl;
    if (!targetUrl) {
      const content = JSON.parse(qr.contentJson);
      targetUrl = content.url || content.website || 'https://qrcraft.app';
    }

    // Security protocol validation
    if (!targetUrl || !/^https?:\/\//i.test(targetUrl)) {
      targetUrl = 'https://' + (targetUrl || 'qrcraft.app');
    }

    // Prevent malicious protocols (javascript:, data:, file:)
    if (/^(javascript|data|file):/i.test(targetUrl)) {
      return res.status(400).send('Invalid destination protocol.');
    }

    // Record scan asynchronously
    const userAgent = req.headers['user-agent'] || '';
    const referrer = (req.headers['referer'] || req.headers['referrer'] || 'Direct Camera Scan') as string;
    const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '') as string;

    const agentInfo = parseScanAgent(userAgent, ip);

    // Simulated country fallback for demo
    const sampleCountries = ['United States', 'United Kingdom', 'Germany', 'Canada', 'Japan'];
    const sampleCities = ['San Francisco', 'London', 'Berlin', 'Toronto', 'Tokyo'];
    const randomIdx = Math.floor(Math.random() * sampleCountries.length);

    prisma.scan
      .create({
        data: {
          qrCodeId: qr.id,
          ipHash: agentInfo.ipHash,
          country: sampleCountries[randomIdx],
          city: sampleCities[randomIdx],
          deviceType: agentInfo.deviceType,
          os: agentInfo.os,
          browser: agentInfo.browser,
          referrer: referrer.substring(0, 255),
        },
      })
      .catch((err) => console.error('Failed to log scan:', err));

    // Redirect to final destination
    return res.redirect(302, targetUrl);
  } catch (error) {
    console.error('Error handling dynamic redirect:', error);
    res.status(500).send('Internal Server Error processing scan redirect.');
  }
});

export default router;
