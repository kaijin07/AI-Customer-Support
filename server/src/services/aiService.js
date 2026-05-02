import OpenAI from 'openai';
import config from '../config/index.js';

const openai = new OpenAI({
  apiKey: config.groqApiKey,
  baseURL: 'https://api.groq.com/openai/v1',
});

export const generateReply = async (messages, businessData, userName) => {
  try {
    const { faqs = [], instructions = '' } = businessData || {};
    const businessName = businessData?.businessName || 'our business';

    const faqString = faqs.map(f => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n');

    const systemPrompt = `You are a helpful and friendly customer support assistant for ${businessName}.
You are currently talking to a user named ${userName || 'Customer'}. Use their name occasionally to be polite.

Instructions from the business:
${instructions}

Frequently Asked Questions:
${faqString}

Guidelines:
1. Always try to answer the user's question based on the provided FAQs or Instructions.
2. If the user asks a question that is NOT covered by the FAQs or instructions, politely inform them that you do not have that information and suggest they escalate to a human agent or create a support ticket.
3. Keep your answers concise, professional, and friendly.
4. If you detect that the user is angry, frustrated, or explicitly asks for a human, agent, or support ticket, ALWAYS include the exact keyword "ESCALATE_TICKET" at the very end of your response so the system can automatically create a ticket.`;

    const apiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text,
      }))
    ];

    const response = await openai.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: apiMessages,
      temperature: 0.5,
      max_tokens: 300,
    });

    const replyText = response.choices[0].message.content.trim();
    
    // Check if the AI decided to escalate
    const escalate = replyText.includes('ESCALATE_TICKET');
    
    // Clean up the reply text if the flag was included
    const cleanReplyText = replyText.replace('ESCALATE_TICKET', '').trim();

    return {
      text: cleanReplyText,
      escalate
    };
  } catch (error) {
    console.error('Groq AI Service Error:', error.message || error);
    return {
      text: "Sorry, I am having trouble connecting right now.",
      escalate: false
    };
  }
};
