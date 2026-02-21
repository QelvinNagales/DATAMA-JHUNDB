import { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = 'http://localhost:5000/api';

// Types for MySQL book data
export interface Book {
    book_id: number;
    title: string;
    isbn: string;
    publication_year: number;
    total_copies: number;
    available_copies: number;
    mongodb_content_id: string | null;
    first_name: string;
    last_name: string;
    author_name: string;
    category_name: string;
}

// Types for full book details (MySQL + MongoDB)
export interface BookDetails {
    book_id: number;
    title: string;
    isbn: string;
    publication_year: number;
    total_copies: number;
    available_copies: number;
    available: boolean;
    author_name: string;
    category_name: string;
    // MongoDB fields
    summary: string | null;
    author_bio: string | null;
    cover_image_url: string | null;
    tags: string[];
    synopsis: string | null;
    categories: string[];
}

// Hook for fetching all books or searching
export const useBooks = (searchQuery?: string) => {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBooks = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            const url = searchQuery 
                ? `${API_BASE_URL}/books/search?q=${encodeURIComponent(searchQuery)}`
                : `${API_BASE_URL}/books`;
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            setBooks(data);
        } catch (err) {
            console.error("Error fetching books:", err);
            setError(err instanceof Error ? err.message : 'Failed to fetch books');
            setBooks([]);
        } finally {
            setLoading(false);
        }
    }, [searchQuery]);

    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    return { books, loading, error, refetch: fetchBooks };
};

// Hook for fetching single book details (hybrid MySQL + MongoDB)
export const useBookDetails = (bookId: number | null) => {
    const [book, setBook] = useState<BookDetails | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (bookId === null) {
            setBook(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        fetch(`${API_BASE_URL}/books/${bookId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setBook(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching book details:", err);
                setError(err instanceof Error ? err.message : 'Failed to fetch book details');
                setBook(null);
                setLoading(false);
            });
    }, [bookId]);

    return { book, loading, error };
};

// Legacy hook for backwards compatibility
export const useLibraryData = (bookId: string | number) => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!bookId) return;

        setLoading(true);
        fetch(`${API_BASE_URL}/books/${bookId}`)
            .then(res => res.json())
            .then(json => {
                setData(json);
                setLoading(false);
            })
            .catch(err => {
                console.error("Integration Fetch Error:", err);
                setLoading(false);
            });
    }, [bookId]);

    return { data, loading };
};