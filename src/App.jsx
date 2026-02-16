import { useState, useEffect } from 'react';
import LanguageSelector from './components/LanguageSelector';
import LoadingState from './components/LoadingState';
import { detectUserLanguage, pricing } from './utils/languages';

function App() {
  const [userLanguage, setUserLanguage] = useState('en');
  const [userInput, setUserInput] = useState('');
  const [uiText, setUiText] = useState(null);
  const [loadingUI, setLoadingUI] = useState(true);
  const [generatingCard, setGeneratingCard] = useState(false);
  const [generatedCard, setGeneratedCard] = useState(null);

  useEffect(() => {
  const detectLanguage = async () => {
    const locationLang = await detectLocationLanguage();
    if (locationLang) {
      setUserLanguage(locationLang);
      return;
    }
    
    const browserLang = detectUserLanguage();
    setUserLanguage(browserLang);
  };
    
  const loadUITranslations = async (lang) => {
    setLoadingUI(true);
    try {
      const response = await fetch('http://localhost:3001/translate-ui', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: lang })
      });
      const data = await response.json();
      setUiText(data);
    } catch (error) {
      console.error('Translation error:', error);
      setUiText(getDefaultUIText());
    } finally {
      setLoadingUI(false);
    }
  };

  const getDefaultUIText = () => ({
    title: "AI Card Creator",
    subtitle: "Describe your perfect card and leave the creation to usS",
    placeholder: "Example: Create a birthday card for my sister who loves unicorns and the color purple...",
    generateButton: "✨ Create My Card",
    loadingMessage: "We are designing your perfect card...",
    examples: [
      "Birthday card for my adventurous dad who loves hiking",
      "Thank you card for my yoga teacher, calm and zen vibes",
      "Mother's Day card for my creative mom who paints",
      "Congratulations card for my friend's new baby"
    ],
    startOver: "Start Over",
    editMessage: "Edit Message",
    buyButton: `Buy for ${pricing['en'].currency}${pricing['en'].price}`
  });

  const handleGenerate = async () => {
    if (!userInput.trim()) return;
    
    setGeneratingCard(true);
    try {
      const response = await fetch('http://localhost:3001/generate-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userInput,
          language: userLanguage 
        })
      });
      const cardData = await response.json();
      setGeneratedCard(cardData);
    } catch (error) {
      console.error('Card generation error:', error);
      alert('Failed to generate card. Please try again.');
    } finally {
      setGeneratingCard(false);
    }
  };

  const handleExampleClick = (example) => {
    setUserInput(example);
  };

  if (loadingUI || !uiText) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <LoadingState message="Loading..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 md:p-8">
      <LanguageSelector 
        currentLang={userLanguage}
        onLanguageChange={setUserLanguage}
      />

      <div className="max-w-5xl mx-auto pt-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
            {uiText.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {uiText.subtitle}
          </p>
        </div>

        {!generatedCard ? (
          <>
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6">
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={uiText.placeholder}
                className="w-full h-40 p-4 text-lg border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none resize-none"
                disabled={generatingCard}
              />
              
              <button
                onClick={handleGenerate}
                disabled={generatingCard || !userInput.trim()}
                className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                {uiText.generateButton}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {uiText.examples.map((example, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(example)}
                  className="p-4 bg-white rounded-xl text-left hover:bg-purple-50 border-2 border-transparent hover:border-purple-300 transition-all shadow-md hover:shadow-lg"
                >
                  <p className="text-sm text-gray-700">{example}</p>
                </button>
              ))}
            </div>

            {generatingCard && (
              <div className="mt-8">
                <LoadingState message={uiText.loadingMessage} />
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Card Generated!</h3>
              <pre className="text-left bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
                {JSON.stringify(generatedCard, null, 2)}
              </pre>
              <button
                onClick={() => setGeneratedCard(null)}
                className="mt-4 px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                {uiText.startOver}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;