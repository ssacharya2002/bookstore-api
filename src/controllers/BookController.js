import fs from "fs/promises";
import path from "path";
import { v4 as uuid } from "uuid";
import { z } from "zod";

const __dirname = path.resolve();
const BOOKS_FILE = path.join(__dirname, "src", "data", "books.json");

const bookSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  genre: z.string().min(1),
  publishedYear: z.number(),
});

const readBooks = async () => {
  try {
    const data = await fs.readFile(BOOKS_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
};

const writeBooks = async (books) => {
  await fs.writeFile(BOOKS_FILE, JSON.stringify(books, null, 2));
};


// Controller: listBooks
export const listBooks = async (req, res) => {
  try {
    const books = await readBooks();
    let { page, limit } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || books.length;
    const start = (page - 1) * limit;
    const paginated = books.slice(start, start + limit);
    res.json({
      success: true,
      data: {
        total: books.length,
        page,
        limit,
        books: paginated,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to read books" });
  }
};

// Controller: getBookById
export const getBookById = async (req, res) => {
  try {
    const books = await readBooks();
    const book = books.find((b) => b.id === req.params.id);
    if (!book) return res.status(404).json({ success: false, error: "Book not found" });
    res.json({ success: true, data: book });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to read books" });
  }
};

// Controller: addBook
export const addBook = async (req, res) => {
  try {
    const validation = bookSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ success: false, error: "Validation failed", details: validation.error.errors });
    }
    const books = await readBooks();
    const newBook = {
      id: uuid(),
      ...validation.data,
      userId: req.user.userId,
    };
    books.push(newBook);
    await writeBooks(books);
    res.status(201).json({ success: true, data: newBook });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to add book" });
  }
};

// Controller: updateBook
export const updateBook = async (req, res) => {
  try {
    const books = await readBooks();
    const idx = books.findIndex((b) => b.id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, error: "Book not found" });
    if (books[idx].userId !== req.user.userId) {
      return res.status(403).json({ success: false, error: "Not authorized to update this book" });
    }
    const validation = bookSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ success: false, error: "Validation failed", details: validation.error.errors });
    }
    books[idx] = { ...books[idx], ...validation.data };
    await writeBooks(books);
    res.json({ success: true, data: books[idx] });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to update book" });
  }
};

// Controller: deleteBook
export const deleteBook = async (req, res) => {
  try {
    const books = await readBooks();
    const idx = books.findIndex((b) => b.id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, error: "Book not found" });
    if (books[idx].userId !== req.user.userId) {
      return res.status(403).json({ success: false, error: "Not authorized to delete this book" });
    }
    const deleted = books.splice(idx, 1)[0];
    await writeBooks(books);
    res.json({ success: true, data: deleted });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to delete book" });
  }
};

// Controller : searchBooks
export const searchBooks = async (req, res) => {
  try {
    const { genre } = req.query;
    if (!genre) {
      return res.status(400).json({ success: false, error: "Genre query parameter is required" });
    }
    const books = await readBooks();
    const filtered = books.filter((b) => b.genre.toLowerCase() === genre.toLowerCase());
    res.json({ success: true, data: filtered });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to search books" });
  }
}; 