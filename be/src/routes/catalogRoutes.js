import express from 'express';
import { mysqlPool } from '../config/db.js';
import BookContent from '../models/BookContent.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const [books] = await mysqlPool.query(`
      SELECT
        b.book_id,
        b.title,
        b.isbn,
        b.status,
        b.mongodb_content_id,
        a.first_name,
        a.last_name,
        CONCAT(a.first_name, ' ', a.last_name) AS author_name,
        c.category AS category_name
      FROM books b
      LEFT JOIN authors a ON b.author_id = a.author_id
      LEFT JOIN categories c ON b.category_id = c.category_id
      ORDER BY b.title
    `);

    const booksWithAvailability = books.map((book) => ({
      ...book,
      available: book.status === 'Available',
      available_copies: book.status === 'Available' ? 1 : 0,
      total_copies: 1,
    }));

    const ids = booksWithAvailability.map((b) => b.book_id);
    const richDocs = await BookContent.find({ mysql_book_id: { $in: ids } }).lean();
    const richByMysqlId = Object.fromEntries(richDocs.map((d) => [d.mysql_book_id, d]));

    const catalog = booksWithAvailability.map((row) => {
      const rich = richByMysqlId[row.book_id];
      return {
        book_id: row.book_id,
        title: row.title,
        isbn: row.isbn,
        status: row.status,
        available: row.available,
        available_copies: row.available_copies,
        total_copies: row.total_copies,
        author_name: row.author_name,
        category_name: row.category_name,
        summary: rich?.summary ?? null,
        synopsis: rich?.synopsis ?? null,
        cover_image_url: rich?.cover_image_url ?? null,
        tags: rich?.tags ?? [],
        categories: rich?.categories ?? (row.category_name ? [row.category_name] : []),
      };
    });

    res.json(catalog);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const bookId = req.params.id;
    const [books] = await mysqlPool.query(
      `
      SELECT
        b.book_id,
        b.title,
        b.isbn,
        b.status,
        b.mongodb_content_id,
        a.first_name,
        a.last_name,
        CONCAT(a.first_name, ' ', a.last_name) AS author_name,
        c.category AS category_name
      FROM books b
      LEFT JOIN authors a ON b.author_id = a.author_id
      LEFT JOIN categories c ON b.category_id = c.category_id
      WHERE b.book_id = ?
      `,
      [bookId]
    );

    if (books.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const row = books[0];
    const withAvailability = {
      ...row,
      available: row.status === 'Available',
      available_copies: row.status === 'Available' ? 1 : 0,
      total_copies: 1,
    };

    const rich = await BookContent.findOne({ mysql_book_id: parseInt(bookId, 10) }).lean();
    const item = {
      book_id: withAvailability.book_id,
      title: withAvailability.title,
      isbn: withAvailability.isbn,
      status: withAvailability.status,
      available: withAvailability.available,
      available_copies: withAvailability.available_copies,
      total_copies: withAvailability.total_copies,
      author_name: withAvailability.author_name,
      category_name: withAvailability.category_name,
      summary: rich?.summary ?? null,
      synopsis: rich?.synopsis ?? null,
      cover_image_url: rich?.cover_image_url ?? null,
      tags: rich?.tags ?? [],
      categories: rich?.categories ?? (withAvailability.category_name ? [withAvailability.category_name] : []),
    };

    res.json(item);
  } catch (err) {
    next(err);
  }
});

export default router;
