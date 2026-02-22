import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { connectMongo, mysqlPool } from './config/db.js';
import mysqlErrorHandler from './middleware/mysqlErrorHandler.js';
import authRoutes from './routes/authRoutes.js';
import logRoutes from './routes/logRoutes.js';
import catalogRoutes from './routes/catalogRoutes.js';
import circulationRoutes from './routes/circulationRoutes.js';
import membersRoutes from './routes/membersRoutes.js';
import finesRoutes from './routes/finesRoutes.js';
import bookIngestRoutes from './routes/bookIngestRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import authorsRoutes from './routes/authorsRoutes.js';
import loansRoutes from './routes/loansRoutes.js';

const app = express();

connectMongo();

const corsOrigin = process.env.FRONTEND_URL || true;
app.use(cors({ origin: corsOrigin }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('City Library Archives API Running');
});

app.get('/api/health', async (req, res) => {
  try {
    await mysqlPool.query('SELECT 1');
    const mongodb = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    res.json({
      status: 'healthy',
      mysql: 'connected',
      mongodb,
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message,
    });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/log', logRoutes);
app.use('/api/catalog', catalogRoutes);
app.use('/api', circulationRoutes);
app.use('/api/members', membersRoutes);
app.use('/api/fines', finesRoutes);
app.use('/api/books', bookIngestRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/authors', authorsRoutes);
app.use('/api/loans', loansRoutes);

app.use(mysqlErrorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
