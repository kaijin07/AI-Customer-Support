import Ticket from '../models/Ticket.js';

// @desc    Get all tickets for a business
// @route   GET /api/tickets
// @access  Private
export const getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ businessId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
