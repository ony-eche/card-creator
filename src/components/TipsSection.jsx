export default function TipsSection({ language }) {
  const tips = {
    en: [
      '💡 Be specific! Include recipient details for personalized cards',
      '🎨 Mention colors or themes (e.g., "blue and gold")',
      '😊 Describe the mood (playful, elegant, warm)',
      '🎯 Include the occasion AND who it\'s for'
    ]
  };
  
  const currentTips = tips[language] || tips.en;
  
  return (
    <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
      <h3 className="font-bold text-yellow-900 mb-3 flex items-center">
        <span className="text-2xl mr-2">💡</span>
        Tips for Better Cards
      </h3>
      <ul className="space-y-2">
        {currentTips.map((tip, index) => (
          <li key={index} className="text-sm text-yellow-900">
            {tip}
          </li>
        ))}
      </ul>
    </div>
  );
}