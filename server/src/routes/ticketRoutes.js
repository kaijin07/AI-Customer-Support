import express from 'express';
import { getTickets, updateTicketStatus } from '../controllers/ticketController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getTickets);
router.put('/:id', protect, updateTicketStatus);

export default router;
