import express from 'express';
import { getTickets, updateTicketStatus, deleteTicket } from '../controllers/ticketController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getTickets);
router.put('/:id', protect, updateTicketStatus);
router.delete('/:id', protect, deleteTicket);

export default router;
