import BotConfig from '../models/BotConfig.js';

// @desc    Get bot config
// @route   GET /api/bot-config
// @access  Private
export const getBotConfig = async (req, res) => {
  try {
    let config = await BotConfig.findOne({ businessId: req.user.id });
    
    if (!config) {
      config = await BotConfig.create({ businessId: req.user.id, faqs: [], instructions: '' });
    }

    res.status(200).json({ success: true, data: config });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update bot config
// @route   POST /api/bot-config
// @access  Private
export const updateBotConfig = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
