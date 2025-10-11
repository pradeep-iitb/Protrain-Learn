import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import router from './routes.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3001;
const ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

// Allow requests from configured origin and any localhost port (dev)
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // same-origin or curl
      if (origin === ORIGIN) return cb(null, true);
      if (origin.startsWith('http://localhost:')) return cb(null, true);
      return cb(new Error('Not allowed by CORS'));
    }
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/', (_req, res) => {
  res.json({ ok: true, service: 'protrain-server' });
});

app.use('/api', router);

// Start HTTP server immediately for resilience
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server listening on http://localhost:${PORT}`);
  console.log(`📡 Ready to accept requests...`);
});

// Prevent server from exiting
server.on('error', (err) => {
  console.error('❌ Server error:', err);
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please free the port and try again.`);
    process.exit(1);
  }
});

// Connect to MongoDB in the background; do not crash on failure
(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: 'protrain' });
    console.log('✅ MongoDB connected');
  } catch (dbErr) {
    console.warn('⚠️  MongoDB connection failed, continuing without DB. Some features will be transient.');
  }
})();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log('Server closed');
      process.exit(0);
    });
  });
});

// Keep process alive
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

// Explicit keepalive - prevent premature exit
const keepAlive = setInterval(() => {
  console.log('🔄 Keepalive tick...');
}, 10000); // Check every 10 seconds

// Cleanup on exit
process.on('exit', (code) => {
  clearInterval(keepAlive);
  console.log(`⚠️ Process exiting with code: ${code}`);
});

process.on('SIGINT', () => {
  console.log('\n🛑 SIGINT received, shutting down gracefully...');
  server.close(() => {
    clearInterval(keepAlive);
    process.exit(0);
  });
});

// Do NOT export - this is an entry point, not a module
// export default app;
