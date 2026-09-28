import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeSocketHub } from './services/socket-hub';

dotenv.config();

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    connections: io.engine.clientsCount
  });
});

// Hive ingest endpoint — lets Bee's own workers push live events into the
// mission-control feed. Auth: shared secret in HIVE_INGEST_SECRET (env var
// on the host), sent as the X-Hive-Secret header. Never commit the secret.
app.post('/ingest', (req, res) => {
  const secret = process.env.HIVE_INGEST_SECRET;
  if (!secret || req.headers['x-hive-secret'] !== secret) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  const { type = 'post', author, content, handle, avatar, isLive } = req.body || {};
  if (type === 'notification') {
    io.emit('notification:received', {
      title: author || 'Hive',
      message: content || '',
      timestamp: new Date().toISOString(),
    });
    return res.json({ ok: true, broadcast: 'notification:received' });
  }
  const post = {
    id: `hive-${Date.now()}-${Math.floor(Math.random() * 1e6)}`,
    author: {
      name: author || 'Hive',
      handle: handle || 'hive',
      avatar,
    },
    content: content || '',
    timestamp: new Date().toISOString(),
    isLive: isLive ?? true,
  };
  io.emit('new_post', post);
  res.json({ ok: true, broadcast: 'new_post', id: post.id });
});

initializeSocketHub(io);

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`🐝 Colony Core backend running on port ${PORT}`);
  console.log(`📡 Socket.IO server ready`);
});
