import express from 'express';
import { getTickets } from '../controllers/ticketController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getTickets);

export default router;
