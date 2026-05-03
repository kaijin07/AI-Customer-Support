import express from 'express';
import multer from 'multer';
import { getBotConfig, updateBotConfig } from '../controllers/botConfigController.js';
import { protect } from '../middleware/authMiddleware.js';
import validate from '../middleware/validate.js';
import { updateBotConfigSchema } from '../validators/botConfigValidator.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.route('/')
  .get(protect, getBotConfig)
  .post(protect, upload.single('pdfFile'), updateBotConfig);

export default router;
