import { huggingFaceProvider } from "./huggingface";
import { pollinationsProvider } from "./pollinations";
import type { GenerateOpts, GenerateResult, Provider } from "./types";

export const PROVIDERS: Provider[] = [pollinationsProvider, huggingFaceProvider];

export const PROVIDERS_BY_ID: Record<string, Provider> = Object.fromEntries(
  PROVIDERS.map((p) => [p.id, p]),
);

export const DEFAULT_PROVIDER_ID = "pollinations";
export const DEFAULT_MODEL_ID = "flux";

export const generateImage = async (opts: GenerateOpts & { providerId: string }): Promise<GenerateResult> => {
  const provider = PROVIDERS_BY_ID[opts.providerId];
  if (!provider) throw new Error(`Unknown provider: ${opts.providerId}`);
  return provider.generate(opts);
};

export type { AspectRatio, GenerateOpts, GenerateResult, Provider, ProviderModel } from "./types";
