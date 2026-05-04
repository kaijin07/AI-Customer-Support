/**
 * app.js - Express Application Configuration
 */

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import config from './config/index.js';
import globalErrorHandler from './controllers/errorController.js';

// Import route handlers
import authRoutes from './routes/authRoutes.js'
import chatRoutes from './routes/chatRoutes.js';
import botConfigRoutes from './routes/botConfigRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import embedRoutes from './routes/embedRoutes.js';
import conversationRoutes from './routes/conversationRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import contactRoutes from './routes/contactRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_PATH = path.join(__dirname, '..', '..', 'client', 'dist');

const app = express();

// --- PROXY TRUST ---
// Required for Render/Heroku so express-rate-limit sees the real user IP
app.set('trust proxy', 1);

// --- GLOBAL MIDDLEWARE ---

app.use(
  helmet({
    // Allows external sites to load your assets (fixes ORB)
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    // Allows Google OAuth popup to communicate with the main window
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
    contentSecurityPolicy: false,
  })
);

// Robust static serving: Adds correct MIME types and CORP headers to JS files
app.use(express.static('public', {
  setHeaders: (res, filepath) => {
    if (filepath.endsWith('.js')) {
      res.set('Content-Type', 'application/javascript');
      res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    }
  }
}));

app.use(express.static(DIST_PATH));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests' },
});

app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// --- API ROUTES ---
app.use('/api/auth', limiter, authRoutes);
app.use('/api/chat', limiter, chatRoutes);
app.use('/api/bot-config', limiter, botConfigRoutes);
app.use('/api/tickets', limiter, ticketRoutes);
app.use('/api/embed', embedRoutes); 
app.use('/api/conversations', limiter, conversationRoutes);
app.use('/api/messages', limiter, messageRoutes);
app.use('/api/contact', limiter, contactRoutes);

// --- SPA FALLBACK ---
app.get('/{*splat}', (_req, res) => {
  res.sendFile(path.join(DIST_PATH, 'index.html'));
});

app.use(globalErrorHandler);

export default app;