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

export const composePrompt = (parts: PromptParts): string => {
  const segments: string[] = [];
  if (parts.scene.trim()) segments.push(parts.scene.trim());
  if (parts.lighting) segments.push(`Lighting: ${parts.lighting}.`);
  if (parts.mood) segments.push(`Mood: ${parts.mood}.`);
  if (parts.extras && parts.extras.trim()) segments.push(parts.extras.trim());
  return segments.join(" ");
};
