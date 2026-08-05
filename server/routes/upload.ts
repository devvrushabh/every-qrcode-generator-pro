import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const router = Router();
const uploadsDir = path.join(process.cwd(), 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Upload file endpoint (base64 or binary payload)
router.post('/', (req, res) => {
  try {
    const { fileName, fileData } = req.body;

    if (!fileData) {
      return res.status(400).json({ error: 'File data is required' });
    }

    // Extract mime/extension
    const matches = fileData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let extension = 'bin';
    let base64Content = fileData;

    if (matches && matches.length === 3) {
      const mime = matches[1];
      base64Content = matches[2];

      if (mime === 'application/pdf') extension = 'pdf';
      else if (mime === 'image/png') extension = 'png';
      else if (mime === 'image/jpeg' || mime === 'image/jpg') extension = 'jpg';
      else if (mime === 'image/svg+xml') extension = 'svg';
      else if (mime === 'image/webp') extension = 'webp';
    } else {
      const extMatch = (fileName || '').split('.').pop();
      if (extMatch) extension = extMatch;
    }

    const uniqueId = crypto.randomBytes(8).toString('hex');
    const safeName = `${uniqueId}.${extension}`;
    const filePath = path.join(uploadsDir, safeName);

    const buffer = Buffer.from(base64Content, 'base64');
    fs.writeFileSync(filePath, buffer);

    const fileUrl = `/uploads/${safeName}`;
    return res.status(201).json({
      success: true,
      url: fileUrl,
      fileName: fileName || safeName,
      size: buffer.length,
    });
  } catch (error) {
    console.error('File upload error:', error);
    return res.status(500).json({ error: 'Failed to upload file' });
  }
});

export default router;
