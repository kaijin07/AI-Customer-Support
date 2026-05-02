import express from 'express';
import { getBotConfig, updateBotConfig } from '../controllers/botConfigController.js';
import { protect } from '../middleware/authMiddleware.js';
import validate from '../middleware/validate.js';
import { updateBotConfigSchema } from '../validators/botConfigValidator.js';

const router = express.Router();

router.route('/')
  .get(protect, getBotConfig)
  .post(protect, validate(updateBotConfigSchema), updateBotConfig);

export default router;
