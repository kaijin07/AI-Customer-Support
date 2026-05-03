/**
 * server.js - Entry point for the backend application
 */

import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './src/config/db.js';
import app from './src/app.js';
import config from './src/config/index.js';

// Establish connection to MongoDB
connectDB();

const PORT = config.port;

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.set('io', io);

io.on('connection', (socket) => {
  socket.on('joinConversation', (userId) => {
    socket.join(userId);
  });
});

// Start listening
server.listen(PORT, () => {
  console.log(`Server running in ${config.env} mode on port ${PORT}`);
});
