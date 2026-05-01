/**
 * app.js - Express Application Configuration
 * 
 * This file sets up the Express application, applies middleware, 
 * and defines the main API route handlers.
 */

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// Import route handlers
import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import botConfigRoutes from './routes/botConfigRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';

// Initialize the Express application
const app = express();

// --- GLOBAL MIDDLEWARE ---

// Configure CORS (Cross-Origin Resource Sharing)
// credentials: true is essential for allowing the browser to send/receive cookies
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Use cookie-parser to parse the Cookie header and populate req.cookies
app.use(cookieParser());

// Body parser middleware to handle JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// --- API ROUTES ---

// Mount route handlers for different features
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/bot-config', botConfigRoutes);
app.use('/api/tickets', ticketRoutes);

// Test route to verify AI service integration
app.get('/test-ai', async (req, res) => {
  try {
    const { generateReply } = await import('./services/aiService.js');
    const result = await generateReply(
      [{ sender: 'user', text: 'Hello, what is your name?' }],
      { businessName: 'Test Business' },
      'TestUser'
    );
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Root API status route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Export the configured app instance
export default app;
