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

/**
 * @desc    Update ticket status
 * @route   PUT /api/tickets/:id
 * @access  Private
 */
export const updateTicketStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const ticket = await Ticket.findOne({ _id: id, businessId: req.user.id });
  
  if (!ticket) {
    res.status(404);
    throw new Error('Ticket not found');
  }

  ticket.status = status;
  await ticket.save();

  // Reset humanTakeover to false when ticket is closed or resolved
  if (status === 'closed' || status === 'resolved') {
    import('../models/Chat.js').then(async ({ default: Chat }) => {
      await Chat.findOneAndUpdate(
        { businessId: ticket.businessId, visitorId: ticket.visitorId },
        { $set: { humanTakeover: false } }
      );
    });
  }

  res.status(200).json({ success: true, data: ticket });
});

/**
 * @desc    Delete a ticket
 * @route   DELETE /api/tickets/:id
 * @access  Private
 */
export const deleteTicket = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const ticket = await Ticket.findOne({ _id: id, businessId: req.user.id });
  
  if (!ticket) {
    res.status(404);
    throw new Error('Ticket not found');
  }

  // Reset humanTakeover to false when a ticket is deleted
  import('../models/Chat.js').then(async ({ default: Chat }) => {
    await Chat.findOneAndUpdate(
      { businessId: ticket.businessId, visitorId: ticket.visitorId },
      { $set: { humanTakeover: false } }
    );
  });

  await ticket.deleteOne();

  res.status(200).json({ success: true, message: 'Ticket deleted successfully' });
});