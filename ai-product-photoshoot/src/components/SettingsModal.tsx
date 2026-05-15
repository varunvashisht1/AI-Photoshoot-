import React, { useEffect, useState } from "react";
import type { Provider } from "../providers/types";
import { CloseIcon, EyeIcon, EyeOffIcon } from "./icons";

interface SettingsModalProps {
  open: boolean;
  providers: Provider[];
  initialKeys: Record<string, string>;
  onClose: () => void;
  onSave: (providerId: string, key: string) => void;
}

const KeyRow: React.FC<{
  provider: Provider;
  value: string;
  onChange: (v: string) => void;
}> = ({ provider, value, onChange }) => {
  const [reveal, setReveal] = useState(false);
  const acceptsKey = provider.requiresKey || !!provider.keyDocsUrl;
  const placeholder =
    provider.id === "huggingface"
      ? "hf_..."
      : provider.id === "pollinations"
        ? "Optional — unlocks FLUX models"
        : "Paste your token";
  const badgeLabel = provider.requiresKey
    ? "Token required"
    : acceptsKey
      ? "Token optional"
      : "No key needed";
  const badgeTone = provider.requiresKey
    ? "border-amber-500/30 bg-amber-500/10 text-amber-200"
    : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";

  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label className="text-sm font-semibold text-slate-100">{provider.name}</label>
        <span className={`rounded border px-1.5 py-0.5 text-[10px] font-semibold ${badgeTone}`}>
          {badgeLabel}
        </span>
      </div>
      {acceptsKey ? (
        <>
          <div className="relative">
            <input
              type={reveal ? "text" : "password"}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="w-full rounded-lg border border-white/10 bg-slate-950/60 py-2 pl-3 pr-10 text-sm text-slate-100 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/40 outline-none"
              spellCheck={false}
              autoComplete="off"
            />
            <button
              type="button"
              onClick={() => setReveal((r) => !r)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
              aria-label={reveal ? "Hide token" : "Show token"}
            >
              {reveal ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
            </button>
          </div>
          {provider.keyDocsUrl && (
            <p className="mt-1.5 text-[11px] text-slate-500">
              {provider.requiresKey ? "Free token at " : "Optional free token at "}
              <a
                href={provider.keyDocsUrl}
                target="_blank"
                rel="noreferrer"
                className="text-brand-300 underline hover:text-brand-200"
              >
                {provider.keyDocsLabel ?? provider.keyDocsUrl}
              </a>
            </p>
          )}
          {!provider.requiresKey && (
            <p className="mt-0.5 text-[11px] text-slate-500">{provider.description}</p>
          )}
        </>
      ) : (
        <p className="text-[12px] italic text-slate-400">{provider.description}</p>
      )}
    </div>
  );
};

export const SettingsModal: React.FC<SettingsModalProps> = ({
  open,
  providers,
  initialKeys,
  onClose,
  onSave,
}) => {
  const [draft, setDraft] = useState<Record<string, string>>(initialKeys);

  useEffect(() => {
    if (open) setDraft({ ...initialKeys });
  }, [open, initialKeys]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleSave = () => {
    for (const p of providers) {
      const v = (draft[p.id] ?? "").trim();
      if (v !== (initialKeys[p.id] ?? "")) onSave(p.id, v);
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="surface-elevated max-h-[90vh] w-full max-w-lg overflow-y-auto p-6 animate-slide-up"
      >
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Provider settings</h2>
            <p className="mt-1 text-sm text-slate-400">
              Tokens stay in your browser. Pollinations works without one.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:bg-white/5 hover:text-white"
            aria-label="Close"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3">
          {providers.map((p) => (
            <KeyRow
              key={p.id}
              provider={p}
              value={draft[p.id] ?? ""}
              onChange={(v) => setDraft((d) => ({ ...d, [p.id]: v }))}
            />
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="btn-ghost">
            Cancel
          </button>
          <button onClick={handleSave} className="btn-primary">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
