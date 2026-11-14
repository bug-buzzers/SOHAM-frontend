const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  // cacheOnFrontEndNav / aggressiveFrontEndNavCaching are left off: they save pages
  // and scripts into caches ("pages", "next-static-js-assets", …) that nothing below
  // reads, so they only re-downloaded every page in the background.
  reloadOnOnline: true,
  swcMinify: true,
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  workboxOptions: {
    disableDevLogs: true,
    skipWaiting: true,
    clientsClaim: true,
    // Don't precache HTML pages. They used to be listed here with `revision: null`,
    // which tells Workbox the URL never changes, so the cached /chat and /login were
    // never refreshed. After a deployment those frozen pages asked for scripts and
    // styles that no longer exist (404, "MIME type text/plain") and stayed broken.
    runtimeCaching: [
      // ── Never cache API calls — always fresh ──────────────────────────────
      {
        urlPattern: /\/api\/.*/i,
        handler: 'NetworkOnly',
      },
      // ── Never cache user uploads ──────────────────────────────────────────
      {
        urlPattern: /\/uploads\/.*/i,
        handler: 'NetworkOnly',
      },
      // ── AI-generated images — short cache ────────────────────────────────
      {
        urlPattern: /^https:\/\/image\.pollinations\.ai\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'pollinations-images',
          expiration: { maxEntries: 30, maxAgeSeconds: 3 * 24 * 60 * 60 },
          cacheableResponse: { statuses: [0, 200] },
        },
      },
      // ── Supabase storage images ───────────────────────────────────────────
      {
        urlPattern: /^https:\/\/.*\.supabase\.co\/storage\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'supabase-storage',
          expiration: { maxEntries: 20, maxAgeSeconds: 24 * 60 * 60 },
          cacheableResponse: { statuses: [0, 200] },
        },
      },
      // ── Google Fonts — long cache ─────────────────────────────────────────
      {
        urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'google-fonts',
          expiration: { maxEntries: 10, maxAgeSeconds: 365 * 24 * 60 * 60 },
          cacheableResponse: { statuses: [0, 200] },
        },
      },
      // ── Static images (app assets) ────────────────────────────────────────
      {
        urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'static-image-assets',
          expiration: { maxEntries: 64, maxAgeSeconds: 7 * 24 * 60 * 60 },
          cacheableResponse: { statuses: [0, 200] },
        },
      },
      // ── Next.js static JS — long cache (hashed filenames) ────────────────
      {
        urlPattern: /\/_next\/static\/.+\.js$/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'next-static-js',
          expiration: { maxEntries: 128, maxAgeSeconds: 30 * 24 * 60 * 60 },
          cacheableResponse: { statuses: [0, 200] },
        },
      },
      // ── Next.js static CSS ────────────────────────────────────────────────
      {
        urlPattern: /\/_next\/static\/.+\.css$/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'next-static-css',
          expiration: { maxEntries: 32, maxAgeSeconds: 30 * 24 * 60 * 60 },
          cacheableResponse: { statuses: [0, 200] },
        },
      },
      // ── Next.js image optimization ────────────────────────────────────────
      {
        urlPattern: /\/_next\/image\?.*/i,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'next-image-opt',
          expiration: { maxEntries: 64, maxAgeSeconds: 7 * 24 * 60 * 60 },
          cacheableResponse: { statuses: [0, 200] },
        },
      },
      // ── Page data for client-side navigation — build-specific, never cache ─
      {
        urlPattern: /[?&]_rsc=/i,
        handler: 'NetworkOnly',
      },
      // ── App pages — network first, cache only when offline ─────────────────
      // No networkTimeoutSeconds: on a slow connection a timeout would serve a
      // page saved from an older deployment, whose scripts may be gone.
      {
        urlPattern: /^https:\/\/soham-ai\.vercel\.app\/(?!api\/).*/i,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'app-pages',
          expiration: { maxEntries: 32, maxAgeSeconds: 24 * 60 * 60 },
          cacheableResponse: { statuses: [0, 200] },
        },
      },
    ],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '25mb',
    },
    serverComponentsExternalPackages: [
      '@genkit-ai/ai',
      '@genkit-ai/core',
      'genkit',
      'zod-to-json-schema',
      '@opentelemetry/api',
      '@opentelemetry/sdk-trace-base',
      '@opentelemetry/instrumentation',
      '@opentelemetry/resources',
      '@opentelemetry/sdk-node',
    ],
  },
  typescript: {
    ignoreBuildErrors: process.env.SKIP_ENV_VALIDATION === 'true',
  },
  eslint: {
    ignoreDuringBuilds: process.env.SKIP_ENV_VALIDATION === 'true',
  },
  poweredByHeader: false,
  compress: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co', pathname: '/**' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'plus.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'image.pollinations.ai', pathname: '/**' },
      { protocol: 'https', hostname: '*.supabase.co', pathname: '/**' },
    ],
  },
  // Security + SEO headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
      // Sitemap — correct content-type + short cache so Google sees updates quickly
      {
        source: '/sitemap.xml',
        headers: [
          { key: 'Content-Type', value: 'application/xml; charset=utf-8' },
          { key: 'Cache-Control', value: 'public, max-age=3600, stale-while-revalidate=86400' },
          { key: 'X-Robots-Tag', value: 'noindex' },
        ],
      },
      // Sitemap index / sub-sitemaps
      {
        source: '/sitemap-:slug.xml',
        headers: [
          { key: 'Content-Type', value: 'application/xml; charset=utf-8' },
          { key: 'Cache-Control', value: 'public, max-age=3600, stale-while-revalidate=86400' },
        ],
      },
      // Robots.txt — plain text, short cache
      {
        source: '/robots.txt',
        headers: [
          { key: 'Content-Type', value: 'text/plain; charset=utf-8' },
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' },
        ],
      },
      // Cache static assets aggressively
      {
        source: '/icons/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/FINALSOHAM.png',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' }],
      },
    ];
  },
};

// ── Server proxy: forward /server/* → Express backend ─────────────────────────
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || process.env.SERVER_URL || 'http://localhost:8080';

nextConfig.rewrites = async () => [
  {
    source: '/server-api/:path*',
    destination: `${SERVER_URL}/api/:path*`,
  },
];

// ── Removed docs pages ────────────────────────────────────────────────────────
// These pages described features SOHAM doesn't have. Send old links to the
// closest real page instead of a 404.
nextConfig.redirects = async () => [
  { source: '/documentation/smart-notes', destination: '/documentation', permanent: true },
  { source: '/documentation/jarvis-mode', destination: '/documentation/chat', permanent: true },
  { source: '/documentation/code-analysis', destination: '/documentation/chat', permanent: true },
  { source: '/documentation/smart-routing', destination: '/documentation/ai-models', permanent: true },
];

module.exports = withPWA(nextConfig);
