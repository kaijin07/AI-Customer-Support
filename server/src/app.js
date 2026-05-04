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

// Resolved path to the built frontend (monorepo: server/ is at root/server)
const DIST_PATH = path.join(__dirname, '..', '..', 'client', 'dist');

const app = express();

// --- PROXY TRUST ---
// This fix allows express-rate-limit to see the real user IP on Render
app.set('trust proxy', 1);

// --- GLOBAL MIDDLEWARE ---

// Security Headers — configured to allow Google OAuth popups and cross-origin widget embedding
app.use(
  helmet({
    // Allows external sites to load your assets (fixes ORB errors)
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    // Google OAuth Fix: Allow the popup to send messages back to the site
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
    // In monolith mode we serve the React SPA, so disable the default
    // contentSecurityPolicy to avoid breaking the frontend.
    contentSecurityPolicy: false,
  })
);

// Explicitly serve the widget with the correct MIME type before general static middleware
app.get('/widget.js', (req, res) => {
  res.set('Content-Type', 'application/javascript');
  res.set('Cross-Origin-Resource-Policy', 'cross-origin');
  res.sendFile(path.join(__dirname, 'public', 'widget.js'));
});

// Serve static public assets (images, fonts, etc.)
app.use(express.static('public'));

// Serve built React frontend
app.use(express.static(DIST_PATH));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
});

// CORS Configuration
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// --- API ROUTES ---

app.use('/api/auth', limiter, authRoutes);
app.use('/api/chat', limiter, chatRoutes);
app.use('/api/bot-config', limiter, botConfigRoutes);
app.use('/api/tickets', limiter, ticketRoutes);
app.use('/api/conversations', limiter, conversationRoutes);
app.use('/api/messages', limiter, messageRoutes);
app.use('/api/embed', embedRoutes);
app.use('/api/contact', limiter, contactRoutes);

// --- SPA FALLBACK ---
// Any route that doesn't match an API route serves the React index.html
app.get('/{*splat}', (_req, res) => {
  res.sendFile(path.join(DIST_PATH, 'index.html'));
});

// --- GLOBAL ERROR HANDLER ---
app.use(globalErrorHandler);

export default app;