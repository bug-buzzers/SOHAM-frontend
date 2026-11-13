import modelsConfigData from '@/lib/models-config.json';
import type { LandingModelStats } from '@/components/landing/landing-content';

/**
 * Derives the landing page's model numbers from the same config the chat
 * model selector reads. Call it from a server component so the full config is
 * not shipped to the browser.
 */

const PROVIDER_NAMES: Record<string, string> = {
  groq: 'Groq',
  cerebras: 'Cerebras',
  google: 'Google Gemini',
  huggingface: 'Hugging Face',
  openrouter: 'OpenRouter',
};

/** Drops tags the provider card already shows, e.g. "(HF)" or "(OpenRouter Free)". */
function toDisplayName(name: string): string {
  return name
    .replace(/\s*\((?:HF|OpenRouter Free|Free)\)\s*$/i, '')
    .replace(/^Cerebras\s+/i, '')
    .trim();
}

export function getLandingModelStats(): LandingModelStats {
  const groups = new Map<string, string[]>();

  for (const model of modelsConfigData.models) {
    // Same filter as src/components/model-selector.tsx.
    if (!model.enabled) continue;
    const names = groups.get(model.provider) ?? [];
    names.push(toDisplayName(model.name));
    groups.set(model.provider, names);
  }

  const providers = Array.from(groups, ([id, models]) => ({
    id,
    name: PROVIDER_NAMES[id] ?? id,
    models,
  }));

  return {
    total: providers.reduce((count, provider) => count + provider.models.length, 0),
    providers,
  };
}
