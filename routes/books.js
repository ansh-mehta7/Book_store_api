// routes/books.js
const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

// Define routes
router.post("/", bookController.createBook); // POST /api/books/
router.get("/", bookController.getBooks); // GET /api/books/

// Search books by name
router.get("/search", bookController.searchBooksByName); // GET /api/books/search


// Get books by rent range
router.get("/rent-range", bookController.getBooksByRentRange); // GET /api/books/rent-range

// Filter books by category, name, and rent
router.get("/filter", bookController.getBooksByCategoryNameRentRange); // GET /api/books/filter

router.get("/:id", bookController.getBookById); // GET /api/books/:id

router.put("/:id", bookController.updateBook); // PUT /api/books/:id

router.delete("/:id", bookController.deleteBook); // DELETE /api/books/:id


module.exports = router;
