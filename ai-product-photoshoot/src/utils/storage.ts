const KEYS_STORAGE = "aiphotoshoot.providerKeys.v1";
const SELECTION_STORAGE = "aiphotoshoot.selection.v1";
const HISTORY_STORAGE = "aiphotoshoot.history.v1";
const MAX_HISTORY = 24;

export interface HistoryItem {
  id: string;
  createdAt: number;
  prompt: string;
  negativePrompt?: string;
  aspectRatio?: string;
  providerId?: string;
  modelId?: string;
  thumbnail: string;
  fullImage: string;
  originalThumbnail?: string;
}

export interface ProviderSelection {
  providerId: string;
  modelId: string;
}

// --- Provider API keys (one per provider id) ---------------------------------

export const loadProviderKeys = (): Record<string, string> => {
  try {
    const raw = localStorage.getItem(KEYS_STORAGE);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

export const saveProviderKey = (providerId: string, key: string): void => {
  try {
    const current = loadProviderKeys();
    if (key) current[providerId] = key;
    else delete current[providerId];
    localStorage.setItem(KEYS_STORAGE, JSON.stringify(current));
  } catch {
    /* storage unavailable */
  }
};

// --- Provider / model selection ----------------------------------------------

export const loadSelection = (): ProviderSelection | null => {
  try {
    const raw = localStorage.getItem(SELECTION_STORAGE);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.providerId === "string" && typeof parsed.modelId === "string") {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
};

export const saveSelection = (sel: ProviderSelection): void => {
  try {
    localStorage.setItem(SELECTION_STORAGE, JSON.stringify(sel));
  } catch {
    /* ignore */
  }
};

// --- History -----------------------------------------------------------------

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
  } catch {
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
