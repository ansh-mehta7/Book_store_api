// controllers/transactionController.js
const Transaction = require("../models/Transaction");
const Book = require("../models/Book");
const User = require("../models/User");

// Issue a Book
exports.issueBook = async (req, res) => {
  try {
    const { bookName, userId, issueDate } = req.body;

    if (!bookName || !userId || !issueDate) {
      return res
        .status(400)
        .json({ error: "Book name, user ID, and issue date are required" });
    }

    // Find the book by name
    const book = await Book.findOne({ name: bookName });
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the book is already issued
    const existingTransaction = await Transaction.findOne({
      book: book._id,
      returnDate: null,
    });
    if (existingTransaction) {
      return res.status(400).json({ error: "Book is already issued" });
    }

    // Create a new transaction
    const transaction = new Transaction({
      book: book._id,
      user: user._id,
      issueDate: new Date(issueDate),
    });

    await transaction.save();

    // Populate the transaction with book and user details
    const populatedTransaction = await Transaction.findById(transaction._id)
      .populate("book", "name category") // Only select fields you need
      .populate("user", "name email"); // Only select fields you need

    res.status(201).json(populatedTransaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Return a Book
exports.returnBook = async (req, res) => {
  try {
    const { bookName, userId, returnDate } = req.body;

    if (!bookName || !userId || !returnDate) {
      return res
        .status(400)
        .json({ error: "Book name, user ID, and return date are required" });
    }

    // Find the book by name
    const book = await Book.findOne({ name: bookName });
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the transaction with no return date (indicating the book is still issued)
    const transaction = await Transaction.findOne({
      book: book._id,
      user: user._id,
      returnDate: null,
    });
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    // Update the return date
    transaction.returnDate = new Date(returnDate);

    // Calculate rent
    const rentDays = Math.ceil(
      (new Date(returnDate) - transaction.issueDate) / (1000 * 60 * 60 * 24)
    );
    transaction.rent = rentDays * book.rentPerDay;

    // Save the updated transaction
    await transaction.save();

    // Populate the transaction with book and user details
    const populatedTransaction = await Transaction.findById(transaction._id)
      .populate("book", "name category rentPerDay") // Populate book details
      .populate("user", "name email"); // Populate user details

    res.status(200).json(populatedTransaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get List of People Who Have Issued a Book
exports.getIssuedByBook = async (req, res) => {
  try {
    const { bookName } = req.params;

    const book = await Book.findOne({ name: bookName });
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    const transactions = await Transaction.find({ book: book._id }).populate(
      "user"
    );

    const issuedBy = {
      totalIssued: transactions.length,
      currentlyIssuedTo:
        transactions.find((tx) => !tx.returnDate)?.user?.name || "Not issued",
    };

    res.status(200).json(issuedBy);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get Total Rent Generated by a Book
exports.getTotalRentByBook = async (req, res) => {
  try {
    const { bookName } = req.params;

    const book = await Book.findOne({ name: bookName });
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    const transactions = await Transaction.find({ book: book._id });
    const totalRent = transactions.reduce((total, tx) => {
      if (tx.rent) {
        return total + tx.rent;
      }
      return total;
    }, 0);

    res.status(200).json({ totalRent });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get List of Books Issued to a Person
exports.getBooksIssuedToPerson = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const transactions = await Transaction.find({ user: user._id }).populate(
      "book"
    );

    const booksIssued = transactions.map((tx) => ({
      bookName: tx.book.name,
      issueDate: tx.issueDate,
      returnDate: tx.returnDate,
    }));

    res.status(200).json(booksIssued);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get List of Books Issued in a Date Range
exports.getBooksIssuedInDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ error: "Start date and end date are required" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const transactions = await Transaction.find({
      issueDate: { $gte: start, $lte: end },
    })
      .populate("book")
      .populate("user");

    const booksIssued = transactions.map((tx) => ({
      bookName: tx.book.name,
      issuedTo: tx.user.name,
      issueDate: tx.issueDate,
      returnDate: tx.returnDate,
    }));

    res.status(200).json(booksIssued);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
