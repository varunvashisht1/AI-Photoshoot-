export type AspectRatio = "1:1" | "4:5" | "3:4" | "16:9" | "9:16";

export interface ProviderModel {
  id: string;
  name: string;
  description?: string;
  badges?: string[]; // e.g. ['Fast', 'Photoreal', 'Free']
}

export interface GenerateOpts {
  prompt: string;
  negativePrompt?: string;
  modelId: string;
  apiKey?: string;
  aspectRatio: AspectRatio;
  seed?: number;
  signal?: AbortSignal;
}

export interface GenerateResult {
  base64: string;
  mimeType: string;
}

export interface Provider {
  id: string;
  name: string;
  description: string;
  requiresKey: boolean;
  keyDocsUrl?: string;
  keyDocsLabel?: string;
  models: ProviderModel[];
  generate(opts: GenerateOpts): Promise<GenerateResult>;
}

export const dimsForAspect = (
  ratio: AspectRatio,
): { width: number; height: number } => {
  switch (ratio) {
    case "1:1":
      return { width: 1024, height: 1024 };
    case "4:5":
      return { width: 832, height: 1024 };
    case "3:4":
      return { width: 768, height: 1024 };
    case "16:9":
      return { width: 1280, height: 720 };
    case "9:16":
      return { width: 720, height: 1280 };
  }
};

export const blobToBase64 = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => {
      const result = r.result as string;
      const idx = result.indexOf(",");
      resolve(idx >= 0 ? result.slice(idx + 1) : result);
    };
    r.onerror = () => reject(new Error("Failed to read response blob."));
    r.readAsDataURL(blob);
  });
