/**
 * "Last updated" dates for the legal pages and the documentation.
 *
 * These dates are shown on the pages themselves and used as `lastModified` in
 * sitemap.xml, so there is one place to change them. When you change the
 * content of one of these pages, update its date here (YYYY-MM-DD).
 */

export const PRIVACY_LAST_UPDATED = '2026-11-13';
export const TERMS_LAST_UPDATED = '2026-11-13';

/** When the facts on /about were last checked against Heoster's public profiles. */
export const ABOUT_LAST_UPDATED = '2026-11-13';

/** Keyed by route. Every page under /documentation should have an entry. */
export const DOCS_LAST_UPDATED: Record<string, string> = {
  '/documentation': '2026-11-13',
  '/documentation/quick-start': '2026-11-13',
  '/documentation/installation': '2026-11-13',
  '/documentation/pwa': '2026-11-13',
  '/documentation/chat': '2026-11-13',
  '/documentation/ai-models': '2026-11-13',
  '/documentation/commands': '2026-11-13',
  '/documentation/math-solver': '2026-11-13',
  '/documentation/pdf-analysis': '2026-11-13',
  '/documentation/web-search': '2026-11-13',
  '/documentation/image-generation': '2026-11-13',
  '/documentation/settings': '2026-11-13',
  '/documentation/personalization': '2026-11-13',
  '/documentation/security': '2026-11-13',
  '/documentation/api-reference': '2026-11-13',
  '/documentation/api': '2026-11-13',
  '/documentation/faq': '2026-11-13',
};

const LONG_DATE = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC',
});

/** "2026-11-13" -> "November 13, 2026". Uses UTC, so server and client render the same text. */
export function formatContentDate(isoDate: string): string {
  return LONG_DATE.format(new Date(`${isoDate}T00:00:00Z`));
}

/** "2026-11-13" -> ISO timestamp for sitemap `lastModified`. */
export function toSitemapDate(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00Z`).toISOString();
}
