import mongoose from 'mongoose';

const BookContentSchema = new mongoose.Schema({
  mysql_book_id: { type: Number, index: true },
  mongodb_content_id: { type: String, index: true },
  summary: { type: String },
  synopsis: { type: String },
  author_bio: { type: String },
  cover_image_url: { type: String },
  tags: [String],
  categories: [String],
  page_count: { type: Number },
  language: { type: String, default: 'English' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
}, { collection: 'catalog_rich_data' });

export default mongoose.model('BookContent', BookContentSchema);
