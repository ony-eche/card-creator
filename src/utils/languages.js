export const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧', rtl: false },
  { code: 'es', name: 'Español', flag: '🇪🇸', rtl: false },
  { code: 'fr', name: 'Français', flag: '🇫🇷', rtl: false },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', rtl: false },
  { code: 'it', name: 'Italiano', flag: '🇮🇹', rtl: false },
  { code: 'pt', name: 'Português', flag: '🇵🇹', rtl: false },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱', rtl: false },
  { code: 'pl', name: 'Polski', flag: '🇵🇱', rtl: false },
  { code: 'ru', name: 'Русский', flag: '🇷🇺', rtl: false },
  { code: 'ja', name: '日本語', flag: '🇯🇵', rtl: false },
  { code: 'zh', name: '中文', flag: '🇨🇳', rtl: false },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', rtl: true },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳', rtl: false },
  { code: 'ko', name: '한국어', flag: '🇰🇷', rtl: false },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷', rtl: false }
];

export const pricing = {
  'en': { currency: '€', price: 1.50, symbol: 'EUR' },
  'es': { currency: '€', price: 1.50, symbol: 'EUR' },
  'fr': { currency: '€', price: 1.50, symbol: 'EUR' },
  'de': { currency: '€', price: 1.50, symbol: 'EUR' },
  'it': { currency: '€', price: 1.50, symbol: 'EUR' },
  'pt': { currency: '€', price: 1.50, symbol: 'EUR' },
  'nl': { currency: '€', price: 1.50, symbol: 'EUR' },
  'pl': { currency: 'zł', price: 6.50, symbol: 'PLN' },
  'ru': { currency: '₽', price: 150, symbol: 'RUB' },
  'ja': { currency: '¥', price: 230, symbol: 'JPY' },
  'zh': { currency: '¥', price: 11, symbol: 'CNY' },
  'ar': { currency: '$', price: 1.50, symbol: 'USD' },
  'hi': { currency: '₹', price: 125, symbol: 'INR' },
  'ko': { currency: '₩', price: 2000, symbol: 'KRW' },
  'tr': { currency: '₺', price: 50, symbol: 'TRY' }
};

export const detectUserLanguage = () => {
  const browserLang = navigator.language.split('-')[0];
  if (languages.find(l => l.code === browserLang)) {
    return browserLang;
  }
  return 'en';
};