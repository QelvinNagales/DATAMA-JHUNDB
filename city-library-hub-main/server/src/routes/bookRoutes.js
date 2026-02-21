import express from 'express';
import { mysqlPool } from '../config/db.js';
import BookContent from '../models/BookContent.js';

const router = express.Router();

// GET /api/books - Get all books (MySQL) with optional MongoDB content
router.get('/', async (req, res) => {
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
        
        // Map status to availability
        const booksWithAvailability = books.map(book => ({
            ...book,
            available: book.status === 'Available',
            available_copies: book.status === 'Available' ? 1 : 0,
            total_copies: 1
        }));
        
        res.json(booksWithAvailability);
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ error: error.message });
    }
});

// GET /api/books/search - Search books by title, author, or category
router.get('/search', async (req, res) => {
    const { q } = req.query;
    
    if (!q) {
        return res.status(400).json({ error: 'Search query (q) is required' });
    }
    
    try {
        const searchTerm = `%${q}%`;
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
            WHERE b.title LIKE ? 
               OR a.first_name LIKE ? 
               OR a.last_name LIKE ?
               OR c.category LIKE ?
            ORDER BY b.title
        `, [searchTerm, searchTerm, searchTerm, searchTerm]);
        
        // Map status to availability
        const booksWithAvailability = books.map(book => ({
            ...book,
            available: book.status === 'Available',
            available_copies: book.status === 'Available' ? 1 : 0,
            total_copies: 1
        }));
        
        res.json(booksWithAvailability);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: error.message });
    }
});

// GET /api/books/:id - Get single book with full MongoDB content
router.get('/:id', async (req, res) => {
    try {
        const bookId = req.params.id;
        
        // Get book from MySQL
        const [mysqlRows] = await mysqlPool.query(`
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
        `, [bookId]);
        
        if (mysqlRows.length === 0) {
            return res.status(404).json({ error: 'Book not found' });
        }
        
        const book = mysqlRows[0];
        
        // Get rich content from MongoDB using the bridge field
        let mongoContent = null;
        if (book.mongodb_content_id) {
            mongoContent = await BookContent.findOne({ 
                mongodb_content_id: book.mongodb_content_id 
            });
        }
        
        // If no content found by mongodb_content_id, try mysql_book_id
        if (!mongoContent) {
            mongoContent = await BookContent.findOne({ 
                mysql_book_id: book.book_id 
            });
        }
        
        const isAvailable = book.status === 'Available';
        
        res.json({
            // MySQL inventory/transactional data
            book_id: book.book_id,
            title: book.title,
            isbn: book.isbn,
            status: book.status,
            available: isAvailable,
            available_copies: isAvailable ? 1 : 0,
            total_copies: 1,
            author_name: book.author_name,
            category_name: book.category_name,
            // MongoDB rich content
            summary: mongoContent?.summary || null,
            author_bio: mongoContent?.author_bio || null,
            cover_image_url: mongoContent?.cover_image_url || null,
            tags: mongoContent?.tags || [],
            synopsis: mongoContent?.synopsis || null,
            publication_year: mongoContent?.publication_year || null,
            categories: mongoContent?.categories || [book.category_name].filter(Boolean)
        });
    } catch (error) {
        console.error('Error fetching book details:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
