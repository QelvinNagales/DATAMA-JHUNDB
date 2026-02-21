// server/src/controllers/bookController.js
exports.searchBooks = async (req, res) => {
    const { q } = req.query; // Get search term from ?q=term
    try {
        const [rows] = await mysqlPool.query(
            `SELECT b.*, a.first_name, a.last_name, c.category 
             FROM books b
             JOIN authors a ON b.author_id = a.author_id
             JOIN categories c ON b.category_id = c.category_id
             WHERE b.title LIKE ?`, 
            [`%${q}%`] // The % symbols allow partial matches
        );
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: "Search failed" });
    }
};