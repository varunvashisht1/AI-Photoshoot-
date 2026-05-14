import React from "react";
import type { AspectRatio } from "../services/geminiService";
import { LIGHTING_OPTIONS, MOOD_OPTIONS } from "../utils/promptBuilder";

export interface AdvancedSettingsValue {
  aspectRatio: AspectRatio;
  variations: 1 | 2 | 4;
  lighting: string;
  mood: string;
  negativePrompt: string;
}

interface AdvancedSettingsProps {
  value: AdvancedSettingsValue;
  onChange: (next: AdvancedSettingsValue) => void;
  disabled?: boolean;
}

const ASPECTS: { label: string; value: AspectRatio }[] = [
  { label: "1:1", value: "1:1" },
  { label: "4:5", value: "4:5" },
  { label: "3:4", value: "3:4" },
  { label: "16:9", value: "16:9" },
  { label: "9:16", value: "9:16" },
];

export const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({
  value,
  onChange,
  disabled,
}) => {
  const update = <K extends keyof AdvancedSettingsValue>(
    key: K,
    v: AdvancedSettingsValue[K],
  ) => onChange({ ...value, [key]: v });

  return (
    <div className="bg-gray-800/50 rounded-lg p-5 shadow-2xl space-y-4">
      <h2 className="text-lg font-semibold text-gray-300">Settings</h2>

      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1.5">Aspect Ratio</label>
        <div className="flex flex-wrap gap-1.5">
          {ASPECTS.map((a) => (
            <button
              key={a.value}
              disabled={disabled}
              onClick={() => update("aspectRatio", a.value)}
              className={`text-xs font-medium px-3 py-1.5 rounded-md transition-colors ${
                value.aspectRatio === a.value
                  ? "bg-cyan-600 text-white"
                  : "bg-gray-700/60 text-gray-300 hover:bg-gray-700"
              } disabled:opacity-50`}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1.5">Variations</label>
        <div className="flex gap-1.5">
          {[1, 2, 4].map((n) => (
            <button
              key={n}
              disabled={disabled}
              onClick={() => update("variations", n as 1 | 2 | 4)}
              className={`text-xs font-medium px-4 py-1.5 rounded-md transition-colors ${
                value.variations === n
                  ? "bg-cyan-600 text-white"
                  : "bg-gray-700/60 text-gray-300 hover:bg-gray-700"
              } disabled:opacity-50`}
            >
              {n}x
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Lighting</label>
          <select
            disabled={disabled}
            value={value.lighting}
            onChange={(e) => update("lighting", e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-md py-2 px-2 text-sm text-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none disabled:opacity-50"
          >
            <option value="">Auto</option>
            {LIGHTING_OPTIONS.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Mood</label>
          <select
            disabled={disabled}
            value={value.mood}
            onChange={(e) => update("mood", e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-md py-2 px-2 text-sm text-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none disabled:opacity-50"
          >
            <option value="">Auto</option>
            {MOOD_OPTIONS.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1.5">
          Avoid (negative prompt)
        </label>
        <input
          disabled={disabled}
          type="text"
          value={value.negativePrompt}
          onChange={(e) => update("negativePrompt", e.target.value)}
          placeholder="e.g. text, hands, blurry, low quality"
          className="w-full bg-gray-900 border border-gray-700 rounded-md py-2 px-3 text-sm text-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none disabled:opacity-50"
        />
      </div>
    </div>
  );
};
