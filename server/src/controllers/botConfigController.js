import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');
import BotConfig from '../models/BotConfig.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Get bot config
 * @route   GET /api/bot-config
 * @access  Private
 */
export const getBotConfig = asyncHandler(async (req, res) => {
  let config = await BotConfig.findOne({ businessId: req.user.id });
  
  if (!config) {
    config = await BotConfig.create({ 
      businessId: req.user.id, 
      botName: 'Support Assistant',
      faqs: [], 
      instructions: '',
      knowledgeSources: { pdfContent: '', notionLinks: [] }
    });
  }

  res.status(200).json({ success: true, data: config });
});

/**
 * @desc    Update bot config
 * @route   POST /api/bot-config
 * @access  Private
 */
export const updateBotConfig = asyncHandler(async (req, res) => {
  const { faqs, instructions, botName, notionLinks } = req.body;
  const businessId = req.user.id;

  let config = await BotConfig.findOne({ businessId });

  // Handle PDF if uploaded
  let pdfContent = config?.knowledgeSources?.pdfContent || '';
  if (req.file) {
    const dataBuffer = req.file.buffer;
    const pdfData = await pdf(dataBuffer);
    pdfContent = pdfData.text;
  }

  const updateData = {
    faqs: faqs ? JSON.parse(faqs) : config?.faqs || [],
    instructions: instructions || config?.instructions || '',
    botName: botName || config?.botName || 'Support Assistant',
    knowledgeSources: {
      pdfContent,
      notionLinks: notionLinks ? JSON.parse(notionLinks) : config?.knowledgeSources?.notionLinks || []
    }
  };

  if (config) {
    config.faqs = updateData.faqs;
    config.instructions = updateData.instructions;
    config.botName = updateData.botName;
    config.knowledgeSources = updateData.knowledgeSources;
    await config.save();
  } else {
    config = await BotConfig.create({
      businessId,
      ...updateData
    });
  }

  res.status(200).json({ success: true, data: config });
});
