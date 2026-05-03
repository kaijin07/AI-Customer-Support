import OpenAI from 'openai';
import config from '../config/index.js';

const openai = new OpenAI({
  apiKey: config.groqApiKey,
  baseURL: 'https://api.groq.com/openai/v1',
});

/**
 * Minimum number of messages in a conversation before
 * it's worth summarizing (at least 2 full exchanges).
 */
const MIN_MESSAGES_TO_SUMMARIZE = 4;

/**
 * Returns true if a conversation has enough substance to be summarized.
 * @param {Array} messages
 */
export const shouldSummarize = (messages) =>
  Array.isArray(messages) && messages.length >= MIN_MESSAGES_TO_SUMMARIZE;

/**
 * Uses Groq AI to compress a conversation into a structured Problem/Resolution/Keywords triple.
 * Falls back to a basic extraction on API failure so the pipeline never crashes.
 *
 * @param {Array} messages - Array of { sender, text } message objects
 * @returns {{ problem: string, resolution: string, keywords: string[] }}
 */
export const summarizeConversation = async (messages) => {
  const transcript = messages
    .map((m) => `${m.sender.toUpperCase()}: ${m.text}`)
    .join('\n');

  const prompt = `You are a customer support analyst. Analyze the conversation below and extract a structured summary.

IMPORTANT RULES:
- "Problem" must be a ONE sentence description of what the customer needed help with.
- "Resolution" must be the ACTUAL answer or solution given to the customer — quote it directly if possible. Do NOT write "questions were answered" or "issue was resolved". Write WHAT the answer was.
- "Keywords" must be simple single words or short phrases, lowercase, comma-separated.

Conversation:
${transcript}

Respond in EXACTLY this format (no extra text, no markdown):
Problem: <one concise sentence describing the customer's issue>
Resolution: <the actual answer or solution provided, e.g. "Refunds are processed within 5-7 business days" or "Product can be replaced with one of equal or lesser value">
Keywords: <5-8 lowercase keywords>`;

  try {
    const response = await openai.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      max_tokens: 300,
    });

    const text = response.choices[0].message.content.trim();
    const lines = text.split('\n').map((l) => l.trim());

    const problem =
      lines.find((l) => l.startsWith('Problem:'))?.replace('Problem:', '').trim() ||
      'Customer support request';
    const resolution =
      lines.find((l) => l.startsWith('Resolution:'))?.replace('Resolution:', '').trim() ||
      'Unresolved';
    const keywordsRaw =
      lines.find((l) => l.startsWith('Keywords:'))?.replace('Keywords:', '').trim() || '';
    const keywords = keywordsRaw
      .split(',')
      .map((k) => k.trim().toLowerCase())
      .filter(Boolean);

    return { problem, resolution, keywords };
  } catch (err) {
    // Graceful fallback — never block the delete pipeline
    const userText = messages
      .filter((m) => m.sender === 'user')
      .map((m) => m.text)
      .join(' ')
      .substring(0, 120);

    return {
      problem: userText || 'Customer support request',
      resolution: 'Conversation archived',
      keywords: [],
    };
  }
};
