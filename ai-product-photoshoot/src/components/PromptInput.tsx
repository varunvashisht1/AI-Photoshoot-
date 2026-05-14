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

  return (
    <div className="bg-gray-800/50 rounded-lg p-5 shadow-2xl flex flex-col">
      <h2 className="text-lg font-semibold text-gray-300 mb-3">Scene Description</h2>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g. on a polished marble counter with soft morning sunlight from the left and a sprig of fresh basil"
        className="w-full bg-gray-900 border border-gray-700 rounded-md p-3 text-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200 min-h-[110px] text-sm resize-y"
        rows={4}
        disabled={isLoading}
      />
      <p className="text-xs text-gray-500 mt-1.5">
        Tip: pick a preset above for a starting point, then add a sentence to personalize.
      </p>
      <button
        onClick={onSubmit}
        disabled={cannotSubmit}
        title={disabled && disabledReason ? disabledReason : undefined}
        className="mt-4 w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-700 disabled:cursor-not-allowed disabled:text-gray-400 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-cyan-500/30"
      >
        <SparklesIcon className="w-5 h-5" />
        {isLoading ? "Generating…" : "Generate"}
      </button>
      {disabled && disabledReason && !isLoading && (
        <p className="text-xs text-amber-400 mt-2 text-center">{disabledReason}</p>
      )}
    </div>
  );
};
