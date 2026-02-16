const languageNames = {
  'en': 'English', 'es': 'Spanish', 'fr': 'French', 
  'de': 'German', 'it': 'Italian', 'pt': 'Portuguese',
  'nl': 'Dutch', 'pl': 'Polish', 'ru': 'Russian',
  'ja': 'Japanese', 'zh': 'Chinese (Simplified)', 
  'ar': 'Arabic', 'hi': 'Hindi', 'ko': 'Korean', 'tr': 'Turkish'
};

app.post('/generate-card', async (req, res) => {
  const { userInput, language } = req.body;
  
  console.log(`Generating card in ${language}: "${userInput}"`);
  
  const targetLanguage = languageNames[language] || 'English';
  
  const prompt = `You are an expert greeting card designer. Based on the user's description, create a beautiful, personalized card design.

User request: "${userInput}"

CRITICAL REQUIREMENTS:
1. Generate ALL text content in ${targetLanguage}
2. Make it culturally appropriate for ${targetLanguage} speakers
3. Use emojis that match the theme
4. Choose colors that evoke the right emotion
5. Create 4-5 slides with varied content

Return a JSON object (NO MARKDOWN, pure JSON only):
{
  "cardType": "birthday|mothersday|fathersday|valentines|thankyou|congratulations|wedding|anniversary|graduation|getwell|sympathy|general",
  "occasion": "brief description",
  "recipientInfo": "what we know about the recipient",
  "theme": "the main visual theme",
  "mood": "warm|elegant|playful|professional|romantic|cheerful",
  "colors": {
    "background": "#hexcode",
    "text": "#hexcode",
    "accent": "#hexcode"
  },
  "emojis": ["3-5 relevant emojis"],
  "mainMessage": "THE MAIN HEADLINE IN ${targetLanguage.toUpperCase()}",
  "subMessage": "THE SUBTITLE IN ${targetLanguage.toUpperCase()}",
  "slides": [
    {
      "slideNumber": 1,
      "layout": "cover",
      "mainText": "TEXT IN ${targetLanguage.toUpperCase()}",
      "subText": "TEXT IN ${targetLanguage.toUpperCase()}",
      "emojis": ["relevant emojis for this slide"],
      "emojiPositions": [
        { "emoji": "🎈", "x": 1, "y": 0.5, "size": 72 },
        { "emoji": "🎉", "x": 8, "y": 1, "size": 60 }
      ]
    },
    {
      "slideNumber": 2,
      "layout": "message",
      "mainText": "A thoughtful message in ${targetLanguage.toUpperCase()}",
      "bodyText": "2-4 lines of heartfelt text in ${targetLanguage.toUpperCase()}",
      "emojis": ["relevant emojis"],
      "emojiPositions": [
        { "emoji": "💝", "x": 0.5, "y": 0.5, "size": 80 }
      ]
    },
    {
      "slideNumber": 3,
      "layout": "wishes",
      "mainText": "Wishes section title in ${targetLanguage.toUpperCase()}",
      "wishes": [
        "First wish in ${targetLanguage.toUpperCase()}",
        "Second wish in ${targetLanguage.toUpperCase()}",
        "Third wish in ${targetLanguage.toUpperCase()}",
        "Fourth wish in ${targetLanguage.toUpperCase()}"
      ],
      "emojis": ["✨", "⭐", "💫"],
      "emojiPositions": [
        { "emoji": "✨", "x": 1, "y": 0.5, "size": 48 }
      ]
    },
    {
      "slideNumber": 4,
      "layout": "celebration",
      "mainText": "Celebration text in ${targetLanguage.toUpperCase()}",
      "subText": "Additional celebration text in ${targetLanguage.toUpperCase()}",
      "emojis": ["🎊", "🎉", "🥳"],
      "emojiPositions": [
        { "emoji": "🎊", "x": 2, "y": 1, "size": 70 }
      ]
    },
    {
      "slideNumber": 5,
      "layout": "closing",
      "mainText": "Closing message in ${targetLanguage.toUpperCase()}",
      "subText": "Final sentiment in ${targetLanguage.toUpperCase()}",
      "emojis": ["💝", "💕"],
      "emojiPositions": [
        { "emoji": "💝", "x": 4.5, "y": 2, "size": 100 }
      ]
    }
  ]
}

Be creative and personalized based on the user's description!`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 3000,
      messages: [{ role: 'user', content: prompt }]
    });
    
    let responseText = message.content[0].text.trim();
    responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    const cardSpec = JSON.parse(responseText);
    
    console.log('Card generated successfully');
    res.json(cardSpec);
    
  } catch (error) {
    console.error('Card generation error:', error);
    res.status(500).json({ 
      error: error.message,
      hint: 'Make sure your ANTHROPIC_API_KEY is set correctly'
    });
  }
});