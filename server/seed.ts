import { prisma } from './db';
import { PRESET_TEMPLATES } from '../src/lib/templates';

async function seed() {
  console.log('🌱 Seeding QRCraft database...');

  // Clean existing
  await prisma.scan.deleteMany();
  await prisma.qRCode.deleteMany();
  await prisma.folder.deleteMany();
  await prisma.user.deleteMany();

  // Create demo user
  const user = await prisma.user.create({
    data: {
      email: 'alex@qrcraft.app',
      passwordHash: 'hashed_pass_123',
      name: 'Alex Rivera',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      plan: 'PRO',
    },
  });

  // Create folders
  const folderMarketing = await prisma.folder.create({
    data: { name: 'Marketing Campaigns', userId: user.id },
  });

  const folderFacilities = await prisma.folder.create({
    data: { name: 'Office & Facilities', userId: user.id },
  });

  // Create sample QR codes
  const qr1 = await prisma.qRCode.create({
    data: {
      userId: user.id,
      folderId: folderMarketing.id,
      name: 'QRCraft Platform Launch',
      type: 'URL',
      mode: 'DYNAMIC',
      shortCode: 'launch-2026',
      destinationUrl: 'https://qrcraft.app',
      contentJson: JSON.stringify({ url: 'https://qrcraft.app', utmSource: 'qr_print', utmCampaign: 'launch' }),
      customizationJson: JSON.stringify(PRESET_TEMPLATES[1].customization),
      status: 'ACTIVE',
    },
  });

  const qr2 = await prisma.qRCode.create({
    data: {
      userId: user.id,
      folderId: folderFacilities.id,
      name: 'HQ Guest Wi-Fi',
      type: 'WIFI',
      mode: 'STATIC',
      shortCode: 'wifi-hq',
      contentJson: JSON.stringify({ ssid: 'QRCraft-Guest', password: 'SecurePassword2026', security: 'WPA2' }),
      customizationJson: JSON.stringify(PRESET_TEMPLATES[0].customization),
      status: 'ACTIVE',
    },
  });

  const qr3 = await prisma.qRCode.create({
    data: {
      userId: user.id,
      folderId: folderMarketing.id,
      name: 'Executive Contact vCard',
      type: 'VCARD',
      mode: 'DYNAMIC',
      shortCode: 'alex-card',
      destinationUrl: 'https://qrcraft.app/card/alex',
      contentJson: JSON.stringify({
        firstName: 'Alex',
        lastName: 'Rivera',
        company: 'QRCraft Technologies',
        jobTitle: 'VP Product Engineering',
        phone: '+1 (555) 019-2834',
        email: 'alex@qrcraft.app',
        website: 'https://qrcraft.app',
      }),
      customizationJson: JSON.stringify(PRESET_TEMPLATES[2].customization),
      status: 'ACTIVE',
    },
  });

  // Seed sample scan events for analytics
  const devices = ['Mobile', 'Desktop', 'Tablet'];
  const osList = ['iOS', 'Android', 'Windows', 'macOS'];
  const browsers = ['Safari', 'Chrome', 'Firefox', 'Edge'];
  const countries = ['United States', 'United Kingdom', 'Germany', 'Canada', 'Japan'];
  const cities = ['San Francisco', 'London', 'Berlin', 'Toronto', 'Tokyo'];
  const referrers = ['Direct Camera Scan', 'google.com', 'instagram.com', 'twitter.com'];

  const now = new Date();
  const scanData = [];

  for (let i = 0; i < 60; i++) {
    const daysAgo = Math.floor(Math.random() * 14);
    const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    const randomQr = i % 2 === 0 ? qr1.id : qr3.id;

    scanData.push({
      qrCodeId: randomQr,
      timestamp: date,
      ipHash: 'ip-hash-' + (i % 12),
      country: countries[i % countries.length],
      city: cities[i % cities.length],
      deviceType: devices[i % devices.length],
      os: osList[i % osList.length],
      browser: browsers[i % browsers.length],
      referrer: referrers[i % referrers.length],
    });
  }

  await prisma.scan.createMany({ data: scanData });

  console.log('✅ Database seeded successfully with demo user, QRs, and analytics!');
}

seed()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
