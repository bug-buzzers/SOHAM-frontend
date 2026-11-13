import type { LandingModelStats } from '@/components/landing/landing-content';
import { getEnabledModels, groupModels, PROVIDER_LABELS } from '@/lib/model-catalog';

/**
 * Derives the landing page's model numbers from the same config the chat
 * model selector reads. Call it from a server component so the full config is
 * not shipped to the browser.
 */
export function getLandingModelStats(): LandingModelStats {
  const models = getEnabledModels();
  const providers = groupModels(models, 'provider').map(({ key, models: providerModels }) => ({
    id: key,
    name: PROVIDER_LABELS[key] ?? key,
    models: providerModels.map((model) => model.shortName),
  }));

  return { total: models.length, providers };
}
