export const detectLocationLanguage = async () => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    const countryToLanguage = {
      'ES': 'es', 'MX': 'es', 'AR': 'es', 'CO': 'es', 'CL': 'es',
      'FR': 'fr', 'BE': 'fr', 'CH': 'fr', 'CA': 'fr',
      'DE': 'de', 'AT': 'de',
      'IT': 'it',
      'PT': 'pt', 'BR': 'pt',
      'NL': 'nl',
      'PL': 'pl',
      'RU': 'ru',
      'JP': 'ja',
      'CN': 'zh', 'TW': 'zh',
      'SA': 'ar', 'AE': 'ar', 'EG': 'ar',
      'IN': 'hi',
      'KR': 'ko',
      'TR': 'tr'
    };
    
    return countryToLanguage[data.country_code] || 'en';
  } catch (error) {
    console.error('Location detection failed:', error);
    return null;
  }
};