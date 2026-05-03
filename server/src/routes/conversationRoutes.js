import express from 'express';
import { getConversation, sendMessageAgent, toggleHumanTakeover } from '../controllers/conversationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:userId', protect, getConversation);
router.put('/:userId/takeover', protect, toggleHumanTakeover);

export default router;
