const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const translationCache = new Map();

app.get('/health', (req, res) => {
  res.json({ status: 'Server is running!', timestamp: new Date() });
});

app.post('/translate-ui', async (req, res) => {
  const { language } = req.body;
  
  console.log(`Translation request for: ${language}`);
  
  const cacheKey = `ui-${language}`;
  if (translationCache.has(cacheKey)) {
    console.log('Returning cached translation');
    return res.json(translationCache.get(cacheKey));
  }
  
  const defaultUI = {
    title: "AI Card Creator",
    subtitle: "Describe your perfect card and let AI create it",
    placeholder: "Example: Create a birthday card for my sister who loves unicorns and the color purple...",
    generateButton: "✨ Generate My Card",
    loadingMessage: "AI is designing your perfect card...",
    examples: [
      "Birthday card for my adventurous dad who loves hiking",
      "Thank you card for my yoga teacher, calm and zen vibes",
      "Mother's Day card for my creative mom who paints",
      "Congratulations card for my friend's new baby"
    ],
    startOver: "Start Over",
    editMessage: "Edit Message",
    buyButton: "Buy for €1.50"
  };
  
  if (language === 'en') {
    translationCache.set(cacheKey, defaultUI);
    return res.json(defaultUI);
  }
  
  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: `Translate this UI text to ${language}. Return ONLY a valid JSON object (no markdown, no code blocks):

${JSON.stringify(defaultUI, null, 2)}

Rules:
- Keep emojis (✨)
- Keep €1.50 price
- Translate naturally for native speakers
- Make examples culturally appropriate
- Return pure JSON only`
      }]
    });
    
    let responseText = message.content[0].text.trim();
    responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    const translatedUI = JSON.parse(responseText);
    translationCache.set(cacheKey, translatedUI);
    
    console.log('Translation successful');
    res.json(translatedUI);
    
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ error: error.message, fallback: defaultUI });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});