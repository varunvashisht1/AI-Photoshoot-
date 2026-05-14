import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { FAQ } from "./components/FAQ";
import { ImageUploader } from "./components/ImageUploader";
import { PromptInput } from "./components/PromptInput";
import { ResultGallery } from "./components/ResultGallery";
import { Loader } from "./components/Loader";
import { ScenePresets } from "./components/ScenePresets";
import { AdvancedSettings, type AdvancedSettingsValue } from "./components/AdvancedSettings";
import { History } from "./components/History";
import { SettingsModal } from "./components/SettingsModal";
import { ModelPicker } from "./components/ModelPicker";
import { ToastProvider, useKeyboardShortcut, useToast } from "./components/Toast";
import {
  blobToDataUrl,
  dataUrlFromBase64,
  downscaleImage,
  fileToBase64,
  makeThumbnail,
} from "./utils/fileUtils";
import {
  addToHistory,
  clearHistory,
  loadHistory,
  loadProviderKeys,
  loadSelection,
  removeFromHistory,
  saveProviderKey,
  saveSelection,
  type HistoryItem,
} from "./utils/storage";
import { composePrompt } from "./utils/promptBuilder";
import {
  DEFAULT_MODEL_ID,
  DEFAULT_PROVIDER_ID,
  PROVIDERS,
  PROVIDERS_BY_ID,
  generateImage,
} from "./providers";
import type { ScenePreset } from "./data/presets";

interface UploadedImage {
  blob: Blob;
  base64: string;
  mimeType: string;
  dataUrl: string;
  width: number;
  height: number;
  sizeKb: number;
}

const DEFAULT_SETTINGS: AdvancedSettingsValue = {
  aspectRatio: "1:1",
  variations: 1,
  lighting: "",
  mood: "",
  negativePrompt: "text, watermark, logo overlay, blurry, low quality, distorted",
};

const AppShell: React.FC = () => {
  const toast = useToast();

  const [providerKeys, setProviderKeys] = useState<Record<string, string>>(() =>
    loadProviderKeys(),
  );
  const [selection, setSelection] = useState(() => {
    const stored = loadSelection();
    if (stored && PROVIDERS_BY_ID[stored.providerId]) {
      const prov = PROVIDERS_BY_ID[stored.providerId];
      if (prov.models.some((m) => m.id === stored.modelId)) return stored;
    }
    return { providerId: DEFAULT_PROVIDER_ID, modelId: DEFAULT_MODEL_ID };
  });
  const [settingsOpen, setSettingsOpen] = useState(false);

  const [uploaded, setUploaded] = useState<UploadedImage | null>(null);
  const [prompt, setPrompt] = useState<string>("");
  const [activePresetId, setActivePresetId] = useState<string | undefined>();
  const [settings, setSettings] = useState<AdvancedSettingsValue>(DEFAULT_SETTINGS);

  const [generatedUrls, setGeneratedUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [history, setHistory] = useState<HistoryItem[]>(() => loadHistory());

  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    saveSelection(selection);
  }, [selection]);

  const currentProvider = PROVIDERS_BY_ID[selection.providerId];
  const currentModel =
    currentProvider.models.find((m) => m.id === selection.modelId) ??
    currentProvider.models[0];
  const currentKey = providerKeys[currentProvider.id] ?? "";

  const handleSelectionChange = useCallback((providerId: string, modelId: string) => {
    setSelection({ providerId, modelId });
  }, []);

  const handleSaveKey = useCallback(
    (providerId: string, key: string) => {
      saveProviderKey(providerId, key);
      setProviderKeys((k) => {
        const next = { ...k };
        if (key) next[providerId] = key;
        else delete next[providerId];
        return next;
      });
      if (key) {
        toast.show(`${PROVIDERS_BY_ID[providerId]?.name} token saved`, { kind: "success" });
      }
    },
    [toast],
  );

  const handleImageUpload = useCallback(
    async (file: File) => {
      try {
        const { blob, width, height, mimeType } = await downscaleImage(file);
        const base64 = await fileToBase64(blob);
        const dataUrl = await blobToDataUrl(blob);
        setUploaded({
          blob,
          base64,
          mimeType,
          dataUrl,
          width,
          height,
          sizeKb: Math.round(blob.size / 1024),
        });
        setGeneratedUrls([]);
      } catch (e) {
        console.error(e);
        toast.show("Couldn't process that image", {
          description: "Try a different file (PNG, JPG, WebP).",
          kind: "error",
        });
      }
    },
    [toast],
  );

  const handleClearImage = useCallback(() => {
    setUploaded(null);
    setGeneratedUrls([]);
  }, []);

  const handlePickPreset = useCallback((preset: ScenePreset) => {
    setActivePresetId(preset.id);
    setPrompt(preset.prompt);
  }, []);

  const fullPromptPreview = useMemo(
    () =>
      composePrompt({
        scene: prompt,
        lighting: settings.lighting,
        mood: settings.mood,
      }),
    [prompt, settings.lighting, settings.mood],
  );

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      toast.show("Add a scene description first", {
        description: "Pick a preset or write your own prompt.",
        kind: "warning",
      });
      return;
    }
    if (currentProvider.requiresKey && !currentKey) {
      setSettingsOpen(true);
      toast.show(`${currentProvider.name} needs a free token`, {
        description: "Add it in Settings to use this provider.",
        kind: "warning",
      });
      return;
    }

    setIsLoading(true);
    setGeneratedUrls([]);

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    try {
      const count = Math.max(1, Math.min(4, settings.variations));
      const baseSeed = Math.floor(Math.random() * 1_000_000);
      const tasks = Array.from({ length: count }, (_, i) =>
        generateImage({
          providerId: currentProvider.id,
          modelId: currentModel.id,
          apiKey: currentKey,
          prompt: fullPromptPreview,
          negativePrompt: settings.negativePrompt,
          aspectRatio: settings.aspectRatio,
          seed: baseSeed + i * 1009,
          signal: abortRef.current.signal,
        }),
      );

      const results = await Promise.all(tasks);
      const urls = results.map((r) => dataUrlFromBase64(r.base64, r.mimeType));
      setGeneratedUrls(urls);
      toast.show(`Generated ${urls.length} image${urls.length > 1 ? "s" : ""}`, {
        kind: "success",
        duration: 3000,
      });

      try {
        const firstUrl = urls[0];
        const thumbnail = await makeThumbnail(firstUrl, 220);
        const originalThumbnail = uploaded
          ? await makeThumbnail(uploaded.dataUrl, 220)
          : undefined;
        const item: HistoryItem = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          createdAt: Date.now(),
          prompt: fullPromptPreview,
          negativePrompt: settings.negativePrompt,
          aspectRatio: settings.aspectRatio,
          providerId: currentProvider.id,
          modelId: currentModel.id,
          thumbnail,
          fullImage: firstUrl,
          originalThumbnail,
        };
        setHistory(addToHistory(item));
      } catch (histErr) {
        console.warn("History save failed", histErr);
      }
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "Generation failed.";
      toast.show("Generation failed", { description: msg, kind: "error", duration: 7000 });
    } finally {
      setIsLoading(false);
    }
  }, [
    currentKey,
    currentModel.id,
    currentProvider.id,
    currentProvider.name,
    currentProvider.requiresKey,
    fullPromptPreview,
    prompt,
    settings.aspectRatio,
    settings.negativePrompt,
    settings.variations,
    toast,
    uploaded,
  ]);

  // Cmd/Ctrl + Enter -> generate from anywhere
  useKeyboardShortcut(
    useCallback((e: KeyboardEvent) => e.key === "Enter" && (e.metaKey || e.ctrlKey), []),
    useCallback(
      (e: KeyboardEvent) => {
        e.preventDefault();
        if (!isLoading) handleGenerate();
      },
      [handleGenerate, isLoading],
    ),
  );

  const handleSelectFromHistory = useCallback((item: HistoryItem) => {
    setPrompt(item.prompt);
    if (item.aspectRatio) {
      setSettings((s) => ({
        ...s,
        aspectRatio: item.aspectRatio as AdvancedSettingsValue["aspectRatio"],
      }));
    }
    if (
      item.providerId &&
      item.modelId &&
      PROVIDERS_BY_ID[item.providerId]?.models.some((m) => m.id === item.modelId)
    ) {
      setSelection({ providerId: item.providerId, modelId: item.modelId });
    }
    setGeneratedUrls([item.fullImage]);
    document.getElementById("app")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleDeleteHistory = useCallback((id: string) => {
    setHistory(removeFromHistory(id));
  }, []);

  const handleClearHistory = useCallback(() => {
    clearHistory();
    setHistory([]);
  }, []);

  const keyMissing = currentProvider.requiresKey && !currentKey;
  const disabled = keyMissing || !prompt.trim();
  const disabledReason = keyMissing
    ? `${currentProvider.name} needs a free token — open Settings.`
    : !prompt.trim()
      ? "Write a scene description or pick a preset."
      : undefined;

  return (
    <div className="min-h-screen text-slate-200">
      <Header
        onOpenSettings={() => setSettingsOpen(true)}
        providerName={currentProvider.name}
        modelName={currentModel.name}
      />

      <a id="top" aria-hidden />
      <Hero />

      <main id="app" className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left column */}
          <div className="flex flex-col gap-5 lg:col-span-2">
            <ModelPicker
              providers={PROVIDERS}
              selectedProviderId={selection.providerId}
              selectedModelId={selection.modelId}
              providerKeys={providerKeys}
              onChange={handleSelectionChange}
              onOpenSettings={() => setSettingsOpen(true)}
            />

            <ImageUploader
              onImageUpload={handleImageUpload}
              onClear={handleClearImage}
              imagePreviewUrl={uploaded?.dataUrl ?? null}
              imageMeta={
                uploaded
                  ? {
                      width: uploaded.width,
                      height: uploaded.height,
                      sizeKb: uploaded.sizeKb,
                    }
                  : null
              }
            />

            <ScenePresets onPick={handlePickPreset} activeId={activePresetId} />

            <PromptInput
              prompt={prompt}
              setPrompt={(v) => {
                setPrompt(v);
                setActivePresetId(undefined);
              }}
              onSubmit={handleGenerate}
              isLoading={isLoading}
              disabled={disabled}
              disabledReason={disabledReason}
            />
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-5">
            <AdvancedSettings value={settings} onChange={setSettings} disabled={isLoading} />

            <div className="surface-elevated min-h-[320px] p-5 flex flex-col items-center justify-center">
              {isLoading ? (
                <Loader />
              ) : (
                <ResultGallery
                  originalUrl={uploaded?.dataUrl ?? null}
                  imageUrls={generatedUrls}
                  onRegenerate={generatedUrls.length ? handleGenerate : undefined}
                  busy={isLoading}
                />
              )}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <History
            items={history}
            onSelect={handleSelectFromHistory}
            onDelete={handleDeleteHistory}
            onClear={handleClearHistory}
          />
        </div>
      </main>

      <FAQ />

      <footer className="border-t border-white/5 bg-slate-950/50">
        <div className="container mx-auto px-4 py-8 text-center text-xs text-slate-500">
          <p>
            Built on free open-source models · Your data stays in your browser ·{" "}
            <a
              href="https://github.com/varunvashisht1/AI-Photoshoot-"
              target="_blank"
              rel="noreferrer"
              className="text-brand-300 hover:text-brand-200"
            >
              Source on GitHub
            </a>
          </p>
        </div>
      </footer>

      <SettingsModal
        open={settingsOpen}
        providers={PROVIDERS}
        initialKeys={providerKeys}
        onClose={() => setSettingsOpen(false)}
        onSave={handleSaveKey}
      />
    </div>
  );
};

const App: React.FC = () => (
  <ToastProvider>
    <AppShell />
  </ToastProvider>
);

export default App;
