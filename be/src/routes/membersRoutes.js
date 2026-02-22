import express from 'express';
import { mysqlPool } from '../config/db.js';

const router = express.Router();

// GET /api/members - List all members with optional search
router.get('/', async (req, res, next) => {
  try {
    const { q } = req.query;
    let query = `
      SELECT m.member_id, m.first_name, m.last_name, m.email, m.phone, m.address, m.created_at,
             COUNT(l.loan_id) AS total_loans,
             SUM(CASE WHEN l.returned_at IS NULL THEN 1 ELSE 0 END) AS active_loans
      FROM members m
      LEFT JOIN loans l ON m.member_id = l.member_id
    `;
    const params = [];
    if (q) {
      query += ` WHERE m.first_name LIKE ? OR m.last_name LIKE ? OR m.email LIKE ? OR CONCAT(m.first_name, ' ', m.last_name) LIKE ?`;
      const term = `%${q}%`;
      params.push(term, term, term, term);
    }
    query += ` GROUP BY m.member_id ORDER BY m.last_name, m.first_name`;
    const [rows] = await mysqlPool.query(query, params);
    // Strip passwords from response
    const safe = rows.map(({ password, ...rest }) => rest);
    res.json(safe);
  } catch (err) {
    next(err);
  }
});

// GET /api/members/:id - Single member
router.get('/:id', async (req, res, next) => {
  try {
    const [rows] = await mysqlPool.query('SELECT * FROM members WHERE member_id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Member not found.' });
    }
    const { password, ...safe } = rows[0];
    res.json(safe);
  } catch (err) {
    next(err);
  }
});

// PUT /api/members/:id - Update member info
router.put('/:id', async (req, res, next) => {
  try {
    const { first_name, last_name, email, phone, address } = req.body || {};
    const [result] = await mysqlPool.query(
      `UPDATE members SET
        first_name = COALESCE(?, first_name),
        last_name = COALESCE(?, last_name),
        email = COALESCE(?, email),
        phone = COALESCE(?, phone),
        address = COALESCE(?, address)
       WHERE member_id = ?`,
      [first_name || null, last_name || null, email || null, phone || null, address || null, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ status: 'error', message: 'Member not found.' });
    }
    res.json({ status: 'ok', message: 'Member updated.' });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/members/:id - Remove member
router.delete('/:id', async (req, res, next) => {
  try {
    const [result] = await mysqlPool.query('DELETE FROM members WHERE member_id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ status: 'error', message: 'Member not found.' });
    }
    res.json({ status: 'ok', message: 'Member deleted.' });
  } catch (err) {
    next(err);
  }
});

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
