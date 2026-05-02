/**
 * server.js - Entry point for the backend application
 */

import connectDB from './src/config/db.js';
import app from './src/app.js';
import config from './src/config/index.js';

// Establish connection to MongoDB
connectDB();

const PORT = config.port;

// Start listening
app.listen(PORT, () => {
  console.log(`Server running in ${config.env} mode on port ${PORT}`);
});
