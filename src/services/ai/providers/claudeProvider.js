const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY });

const complete = async (prompt) => {
  const response = await client.messages.create({
    model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-6',
    max_tokens: 1000,
    messages: [{ role: 'user', content: prompt }],
  });

  // Claude's SDK returns content as an array of blocks; we expect a single text block
  const textBlock = response.content.find((block) => block.type === 'text');
  return textBlock ? textBlock.text : '';
};

module.exports = { complete };