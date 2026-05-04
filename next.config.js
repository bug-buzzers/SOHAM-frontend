const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  workboxOptions: {
    disableDevLogs: true,
    skipWaiting: true,
    clientsClaim: true,
    // Precache the app shell pages for instant offline load
    additionalManifestEntries: [
      { url: '/chat', revision: null },
      { url: '/login', revision: null },
    ],
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
      // ── App pages — network first, fall back to cache ─────────────────────
      {
        urlPattern: /^https:\/\/soham-ai\.vercel\.app\/(?!api\/).*/i,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'app-pages',
          expiration: { maxEntries: 32, maxAgeSeconds: 24 * 60 * 60 },
          networkTimeoutSeconds: 5,
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
  // Security headers
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

module.exports = withPWA(nextConfig);
