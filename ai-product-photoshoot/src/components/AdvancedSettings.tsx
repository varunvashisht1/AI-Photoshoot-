import React from "react";
import type { AspectRatio } from "../providers/types";
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

interface AspectOption {
  label: string;
  hint: string;
  value: AspectRatio;
  glyph: { w: number; h: number };
}

const ASPECTS: AspectOption[] = [
  { label: "Square", hint: "Instagram · Amazon · 1:1", value: "1:1", glyph: { w: 22, h: 22 } },
  { label: "Portrait", hint: "Pinterest · Etsy · 4:5", value: "4:5", glyph: { w: 18, h: 22 } },
  { label: "Tall", hint: "Print · 3:4", value: "3:4", glyph: { w: 16, h: 22 } },
  { label: "Landscape", hint: "Hero · X / Twitter · 16:9", value: "16:9", glyph: { w: 26, h: 14 } },
  { label: "Story", hint: "Instagram · TikTok · 9:16", value: "9:16", glyph: { w: 14, h: 24 } },
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
    <div className="surface-elevated p-5 space-y-5">
      <h2 className="text-base font-semibold text-slate-100">Settings</h2>

      <div>
        <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-400">
          Aspect ratio
        </label>
        <div className="grid grid-cols-5 gap-1.5">
          {ASPECTS.map((a) => {
            const active = value.aspectRatio === a.value;
            return (
              <button
                key={a.value}
                disabled={disabled}
                onClick={() => update("aspectRatio", a.value)}
                title={a.hint}
                className={`group flex flex-col items-center gap-1 rounded-lg border px-2 py-2 transition-all ${
                  active
                    ? "border-cyan-400 bg-cyan-500/10 ring-1 ring-cyan-400/30"
                    : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]"
                } disabled:opacity-50`}
              >
                <span
                  aria-hidden
                  className={`rounded-sm border-2 ${
                    active ? "border-cyan-300" : "border-slate-400 group-hover:border-slate-200"
                  }`}
                  style={{ width: a.glyph.w, height: a.glyph.h }}
                />
                <span
                  className={`text-[10px] font-semibold ${
                    active ? "text-cyan-200" : "text-slate-200"
                  }`}
                >
                  {a.label}
                </span>
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-[11px] text-slate-500">
          {ASPECTS.find((a) => a.value === value.aspectRatio)?.hint}
        </p>
      </div>

      <div>
        <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-400">
          Variations
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {[1, 2, 4].map((n) => (
            <button
              key={n}
              disabled={disabled}
              onClick={() => update("variations", n as 1 | 2 | 4)}
              className={`rounded-lg border px-3 py-2 text-sm font-semibold transition-all ${
                value.variations === n
                  ? "border-cyan-400 bg-cyan-500/10 text-cyan-200 ring-1 ring-cyan-400/30"
                  : "border-white/10 bg-white/[0.02] text-slate-200 hover:border-white/20 hover:bg-white/[0.05]"
              } disabled:opacity-50`}
            >
              {n}×
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400">
            Lighting
          </label>
          <select
            disabled={disabled}
            value={value.lighting}
            onChange={(e) => update("lighting", e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-2 py-2 text-sm text-slate-100 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/40 outline-none disabled:opacity-50"
          >
            <option value="">Auto</option>
            {LIGHTING_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400">
            Mood
          </label>
          <select
            disabled={disabled}
            value={value.mood}
            onChange={(e) => update("mood", e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-2 py-2 text-sm text-slate-100 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/40 outline-none disabled:opacity-50"
          >
            <option value="">Auto</option>
            {MOOD_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400">
          Avoid <span className="font-normal normal-case text-slate-500">(negative prompt)</span>
        </label>
        <input
          disabled={disabled}
          type="text"
          value={value.negativePrompt}
          onChange={(e) => update("negativePrompt", e.target.value)}
          placeholder="text, hands, blurry, low quality…"
          className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/40 outline-none disabled:opacity-50"
        />
        <p className="mt-1.5 text-[11px] text-slate-500">
          Used by Hugging Face models. Pollinations ignores this field.
        </p>
      </div>
    </div>
  );
};
