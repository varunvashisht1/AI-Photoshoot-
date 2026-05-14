import React, { useEffect, useRef, useState } from "react";
import { CloseIcon, EyeIcon, EyeOffIcon } from "./icons";

interface ApiKeyModalProps {
  open: boolean;
  initialKey: string;
  onClose: () => void;
  onSave: (key: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  open,
  initialKey,
  onClose,
  onSave,
}) => {
  const [value, setValue] = useState(initialKey);
  const [reveal, setReveal] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setValue(initialKey);
      setReveal(false);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open, initialKey]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl w-full max-w-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white">Gemini API Key</h2>
            <p className="text-sm text-gray-400 mt-1">
              Used only in your browser to call Google's Gemini Image API. Stored in localStorage.
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

        <label className="block text-xs font-medium text-gray-400 mb-1.5">
          API Key
        </label>
        <div className="relative">
          <input
            ref={inputRef}
            type={reveal ? "text" : "password"}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="AIza..."
            className="w-full bg-gray-800 border border-gray-700 rounded-md py-2.5 pl-3 pr-10 text-sm text-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
            spellCheck={false}
            autoComplete="off"
          />
          <button
            type="button"
            onClick={() => setReveal((r) => !r)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1"
            aria-label={reveal ? "Hide key" : "Show key"}
          >
            {reveal ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-3 leading-relaxed">
          Get a free key at{" "}
          <a
            href="https://aistudio.google.com/apikey"
            target="_blank"
            rel="noreferrer"
            className="text-cyan-400 hover:text-cyan-300 underline"
          >
            aistudio.google.com/apikey
          </a>
          . Make sure the project has access to the image preview model.
        </p>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white rounded-md hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(value.trim());
              onClose();
            }}
            disabled={!value.trim()}
            className="px-4 py-2 text-sm font-bold bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed text-white rounded-md transition-colors"
          >
            Save Key
          </button>
        </div>
      </div>
    </div>
  );
};
