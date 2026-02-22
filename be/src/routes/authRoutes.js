import express from 'express';
import { mysqlPool } from '../config/db.js';

const router = express.Router();

router.post('/login/member', async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ status: 'error', message: 'Email and password are required.' });
    }
    const [rows] = await mysqlPool.query(
      'SELECT * FROM members WHERE email = ?',
      [email]
    );
    if (rows.length === 0) {
      return res.status(401).json({ status: 'error', message: 'Invalid email or password.' });
    }
    const member = rows[0];
    const match = member.password === password;
    if (!match) {
      return res.status(401).json({ status: 'error', message: 'Invalid email or password.' });
    }
    const { password: _, ...safe } = member;
    res.json({ status: 'ok', member: safe });
  } catch (err) {
    next(err);
  }
});

router.post('/login/staff', async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ status: 'error', message: 'Email and password are required.' });
    }
    const [rows] = await mysqlPool.query(
      'SELECT * FROM librarians WHERE email = ?',
      [email]
    );
    if (rows.length === 0) {
      return res.status(401).json({ status: 'error', message: 'Invalid email or password.' });
    }
    const staff = rows[0];
    const match = staff.password === password;
    if (!match) {
      return res.status(401).json({ status: 'error', message: 'Invalid email or password.' });
    }
    const { password: _, ...safe } = staff;
    res.json({ status: 'ok', staff: safe });
  } catch (err) {
    next(err);
  }
});

export default router;
