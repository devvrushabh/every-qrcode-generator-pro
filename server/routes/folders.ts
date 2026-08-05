import { Router } from 'express';
import { prisma } from '../db';

const router = Router();

// GET folders
router.get('/', async (req, res) => {
  try {
    const folders = await prisma.folder.findMany({
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { qrCodes: true } } },
    });

    const formatted = folders.map((f) => ({
      id: f.id,
      name: f.name,
      qrCount: f._count.qrCodes,
      createdAt: f.createdAt,
    }));

    return res.json(formatted);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch folders' });
  }
});

// POST create folder
router.post('/', async (req, res) => {
  try {
    const { name, userId } = req.body;
    if (!name) return res.status(400).json({ error: 'Folder name is required' });

    let targetUserId = userId;
    if (!targetUserId) {
      const user = await prisma.user.findFirst();
      if (user) targetUserId = user.id;
    }

    const folder = await prisma.folder.create({
      data: {
        name,
        userId: targetUserId,
      },
    });

    return res.status(201).json({
      id: folder.id,
      name: folder.name,
      qrCount: 0,
      createdAt: folder.createdAt,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create folder' });
  }
});

// DELETE folder
router.delete('/:id', async (req, res) => {
  try {
    await prisma.folder.delete({ where: { id: req.params.id } });
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete folder' });
  }
});

export default router;
