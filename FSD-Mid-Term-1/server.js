const express = require('express');
const app = express();
const PORT = 3000;

// Configure JSON body parser middleware
app.use(express.json());

// In-memory data store
let books = [
  { id: 1, title: "Clean Code", author: "Robert C. Martin", category: "Technology", quantity: 5, available: 4 },
  { id: 2, title: "The Pragmatic Programmer", author: "Andrew Hunt, David Thomas", category: "Technology", quantity: 3, available: 3 },
  { id: 3, title: "To Kill a Mockingbird", author: "Harper Lee", category: "Fiction", quantity: 4, available: 2 }
];

// Helper to auto-increment ID
let nextId = 4;

// 1. GET /api/books - Retrieve all books or filter by search query (?search=...)
app.get('/api/books', (req, res) => {
  const { search, category, author } = req.query;
  let results = [...books];

  if (search) {
    const term = search.toLowerCase();
    results = results.filter(b => 
      b.title.toLowerCase().includes(term) || 
      b.author.toLowerCase().includes(term) ||
      b.category.toLowerCase().includes(term)
    );
  }

  if (category) {
    results = results.filter(b => b.category.toLowerCase() === category.toLowerCase());
  }

  if (author) {
    results = results.filter(b => b.author.toLowerCase().includes(author.toLowerCase()));
  }

  res.status(200).json({ success: true, count: results.length, data: results });
});

// 2. GET /api/books/:id - Retrieve a single book by ID
app.get('/api/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id, 10);
  const book = books.find(b => b.id === bookId);

  if (!book) {
    return res.status(404).json({ success: false, message: `Book with id ${bookId} not found` });
  }

  res.status(200).json({ success: true, data: book });
});

// 3. POST /api/books - Add a new book
app.post('/api/books', (req, res) => {
  const { title, author, category, quantity } = req.body;

  if (!title || !author || !category || quantity === undefined) {
    return res.status(400).json({ 
      success: false, 
      message: "Please provide title, author, category, and quantity" 
    });
  }

  const parsedQty = parseInt(quantity, 10);
  if (isNaN(parsedQty) || parsedQty < 0) {
    return res.status(400).json({ success: false, message: "Quantity must be a positive integer" });
  }

  const newBook = {
    id: nextId++,
    title,
    author,
    category,
    quantity: parsedQty,
    available: parsedQty
  };

  books.push(newBook);
  res.status(201).json({ success: true, message: "Book added successfully", data: newBook });
});

// 4. PUT /api/books/:id - Update book details
app.put('/api/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id, 10);
  const bookIndex = books.findIndex(b => b.id === bookId);

  if (bookIndex === -1) {
    return res.status(404).json({ success: false, message: `Book with id ${bookId} not found` });
  }

  const { title, author, category, quantity, available } = req.body;
  const current = books[bookIndex];

  const updatedBook = {
    id: bookId,
    title: title !== undefined ? title : current.title,
    author: author !== undefined ? author : current.author,
    category: category !== undefined ? category : current.category,
    quantity: quantity !== undefined ? parseInt(quantity, 10) : current.quantity,
    available: available !== undefined ? parseInt(available, 10) : current.available
  };

  if (updatedBook.available > updatedBook.quantity) {
    return res.status(400).json({ 
      success: false, 
      message: "Available copies cannot exceed total quantity" 
    });
  }

  books[bookIndex] = updatedBook;
  res.status(200).json({ success: true, message: "Book updated successfully", data: updatedBook });
});

// 5. DELETE /api/books/:id - Remove a book
app.delete('/api/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id, 10);
  const bookIndex = books.findIndex(b => b.id === bookId);

  if (bookIndex === -1) {
    return res.status(404).json({ success: false, message: `Book with id ${bookId} not found` });
  }

  const deletedBook = books.splice(bookIndex, 1)[0];
  res.status(200).json({ success: true, message: "Book deleted successfully", data: deletedBook });
});

// 6. POST /api/books/:id/issue - Issue a copy of the book
app.post('/api/books/:id/issue', (req, res) => {
  const bookId = parseInt(req.params.id, 10);
  const book = books.find(b => b.id === bookId);

  if (!book) {
    return res.status(404).json({ success: false, message: `Book with id ${bookId} not found` });
  }

  if (book.available <= 0) {
    return res.status(400).json({ success: false, message: "No copies currently available to issue" });
  }

  book.available -= 1;
  res.status(200).json({ success: true, message: "Book issued successfully", data: book });
});

// 7. POST /api/books/:id/return - Return an issued copy
app.post('/api/books/:id/return', (req, res) => {
  const bookId = parseInt(req.params.id, 10);
  const book = books.find(b => b.id === bookId);

  if (!book) {
    return res.status(404).json({ success: false, message: `Book with id ${bookId} not found` });
  }

  if (book.available >= book.quantity) {
    return res.status(400).json({ 
      success: false, 
      message: "All copies are already accounted for; cannot return extra copies" 
    });
  }

  book.available += 1;
  res.status(200).json({ success: true, message: "Book returned successfully", data: book });
});

// Start server
app.listen(PORT, () => {
  console.log(`Library Management Server is running on http://localhost:${PORT}`);
});