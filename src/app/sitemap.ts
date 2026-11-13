import { MetadataRoute } from 'next';
import {
  DOCS_LAST_UPDATED,
  PRIVACY_LAST_UPDATED,
  TERMS_LAST_UPDATED,
  toSitemapDate,
} from '@/lib/content-dates';

const BASE = 'https://soham-ai.vercel.app';

// Rolling dates for marketing pages; docs and legal pages use their real
// "last updated" dates from src/lib/content-dates.ts.
const TODAY   = new Date().toISOString();
const WEEK    = new Date(Date.now() - 7  * 86_400_000).toISOString();
const MONTH   = new Date(Date.now() - 30 * 86_400_000).toISOString();

type Freq = MetadataRoute.Sitemap[number]['changeFrequency'];

function url(
  path: string,
  priority: number,
  changeFrequency: Freq,
  lastModified: string,
): MetadataRoute.Sitemap[number] {
  return { url: `${BASE}${path}`, lastModified, changeFrequency, priority };
}

/** Docs pages use their real "last updated" date (see src/lib/content-dates.ts). */
function docDate(path: string): string {
  const date = DOCS_LAST_UPDATED[path];
  if (!date) throw new Error(`Missing DOCS_LAST_UPDATED entry for ${path}`);
  return toSitemapDate(date);
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // ── Tier 1 — Core product (crawl daily) ───────────────────────────────
    url('/',              1.00, 'daily',   TODAY),
    url('/chat',          0.95, 'daily',   TODAY),
    url('/docs',          0.92, 'daily',   TODAY),
    url('/about',         0.90, 'weekly',  WEEK),
    url('/soham',         0.90, 'weekly',  WEEK),

    // ── Tier 2 — Marketing & discovery ────────────────────────────────────
    url('/features',      0.88, 'weekly',  WEEK),
    url('/models',        0.85, 'weekly',  WEEK),
    url('/integrations',  0.82, 'weekly',  WEEK),
    url('/about',         0.80, 'monthly', MONTH),
    url('/soham',         0.80, 'monthly', MONTH),
    url('/pricing',       0.75, 'monthly', MONTH),
    url('/blog',          0.70, 'weekly',  WEEK),
    url('/faq',           0.72, 'weekly',  WEEK),

    // ── Tier 3 — Support & legal ───────────────────────────────────────────
    url('/contact',       0.65, 'monthly', MONTH),
    url('/support',       0.65, 'monthly', MONTH),
    url('/privacy',       0.50, 'yearly',  toSitemapDate(PRIVACY_LAST_UPDATED)),
    url('/terms',         0.50, 'yearly',  toSitemapDate(TERMS_LAST_UPDATED)),

    // ── Documentation — index ─────────────────────────────────────────────
    url('/documentation',                         0.90, 'weekly', docDate('/documentation')),

    // ── Documentation — Getting Started ───────────────────────────────────
    url('/documentation/quick-start',             0.85, 'weekly', docDate('/documentation/quick-start')),
    url('/documentation/installation',            0.85, 'weekly', docDate('/documentation/installation')),
    url('/documentation/pwa',                     0.82, 'weekly', docDate('/documentation/pwa')),

    // ── Documentation — Features ──────────────────────────────────────────
    url('/documentation/chat',                    0.80, 'weekly', docDate('/documentation/chat')),
    url('/documentation/ai-models',               0.80, 'weekly', docDate('/documentation/ai-models')),
    url('/documentation/commands',                0.78, 'weekly', docDate('/documentation/commands')),
    url('/documentation/web-search',              0.76, 'weekly', docDate('/documentation/web-search')),
    url('/documentation/math-solver',             0.75, 'weekly', docDate('/documentation/math-solver')),
    url('/documentation/pdf-analysis',            0.75, 'weekly', docDate('/documentation/pdf-analysis')),
    url('/documentation/image-generation',        0.75, 'weekly', docDate('/documentation/image-generation')),

    // ── Documentation — Configuration ─────────────────────────────────────
    url('/documentation/settings',               0.72, 'weekly', docDate('/documentation/settings')),
    url('/documentation/personalization',         0.70, 'monthly', docDate('/documentation/personalization')),
    url('/documentation/security',               0.68, 'monthly', docDate('/documentation/security')),

    // ── Documentation — Reference ─────────────────────────────────────────
    url('/documentation/api-reference',           0.75, 'weekly', docDate('/documentation/api-reference')),
    url('/documentation/faq',                     0.75, 'weekly', docDate('/documentation/faq')),
  ];
}
