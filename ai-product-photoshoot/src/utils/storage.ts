const API_KEY_STORAGE = "aiphotoshoot.apiKey";
const HISTORY_STORAGE = "aiphotoshoot.history.v1";
const MAX_HISTORY = 24;

export interface HistoryItem {
  id: string;
  createdAt: number;
  prompt: string;
  negativePrompt?: string;
  aspectRatio?: string;
  thumbnail: string;
  fullImage: string;
  originalThumbnail?: string;
}

export const loadApiKey = (): string => {
  try {
    return localStorage.getItem(API_KEY_STORAGE) ?? "";
  } catch {
    return "";
  }
};

export const saveApiKey = (key: string): void => {
  try {
    if (key) localStorage.setItem(API_KEY_STORAGE, key);
    else localStorage.removeItem(API_KEY_STORAGE);
  } catch {
    /* storage unavailable */
  }
};

export const loadHistory = (): HistoryItem[] => {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const persistHistory = (items: HistoryItem[]): void => {
  try {
    localStorage.setItem(HISTORY_STORAGE, JSON.stringify(items));
  } catch (err) {
    // Likely quota exceeded — drop oldest half and retry once.
    if (items.length > 4) {
      try {
        localStorage.setItem(
          HISTORY_STORAGE,
          JSON.stringify(items.slice(0, Math.ceil(items.length / 2))),
        );
      } catch {
        /* give up silently */
      }
    }
  }
};

export const addToHistory = (item: HistoryItem): HistoryItem[] => {
  const current = loadHistory();
  const next = [item, ...current].slice(0, MAX_HISTORY);
  persistHistory(next);
  return next;
};

export const removeFromHistory = (id: string): HistoryItem[] => {
  const next = loadHistory().filter((it) => it.id !== id);
  persistHistory(next);
  return next;
};

export const clearHistory = (): void => {
  try {
    localStorage.removeItem(HISTORY_STORAGE);
  } catch {
    /* ignore */
  }
};
