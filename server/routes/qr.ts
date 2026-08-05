import { Router } from 'express';
import { prisma } from '../db';
import crypto from 'crypto';

const router = Router();

// GET all QR Codes
router.get('/', async (req, res) => {
  try {
    const qrCodes = await prisma.qRCode.findMany({
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { scans: true } } },
    });

    const formatted = qrCodes.map((q) => ({
      id: q.id,
      name: q.name,
      type: q.type.toLowerCase(),
      mode: q.mode.toLowerCase(),
      shortCode: q.shortCode,
      destinationUrl: q.destinationUrl,
      content: JSON.parse(q.contentJson),
      customization: JSON.parse(q.customizationJson),
      folderId: q.folderId,
      status: q.status,
      createdAt: q.createdAt,
      scansCount: q._count.scans,
    }));

    return res.json(formatted);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch QR codes' });
  }
});

// GET single QR Code
router.get('/:id', async (req, res) => {
  try {
    const q = await prisma.qRCode.findUnique({
      where: { id: req.params.id },
      include: { _count: { select: { scans: true } } },
    });
    if (!q) return res.status(404).json({ error: 'QR Code not found' });

    return res.json({
      id: q.id,
      name: q.name,
      type: q.type.toLowerCase(),
      mode: q.mode.toLowerCase(),
      shortCode: q.shortCode,
      destinationUrl: q.destinationUrl,
      content: JSON.parse(q.contentJson),
      customization: JSON.parse(q.customizationJson),
      folderId: q.folderId,
      status: q.status,
      createdAt: q.createdAt,
      scansCount: q._count.scans,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch QR code details' });
  }
});

// POST create QR Code
router.post('/', async (req, res) => {
  try {
    const { name, type, mode, destinationUrl, content, customization, folderId, userId } = req.body;

    const shortCode = mode === 'dynamic' ? crypto.randomBytes(4).toString('hex') : crypto.randomBytes(6).toString('hex');
    const dbType = (type || 'url').toUpperCase();
    const dbMode = (mode || 'static').toUpperCase();

    // Default user fallback for demo/dev
    let targetUserId = userId;
    if (!targetUserId) {
      const firstUser = await prisma.user.findFirst();
      if (firstUser) targetUserId = firstUser.id;
      else {
        const createdUser = await prisma.user.create({
          data: {
            email: 'demo@qrcraft.app',
            passwordHash: 'hashed_password',
            name: 'Demo User',
            plan: 'PRO',
          },
        });
        targetUserId = createdUser.id;
      }
    }

    const created = await prisma.qRCode.create({
      data: {
        userId: targetUserId,
        folderId: folderId || null,
        name: name || 'Untitled QR Code',
        type: dbType,
        mode: dbMode,
        shortCode,
        destinationUrl: destinationUrl || null,
        contentJson: JSON.stringify(content || {}),
        customizationJson: JSON.stringify(customization || {}),
        status: 'ACTIVE',
      },
    });

    return res.status(201).json({
      id: created.id,
      name: created.name,
      type: created.type.toLowerCase(),
      mode: created.mode.toLowerCase(),
      shortCode: created.shortCode,
      destinationUrl: created.destinationUrl,
      content: JSON.parse(created.contentJson),
      customization: JSON.parse(created.customizationJson),
      folderId: created.folderId,
      status: created.status,
      createdAt: created.createdAt,
      scansCount: 0,
    });
  } catch (error) {
    console.error('Error creating QR Code:', error);
    return res.status(500).json({ error: 'Failed to create QR Code' });
  }
});

// PUT update QR Code (e.g. edit destination)
router.put('/:id', async (req, res) => {
  try {
    const { name, destinationUrl, content, customization, folderId, status } = req.body;

    const existing = await prisma.qRCode.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: 'QR Code not found' });

    const updated = await prisma.qRCode.update({
      where: { id: req.params.id },
      data: {
        name: name !== undefined ? name : existing.name,
        destinationUrl: destinationUrl !== undefined ? destinationUrl : existing.destinationUrl,
        contentJson: content !== undefined ? JSON.stringify(content) : existing.contentJson,
        customizationJson: customization !== undefined ? JSON.stringify(customization) : existing.customizationJson,
        folderId: folderId !== undefined ? folderId : existing.folderId,
        status: status !== undefined ? status : existing.status,
      },
      include: { _count: { select: { scans: true } } },
    });

    return res.json({
      id: updated.id,
      name: updated.name,
      type: updated.type.toLowerCase(),
      mode: updated.mode.toLowerCase(),
      shortCode: updated.shortCode,
      destinationUrl: updated.destinationUrl,
      content: JSON.parse(updated.contentJson),
      customization: JSON.parse(updated.customizationJson),
      folderId: updated.folderId,
      status: updated.status,
      createdAt: updated.createdAt,
      scansCount: updated._count.scans,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update QR Code' });
  }
});

// DELETE QR Code
router.delete('/:id', async (req, res) => {
  try {
    await prisma.qRCode.delete({ where: { id: req.params.id } });
    return res.json({ success: true, message: 'QR Code deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete QR Code' });
  }
});

export default router;
