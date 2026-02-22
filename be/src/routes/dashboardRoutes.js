import express from 'express';
import { mysqlPool } from '../config/db.js';

const router = express.Router();

// GET /api/dashboard/stats - Aggregated dashboard statistics
router.get('/stats', async (req, res, next) => {
  try {
    const [[bookCount]] = await mysqlPool.query('SELECT COUNT(*) AS total FROM books');
    const [[memberCount]] = await mysqlPool.query('SELECT COUNT(*) AS total FROM members');
    const [[activeLoans]] = await mysqlPool.query('SELECT COUNT(*) AS total FROM loans WHERE returned_at IS NULL');
    const [[unpaidFines]] = await mysqlPool.query('SELECT COALESCE(SUM(amount), 0) AS total FROM fines WHERE is_paid = FALSE');
    const [[overdueLoans]] = await mysqlPool.query(
      'SELECT COUNT(*) AS total FROM loans WHERE returned_at IS NULL AND due_date < CURDATE()'
    );
    const [[todayLoans]] = await mysqlPool.query(
      'SELECT COUNT(*) AS total FROM loans WHERE DATE(borrowed_at) = CURDATE()'
    );

    res.json({
      total_books: bookCount.total,
      total_members: memberCount.total,
      active_loans: activeLoans.total,
      unpaid_fines: Number(unpaidFines.total),
      overdue_loans: overdueLoans.total,
      today_loans: todayLoans.total,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/dashboard/popular-books - Most borrowed books this month (bar chart)
router.get('/popular-books', async (req, res, next) => {
  try {
    const [rows] = await mysqlPool.query(`
      SELECT b.title, COUNT(*) AS borrow_count
      FROM loans l
      JOIN books b ON l.book_id = b.book_id
      WHERE l.borrowed_at >= DATE_FORMAT(CURDATE(), '%Y-%m-01')
      GROUP BY b.book_id, b.title
      ORDER BY borrow_count DESC
      LIMIT 10
    `);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// GET /api/dashboard/loan-activity - Loan activity over last 14 days (line chart)
router.get('/loan-activity', async (req, res, next) => {
  try {
    const [rows] = await mysqlPool.query(`
      SELECT DATE(borrowed_at) AS date, COUNT(*) AS count
      FROM loans
      WHERE borrowed_at >= DATE_SUB(CURDATE(), INTERVAL 14 DAY)
      GROUP BY DATE(borrowed_at)
      ORDER BY date
    `);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// GET /api/dashboard/category-distribution - Book count by category (pie/donut)
router.get('/category-distribution', async (req, res, next) => {
  try {
    const [rows] = await mysqlPool.query(`
      SELECT c.category AS name, COUNT(*) AS value
      FROM books b
      JOIN categories c ON b.category_id = c.category_id
      GROUP BY c.category_id, c.category
      ORDER BY value DESC
      LIMIT 8
    `);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

export default router;
