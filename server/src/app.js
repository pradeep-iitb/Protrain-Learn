import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import router from './routes.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
const ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: ORIGIN }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/', (_req, res) => {
  res.json({ ok: true, service: 'protrain-server' });
});

app.use('/api', router);

async function start() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: 'protrain' });
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
  } catch (err) {
    console.error('Startup error', err);
    process.exit(1);
  }
}

start();
