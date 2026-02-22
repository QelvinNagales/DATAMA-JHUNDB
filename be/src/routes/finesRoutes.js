import express from 'express';
import { mysqlPool } from '../config/db.js';

const router = express.Router();

// GET /api/fines - List all fines with member and book info, optional search
router.get('/', async (req, res, next) => {
  try {
    const { q, status } = req.query;
    let query = `
      SELECT f.fine_id, f.loan_id, f.amount, f.is_paid,
             l.borrowed_at, l.due_date, l.returned_at,
             m.member_id, m.first_name AS member_first, m.last_name AS member_last, m.email AS member_email,
             b.title AS book_title, b.isbn
      FROM fines f
      JOIN loans l ON f.loan_id = l.loan_id
      JOIN members m ON l.member_id = m.member_id
      JOIN books b ON l.book_id = b.book_id
    `;
    const conditions = [];
    const params = [];
    if (q) {
      conditions.push(`(m.first_name LIKE ? OR m.last_name LIKE ? OR CONCAT(m.first_name, ' ', m.last_name) LIKE ? OR b.title LIKE ?)`);
      const term = `%${q}%`;
      params.push(term, term, term, term);
    }
    if (status === 'unpaid') {
      conditions.push('f.is_paid = FALSE');
    } else if (status === 'paid') {
      conditions.push('f.is_paid = TRUE');
    }
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    query += ' ORDER BY f.is_paid ASC, l.due_date DESC';
    const [rows] = await mysqlPool.query(query, params);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.get('/unpaid', async (req, res, next) => {
  try {
    const [rows] = await mysqlPool.query(
      'SELECT * FROM fines WHERE is_paid = FALSE'
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.put('/settle/:fine_id', async (req, res, next) => {
  try {
    const { fine_id } = req.params;
    const [result] = await mysqlPool.query(
      'UPDATE fines SET is_paid = TRUE WHERE fine_id = ?',
      [fine_id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ status: 'error', message: 'Fine not found.' });
    }
    res.json({ status: 'ok', message: 'Fine settled.' });
  } catch (err) {
    next(err);
  }
});

export default router;
