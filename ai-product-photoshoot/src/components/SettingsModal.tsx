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

interface KeyRowProps {
  provider: Provider;
  value: string;
  onChange: (v: string) => void;
}

const KeyRow: React.FC<KeyRowProps> = ({ provider, value, onChange }) => {
  const [reveal, setReveal] = useState(false);
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <label className="text-sm font-medium text-gray-200">{provider.name}</label>
        <span className="text-xs text-gray-500">
          {provider.requiresKey ? "Token required" : "No key needed"}
        </span>
      </div>
      {provider.requiresKey ? (
        <>
          <div className="relative">
            <input
              type={reveal ? "text" : "password"}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={
                provider.id === "huggingface" ? "hf_..." : "Paste your token"
              }
              className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 pl-3 pr-10 text-sm text-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
              spellCheck={false}
              autoComplete="off"
            />
            <button
              type="button"
              onClick={() => setReveal((r) => !r)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1"
              aria-label={reveal ? "Hide token" : "Show token"}
            >
              {reveal ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
            </button>
          </div>
          {provider.keyDocsUrl && (
            <p className="text-xs text-gray-500 mt-1.5">
              Get a free token at{" "}
              <a
                href={provider.keyDocsUrl}
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 hover:text-cyan-300 underline"
              >
                {provider.keyDocsLabel ?? provider.keyDocsUrl}
              </a>
              .
            </p>
          )}
        </>
      ) : (
        <p className="text-xs text-gray-500 italic">{provider.description}</p>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white">Provider Settings</h2>
            <p className="text-sm text-gray-400 mt-1">
              Keys stay in this browser's localStorage. Pollinations works without one.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded"
            aria-label="Close"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5">
          {providers.map((p) => (
            <KeyRow
              key={p.id}
              provider={p}
              value={draft[p.id] ?? ""}
              onChange={(v) => setDraft((d) => ({ ...d, [p.id]: v }))}
            />
          ))}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white rounded-md hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-bold bg-cyan-600 hover:bg-cyan-500 text-white rounded-md transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
