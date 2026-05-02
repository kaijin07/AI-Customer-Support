import express from 'express';
import { sendMessage } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';
import validate from '../middleware/validate.js';
import { sendMessageSchema } from '../validators/chatValidator.js';

const router = express.Router();

router.post('/send', protect, validate(sendMessageSchema), sendMessage);

export default router;
