const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    rentPerDay: {
        type: Number,
        required: true,
    },
    //  additional fields as needed
}, { timestamps: true });

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
