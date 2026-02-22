import express from 'express';
import { mysqlPool } from '../config/db.js';

const router = express.Router();

// GET /api/loans - List all loans with member/book info, optional search
router.get('/', async (req, res, next) => {
  try {
    const { q, status } = req.query;
    let query = `
      SELECT l.loan_id, l.member_id, l.book_id, l.librarian_id,
             l.borrowed_at, l.due_date, l.returned_at,
             m.first_name AS member_first, m.last_name AS member_last, m.email AS member_email,
             b.title AS book_title, b.isbn,
             CONCAT(lib.first_name, ' ', lib.last_name) AS librarian_name,
             CASE
               WHEN l.returned_at IS NOT NULL THEN 'Returned'
               WHEN l.due_date < CURDATE() THEN 'Overdue'
               ELSE 'Active'
             END AS loan_status,
             f.fine_id, f.amount AS fine_amount, f.is_paid AS fine_paid
      FROM loans l
      JOIN members m ON l.member_id = m.member_id
      JOIN books b ON l.book_id = b.book_id
      LEFT JOIN librarians lib ON l.librarian_id = lib.librarian_id
      LEFT JOIN fines f ON l.loan_id = f.loan_id
    `;
    const conditions = [];
    const params = [];

    if (q) {
      conditions.push(`(m.first_name LIKE ? OR m.last_name LIKE ? OR CONCAT(m.first_name, ' ', m.last_name) LIKE ? OR b.title LIKE ? OR b.isbn LIKE ?)`);
      const term = `%${q}%`;
      params.push(term, term, term, term, term);
    }

    if (status === 'active') {
      conditions.push('l.returned_at IS NULL');
    } else if (status === 'returned') {
      conditions.push('l.returned_at IS NOT NULL');
    } else if (status === 'overdue') {
      conditions.push('l.returned_at IS NULL AND l.due_date < CURDATE()');
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY l.borrowed_at DESC';

    const [rows] = await mysqlPool.query(query, params);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// POST /api/loans - Create a new loan and return receipt data
router.post('/', async (req, res, next) => {
  try {
    const { member_id, book_id, librarian_id } = req.body || {};
    if (member_id == null || book_id == null) {
      return res.status(400).json({ status: 'error', message: 'member_id and book_id are required.' });
    }

    await mysqlPool.query('CALL borrow(?, ?, ?)', [member_id, book_id, librarian_id ?? null]);

    // Fetch the newly created loan for receipt
    const [loans] = await mysqlPool.query(
      `SELECT l.loan_id, l.borrowed_at, l.due_date,
              m.first_name AS member_first, m.last_name AS member_last, m.email AS member_email, m.member_id,
              b.title AS book_title, b.isbn, b.book_id,
              CONCAT(lib.first_name, ' ', lib.last_name) AS librarian_name
       FROM loans l
       JOIN members m ON l.member_id = m.member_id
       JOIN books b ON l.book_id = b.book_id
       LEFT JOIN librarians lib ON l.librarian_id = lib.librarian_id
       WHERE l.member_id = ? AND l.book_id = ? AND l.returned_at IS NULL
       ORDER BY l.loan_id DESC LIMIT 1`,
      [member_id, book_id]
    );

    const receipt = loans.length > 0 ? loans[0] : null;

    res.status(201).json({
      status: 'ok',
      message: 'Loan processed successfully.',
      receipt,
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/loans/:id/return - Mark loan as returned
router.put('/:id/return', async (req, res, next) => {
  try {
    const loanId = req.params.id;
    await mysqlPool.query('CALL return_item(?)', [loanId]);

    // Check if a fine was generated
    const [fines] = await mysqlPool.query(
      'SELECT fine_id, amount, is_paid FROM fines WHERE loan_id = ? ORDER BY fine_id DESC LIMIT 1',
      [loanId]
    );

    res.json({
      status: 'ok',
      message: 'Return processed successfully.',
      fine: fines.length > 0 ? fines[0] : null,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
