/**
 * app.js - Express Application Configuration
 */

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import config from './config/index.js';
import globalErrorHandler from './controllers/errorController.js';

// Import route handlers
import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import botConfigRoutes from './routes/botConfigRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';

const app = express();

// --- GLOBAL MIDDLEWARE ---

app.use(cors({
  origin: config.clientUrl,
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// --- API ROUTES ---

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/bot-config', botConfigRoutes);
app.use('/api/tickets', ticketRoutes);

// Root API status route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// --- GLOBAL ERROR HANDLER ---
app.use(globalErrorHandler);

export default app;
