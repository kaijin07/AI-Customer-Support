/**
 * server.js - Entry point for the backend application
 * 
 * This file is responsible for:
 * 1. Loading environment variables
 * 2. Initializing the database connection
 * 3. Starting the Express server
 */

import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import app from './src/app.js';

// Load environment variables from .env file into process.env
dotenv.config();

// Establish connection to MongoDB using the URI provided in .env
connectDB();

// Define the port the server will listen on, defaulting to 5000
const PORT = process.env.PORT || 5000;

// Start listening for incoming requests on the specified port
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
