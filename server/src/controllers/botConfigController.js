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
    config = await BotConfig.create({ businessId: req.user.id, faqs: [], instructions: '' });
  }

  res.status(200).json({ success: true, data: config });
});

/**
 * @desc    Update bot config
 * @route   POST /api/bot-config
 * @access  Private
 */
export const updateBotConfig = asyncHandler(async (req, res) => {
  const { faqs, instructions } = req.body;

  let config = await BotConfig.findOne({ businessId: req.user.id });

  if (config) {
    config.faqs = faqs;
    config.instructions = instructions;
    await config.save();
  } else {
    config = await BotConfig.create({
      businessId: req.user.id,
      faqs,
      instructions
    });
  }

  res.status(200).json({ success: true, data: config });
});
