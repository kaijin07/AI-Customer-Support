import Chat from '../models/Chat.js';
import BotConfig from '../models/BotConfig.js';
import Ticket from '../models/Ticket.js';
import { generateReply } from '../services/aiService.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Send a message to the bot
 * @route   POST /api/chat/send
 * @access  Private
 */
export const sendMessage = asyncHandler(async (req, res) => {
  const { text, userName } = req.body;
  const businessId = req.user.id;
  const businessName = req.user.businessName;

  // Find existing chat for the business or create a new one
  let chat = await Chat.findOne({ businessId });

  if (!chat) {
    chat = new Chat({
      businessId,
      messages: [],
    });
  }

  // Push user message
  const userMessage = { sender: 'user', text };
  chat.messages.push(userMessage);

  // Fetch bot configuration (FAQs + Instructions)
  const botConfig = await BotConfig.findOne({ businessId });
  const businessData = {
    faqs: botConfig ? botConfig.faqs : [],
    instructions: botConfig ? botConfig.instructions : '',
    businessName,
  };

  // Pre-check for explicit hardcoded escalation requests
  const lowerText = text.toLowerCase();
  const explicitEscalate = lowerText.includes('talk to human') || lowerText.includes('agent') || lowerText.includes('help');

  let botReplyText = "";
  let shouldCreateTicket = explicitEscalate;

  // Fast path: Simple keyword match for FAQs to save API calls
  let faqMatch = null;
  if (botConfig && botConfig.faqs.length > 0 && !explicitEscalate) {
    faqMatch = botConfig.faqs.find(faq => lowerText.includes(faq.question.toLowerCase()));
  }

  if (faqMatch) {
    botReplyText = faqMatch.answer;
  } else {
    // Use AI to generate reply based on context and FAQs
    const aiResponse = await generateReply(chat.messages, businessData, userName);
    botReplyText = aiResponse.text;
    if (aiResponse.escalate) {
      shouldCreateTicket = true;
    }
  }

  // Handle ticket creation if escalated
  if (shouldCreateTicket) {
    botReplyText = "Your request has been escalated. Our team will contact you shortly.";
    await Ticket.create({
      businessId,
      userMessage: text,
    });
  }

  const botMessage = { sender: 'bot', text: botReplyText };
  chat.messages.push(botMessage);

  // Save chat history
  await chat.save();

  res.status(200).json({
    success: true,
    data: botMessage,
  });
});
