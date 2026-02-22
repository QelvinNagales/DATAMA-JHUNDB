import express from 'express';
import { mysqlPool } from '../config/db.js';
import BookContent from '../models/BookContent.js';

const router = express.Router();

router.post('/ingest', async (req, res, next) => {
  try {
    const body = req.body || {};
    const {
      isbn,
      title,
      author_first_name,
      author_last_name,
      category,
      cover_image_url,
      genre_tags,
      synopsis,
      summary,
      tags,
      categories,
    } = body;

    if (!isbn || !title) {
      return res.status(400).json({
        status: 'error',
        message: 'isbn and title are required.',
      });
    }

    await mysqlPool.query('CALL add_book(?, ?, ?, ?, ?)', [
      isbn,
      title ?? '',
      author_first_name ?? '',
      author_last_name ?? '',
      category ?? null,
    ]);

    const [bookRows] = await mysqlPool.query(
      'SELECT book_id FROM books WHERE isbn = ? ORDER BY book_id DESC LIMIT 1',
      [isbn]
    );
    const mysql_book_id = bookRows.length > 0 ? bookRows[0].book_id : null;

    if (mysql_book_id != null) {
      const tagList = Array.isArray(tags)
        ? tags
        : typeof genre_tags === 'string'
          ? genre_tags.split(',').map((s) => s.trim()).filter(Boolean)
          : [];
      const catList = Array.isArray(categories)
        ? categories
        : category
          ? [category]
          : [];
      await BookContent.create({
        mysql_book_id,
        summary: summary ?? null,
        synopsis: synopsis ?? null,
        cover_image_url: cover_image_url ?? null,
        tags: tagList,
        categories: catList,
      });
    }

    res.status(201).json({
      status: 'ok',
      message: 'Book ingested.',
      book_id: mysql_book_id,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
