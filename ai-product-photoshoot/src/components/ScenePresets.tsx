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
    <div className="surface-elevated p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold text-slate-100">Scene presets</h2>
          <p className="text-[11px] text-slate-500">
            One click — fine-tune the wording below.
          </p>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-1.5 border-b border-white/5 pb-3">
        {PRESET_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setTab(cat)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              tab === cat
                ? "bg-gradient-to-r from-cyan-500 to-indigo-500 text-white shadow-glow"
                : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
        {items.map((p) => {
          const active = activeId === p.id;
          return (
            <button
              key={p.id}
              onClick={() => onPick(p)}
              className={`group overflow-hidden rounded-xl border text-left transition-all ${
                active
                  ? "border-cyan-400 ring-2 ring-cyan-400/40 shadow-glow"
                  : "border-white/10 hover:border-white/25 hover:translate-y-[-1px]"
              }`}
              title={p.prompt}
            >
              <div
                className={`h-16 bg-gradient-to-br ${p.swatch} transition-all group-hover:brightness-110`}
              />
              <div className="bg-slate-950/70 px-2 py-1.5">
                <p className="truncate text-xs font-semibold text-slate-100">{p.name}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
