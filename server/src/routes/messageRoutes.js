import express from 'express';
import { sendMessageAgent } from '../controllers/conversationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, sendMessageAgent);

export default router;
