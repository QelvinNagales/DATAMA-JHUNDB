export interface Member {
  member_id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
}

export interface Author {
  author_id: string;
  first_name: string;
  last_name: string;
}

export interface Category {
  category_id: string;
  category: string;
}

export interface Book {
  book_id: string;
  title: string;
  isbn: string;
  author_id: string;
  category_id: string;
}

export interface Librarian {
  librarian_id: string;
  first_name: string;
  last_name: string;
}

export interface Loan {
  loan_id: string;
  member_id: string;
  book_id: string;
  librarian_id: string;
  checkout_date: string;
  due_date: string;
  return_date: string | null;
}

export interface Fine {
  fine_id: string;
  loan_id: string;
  amount: number;
  is_paid: boolean;
}

export type LoanStatus = "active" | "returned" | "overdue";
