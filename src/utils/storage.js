const HISTORY_KEY = 'card_history';
const MAX_HISTORY = 10;

export const saveCardToHistory = (cardSpec) => {
  const history = getCardHistory();
  const newCard = {
    id: Date.now(),
    cardSpec,
    createdAt: new Date().toISOString()
  };
  
  history.unshift(newCard);
  if (history.length > MAX_HISTORY) {
    history.pop();
  }
  
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
};

export const getCardHistory = () => {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  } catch {
    return [];
  }
};

export const clearCardHistory = () => {
  localStorage.removeItem(HISTORY_KEY);
};
