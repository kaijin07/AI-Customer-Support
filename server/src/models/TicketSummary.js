import mongoose from 'mongoose';

/**
 * TicketSummary — stores AI-generated summaries of resolved conversations.
 * Acts as a self-growing knowledge base: every closed ticket makes the AI smarter.
 */
const ticketSummarySchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    ticketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
    },
    visitorId: {
      type: String,
    },
    /** One-line description of the user's problem */
    problem: {
      type: String,
      required: true,
    },
    /** One-line description of how it was resolved */
    resolution: {
      type: String,
      required: true,
    },
    /** Lowercase keywords extracted by AI for fast retrieval */
    keywords: [String],
  },
  {
    timestamps: true,
  }
);

// Full-text index across all three searchable fields
ticketSummarySchema.index({ problem: 'text', resolution: 'text' });

const TicketSummary = mongoose.model('TicketSummary', ticketSummarySchema);

export default TicketSummary;
