// API service layer — currently uses mock data.
// Replace fetch calls with real endpoints when PHP backend is ready.
// e.g., fetch('/api/books') instead of importing mock data.

import * as mockData from "@/data/mock-data";
import type { Member, Author, Category, Book, Librarian, Loan, Fine } from "@/types";

const delay = (ms = 100) => new Promise((r) => setTimeout(r, ms));

// Generic CRUD helpers — will map 1:1 to REST endpoints later.
export const api = {
  // Members
  getMembers: async (): Promise<Member[]> => { await delay(); return [...mockData.members]; },
  // Authors
  getAuthors: async (): Promise<Author[]> => { await delay(); return [...mockData.authors]; },
  // Categories
  getCategories: async (): Promise<Category[]> => { await delay(); return [...mockData.categories]; },
  // Books
  getBooks: async (): Promise<Book[]> => { await delay(); return [...mockData.books]; },
  // Librarians
  getLibrarians: async (): Promise<Librarian[]> => { await delay(); return [...mockData.librarians]; },
  // Loans
  getLoans: async (): Promise<Loan[]> => { await delay(); return [...mockData.loans]; },
  // Fines
  getFines: async (): Promise<Fine[]> => { await delay(); return [...mockData.fines]; },
};
