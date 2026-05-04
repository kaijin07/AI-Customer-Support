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

// --- GLOBAL MIDDLEWARE ---

// Security Headers — allow the widget script to be loaded cross-origin
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    // In monolith mode we serve the React SPA, so disable the default
    // contentSecurityPolicy to avoid breaking the frontend.
    contentSecurityPolicy: false,
  })
);

// Serve static public assets (widget.js etc.)
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

// CORS — in development allow all localhost origins (Vite :5173 + Express :5000)
// In production restrict to the deployed CLIENT_URL only.
const isDev = config.env !== 'production';

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       // Allow requests with no origin (Postman, curl, server-to-server, mobile)
//       if (!origin) return callback(null, true);
//       // Dev: allow any localhost regardless of port
//       if (isDev && /^https?:\/\/localhost(:\d+)?$/.test(origin)) {
//         return callback(null, true);
//       }
//       // Production: allow only the configured client URL
//       if (!isDev && config.clientUrl && origin === config.clientUrl) {
//         return callback(null, true);
//       }
//       return callback(new Error(`CORS: origin ${origin} not allowed`));
//     },
//     credentials: true,
//   })
// );

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
// so that client-side routing (react-router) works after refresh.
// NOTE: Express v5 requires a named catch-all parameter — bare '*' is invalid.
app.get('/{*splat}', (_req, res) => {
  res.sendFile(path.join(DIST_PATH, 'index.html'));
});

// --- GLOBAL ERROR HANDLER ---
app.use(globalErrorHandler);

export default app;
