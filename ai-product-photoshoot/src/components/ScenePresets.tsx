import React, { useState } from "react";
import {
  PRESET_CATEGORIES,
  SCENE_PRESETS,
  type PresetCategory,
  type ScenePreset,
} from "../data/presets";

interface ScenePresetsProps {
  onPick: (preset: ScenePreset) => void;
  activeId?: string;
}

export const ScenePresets: React.FC<ScenePresetsProps> = ({ onPick, activeId }) => {
  const [tab, setTab] = useState<PresetCategory>("Studio");
  const items = SCENE_PRESETS.filter((p) => p.category === tab);

  return (
    <div className="bg-gray-800/50 rounded-lg p-5 shadow-2xl">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <h2 className="text-lg font-semibold text-gray-300">Scene Presets</h2>
        <span className="text-xs text-gray-500">Click a card — you can fine-tune below</span>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4 border-b border-gray-700/60 pb-3">
        {PRESET_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setTab(cat)}
            className={`text-xs px-3 py-1.5 rounded-full transition-colors font-medium ${
              tab === cat
                ? "bg-cyan-600 text-white"
                : "bg-gray-700/60 text-gray-300 hover:bg-gray-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
        {items.map((p) => (
          <button
            key={p.id}
            onClick={() => onPick(p)}
            className={`group text-left rounded-lg overflow-hidden border transition-all ${
              activeId === p.id
                ? "border-cyan-400 ring-2 ring-cyan-500/40"
                : "border-gray-700 hover:border-gray-500"
            }`}
            title={p.prompt}
          >
            <div
              className={`h-16 bg-gradient-to-br ${p.swatch} group-hover:brightness-110 transition-all`}
            />
            <div className="px-2 py-1.5 bg-gray-900/70">
              <p className="text-xs font-medium text-gray-200 truncate">{p.name}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
