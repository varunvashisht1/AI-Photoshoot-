
import React from 'react';
import { SparklesIcon } from './icons';

interface PromptInputProps {
  prompt: string;
  setPrompt: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  onExampleClick: (prompt: string) => void;
}

const examplePrompts = [
    "on a marble countertop with soft morning light",
    "in a minimalist studio with a single spotlight",
    "on a wooden table next to a steaming cup of coffee",
    "floating in a pool of crystal clear water",
];

export const PromptInput: React.FC<PromptInputProps> = ({ prompt, setPrompt, onSubmit, isLoading, onExampleClick }) => {
  return (
    <div className="bg-gray-800/50 rounded-lg p-6 shadow-2xl flex flex-col">
      <h2 className="text-lg font-semibold text-gray-300 mb-4">2. Describe Your Scene</h2>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g., 'A modern watch on a dark, rocky surface with dramatic lighting...'"
        className="w-full bg-gray-900 border border-gray-700 rounded-md p-3 text-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200 min-h-[100px] text-sm"
        rows={4}
        disabled={isLoading}
      />
      <div className="mt-3">
        <p className="text-xs text-gray-500 mb-2">Need ideas? Try one of these:</p>
        <div className="flex flex-wrap gap-2">
            {examplePrompts.map((p, i) => (
                <button
                    key={i}
                    onClick={() => onExampleClick(p)}
                    disabled={isLoading}
                    className="text-xs bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-gray-300 px-2 py-1 rounded-full transition-colors"
                >
                    {p}
                </button>
            ))}
        </div>
      </div>
      <button
        onClick={onSubmit}
        disabled={isLoading || !prompt.trim()}
        className="mt-6 w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-cyan-500/30"
      >
        <SparklesIcon className="w-5 h-5" />
        {isLoading ? 'Generating...' : 'Generate Image'}
      </button>
    </div>
  );
};
