const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        // Connecting to MongoDB using Mongoose
        await mongoose.connect(process.env.MONGO_URI);

        console.log('MongoDB Connected successfully');
    } catch (error) {
        console.log("issue in db connection ");
        console.error(`Error: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
