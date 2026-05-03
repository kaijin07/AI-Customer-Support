import TicketSummary from '../models/TicketSummary.js';

/** Max number of ticket summaries injected into one AI prompt */
const MAX_SUMMARIES = 3;

/**
 * Common English stop-words to ignore when extracting query keywords.
 */
const STOP_WORDS = new Set([
  'what', 'how', 'can', 'you', 'is', 'the', 'a', 'an', 'my', 'do', 'i',
  'to', 'of', 'in', 'for', 'and', 'or', 'not', 'please', 'help', 'me',
  'with', 'this', 'that', 'it', 'be', 'are', 'was', 'have', 'has', 'on',
  'at', 'by', 'from', 'get', 'need', 'want', 'know', 'about',
]);

/**
 * Extract meaningful search terms from a user query.
 * @param {string} query
 * @returns {string[]}
 */
function extractQueryWords(query) {
  return query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

/**
 * Score a block of text against a list of query words.
 * Returns a count of how many query words appear in the text.
 * @param {string} text
 * @param {string[]} queryWords
 * @returns {number}
 */
function scoreText(text, queryWords) {
  if (!text) return 0;
  const lower = text.toLowerCase();
  return queryWords.reduce((acc, word) => (lower.includes(word) ? acc + 1 : acc), 0);
}

/**
 * Retrieves the most relevant ticket summaries for a given user query.
 * Uses a lightweight keyword-overlap scoring (no external vector DB needed).
 *
 * @param {string} query         - The user's latest message
 * @param {mongoose.Types.ObjectId} businessId
 * @returns {Promise<Array>}     - Scored and ranked TicketSummary documents
 */
export const retrieveRelevantSummaries = async (query, businessId) => {
  const queryWords = extractQueryWords(query);
  if (queryWords.length === 0) return [];

  // Load recent summaries (cap at 200 to keep retrieval fast)
  const summaries = await TicketSummary.find({ businessId })
    .sort({ createdAt: -1 })
    .limit(200)
    .lean();

  const scored = summaries
    .map((s) => {
      const score =
        scoreText(s.problem, queryWords) * 3 +
        scoreText(s.resolution, queryWords) * 3 +
        (s.keywords || []).filter((k) =>
          queryWords.some((q) => k.includes(q) || q.includes(k))
        ).length * 2;

      return { ...s, _score: score };
    })
    .filter((s) => s._score > 0)
    .sort((a, b) => b._score - a._score)
    .slice(0, MAX_SUMMARIES);

  return scored;
};

/**
 * Formats retrieved summaries into a compact string block for the AI system prompt.
 * @param {Array} summaries
 * @returns {string}
 */
export const formatSummariesForPrompt = (summaries) => {
  if (!summaries || summaries.length === 0) return '';
  return (
    'Relevant Past Resolutions (use these to answer similar questions):\n' +
    summaries
      .map((s) => `- Problem: "${s.problem}" → Resolution: "${s.resolution}"`)
      .join('\n')
  );
};
