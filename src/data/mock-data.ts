import { Member, Author, Category, Book, Librarian, Loan, Fine } from "@/types";

export const members: Member[] = [
  { member_id: "M001", first_name: "Sarah", last_name: "Johnson", phone_number: "555-0101" },
  { member_id: "M002", first_name: "James", last_name: "Williams", phone_number: "555-0102" },
  { member_id: "M003", first_name: "Emily", last_name: "Brown", phone_number: "555-0103" },
  { member_id: "M004", first_name: "Michael", last_name: "Davis", phone_number: "555-0104" },
  { member_id: "M005", first_name: "Olivia", last_name: "Martinez", phone_number: "555-0105" },
  { member_id: "M006", first_name: "Daniel", last_name: "Garcia", phone_number: "555-0106" },
  { member_id: "M007", first_name: "Sophia", last_name: "Wilson", phone_number: "555-0107" },
  { member_id: "M008", first_name: "David", last_name: "Anderson", phone_number: "555-0108" },
];

export const authors: Author[] = [
  { author_id: "A001", first_name: "Harper", last_name: "Lee" },
  { author_id: "A002", first_name: "George", last_name: "Orwell" },
  { author_id: "A003", first_name: "Jane", last_name: "Austen" },
  { author_id: "A004", first_name: "Mark", last_name: "Twain" },
  { author_id: "A005", first_name: "F. Scott", last_name: "Fitzgerald" },
  { author_id: "A006", first_name: "Ernest", last_name: "Hemingway" },
];

export const categories: Category[] = [
  { category_id: "C001", category: "Fiction" },
  { category_id: "C002", category: "Science Fiction" },
  { category_id: "C003", category: "Romance" },
  { category_id: "C004", category: "History" },
  { category_id: "C005", category: "Biography" },
  { category_id: "C006", category: "Adventure" },
];

export const books: Book[] = [
  { book_id: "B001", title: "To Kill a Mockingbird", isbn: "978-0-06-112008-4", author_id: "A001", category_id: "C001" },
  { book_id: "B002", title: "1984", isbn: "978-0-45-152493-5", author_id: "A002", category_id: "C002" },
  { book_id: "B003", title: "Pride and Prejudice", isbn: "978-0-14-143951-8", author_id: "A003", category_id: "C003" },
  { book_id: "B004", title: "Adventures of Huckleberry Finn", isbn: "978-0-14-243717-0", author_id: "A004", category_id: "C006" },
  { book_id: "B005", title: "The Great Gatsby", isbn: "978-0-74-327356-5", author_id: "A005", category_id: "C001" },
  { book_id: "B006", title: "The Old Man and the Sea", isbn: "978-0-68-480122-3", author_id: "A006", category_id: "C001" },
  { book_id: "B007", title: "Animal Farm", isbn: "978-0-45-152634-2", author_id: "A002", category_id: "C002" },
  { book_id: "B008", title: "Sense and Sensibility", isbn: "978-0-14-143966-2", author_id: "A003", category_id: "C003" },
  { book_id: "B009", title: "A Farewell to Arms", isbn: "978-0-68-480171-1", author_id: "A006", category_id: "C001" },
  { book_id: "B010", title: "The Sun Also Rises", isbn: "978-0-74-324709-2", author_id: "A006", category_id: "C001" },
];

export const librarians: Librarian[] = [
  { librarian_id: "L001", first_name: "Robert", last_name: "Thompson" },
  { librarian_id: "L002", first_name: "Linda", last_name: "White" },
  { librarian_id: "L003", first_name: "Patricia", last_name: "Harris" },
];

export const loans: Loan[] = [
  { loan_id: "LN001", member_id: "M001", book_id: "B001", librarian_id: "L001", checkout_date: "2026-01-15", due_date: "2026-02-15", return_date: "2026-02-10" },
  { loan_id: "LN002", member_id: "M002", book_id: "B002", librarian_id: "L001", checkout_date: "2026-01-20", due_date: "2026-02-20", return_date: null },
  { loan_id: "LN003", member_id: "M003", book_id: "B003", librarian_id: "L002", checkout_date: "2026-01-25", due_date: "2026-02-05", return_date: null },
  { loan_id: "LN004", member_id: "M004", book_id: "B005", librarian_id: "L002", checkout_date: "2026-02-01", due_date: "2026-03-01", return_date: null },
  { loan_id: "LN005", member_id: "M005", book_id: "B006", librarian_id: "L003", checkout_date: "2026-02-05", due_date: "2026-03-05", return_date: null },
  { loan_id: "LN006", member_id: "M001", book_id: "B007", librarian_id: "L001", checkout_date: "2026-01-10", due_date: "2026-01-25", return_date: null },
  { loan_id: "LN007", member_id: "M006", book_id: "B004", librarian_id: "L003", checkout_date: "2026-02-08", due_date: "2026-03-08", return_date: null },
  { loan_id: "LN008", member_id: "M007", book_id: "B009", librarian_id: "L001", checkout_date: "2025-12-20", due_date: "2026-01-20", return_date: "2026-01-18" },
];

export const fines: Fine[] = [
  { fine_id: "F001", loan_id: "LN003", amount: 5.50, is_paid: false },
  { fine_id: "F002", loan_id: "LN006", amount: 12.00, is_paid: false },
  { fine_id: "F003", loan_id: "LN008", amount: 2.00, is_paid: true },
];
