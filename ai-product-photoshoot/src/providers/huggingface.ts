import {
  blobToBase64,
  dimsForAspect,
  type GenerateOpts,
  type GenerateResult,
  type Provider,
} from "./types";

const MODELS = [
  {
    id: "black-forest-labs/FLUX.1-schnell",
    name: "FLUX.1 Schnell",
    description: "Fast FLUX variant — 4-step diffusion",
    badges: ["Fast", "Photoreal"],
  },
  {
    id: "black-forest-labs/FLUX.1-dev",
    name: "FLUX.1 Dev",
    description: "Higher-quality FLUX (slower)",
    badges: ["Photoreal", "High Quality"],
  },
  {
    id: "stabilityai/stable-diffusion-xl-base-1.0",
    name: "SDXL 1.0",
    description: "Stable Diffusion XL base model",
    badges: ["Photoreal"],
  },
  {
    id: "stabilityai/stable-diffusion-3.5-large-turbo",
    name: "SD 3.5 Large Turbo",
    description: "Stable Diffusion 3.5 large — turbo",
    badges: ["Fast", "Photoreal"],
  },
  {
    id: "playgroundai/playground-v2.5-1024px-aesthetic",
    name: "Playground v2.5",
    description: "Aesthetic-tuned SDXL fork",
    badges: ["Aesthetic"],
  },
];

interface HfErrorBody {
  error?: string | string[];
  estimated_time?: number;
}

const parseHfError = (body: string, status: number, modelId: string): string => {
  let parsed: HfErrorBody | null = null;
  try {
    parsed = JSON.parse(body);
  } catch {
    /* not json */
  }
  const errText = Array.isArray(parsed?.error)
    ? parsed?.error.join("; ")
    : parsed?.error ?? body;
  const lower = (errText || "").toLowerCase();

  if (status === 401 || lower.includes("invalid") && lower.includes("token")) {
    return "Your Hugging Face token is invalid. Generate a new one in Settings.";
  }
  if (status === 403 || lower.includes("gated") || lower.includes("license")) {
    return `Access to ${modelId} is gated. Visit the model page on huggingface.co and accept the license, then retry.`;
  }
  if (status === 429 || lower.includes("rate")) {
    return "Hugging Face free-tier rate limit reached. Wait a minute or use Pollinations.";
  }
  if (status === 503 || lower.includes("loading")) {
    const eta = parsed?.estimated_time ? ` (~${Math.ceil(parsed.estimated_time)}s)` : "";
    return `Model is warming up on Hugging Face${eta}. Try again shortly.`;
  }
  if (status >= 500) {
    return "Hugging Face server error. Try again or pick another model.";
  }
  return errText || `Hugging Face request failed (HTTP ${status}).`;
};

const generate = async (opts: GenerateOpts): Promise<GenerateResult> => {
  const {
    prompt,
    negativePrompt,
    modelId,
    apiKey,
    aspectRatio,
    seed,
    signal,
  } = opts;
  if (!apiKey) throw new Error("Hugging Face token required. Add it in Settings.");
  const { width, height } = dimsForAspect(aspectRatio);

  const body: Record<string, unknown> = {
    inputs: prompt,
    parameters: {
      width,
      height,
      ...(negativePrompt ? { negative_prompt: negativePrompt } : {}),
      ...(seed != null ? { seed } : {}),
    },
    options: { wait_for_model: true },
  };

  let res: Response;
  try {
    res = await fetch(`https://api-inference.huggingface.co/models/${modelId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "image/png",
      },
      body: JSON.stringify(body),
      signal,
    });
  } catch (err) {
    if ((err as Error).name === "AbortError") throw err;
    throw new Error("Network error reaching Hugging Face. Check your connection.");
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(parseHfError(text, res.status, modelId));
  }

  const blob = await res.blob();
  if (!blob.type.startsWith("image/")) {
    // HF can return JSON even with 200 — re-read as text
    const text = await blob.text().catch(() => "");
    throw new Error(parseHfError(text, 200, modelId));
  }
  const base64 = await blobToBase64(blob);
  return { base64, mimeType: blob.type || "image/png" };
};

export const huggingFaceProvider: Provider = {
  id: "huggingface",
  name: "Hugging Face",
  description: "FLUX, SDXL, SD 3.5, Playground v2.5 — free with HF token.",
  requiresKey: true,
  keyDocsUrl: "https://huggingface.co/settings/tokens",
  keyDocsLabel: "huggingface.co/settings/tokens",
  models: MODELS,
  generate,
};
