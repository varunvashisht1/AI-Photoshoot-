import {
  blobToBase64,
  dimsForAspect,
  type GenerateOpts,
  type GenerateResult,
  type Provider,
} from "./types";

// Pollinations introduced tiered access in 2025. FLUX-family models now
// require a free token from auth.pollinations.ai; anonymous calls return
// HTTP 402. "turbo" (SDXL Turbo) still works without a token.
const MODELS = [
  {
    id: "turbo",
    name: "SDXL Turbo",
    description: "Fast Stable Diffusion XL Turbo — works without a token",
    badges: ["Free", "Fast", "No token"],
  },
  {
    id: "flux",
    name: "FLUX.1",
    description: "Open-source FLUX — best general quality",
    badges: ["Photoreal", "Token"],
  },
  {
    id: "flux-realism",
    name: "FLUX Realism",
    description: "FLUX tuned for photorealistic results",
    badges: ["Photoreal", "Token"],
  },
  {
    id: "flux-3d",
    name: "FLUX 3D",
    description: "3D-rendered aesthetic",
    badges: ["Token"],
  },
  {
    id: "flux-anime",
    name: "FLUX Anime",
    description: "Anime / illustration style",
    badges: ["Stylized", "Token"],
  },
];

const generate = async (opts: GenerateOpts): Promise<GenerateResult> => {
  const { prompt, modelId, apiKey, aspectRatio, seed, signal } = opts;
  const { width, height } = dimsForAspect(aspectRatio);
  const params = new URLSearchParams({
    model: modelId || "turbo",
    width: String(width),
    height: String(height),
    seed: String(seed ?? Math.floor(Math.random() * 1_000_000)),
    nologo: "true",
    enhance: "true",
    private: "true",
  });
  if (apiKey) params.set("token", apiKey);
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
    if (res.status === 402) {
      throw new Error(
        apiKey
          ? "Your Pollinations token doesn't have access to this model. Try 'SDXL Turbo' or check your tier at auth.pollinations.ai."
          : "This Pollinations model needs a free token. Open Settings, add a token from auth.pollinations.ai — or switch to 'SDXL Turbo' which works anonymously.",
      );
    }
    if (res.status === 401 || res.status === 403) {
      throw new Error(
        "Your Pollinations token was rejected. Update it in Settings or remove it to use anonymous models.",
      );
    }
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
  description:
    "SDXL Turbo works without a token. FLUX models need a free token from auth.pollinations.ai (added in Settings).",
  requiresKey: false,
  keyDocsUrl: "https://auth.pollinations.ai/",
  keyDocsLabel: "auth.pollinations.ai",
  models: MODELS,
  generate,
};
