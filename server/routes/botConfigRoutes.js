import express from 'express';
import { getBotConfig, updateBotConfig } from '../controllers/botConfigController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getBotConfig).post(protect, updateBotConfig);

export default router;
