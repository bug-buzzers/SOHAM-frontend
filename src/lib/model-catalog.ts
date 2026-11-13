import modelsConfigData from '@/lib/models-config.json';

/**
 * Read-only view of the models SOHAM actually offers, taken from the same
 * config the chat model selector uses (`models-config.json`, enabled models
 * only). Use this for any public page that lists or counts models so the
 * marketing copy can never drift from the product again.
 */

export interface CatalogModel {
  id: string;
  /** Name as configured, e.g. "GPT-OSS 120B (Groq)". */
  name: string;
  /** Name without provider tags, for use under a provider heading. */
  shortName: string;
  provider: string;
  providerLabel: string;
  category: string;
  description: string;
  contextWindow: number;
  supportsStreaming: boolean;
}

export const PROVIDER_LABELS: Record<string, string> = {
  google: 'Google Gemini',
  openrouter: 'OpenRouter',
  groq: 'Groq',
};

export const CATEGORY_LABELS: Record<string, string> = {
  general: 'General purpose',
  coding: 'Coding and reasoning',
  conversation: 'Conversation',
  multimodal: 'Multimodal (text and images)',
};

/** Drops tags a provider heading already shows, e.g. "(Groq)" or a leading "OpenRouter". */
function toShortName(name: string): string {
  return name
    .replace(/\s*\((?:Groq|HF|OpenRouter Free|Free)\)\s*$/i, '')
    .replace(/^(?:Cerebras|OpenRouter)\s+/i, '')
    .trim();
}

export function getEnabledModels(): CatalogModel[] {
  // Same filter as src/components/model-selector.tsx.
  return modelsConfigData.models
    .filter((model) => model.enabled)
    .map((model) => ({
      id: model.id,
      name: model.name,
      shortName: toShortName(model.name),
      provider: model.provider,
      providerLabel: PROVIDER_LABELS[model.provider] ?? model.provider,
      category: model.category,
      description: model.description,
      contextWindow: model.contextWindow,
      supportsStreaming: Boolean(model.supportsStreaming),
    }));
}

/** Groups enabled models by a key, keeping config order. */
export function groupModels(
  models: CatalogModel[],
  key: 'provider' | 'category'
): Array<{ key: string; models: CatalogModel[] }> {
  const groups = new Map<string, CatalogModel[]>();
  for (const model of models) {
    const list = groups.get(model[key]) ?? [];
    list.push(model);
    groups.set(model[key], list);
  }
  return Array.from(groups, ([groupKey, groupModels]) => ({ key: groupKey, models: groupModels }));
}

/** 131072 -> "128K tokens", 1048576 -> "1M tokens". */
export function formatContextWindow(tokens: number): string {
  if (tokens >= 1_000_000) return `${Math.round(tokens / 1_048_576)}M tokens`;
  return `${Math.round(tokens / 1024)}K tokens`;
}

/** Provider names in config order, joined for prose: "Google Gemini, OpenRouter and Groq". */
export function formatProviderList(models: CatalogModel[] = getEnabledModels()): string {
  const names = groupModels(models, 'provider').map(({ key }) => PROVIDER_LABELS[key] ?? key);
  if (names.length <= 1) return names.join('');
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
}
