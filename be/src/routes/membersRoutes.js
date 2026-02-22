import express from 'express';
import { mysqlPool } from '../config/db.js';

const router = express.Router();

router.post('/register', async (req, res, next) => {
  try {
    const body = req.body || {};
    const {
      first_name,
      last_name,
      email,
      password,
      phone,
      address,
    } = body;
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'first_name, last_name, email, and password are required.',
      });
    }
    await mysqlPool.query('CALL add_member(?, ?, ?, ?, ?, ?)', [
      first_name,
      last_name,
      email,
      password,
      phone ?? null,
      address ?? null,
    ]);
    res.status(201).json({ status: 'ok', message: 'Member registered.' });
  } catch (err) {
    next(err);
  }
});

export default router;
