import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { CloseIcon } from "./icons";

export type ToastKind = "info" | "success" | "error" | "warning";

interface ToastItem {
  id: number;
  kind: ToastKind;
  title: string;
  description?: string;
  duration: number;
}

interface ToastContextValue {
  show: (
    title: string,
    options?: { description?: string; kind?: ToastKind; duration?: number },
  ) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
};

const KIND_STYLES: Record<ToastKind, { ring: string; icon: string; iconBg: string }> = {
  info: {
    ring: "border-cyan-500/30 bg-cyan-500/5",
    icon: "ℹ",
    iconBg: "bg-cyan-500/20 text-cyan-300",
  },
  success: {
    ring: "border-emerald-500/30 bg-emerald-500/5",
    icon: "✓",
    iconBg: "bg-emerald-500/20 text-emerald-300",
  },
  error: {
    ring: "border-rose-500/30 bg-rose-500/5",
    icon: "!",
    iconBg: "bg-rose-500/20 text-rose-300",
  },
  warning: {
    ring: "border-amber-500/30 bg-amber-500/5",
    icon: "!",
    iconBg: "bg-amber-500/20 text-amber-300",
  },
};

let idCounter = 0;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: number) => {
    setItems((list) => list.filter((it) => it.id !== id));
  }, []);

  const show = useCallback<ToastContextValue["show"]>((title, options = {}) => {
    const id = ++idCounter;
    const item: ToastItem = {
      id,
      title,
      description: options.description,
      kind: options.kind ?? "info",
      duration: options.duration ?? 5000,
    };
    setItems((list) => [...list, item]);
    if (item.duration > 0) {
      setTimeout(() => {
        setItems((list) => list.filter((it) => it.id !== id));
      }, item.duration);
    }
  }, []);

  const value = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4 sm:bottom-6 sm:right-6 sm:left-auto sm:items-end"
      >
        {items.map((it) => {
          const s = KIND_STYLES[it.kind];
          return (
            <div
              key={it.id}
              role="status"
              className={`pointer-events-auto w-full max-w-sm overflow-hidden rounded-xl border ${s.ring} bg-slate-900/90 backdrop-blur-md shadow-2xl animate-toast-in`}
            >
              <div className="flex items-start gap-3 p-3.5">
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold ${s.iconBg}`}
                  aria-hidden
                >
                  {s.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-100">{it.title}</p>
                  {it.description && (
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-300">
                      {it.description}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => dismiss(it.id)}
                  aria-label="Dismiss notification"
                  className="text-slate-400 hover:text-white"
                >
                  <CloseIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

/** Bind a global keyboard shortcut. Returns nothing — install once in App. */
export const useKeyboardShortcut = (
  match: (e: KeyboardEvent) => boolean,
  handler: (e: KeyboardEvent) => void,
): void => {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (match(e)) handler(e);
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [match, handler]);
};
