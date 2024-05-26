const mongoose = require('mongoose');
const dotenv = require('dotenv');

//Config
dotenv.config();

const dbURI = process.env.dbURI;

const connectDB = async () => {
    try {
        await mongoose.connect(dbURI);
        console.log(`MongoDB Connected`);
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

module.exports = connectDB;