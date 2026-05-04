import { MetadataRoute } from 'next';

const BASE = 'https://soham-ai.vercel.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // All crawlers — allow public pages, block private/internal paths
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/_next/',
          '/account',
          '/account-settings',
          '/user-management',
          '/login',
          '/test-',
          '/debug',
        ],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
