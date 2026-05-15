import React from "react";
import type { Provider } from "../providers/types";

interface ModelPickerProps {
  providers: Provider[];
  selectedProviderId: string;
  selectedModelId: string;
  providerKeys: Record<string, string>;
  onChange: (providerId: string, modelId: string) => void;
  onOpenSettings: () => void;
}

const Badge: React.FC<{ children: React.ReactNode; tone?: "default" | "warn" | "ok" }> = ({
  children,
  tone = "default",
}) => {
  const cls =
    tone === "warn"
      ? "border-amber-500/30 bg-amber-500/10 text-amber-200"
      : tone === "ok"
        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
        : "border-white/10 bg-white/5 text-slate-300";
  return (
    <span className={`rounded border px-1.5 py-0.5 text-[10px] font-semibold ${cls}`}>
      {children}
    </span>
  );
};

export const ModelPicker: React.FC<ModelPickerProps> = ({
  providers,
  selectedProviderId,
  selectedModelId,
  providerKeys,
  onChange,
  onOpenSettings,
}) => {
  const selectedProvider = providers.find((p) => p.id === selectedProviderId) ?? providers[0];
  const providerKey = providerKeys[selectedProvider.id];
  const keyMissing = selectedProvider.requiresKey && !providerKey;

  return (
    <div className="surface-elevated p-5">
      <div className="mb-3 flex items-baseline justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold text-slate-100">Model</h2>
          <p className="text-[11px] text-slate-500">Choose any free open-source model.</p>
        </div>
        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
          {providers.reduce((n, p) => n + p.models.length, 0)} available
        </span>
      </div>

      <div className="mb-4 flex flex-wrap gap-1.5 border-b border-white/5 pb-3">
        {providers.map((p) => {
          const active = p.id === selectedProvider.id;
          const hasKey = !p.requiresKey || !!providerKeys[p.id];
          return (
            <button
              key={p.id}
              onClick={() => onChange(p.id, p.models[0].id)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                active
                  ? "bg-gradient-to-r from-cyan-500 to-indigo-500 text-white shadow-glow"
                  : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              {p.name}
              <span
                className={`h-1.5 w-1.5 rounded-full ${hasKey ? "bg-emerald-400" : "bg-amber-400"}`}
                aria-label={hasKey ? "ready" : "needs key"}
              />
            </button>
          );
        })}
      </div>

      <p className="mb-3 text-xs text-slate-400">{selectedProvider.description}</p>

      {keyMissing && (
        <div className="mb-3 flex items-center justify-between gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2">
          <p className="text-xs text-amber-200">
            Needs a free token —{" "}
            <a
              href={selectedProvider.keyDocsUrl}
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-amber-100"
            >
              {selectedProvider.keyDocsLabel ?? selectedProvider.keyDocsUrl}
            </a>
          </p>
          <button
            onClick={onOpenSettings}
            className="whitespace-nowrap rounded-md bg-amber-400 px-2.5 py-1 text-xs font-bold text-slate-900 hover:bg-amber-300"
          >
            Add token
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {selectedProvider.models.map((m) => {
          const active = m.id === selectedModelId;
          return (
            <button
              key={m.id}
              onClick={() => onChange(selectedProvider.id, m.id)}
              className={`rounded-xl border px-3 py-2.5 text-left transition-all ${
                active
                  ? "border-cyan-400 bg-cyan-500/10 ring-1 ring-cyan-400/30"
                  : "border-white/10 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.05]"
              }`}
              title={m.id}
            >
              <div className="mb-0.5 flex items-center justify-between gap-2">
                <span className="truncate text-sm font-semibold text-slate-100">{m.name}</span>
              </div>
              {m.description && (
                <p className="mb-1.5 line-clamp-2 text-xs text-slate-400">{m.description}</p>
              )}
              <div className="flex flex-wrap gap-1">
                {m.badges?.map((b) => {
                  const isTokenBadge = b === "Token";
                  const tone: "ok" | "warn" | "default" =
                    b === "Free" || b === "No token"
                      ? "ok"
                      : isTokenBadge && !providerKey
                        ? "warn"
                        : "default";
                  return (
                    <Badge key={b} tone={tone}>
                      {b}
                    </Badge>
                  );
                })}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
