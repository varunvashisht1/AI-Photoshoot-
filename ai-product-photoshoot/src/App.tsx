import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Header } from "./components/Header";
import { ImageUploader } from "./components/ImageUploader";
import { PromptInput } from "./components/PromptInput";
import { ResultGallery } from "./components/ResultGallery";
import { Loader } from "./components/Loader";
import { ScenePresets } from "./components/ScenePresets";
import { AdvancedSettings, type AdvancedSettingsValue } from "./components/AdvancedSettings";
import { History } from "./components/History";
import { SettingsModal } from "./components/SettingsModal";
import { ModelPicker } from "./components/ModelPicker";
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

const App: React.FC = () => {
  // Provider keys + selection
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

  // Photo / prompt state
  const [uploaded, setUploaded] = useState<UploadedImage | null>(null);
  const [prompt, setPrompt] = useState<string>("");
  const [activePresetId, setActivePresetId] = useState<string | undefined>();
  const [settings, setSettings] = useState<AdvancedSettingsValue>(DEFAULT_SETTINGS);

  // Output state
  const [generatedUrls, setGeneratedUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [history, setHistory] = useState<HistoryItem[]>(() => loadHistory());

  const abortRef = useRef<AbortController | null>(null);

  // Persist selection
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

  const handleSaveKey = useCallback((providerId: string, key: string) => {
    saveProviderKey(providerId, key);
    setProviderKeys((k) => {
      const next = { ...k };
      if (key) next[providerId] = key;
      else delete next[providerId];
      return next;
    });
  }, []);

  const handleImageUpload = useCallback(async (file: File) => {
    try {
      setError(null);
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
      setError("Failed to process the image. Try a different file.");
    }
  }, []);

  const handleClearImage = useCallback(() => {
    setUploaded(null);
    setGeneratedUrls([]);
    setError(null);
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
      setError("Write a scene description or pick a preset.");
      return;
    }
    if (currentProvider.requiresKey && !currentKey) {
      setSettingsOpen(true);
      return;
    }

    setIsLoading(true);
    setError(null);
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
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [
    currentKey,
    currentModel.id,
    currentProvider.id,
    currentProvider.requiresKey,
    fullPromptPreview,
    prompt,
    settings.aspectRatio,
    settings.negativePrompt,
    settings.variations,
    uploaded,
  ]);

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
    setError(null);
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
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-gray-200 font-sans">
      <Header
        onOpenSettings={() => setSettingsOpen(true)}
        providerName={currentProvider.name}
        modelName={currentModel.name}
      />

      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: inputs */}
          <div className="lg:col-span-2 flex flex-col gap-5">
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
                  ? { width: uploaded.width, height: uploaded.height, sizeKb: uploaded.sizeKb }
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

          {/* Right column: settings + output */}
          <div className="flex flex-col gap-5">
            <AdvancedSettings value={settings} onChange={setSettings} disabled={isLoading} />

            <div className="bg-gray-800/50 rounded-lg p-5 shadow-2xl min-h-[300px] flex flex-col items-center justify-center">
              {isLoading ? (
                <Loader />
              ) : error ? (
                <div className="text-center text-red-300 max-w-sm">
                  <p className="font-semibold mb-1">Something went wrong</p>
                  <p className="text-sm">{error}</p>
                  <button
                    onClick={handleGenerate}
                    disabled={disabled}
                    className="mt-4 text-sm bg-gray-700 hover:bg-gray-600 disabled:opacity-50 px-3 py-1.5 rounded-md text-gray-200"
                  >
                    Try again
                  </button>
                </div>
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

        <footer className="mt-10 text-center text-xs text-gray-500 pb-6">
          Built on free open-source models · Your tokens and history stay in this browser.
        </footer>
      </main>

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

export default App;
