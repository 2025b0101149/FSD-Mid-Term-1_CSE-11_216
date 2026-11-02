# Library Management System

## Student Details

- **Name:** Anmol Teotia
- **Roll Number:** 2500320100216
- **Branch:** CSE
- **Section:** 11

## Project Description

A simple REST API for managing library books. Books are stored in an in-memory
JavaScript array; no database or file-based storage is used. Data added or
changed through the API is reset when the server restarts.

## Technologies

- Node.js
- Express.js
- JavaScript

## Installation and Run

Install Node.js, open a terminal in the project folder, and run:

```bash
npm install
npm start
```

The server runs at **http://localhost:3000**.

## API Endpoints

All responses are JSON. For request bodies, select `Body` → `JSON` in your API
client and set the `Content-Type: application/json` header.

### Add a book

`POST /api/books` — Creates a book. IDs must be unique; quantity and available
must be non-negative integers, and available cannot exceed quantity.

Request body:

```json
{
  "id": 103,
  "title": "API Basics",
  "author": "A. Writer",
  "category": "programming",
  "quantity": 2,
  "available": 2
}
```

Expected response (**201 Created**):

```json
{
  "message": "Book added successfully.",
  "book": {
    "id": 103,
    "title": "API Basics",
    "author": "A. Writer",
    "category": "programming",
    "quantity": 2,
    "available": 2
  }
}
```

Invalid or duplicate book data returns **400 Bad Request**, for example:

```json
{ "message": "A book with this ID already exists." }
```

### Get all books

`GET /api/books` — Returns all books as an array (**200 OK**). If there are no
books, the response is `[]`.

Example response:

```json
[
  {
    "id": 101,
    "title": "Java Programming",
    "author": "Herbert Schildt",
    "category": "programming",
    "quantity": 5,
    "available": 5
  },
  {
    "id": 102,
    "title": "Learning Node.js",
    "author": "Shelley Powers",
    "category": "programming",
    "quantity": 3,
    "available": 2
  }
]
```

### Get a book by ID

`GET /api/books/:id` — Returns the matching book (**200 OK**), or **404 Not
Found**:

```json
{ "message": "Book not found." }
```

Example: `GET /api/books/101`

Expected response:

```json
{
  "id": 101,
  "title": "Java Programming",
  "author": "Herbert Schildt",
  "category": "programming",
  "quantity": 5,
  "available": 5
}
```

### Update book details

`PUT /api/books/:id` — Updates one or more of `title`, `author`, `category`,
`quantity`, and `available`. The ID cannot be changed and the resulting book
must satisfy the same validation rules as when creating a book.

Example: `PUT /api/books/101`

Request body:

```json
{
  "title": "Java Programming, Updated",
  "quantity": 6,
  "available": 6
}
```

Expected response (**200 OK**):

```json
{
  "message": "Book updated successfully.",
  "book": {
    "id": 101,
    "title": "Java Programming, Updated",
    "author": "Herbert Schildt",
    "category": "programming",
    "quantity": 6,
    "available": 6
  }
}
```

Invalid updates return **400 Bad Request**; a book that does not exist returns
**404 Not Found**.

### Delete a book

`DELETE /api/books/:id` — Removes the matching book.

Example: `DELETE /api/books/103`

Expected response (**200 OK**):

```json
{ "message": "Book deleted successfully." }
```

If the book does not exist, the API returns **404 Not Found**.

### Search by title

`GET /api/books/search?title=Java` — Returns an array of books whose titles
contain the search text, ignoring letter case (**200 OK**). No matches return
`[]`.

Example response:

```json
[
  {
    "id": 101,
    "title": "Java Programming",
    "author": "Herbert Schildt",
    "category": "programming",
    "quantity": 5,
    "available": 5
  }
]
```

### Issue a book

`PUT /api/books/:id/issue` — Decreases the available copy count by one.

Example: `PUT /api/books/101/issue`

Expected response (**200 OK**):

```json
{
  "message": "Book issued successfully.",
  "book": {
    "id": 101,
    "title": "Java Programming",
    "author": "Herbert Schildt",
    "category": "programming",
    "quantity": 5,
    "available": 4
  }
}
```

If no copies are available, the API returns **400 Bad Request**. A missing
book returns **404 Not Found**.

### Return a book

`PUT /api/books/:id/return` — Increases the available copy count by one, up to
the total quantity.

Example: `PUT /api/books/101/return`

Expected response (**200 OK**):

```json
{
  "message": "Book returned successfully.",
  "book": {
    "id": 101,
    "title": "Java Programming",
    "author": "Herbert Schildt",
    "category": "programming",
    "quantity": 5,
    "available": 5
  }
}
```

If all copies are already available, the API returns **400 Bad Request**. A
missing book returns **404 Not Found**.

## Sample Books

The server starts with two sample books:

- ID 101 — Java Programming, by Herbert Schildt (5 total, 5 available)
- ID 102 — Learning Node.js, by Shelley Powers (3 total, 2 available)
