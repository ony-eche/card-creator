import { useState } from 'react';
import { pricing } from '../utils/languages';
import { downloadPresentation } from '../utils/download';

export default function CardPreview({ 
  cardData, 
  language, 
  onEdit, 
  onPurchase, 
  onStartOver,
  uiText 
}) {
  const currentPricing = pricing[language] || pricing['en'];
  const [downloading, setDownloading] = useState(false);

const handlePreview = async () => {
  setDownloading(true);
  try {
    await downloadPresentation(cardData);
    alert('Preview downloaded! Check your downloads folder.');
  } catch (error) {
    alert('Failed to generate preview. Please try again.');
  } finally {
    setDownloading(false);
  }
};
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
      {/* Card Info */}
      <div className="mb-6 p-4 bg-purple-50 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-purple-900">
            {cardData.occasion}
          </h3>
          <span className="px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-sm font-medium">
            {cardData.cardType}
          </span>
        </div>
        <p className="text-purple-700 text-sm">
          {cardData.theme} • {cardData.mood}
        </p>
      </div>

      {/* Preview Slide */}
      <div 
        className="relative w-full aspect-[16/9] rounded-xl overflow-hidden shadow-lg mb-6"
        style={{ 
          backgroundColor: cardData.colors.background,
          color: cardData.colors.text 
        }}
      >
        {/* Emojis */}
        <div className="absolute inset-0">
          {cardData.slides[0]?.emojiPositions?.map((pos, idx) => (
            <div
              key={idx}
              className="absolute"
              style={{
                left: `${(pos.x / 10) * 100}%`,
                top: `${(pos.y / 5.625) * 100}%`,
                fontSize: `${pos.size}px`,
                opacity: 0.7
              }}
            >
              {pos.emoji}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {cardData.mainMessage}
          </h1>
          <p className="text-xl md:text-2xl italic">
            {cardData.subMessage}
          </p>
        </div>
      </div>

      {/* Slide Count */}
      <div className="text-center mb-6">
        <p className="text-gray-600">
          📊 {cardData.slides.length} slides • 
          {cardData.slides.map(s => s.layout).join(' → ')}
        </p>
      </div>

      {/* Edit Options */}
      <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded-xl">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {uiText.editMessage || 'Main Message'}
          </label>
          <input
            type="text"
            value={cardData.mainMessage}
            onChange={(e) => onEdit({ ...cardData, mainMessage: e.target.value })}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 outline-none"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subtitle
          </label>
          <input
            type="text"
            value={cardData.subMessage}
            onChange={(e) => onEdit({ ...cardData, subMessage: e.target.value })}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Background
            </label>
            <input
              type="color"
              value={cardData.colors.background}
              onChange={(e) => onEdit({
                ...cardData,
                colors: { ...cardData.colors, background: e.target.value }
              })}
              className="w-full h-12 rounded-lg cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Text Color
            </label>
            <input
              type="color"
              value={cardData.colors.text}
              onChange={(e) => onEdit({
                ...cardData,
                colors: { ...cardData.colors, text: e.target.value }
              })}
              className="w-full h-12 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {/* Preview Button */}
<button
  onClick={handlePreview}
  disabled={downloading}
  className="w-full mb-4 py-3 bg-blue-100 text-blue-800 rounded-xl font-semibold hover:bg-blue-200 disabled:opacity-50"
>
  {downloading ? '📥 Generating...' : '👁️ Preview Full Presentation (Free)'}
</button>
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={onStartOver}
          className="py-4 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition-all"
        >
          {uiText.startOver || 'Start Over'}
        </button>
        <button
          onClick={onPurchase}
          className="py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg"
        >
          💳 {uiText.buyButton || `Buy ${currentPricing.currency}${currentPricing.price}`}
        </button>
      </div>
    </div>
  );
}
const handleShare = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: cardData.mainMessage,
        text: `Check out this AI-generated card: ${cardData.mainMessage}`,
        url: window.location.href
      });
    } catch (error) {
      console.log('Share cancelled');
    }
  } else {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  }
};
