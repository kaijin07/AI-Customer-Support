import Chat from '../models/Chat.js';
import User from '../models/User.js';
import BotConfig from '../models/BotConfig.js';
import Ticket from '../models/Ticket.js';
import { generateReply } from '../services/aiService.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Send a message to the bot
 * @route   POST /api/chat/send
 * @access  Private
 */
/**
 * @desc    Send a message to the bot
 * @route   POST /api/chat/send
 * @access  Private/Public (depending on whether it's from dashboard or widget)
 */
export const sendMessage = asyncHandler(async (req, res) => {
  const { text, userName, visitorId: reqVisitorId, businessId: reqBusinessId } = req.body;
  
  // Use businessId from req.body (for widget) or req.user (for dashboard)
  const businessId = reqBusinessId || req.user?.id;
  if (!businessId) {
    return res.status(400).json({ success: false, message: 'Business ID is required' });
  }

  // Use visitorId from req.body or fallback to a default
  const visitorId = reqVisitorId || 'anonymous';

  // Fetch business info to get businessName if not in req.user
  let businessName = req.user?.businessName;
  if (!businessName) {
    const user = await User.findById(businessId);
    businessName = user?.businessName || 'the business';
  }

  // Find existing chat for the business + visitor or create a new one
  let chat = await Chat.findOne({ businessId, visitorId });

  if (!chat) {
    chat = await Chat.create({
      businessId,
      visitorId,
      messages: [],
    });
  }

  // Push user message
  const userMessage = { sender: 'user', text };
  chat.messages.push(userMessage);
  
  const io = req.app.get('io');
  if (io) {
    io.to(visitorId).emit('newMessage', userMessage);
  }

  // If human has taken over, don't generate AI reply
  if (chat.humanTakeover) {
    await chat.save();
    return res.status(200).json({
      success: true,
      data: { sender: 'agent', text: '', isAssisted: true },
    });
  }

  // Fetch bot configuration (FAQs + Instructions + botName + knowledge)
  const botConfig = await BotConfig.findOne({ businessId });
  const botName = botConfig?.botName || 'Support Assistant';
  const businessData = {
    faqs: botConfig ? botConfig.faqs : [],
    instructions: botConfig ? botConfig.instructions : '',
    botName,
    businessName,
    knowledge: botConfig?.knowledgeSources?.pdfContent || '',
  };

  // Pre-check for explicit hardcoded escalation requests
  const lowerText = text.toLowerCase();
  // Removed "help" as per requirements
  const explicitEscalate = lowerText.includes('talk to human') || lowerText.includes('agent') || lowerText.includes('talk to agent');

  let botReplyText = "";
  let shouldCreateTicket = explicitEscalate;

  // Fast path: Simple keyword match for FAQs to save API calls
  let faqMatch = null;
  const faqs = botConfig?.faqs || [];
  if (faqs.length > 0 && !explicitEscalate) {
    // Partial matching
    faqMatch = faqs.find(faq => 
      lowerText.includes(faq.question.toLowerCase()) || 
      faq.question.toLowerCase().includes(lowerText)
    );
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
    botReplyText = `Your request has been escalated to ${botName}. Our team will contact you shortly.`;
    await Ticket.create({
      businessId,
      visitorId,
      userName: userName || 'Anonymous Visitor',
      userMessage: text,
    });
  }

  const botMessage = { sender: 'bot', text: botReplyText };
  chat.messages.push(botMessage);
  
  if (io) {
    io.to(visitorId).emit('newMessage', botMessage);
  }

  // Limit chat history to last 50 messages
  if (chat.messages.length > 50) {
    chat.messages = chat.messages.slice(-50);
  }

  // Save chat history
  await chat.save();

  res.status(200).json({
    success: true,
    data: botMessage,
  });
});
