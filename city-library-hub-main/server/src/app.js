// 1. Load environment variables immediately using the ES Module way
import 'dotenv/config'; 

// 2. Imports (Standardized to ES Modules)
import express from "express";
import cors from "cors";
import { connectMongo, mysqlPool } from "./config/db.js";
import bookRoutes from './routes/bookRoutes.js';

const app = express();

// 3. Initialize MongoDB Connection
connectMongo();

// 4. Middleware
app.use(cors());
app.use(express.json());

// 5. Routes
app.get("/", (req, res) => {
    res.send("City Library Archives API Running 🚀");
});

// Book routes - handles /api/books, /api/books/search, /api/books/:id
app.use("/api/books", bookRoutes);

// Legacy hybrid route for backwards compatibility
app.get("/api/full-book/:id", async (req, res) => {
    // Redirect to new route
    res.redirect(`/api/books/${req.params.id}`);
});

// Health check endpoint
app.get("/api/health", async (req, res) => {
    try {
        // Test MySQL connection
        await mysqlPool.query("SELECT 1");
        res.json({ 
            status: "healthy",
            mysql: "connected",
            mongodb: "connected"
        });
    } catch (error) {
        res.status(500).json({ 
            status: "unhealthy",
            error: error.message 
        });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});