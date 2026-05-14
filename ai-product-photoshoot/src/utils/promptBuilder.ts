export interface PromptParts {
  scene: string;
  lighting?: string;
  mood?: string;
  extras?: string;
}

export const LIGHTING_OPTIONS = [
  "soft diffused daylight",
  "golden-hour sunlight",
  "dramatic single key light",
  "cool overcast lighting",
  "warm tungsten studio light",
  "neon-lit moody",
] as const;

export const MOOD_OPTIONS = [
  "minimalist & clean",
  "luxurious & premium",
  "warm & cozy",
  "energetic & playful",
  "moody & cinematic",
  "fresh & natural",
] as const;

/**
 * Build a text-to-image prompt. Open-source models want descriptive scene text,
 * not the instruction-style preservation prose Gemini wanted.
 */
export const composePrompt = (parts: PromptParts): string => {
  const tail: string[] = [];
  if (parts.lighting) tail.push(parts.lighting);
  if (parts.mood) tail.push(parts.mood);
  tail.push(
    "professional product photography",
    "high detail",
    "studio quality",
    "8k",
  );
  const head = parts.extras?.trim()
    ? `${parts.scene.trim()}. ${parts.extras.trim()}`
    : parts.scene.trim();
  return [head, tail.join(", ")].filter(Boolean).join(", ");
};
