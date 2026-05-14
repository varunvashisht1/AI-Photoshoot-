import {
  blobToBase64,
  dimsForAspect,
  type GenerateOpts,
  type GenerateResult,
  type Provider,
} from "./types";

const MODELS = [
  {
    id: "flux",
    name: "FLUX.1",
    description: "Open-source FLUX — best general quality",
    badges: ["Free", "Photoreal"],
  },
  {
    id: "flux-realism",
    name: "FLUX Realism",
    description: "FLUX tuned for photorealistic results",
    badges: ["Free", "Photoreal"],
  },
  {
    id: "flux-3d",
    name: "FLUX 3D",
    description: "3D-rendered aesthetic",
    badges: ["Free"],
  },
  {
    id: "flux-anime",
    name: "FLUX Anime",
    description: "Anime / illustration style",
    badges: ["Free", "Stylized"],
  },
  {
    id: "turbo",
    name: "SDXL Turbo",
    description: "Fast Stable Diffusion XL Turbo",
    badges: ["Free", "Fast"],
  },
];

const generate = async (opts: GenerateOpts): Promise<GenerateResult> => {
  const { prompt, modelId, aspectRatio, seed, signal } = opts;
  const { width, height } = dimsForAspect(aspectRatio);
  const params = new URLSearchParams({
    model: modelId || "flux",
    width: String(width),
    height: String(height),
    seed: String(seed ?? Math.floor(Math.random() * 1_000_000)),
    nologo: "true",
    enhance: "true",
    private: "true",
  });
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(
    prompt,
  )}?${params.toString()}`;

  let res: Response;
  try {
    res = await fetch(url, { signal });
  } catch (err) {
    if ((err as Error).name === "AbortError") throw err;
    throw new Error("Network error reaching Pollinations.ai. Check your connection.");
  }

  if (!res.ok) {
    if (res.status === 429) {
      throw new Error("Pollinations rate limit hit. Wait a few seconds and retry.");
    }
    if (res.status >= 500) {
      throw new Error("Pollinations server error. Try again in a moment.");
    }
    throw new Error(`Pollinations request failed (HTTP ${res.status}).`);
  }

  const blob = await res.blob();
  if (!blob.type.startsWith("image/")) {
    throw new Error("Pollinations returned a non-image response.");
  }
  const base64 = await blobToBase64(blob);
  return { base64, mimeType: blob.type || "image/jpeg" };
};

export const pollinationsProvider: Provider = {
  id: "pollinations",
  name: "Pollinations.ai",
  description: "Free FLUX / SDXL-Turbo. No account or API key required.",
  requiresKey: false,
  models: MODELS,
  generate,
};
