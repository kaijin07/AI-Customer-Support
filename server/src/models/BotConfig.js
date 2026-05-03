import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
});

const botConfigSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    botName: {
      type: String,
      default: 'Support Assistant',
    },
    faqs: [faqSchema],
    instructions: {
      type: String,
      default: '',
    },
    knowledgeSources: {
      pdfContent: {
        type: String,
        default: '',
      },
      notionLinks: [String],
    },
  },
  {
    timestamps: true,
  }
);

const BotConfig = mongoose.model('BotConfig', botConfigSchema);

export default BotConfig;
