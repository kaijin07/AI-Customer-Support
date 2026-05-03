import express from 'express';
import { sendMessage } from '../controllers/chatController.js';
import config from '../config/index.js';

const router = express.Router();

/**
 * @desc    Get embed script
 * @route   GET /api/embed/script
 * @access  Public
 */
router.get('/script', async (req, res) => {
  const businessId = req.query.businessId;
  if (!businessId) {
    return res.status(400).send('businessId is required');
  }

  let botName = 'Chat Support';
  try {
    const { default: BotConfig } = await import('../models/BotConfig.js');
    const configData = await BotConfig.findOne({ businessId });
    if (configData && configData.botName) {
      botName = configData.botName;
    }
  } catch (err) {
    console.error('Error fetching bot config for embed:', err);
  }

  const script = `
    (function() {
      const businessId = "${businessId}";
      const apiUrl = "${config.apiUrl || 'http://localhost:5000'}";
      
      const script = document.createElement('script');
      script.src = apiUrl + '/widget.js';
      script.setAttribute('data-business-id', businessId);
      script.setAttribute('data-bot-name', "${botName}");
      document.body.appendChild(script);
    })();
  `;

  res.set('Content-Type', 'application/javascript');
  res.send(script);
});

/**
 * @desc    Public send message (from widget)
 * @route   POST /api/embed/chat/send
 * @access  Public
 */
router.post('/chat/send', sendMessage);

export default router;
