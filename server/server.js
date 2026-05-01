import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import botConfigRoutes from './routes/botConfigRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';

dotenv.config();

connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/bot-config', botConfigRoutes);
app.use('/api/tickets', ticketRoutes);

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

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
