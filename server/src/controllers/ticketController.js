import Ticket from '../models/Ticket.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Get all tickets for a business
 * @route   GET /api/tickets
 * @access  Private
 */
export const getTickets = asyncHandler(async (req, res) => {
  const tickets = await Ticket.find({ businessId: req.user.id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: tickets });
});
