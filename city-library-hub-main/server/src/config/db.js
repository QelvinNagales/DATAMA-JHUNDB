import mysql from 'mysql2/promise';
import mongoose from 'mongoose';
import 'dotenv/config'; // Add this to the TOP of db.js as well

// 1. MySQL Connection Pool
export const mysqlPool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,      // This is currently coming up empty
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// 2. MongoDB Connection
export const connectMongo = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("🍃 MongoDB Connected Successfully");
    } catch (err) {
        console.error("❌ MongoDB Connection Error:", err.message);
    }
};