import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userMessage: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'closed'],
      default: 'open',
    },
  },
  {
    timestamps: true,
  }
);

const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;
