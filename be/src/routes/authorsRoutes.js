import express from 'express';
import { mysqlPool } from '../config/db.js';

const router = express.Router();

// GET /api/authors - List all authors with book count, optional search
router.get('/', async (req, res, next) => {
  try {
    const { q } = req.query;
    let query = `
      SELECT a.author_id, a.first_name, a.last_name,
             COUNT(b.book_id) AS book_count
      FROM authors a
      LEFT JOIN books b ON a.author_id = b.author_id
    `;
    const params = [];

    if (q) {
      query += ` WHERE a.first_name LIKE ? OR a.last_name LIKE ? OR CONCAT(a.first_name, ' ', a.last_name) LIKE ?`;
      const term = `%${q}%`;
      params.push(term, term, term);
    }

    query += ` GROUP BY a.author_id, a.first_name, a.last_name ORDER BY a.last_name, a.first_name`;

    const [rows] = await mysqlPool.query(query, params);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// GET /api/authors/:id - Single author with their books
router.get('/:id', async (req, res, next) => {
  try {
    const [authors] = await mysqlPool.query(
      'SELECT * FROM authors WHERE author_id = ?',
      [req.params.id]
    );
    if (authors.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Author not found.' });
    }
    const [books] = await mysqlPool.query(
      `SELECT b.book_id, b.title, b.isbn, b.status, c.category AS category_name
       FROM books b LEFT JOIN categories c ON b.category_id = c.category_id
       WHERE b.author_id = ? ORDER BY b.title`,
      [req.params.id]
    );
    res.json({ ...authors[0], books });
  } catch (err) {
    next(err);
  }
});

// POST /api/authors - Create a new author
router.post('/', async (req, res, next) => {
  try {
    const { first_name, last_name } = req.body || {};
    if (!first_name || !last_name) {
      return res.status(400).json({ status: 'error', message: 'first_name and last_name are required.' });
    }
    const [result] = await mysqlPool.query(
      'INSERT INTO authors (first_name, last_name) VALUES (?, ?)',
      [first_name.trim(), last_name.trim()]
    );
    res.status(201).json({ status: 'ok', author_id: result.insertId });
  } catch (err) {
    next(err);
  }
});

// PUT /api/authors/:id - Update an author
router.put('/:id', async (req, res, next) => {
  try {
    const { first_name, last_name } = req.body || {};
    const [result] = await mysqlPool.query(
      'UPDATE authors SET first_name = COALESCE(?, first_name), last_name = COALESCE(?, last_name) WHERE author_id = ?',
      [first_name?.trim() || null, last_name?.trim() || null, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ status: 'error', message: 'Author not found.' });
    }
    res.json({ status: 'ok', message: 'Author updated.' });
  } catch (err) {
    next(err);
  }
});

export default router;
