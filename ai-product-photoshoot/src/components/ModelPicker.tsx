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
      ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
      : tone === "ok"
        ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
        : "bg-gray-700/60 text-gray-300 border-gray-600/60";
  return (
    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${cls}`}>
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
    <div className="bg-gray-800/50 rounded-lg p-5 shadow-2xl">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <h2 className="text-lg font-semibold text-gray-300">Model</h2>
        <span className="text-xs text-gray-500">Free open-source models</span>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4 border-b border-gray-700/60 pb-3">
        {providers.map((p) => {
          const active = p.id === selectedProvider.id;
          const hasKey = !p.requiresKey || !!providerKeys[p.id];
          return (
            <button
              key={p.id}
              onClick={() => onChange(p.id, p.models[0].id)}
              className={`text-xs px-3 py-1.5 rounded-full transition-colors font-medium flex items-center gap-1.5 ${
                active
                  ? "bg-cyan-600 text-white"
                  : "bg-gray-700/60 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {p.name}
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  hasKey ? "bg-emerald-400" : "bg-amber-400"
                }`}
                aria-label={hasKey ? "ready" : "needs key"}
              />
            </button>
          );
        })}
      </div>

      <p className="text-xs text-gray-400 mb-3">{selectedProvider.description}</p>

      {keyMissing && (
        <div className="mb-3 flex items-center justify-between gap-3 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2">
          <p className="text-xs text-amber-200">
            This provider needs a free token. Get one at{" "}
            <a
              href={selectedProvider.keyDocsUrl}
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-amber-100"
            >
              {selectedProvider.keyDocsLabel ?? selectedProvider.keyDocsUrl}
            </a>
            .
          </p>
          <button
            onClick={onOpenSettings}
            className="text-xs font-medium bg-amber-500/80 hover:bg-amber-400 text-gray-900 px-2.5 py-1 rounded-md whitespace-nowrap"
          >
            Add token
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {selectedProvider.models.map((m) => {
          const active = m.id === selectedModelId;
          return (
            <button
              key={m.id}
              onClick={() => onChange(selectedProvider.id, m.id)}
              className={`text-left rounded-md border px-3 py-2.5 transition-colors ${
                active
                  ? "border-cyan-400 bg-cyan-500/10 ring-1 ring-cyan-500/30"
                  : "border-gray-700 bg-gray-900/40 hover:border-gray-500 hover:bg-gray-900/60"
              }`}
              title={m.id}
            >
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <span className="text-sm font-semibold text-gray-100 truncate">
                  {m.name}
                </span>
              </div>
              {m.description && (
                <p className="text-xs text-gray-400 mb-1.5 line-clamp-2">{m.description}</p>
              )}
              <div className="flex flex-wrap gap-1">
                {m.badges?.map((b) => (
                  <Badge key={b} tone={b === "Free" ? "ok" : "default"}>
                    {b}
                  </Badge>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
