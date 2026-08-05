import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import qrRoutes from './routes/qr';
import folderRoutes from './routes/folders';
import analyticsRoutes from './routes/analytics';
import redirectRoutes from './routes/redirect';
import uploadRoutes from './routes/upload';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '25mb' }));

// Serve uploaded files statically
const uploadsPath = path.join(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadsPath));

// REST API routes
app.use('/api/qr', qrRoutes);
app.use('/api/folders', folderRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/upload', uploadRoutes);

// Dynamic redirect route
app.use('/r', redirectRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'QRCraft SaaS API', version: '1.0.0' });
});

// Serve frontend build in production if available
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 QRCraft Server listening on http://localhost:${PORT}`);
});
