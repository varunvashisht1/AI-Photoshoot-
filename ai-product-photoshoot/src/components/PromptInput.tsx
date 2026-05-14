import React from "react";
import { SparklesIcon } from "./icons";

interface PromptInputProps {
  prompt: string;
  setPrompt: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  disabled?: boolean;
  disabledReason?: string;
}

export const PromptInput: React.FC<PromptInputProps> = ({
  prompt,
  setPrompt,
  onSubmit,
  isLoading,
  disabled,
  disabledReason,
}) => {
  const cannotSubmit = isLoading || !prompt.trim() || disabled;
  const charCount = prompt.length;
  const isMac =
    typeof navigator !== "undefined" && /Mac|iPhone|iPod|iPad/i.test(navigator.userAgent);

  return (
    <div className="surface-elevated p-5">
      <div className="mb-2 flex items-baseline justify-between">
        <h2 className="text-base font-semibold text-slate-100">Describe your scene</h2>
        <span className="text-[11px] text-slate-500 tabular-nums">{charCount} chars</span>
      </div>
      <div className="relative">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && !cannotSubmit) {
              e.preventDefault();
              onSubmit();
            }
          }}
          placeholder="A sleek black ceramic vase on a polished marble counter, soft morning light from the left, sprig of fresh basil…"
          className="block w-full resize-y rounded-lg border border-white/10 bg-slate-950/60 p-3 text-sm leading-relaxed text-slate-100 placeholder:text-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/40 outline-none min-h-[120px]"
          rows={4}
          disabled={isLoading}
        />
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[11px] text-slate-500">
          Tip: pick a preset above, then add the product details.
        </p>
        <kbd className="hidden rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-slate-400 sm:inline">
          {isMac ? "⌘" : "Ctrl"} + ↵
        </kbd>
      </div>
      <button
        onClick={onSubmit}
        disabled={cannotSubmit}
        title={disabled && disabledReason ? disabledReason : undefined}
        className="btn-primary mt-4 w-full py-3 text-base"
      >
        <SparklesIcon className={`h-5 w-5 ${isLoading ? "animate-pulse-soft" : ""}`} />
        {isLoading ? "Generating…" : "Generate"}
      </button>
      {disabled && disabledReason && !isLoading && (
        <p className="mt-2 text-center text-xs text-amber-300/90">{disabledReason}</p>
      )}
    </div>
  );
};
