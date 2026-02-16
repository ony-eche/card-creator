import { languages } from '../utils/languages';

export default function LanguageSelector({ currentLang, onLanguageChange }) {
  return (
    <div className="absolute top-6 right-6 z-50">
      <select
        value={currentLang}
        onChange={(e) => onLanguageChange(e.target.value)}
        className="bg-white border-2 border-purple-300 rounded-lg px-4 py-2 text-base font-medium shadow-md hover:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
      >
        {languages.map(lang => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}