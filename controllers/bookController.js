const Book = require("../models/Book");

// Create a new book
exports.createBook = async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all books
exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get book by ID
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update book by ID
exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete book by ID
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.status(200).json({ message: "Book deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Search books by name or term in the name
exports.searchBooksByName = async (req, res) => {
  try {
    const term = req.query.term;
    if (!term) {
      return res.status(400).json({ error: "Search term is required" });
    }
    const books = await Book.find({ name: new RegExp(term, "i") });
    res.status(200).json(books);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get books by rent price range
exports.getBooksByRentRange = async (req, res) => {
  try {
    const { minRent, maxRent } = req.query;
    if (!minRent || !maxRent) {
      return res.status(400).json({ error: "Min and Max rent are required" });
    }
    const books = await Book.find({
      rentPerDay: { $gte: minRent, $lte: maxRent },
    });
    res.status(200).json(books);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get books by category, name/term, and rent per day range
exports.getBooksByCategoryNameRentRange = async (req, res) => {
  try {
    const { category, term, minRent, maxRent } = req.query;
    console.log(req.query)
    if (!category || !term || !minRent || !maxRent) {
      return res
        .status(400)
        .json({ error: "Category, term, min rent, and max rent are required" });
    }
    const books = await Book.find({
      category: category,
      name: new RegExp(term, "i"),
      rentPerDay: { $gte: Number(minRent), $lte: Number(maxRent) },
    });
    res.status(200).json(books);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
