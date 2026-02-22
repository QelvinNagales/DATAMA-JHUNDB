-- City Library Archives - MySQL init script
-- Run: mysql -u root -p < be/sql/init.sql  (or use Docker: docker exec -i <mysql_container> mysql -u root -p<password> < be/sql/init.sql)

CREATE DATABASE IF NOT EXISTS library;
USE library;

-- ---------------------------------------------------------------------------
-- Tables (order respects FKs)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS authors (
  author_id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS categories (
  category_id INT AUTO_INCREMENT PRIMARY KEY,
  category VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS members (
  member_id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(50) DEFAULT NULL,
  address VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS librarians (
  librarian_id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS books (
  book_id INT AUTO_INCREMENT PRIMARY KEY,
  isbn VARCHAR(20) NOT NULL,
  title VARCHAR(255) NOT NULL,
  author_id INT DEFAULT NULL,
  category_id INT DEFAULT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'Available',
  mongodb_content_id VARCHAR(100) DEFAULT NULL,
  FOREIGN KEY (author_id) REFERENCES authors(author_id) ON DELETE SET NULL,
  FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS loans (
  loan_id INT AUTO_INCREMENT PRIMARY KEY,
  member_id INT NOT NULL,
  book_id INT NOT NULL,
  librarian_id INT DEFAULT NULL,
  borrowed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  returned_at TIMESTAMP NULL DEFAULT NULL,
  due_date DATE DEFAULT NULL,
  FOREIGN KEY (member_id) REFERENCES members(member_id) ON DELETE CASCADE,
  FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE,
  FOREIGN KEY (librarian_id) REFERENCES librarians(librarian_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS fines (
  fine_id INT AUTO_INCREMENT PRIMARY KEY,
  loan_id INT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  is_paid BOOLEAN NOT NULL DEFAULT FALSE,
  FOREIGN KEY (loan_id) REFERENCES loans(loan_id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------------
-- Stored procedures
-- ---------------------------------------------------------------------------

DELIMITER //

-- borrow(member_id, book_id) or borrow(member_id, book_id, librarian_id)
-- Enforces max 5 active loans per member (SIGNAL 1644).
DROP PROCEDURE IF EXISTS borrow//
CREATE PROCEDURE borrow(
  IN p_member_id INT,
  IN p_book_id INT,
  IN p_librarian_id INT
)
BEGIN
  DECLARE active_count INT DEFAULT 0;
  DECLARE current_status VARCHAR(20);

  SELECT status INTO current_status FROM books WHERE book_id = p_book_id LIMIT 1;
  IF current_status IS NULL THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Book not found.', MYSQL_ERRNO = 1644;
  END IF;
  IF current_status != 'Available' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Book is not available.', MYSQL_ERRNO = 1644;
  END IF;

  SELECT COUNT(*) INTO active_count
  FROM loans
  WHERE member_id = p_member_id AND returned_at IS NULL;

  IF active_count >= 5 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Member has reached the maximum of 5 active loans.', MYSQL_ERRNO = 1644;
  END IF;

  INSERT INTO loans (member_id, book_id, librarian_id, due_date)
  VALUES (p_member_id, p_book_id, NULLIF(p_librarian_id, 0), DATE_ADD(CURDATE(), INTERVAL 14 DAY));
  UPDATE books SET status = 'Checked Out' WHERE book_id = p_book_id;
END//

-- return_item(loan_id): set returned_at, optionally create overdue fine
DROP PROCEDURE IF EXISTS return_item//
CREATE PROCEDURE return_item(IN p_loan_id INT)
BEGIN
  DECLARE v_returned_at TIMESTAMP;
  DECLARE v_due_date DATE;
  DECLARE v_loan_id INT;
  DECLARE fine_amount DECIMAL(10,2) DEFAULT 0;

  SELECT returned_at, due_date, loan_id INTO v_returned_at, v_due_date, v_loan_id
  FROM loans WHERE loan_id = p_loan_id LIMIT 1;

  IF v_loan_id IS NULL THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Loan not found.', MYSQL_ERRNO = 1644;
  END IF;
  IF v_returned_at IS NOT NULL THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Loan already returned.', MYSQL_ERRNO = 1644;
  END IF;

  UPDATE loans SET returned_at = CURRENT_TIMESTAMP WHERE loan_id = p_loan_id;

  IF v_due_date IS NOT NULL AND CURDATE() > v_due_date THEN
    SET fine_amount = DATEDIFF(CURDATE(), v_due_date) * 5.00;
    INSERT INTO fines (loan_id, amount, is_paid) VALUES (p_loan_id, fine_amount, FALSE);
  END IF;

  UPDATE books b
  INNER JOIN loans l ON l.book_id = b.book_id AND l.loan_id = p_loan_id
  SET b.status = 'Available';
END//

-- add_member(first_name, last_name, email, password, phone, address)
DROP PROCEDURE IF EXISTS add_member//
CREATE PROCEDURE add_member(
  IN p_first_name VARCHAR(100),
  IN p_last_name VARCHAR(100),
  IN p_email VARCHAR(255),
  IN p_password VARCHAR(255),
  IN p_phone VARCHAR(50),
  IN p_address VARCHAR(255)
)
BEGIN
  INSERT INTO members (first_name, last_name, email, password, phone, address)
  VALUES (p_first_name, p_last_name, p_email, p_password, NULLIF(TRIM(p_phone), ''), NULLIF(TRIM(p_address), ''));
END//

-- add_book(isbn, title, author_first, author_last, category)
DROP PROCEDURE IF EXISTS add_book//
CREATE PROCEDURE add_book(
  IN p_isbn VARCHAR(20),
  IN p_title VARCHAR(255),
  IN p_author_first VARCHAR(100),
  IN p_author_last VARCHAR(100),
  IN p_category VARCHAR(100)
)
BEGIN
  DECLARE v_author_id INT DEFAULT NULL;
  DECLARE v_category_id INT DEFAULT NULL;

  IF TRIM(p_author_first) != '' OR TRIM(p_author_last) != '' THEN
    SELECT author_id INTO v_author_id FROM authors
    WHERE first_name = TRIM(p_author_first) AND last_name = TRIM(p_author_last) LIMIT 1;
    IF v_author_id IS NULL THEN
      INSERT INTO authors (first_name, last_name) VALUES (TRIM(p_author_first), TRIM(p_author_last));
      SET v_author_id = LAST_INSERT_ID();
    END IF;
  END IF;

  IF TRIM(p_category) != '' AND TRIM(p_category) IS NOT NULL THEN
    SELECT category_id INTO v_category_id FROM categories WHERE category = TRIM(p_category) LIMIT 1;
    IF v_category_id IS NULL THEN
      INSERT INTO categories (category) VALUES (TRIM(p_category));
      SET v_category_id = LAST_INSERT_ID();
    END IF;
  END IF;

  INSERT INTO books (isbn, title, author_id, category_id, status)
  VALUES (p_isbn, p_title, v_author_id, v_category_id, 'Available');
END//

DELIMITER ;
