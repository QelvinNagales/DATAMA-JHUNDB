import express from 'express';
import UserTelemetryLog from '../models/UserTelemetryLog.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { event_type, payload, timestamp } = req.body || {};
    if (!event_type) {
      return res.status(400).json({ status: 'error', message: 'event_type is required.' });
    }
    const doc = await UserTelemetryLog.create({
      event_type,
      payload: payload ?? {},
      timestamp: timestamp ? new Date(timestamp) : new Date(),
    });
    res.status(201).json({ status: 'ok', id: doc._id });
  } catch (err) {
    next(err);
  }
});

export default router;
