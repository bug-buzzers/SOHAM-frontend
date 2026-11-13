import modelsConfigData from '@/lib/models-config.json';

/**
 * Read-only view of the models SOHAM actually offers, taken from the same
 * config the chat model selector uses (`models-config.json`, enabled models
 * only). Use this for any public page that lists or counts models so the
 * marketing copy can never drift from the product again.
 */

export interface CatalogModel {
  id: string;
  /** Name as configured, e.g. "Llama 3.1 8B Instruct (HF)". */
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
  groq: 'Groq',
  cerebras: 'Cerebras',
  google: 'Google Gemini',
  huggingface: 'Hugging Face',
  openrouter: 'OpenRouter',
};

export const CATEGORY_LABELS: Record<string, string> = {
  general: 'General purpose',
  coding: 'Coding and reasoning',
  conversation: 'Conversation',
  multimodal: 'Multimodal (text and images)',
};

/** Drops tags a provider heading already shows, e.g. "(HF)" or "(OpenRouter Free)". */
function toShortName(name: string): string {
  return name
    .replace(/\s*\((?:HF|OpenRouter Free|Free)\)\s*$/i, '')
    .replace(/^Cerebras\s+/i, '')
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
