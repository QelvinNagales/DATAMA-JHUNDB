import mongoose from 'mongoose';

const BookContentSchema = new mongoose.Schema({
    // Bridge fields - one of these will match MySQL
    mysql_book_id: { type: Number, index: true }, 
    mongodb_content_id: { type: String, index: true },
    
    // Rich content stored in MongoDB
    summary: { type: String },
    synopsis: { type: String },
    author_bio: { type: String },
    cover_image_url: { type: String },
    tags: [String],
    categories: [String],
    
    // Additional metadata
    page_count: { type: Number },
    language: { type: String, default: 'English' },
    
    // Timestamps
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

export default mongoose.model('BookContent', BookContentSchema);