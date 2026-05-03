/**
 * app.js - Express Application Configuration
 */

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import config from './config/index.js';
import globalErrorHandler from './controllers/errorController.js';

// Import route handlers
import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import botConfigRoutes from './routes/botConfigRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import embedRoutes from './routes/embedRoutes.js';

const app = express();

// --- GLOBAL MIDDLEWARE ---

// Security Headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" } // Allow widget script to be loaded
}));

// Serve static files (for widget.js)
app.use(express.static('public'));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
});

app.use(cors({
  origin: true, // Allow widget from anywhere by reflecting origin
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// --- API ROUTES ---

app.use('/api/auth', limiter, authRoutes);
app.use('/api/chat', limiter, chatRoutes);
app.use('/api/bot-config', limiter, botConfigRoutes);
app.use('/api/tickets', limiter, ticketRoutes);
app.use('/api/embed', embedRoutes);

// Root API status route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// --- GLOBAL ERROR HANDLER ---
app.use(globalErrorHandler);

export default app;
