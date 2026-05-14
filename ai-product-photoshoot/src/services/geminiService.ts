import { GoogleGenAI, Modality } from "@google/genai";

export type AspectRatio = "1:1" | "4:5" | "3:4" | "16:9" | "9:16";

export interface GenerateOptions {
  apiKey: string;
  base64ImageData: string;
  mimeType: string;
  prompt: string;
  negativePrompt?: string;
  aspectRatio?: AspectRatio;
  variations?: number;
  signal?: AbortSignal;
}

export interface GeneratedResult {
  base64: string;
  mimeType: string;
}

const MODEL = "gemini-2.5-flash-image-preview";

const buildFullPrompt = (
  prompt: string,
  negativePrompt: string | undefined,
  aspectRatio: AspectRatio | undefined,
): string => {
  const sections: string[] = [
    "Produce a single photorealistic product photograph using the supplied product image.",
    "Preserve the product exactly: shape, materials, colors, branding, proportions and small details must remain identical. Do not redesign the product, do not add logos, do not alter text on the product.",
    `Scene direction: ${prompt.trim()}`,
    "Match perspective and scale so the product looks naturally placed. Use realistic lighting, soft shadows on the surface, and physically plausible reflections.",
  ];
  if (aspectRatio) {
    sections.push(`Compose for a ${aspectRatio} aspect ratio frame.`);
  }
  if (negativePrompt && negativePrompt.trim()) {
    sections.push(`Avoid: ${negativePrompt.trim()}.`);
  }
  sections.push(
    "Return only the final image. Do not include text, captions, watermarks or borders.",
  );
  return sections.join("\n\n");
};

const parseApiError = (err: unknown): string => {
  const raw = err instanceof Error ? err.message : String(err);
  const lower = raw.toLowerCase();
  if (lower.includes("api key") || lower.includes("api_key") || lower.includes("unauthorized") || lower.includes("permission")) {
    return "Your Gemini API key looks invalid or lacks access to the image preview model. Open Settings and check it.";
  }
  if (lower.includes("quota") || lower.includes("rate") || lower.includes("429")) {
    return "Gemini rate limit or quota reached. Wait a minute and try again, or check your billing.";
  }
  if (lower.includes("safety") || lower.includes("blocked")) {
    return "The model refused this request on safety grounds. Try a different scene description.";
  }
  if (lower.includes("network") || lower.includes("failed to fetch")) {
    return "Network error reaching Google. Check your connection and try again.";
  }
  return raw || "Unknown error from Gemini.";
};

const generateOne = async (
  ai: GoogleGenAI,
  fullPrompt: string,
  base64ImageData: string,
  mimeType: string,
  signal?: AbortSignal,
): Promise<GeneratedResult> => {
  if (signal?.aborted) throw new Error("Cancelled");

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: {
      parts: [
        { inlineData: { data: base64ImageData, mimeType } },
        { text: fullPrompt },
      ],
    },
    config: {
      responseModalities: [Modality.IMAGE, Modality.TEXT],
    },
  });

  const candidate = response.candidates?.[0];
  if (!candidate?.content?.parts) {
    throw new Error("Empty response from Gemini.");
  }

  for (const part of candidate.content.parts) {
    if (part.inlineData && part.inlineData.mimeType?.startsWith("image/")) {
      return {
        base64: part.inlineData.data,
        mimeType: part.inlineData.mimeType,
      };
    }
  }

  const textPart = candidate.content.parts.find((p) => p.text)?.text;
  if (textPart) {
    throw new Error(`Model returned text instead of an image: ${textPart.slice(0, 200)}`);
  }
  throw new Error("No image data found in the response.");
};

export const generateProductScene = async (
  opts: GenerateOptions,
): Promise<GeneratedResult[]> => {
  const {
    apiKey,
    base64ImageData,
    mimeType,
    prompt,
    negativePrompt,
    aspectRatio,
    variations = 1,
    signal,
  } = opts;

  if (!apiKey) {
    throw new Error("Missing Gemini API key. Open Settings to add one.");
  }
  if (!prompt?.trim()) {
    throw new Error("Prompt is empty.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const fullPrompt = buildFullPrompt(prompt, negativePrompt, aspectRatio);
  const count = Math.max(1, Math.min(4, variations));

  try {
    const results = await Promise.all(
      Array.from({ length: count }, () =>
        generateOne(ai, fullPrompt, base64ImageData, mimeType, signal),
      ),
    );
    return results;
  } catch (err) {
    throw new Error(parseApiError(err));
  }
};
