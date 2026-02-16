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

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running!', timestamp: new Date() });
});

// Translate UI endpoint
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

// Generate card endpoint
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

// Start server
const pptxgen = require('pptxgenjs');

app.post('/generate-presentation', async (req, res) => {
  const { cardSpec } = req.body;
  
  console.log('Generating presentation...');
  
  try {
    let pres = new pptxgen();
    pres.layout = 'LAYOUT_16x9';
    pres.author = 'AI Card Creator';
    pres.title = cardSpec.mainMessage;
    
    // Extract colors (remove # for pptxgenjs)
    const bgColor = cardSpec.colors.background.replace('#', '');
    const textColor = cardSpec.colors.text.replace('#', '');
    const accentColor = cardSpec.colors.accent?.replace('#', '') || textColor;
    
    // Generate each slide
    cardSpec.slides.forEach((slideData, index) => {
      let slide = pres.addSlide();
      slide.background = { color: bgColor };
      
      // Add emojis
      if (slideData.emojiPositions && slideData.emojiPositions.length > 0) {
        slideData.emojiPositions.forEach(pos => {
          slide.addText(pos.emoji, {
            x: pos.x,
            y: pos.y,
            fontSize: pos.size || 60
          });
        });
      }
      
      switch (slideData.layout) {
        case 'cover':
          // Main message
          slide.addText(slideData.mainText, {
            x: 0, y: 2, w: 10, h: 1.5,
            fontSize: 54, bold: true,
            color: textColor,
            align: 'center',
            valign: 'middle'
          });
          
          // Subtitle
          if (slideData.subText) {
            slide.addText(slideData.subText, {
              x: 0, y: 3.7, w: 10, h: 0.8,
              fontSize: 28, italic: true,
              color: textColor,
              align: 'center',
              valign: 'middle'
            });
          }
          break;
        
        case 'message':
          // Title
          slide.addText(slideData.mainText, {
            x: 0.5, y: 0.8, w: 9, h: 0.8,
            fontSize: 40, bold: true,
            color: textColor,
            align: 'center'
          });
          
          // Body text
          if (slideData.bodyText) {
            slide.addText(slideData.bodyText, {
              x: 1, y: 2.2, w: 8, h: 2.5,
              fontSize: 24,
              color: textColor,
              align: 'center',
              valign: 'middle'
            });
          }
          break;
        
        case 'wishes':
          // Title
          slide.addText(slideData.mainText, {
            x: 0.5, y: 0.8, w: 9, h: 0.7,
            fontSize: 36, bold: true,
            color: textColor,
            align: 'center'
          });
          
          // Wishes list
          if (slideData.wishes && slideData.wishes.length > 0) {
            const wishText = slideData.wishes.map((wish, i) => ({
              text: `${slideData.emojis[i] || '✨'} ${wish}`,
              options: { 
                breakLine: i < slideData.wishes.length - 1,
                fontSize: 22
              }
            }));
            
            slide.addText(wishText, {
              x: 1.5, y: 2, w: 7, h: 3,
              color: textColor,
              align: 'left',
              valign: 'middle',
              lineSpacing: 36
            });
          }
          break;
        
        case 'celebration':
          slide.addText(slideData.mainText, {
            x: 0.5, y: 2.5, w: 9, h: 1,
            fontSize: 48, bold: true,
            color: textColor,
            align: 'center',
            valign: 'middle'
          });
          
          if (slideData.subText) {
            slide.addText(slideData.subText, {
              x: 0.5, y: 3.7, w: 9, h: 0.6,
              fontSize: 24,
              color: textColor,
              align: 'center'
            });
          }
          break;
        
        case 'closing':
          slide.addText(slideData.mainText, {
            x: 0.5, y: 2.8, w: 9, h: 0.8,
            fontSize: 36, bold: true,
            color: textColor,
            align: 'center',
            italic: true
          });
          
          if (slideData.subText) {
            slide.addText(slideData.subText, {
              x: 0.5, y: 3.8, w: 9, h: 0.5,
              fontSize: 22,
              color: textColor,
              align: 'center'
            });
          }
          break;
      }
    });
    
    // Generate base64
    const base64 = await pres.write({ outputType: 'base64' });
    
    console.log('Presentation generated successfully');
    
    res.json({
      file: base64,
      filename: `${cardSpec.cardType}-card.pptx`
    });
    
  } catch (error) {
    console.error('Presentation generation error:', error);
    res.status(500).json({ error: error.message });
  }
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:3001`);
});
