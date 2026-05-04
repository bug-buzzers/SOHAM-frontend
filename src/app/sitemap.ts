import { MetadataRoute } from 'next';

const BASE = 'https://soham-ai.vercel.app';

// Use a fixed release date for stable pages, today for frequently-updated ones
const TODAY   = new Date().toISOString();
const WEEK    = new Date(Date.now() - 7  * 86_400_000).toISOString();
const MONTH   = new Date(Date.now() - 30 * 86_400_000).toISOString();
const QUARTER = new Date(Date.now() - 90 * 86_400_000).toISOString();

type Freq = MetadataRoute.Sitemap[number]['changeFrequency'];

function url(
  path: string,
  priority: number,
  changeFrequency: Freq,
  lastModified: string,
): MetadataRoute.Sitemap[number] {
  return { url: `${BASE}${path}`, lastModified, changeFrequency, priority };
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // ── Tier 1 — Core product (crawl daily) ───────────────────────────────
    url('/',              1.00, 'daily',   TODAY),
    url('/chat',          0.95, 'daily',   TODAY),
    url('/ai-services',   0.92, 'daily',   TODAY),
    url('/visual-math',   0.90, 'weekly',  WEEK),
    url('/pdf-analyzer',  0.90, 'weekly',  WEEK),

    // ── Tier 2 — Marketing & discovery ────────────────────────────────────
    url('/features',      0.88, 'weekly',  WEEK),
    url('/models',        0.85, 'weekly',  WEEK),
    url('/integrations',  0.82, 'weekly',  WEEK),
    url('/about',         0.80, 'monthly', MONTH),
    url('/soham',         0.80, 'monthly', MONTH),
    url('/pricing',       0.75, 'monthly', MONTH),
    url('/blog',          0.70, 'weekly',  WEEK),
    url('/faq',           0.72, 'weekly',  WEEK),
    url('/community',     0.70, 'daily',   TODAY),

    // ── Tier 3 — Support & legal ───────────────────────────────────────────
    url('/contact',       0.65, 'monthly', MONTH),
    url('/support',       0.65, 'monthly', MONTH),
    url('/privacy',       0.50, 'yearly',  QUARTER),
    url('/terms',         0.50, 'yearly',  QUARTER),

    // ── Documentation — index ─────────────────────────────────────────────
    url('/documentation',                         0.90, 'weekly', WEEK),

    // ── Documentation — Getting Started ───────────────────────────────────
    url('/documentation/quick-start',             0.85, 'weekly', WEEK),
    url('/documentation/installation',            0.85, 'weekly', WEEK),
    url('/documentation/pwa',                     0.82, 'weekly', WEEK),

    // ── Documentation — Features ──────────────────────────────────────────
    url('/documentation/chat',                    0.80, 'weekly', WEEK),
    url('/documentation/ai-models',               0.80, 'weekly', WEEK),
    url('/documentation/commands',                0.78, 'weekly', WEEK),
    url('/documentation/web-search',              0.76, 'weekly', WEEK),
    url('/documentation/math-solver',             0.75, 'weekly', WEEK),
    url('/documentation/pdf-analysis',            0.75, 'weekly', WEEK),
    url('/documentation/image-generation',        0.75, 'weekly', WEEK),
    url('/documentation/code-analysis',           0.73, 'weekly', WEEK),
    url('/documentation/smart-routing',           0.72, 'weekly', WEEK),
    url('/documentation/smart-notes',             0.72, 'weekly', WEEK),
    url('/documentation/jarvis-mode',             0.70, 'weekly', WEEK),

    // ── Documentation — Configuration ─────────────────────────────────────
    url('/documentation/settings',               0.72, 'weekly', WEEK),
    url('/documentation/personalization',         0.70, 'monthly', MONTH),
    url('/documentation/security',               0.68, 'monthly', MONTH),

    // ── Documentation — Reference ─────────────────────────────────────────
    url('/documentation/api-reference',           0.75, 'weekly', WEEK),
    url('/documentation/faq',                     0.75, 'weekly', WEEK),
  ];
}
