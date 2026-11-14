import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkRateLimit, getClientIp, LIMITS } from '@/lib/rate-limiter';

// ── Allowed origins ──────────────────────────────────────────────────────────
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:8080',
  'https://soham-ai.vercel.app',
  'https://codeex-ai.netlify.app',
  process.env.NEXT_PUBLIC_APP_URL,
  process.env.NEXT_PUBLIC_SITE_URL,
  process.env.NEXT_PUBLIC_SERVER_URL,
  process.env.SERVER_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
].filter(Boolean) as string[];

// ── Vercel Toolbar ───────────────────────────────────────────────────────────
// Vercel injects its toolbar (comments and feedback, loaded from
// https://vercel.live/_next-live/feedback/feedback.js) into preview
// deployments, and into production ones too unless it's switched off in the
// project settings. Without these sources the CSP below blocks it. They're the
// ones Vercel lists under "Using a Content Security Policy":
// https://vercel.com/docs/vercel-toolbar/managing-toolbar
// Only added when running on Vercel; local and self-hosted builds never load it.
const ON_VERCEL = Boolean(process.env.VERCEL || process.env.VERCEL_ENV);
const VERCEL_TOOLBAR_SOURCES: Record<string, string | undefined> = {
  'script-src': 'https://vercel.live',
  'style-src': 'https://vercel.live',
  'font-src': 'https://vercel.live https://assets.vercel.com',
  'img-src': 'https://vercel.live https://vercel.com',
  'connect-src': 'https://vercel.live wss://ws-us3.pusher.com',
  'frame-src': 'https://vercel.live',
};

function withVercelToolbar(directive: string): string {
  const extra = VERCEL_TOOLBAR_SOURCES[directive.split(' ')[0]];
  return ON_VERCEL && extra ? `${directive} ${extra}` : directive;
}

// ── Security headers applied to every response ───────────────────────────────
const SECURITY_HEADERS: Record<string, string> = {
  // Prevent clickjacking
  'X-Frame-Options': 'SAMEORIGIN',
  // Stop MIME sniffing
  'X-Content-Type-Options': 'nosniff',
  // XSS protection (legacy browsers)
  'X-XSS-Protection': '1; mode=block',
  // Referrer policy — don't leak full URL to third parties
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  // Permissions policy — disable unused browser features
  'Permissions-Policy': 'camera=(), microphone=(self), geolocation=(), payment=()',
  // HSTS — force HTTPS for 1 year (only in production)
  ...(process.env.NODE_ENV === 'production'
    ? { 'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload' }
    : {}),
  // Content Security Policy
  'Content-Security-Policy': [
    "default-src 'self'",
    // Scripts: self + Vercel analytics + Google Analytics + Firebase/Google APIs
    // apis.google.com is required for Firebase Auth Google Sign-In (loads api.js)
    withVercelToolbar("script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://va.vercel-scripts.com https://apis.google.com https://accounts.google.com"),
    // Styles: self + inline (needed for Tailwind) + Google Fonts
    withVercelToolbar("style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://accounts.google.com"),
    // Fonts
    withVercelToolbar("font-src 'self' https://fonts.gstatic.com"),
    // Images: self + data URIs + Supabase storage + Firebase + external CDNs
    withVercelToolbar("img-src 'self' data: blob: https://*.supabase.co https://*.googleapis.com https://*.googleusercontent.com https://soham-ai.vercel.app https://lh3.googleusercontent.com"),
    // Media (audio/video)
    "media-src 'self' blob: data:",
    // API connections — includes Firebase Auth endpoints
    withVercelToolbar([
      "connect-src 'self'",
      'https://*.supabase.co',
      'https://soham-backend-dwpp.onrender.com',
      'https://www.google-analytics.com',
      'https://va.vercel-scripts.com',
      'https://api.groq.com',
      'https://generativelanguage.googleapis.com',
      'https://api-inference.huggingface.co',
      'https://openrouter.ai',
      'https://api.cerebras.ai',
      'https://identitytoolkit.googleapis.com',
      'https://securetoken.googleapis.com',
      'https://accounts.google.com',
      'https://apis.google.com',
      'wss://*.supabase.co',
    ].join(' ')),
    // Workers (for PWA service worker)
    "worker-src 'self' blob:",
    // Frames — Firebase Auth uses iframes for Google Sign-In
    withVercelToolbar("frame-src https://accounts.google.com https://*.firebaseapp.com"),
    // Object/embed
    "object-src 'none'",
    // Base URI
    "base-uri 'self'",
    // Form action
    "form-action 'self' https://accounts.google.com",
  ].join('; '),
};

// ── Route-specific rate limit config ─────────────────────────────────────────
function getRateLimitConfig(pathname: string) {
  if (pathname.startsWith('/api/chat')) return LIMITS.chat;
  if (pathname.startsWith('/api/generate-image')) return LIMITS.imageGen;
  if (pathname.startsWith('/api/tts')) return LIMITS.tts;
  if (pathname.startsWith('/api/transcribe')) return LIMITS.transcribe;
  if (pathname.startsWith('/api/web-search')) return LIMITS.webSearch;
  if (pathname.startsWith('/api/community')) return LIMITS.communityPost;
  return LIMITS.general;
}

// ── Middleware ────────────────────────────────────────────────────────────────
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // 1. Apply security headers to ALL responses
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }

  // 2. Handle API routes
  if (pathname.startsWith('/api/')) {
    // CORS
    const origin = request.headers.get('origin');
    if (origin && ALLOWED_ORIGINS.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Vary', 'Origin');
    }
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Max-Age', '86400');

    // Preflight
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 204, headers: response.headers });
    }

    // Rate limiting (skip health checks and OPTIONS)
    if (request.method !== 'OPTIONS' && !pathname.startsWith('/api/health')) {
      const ip = getClientIp(request);
      const config = getRateLimitConfig(pathname);
      const result = checkRateLimit(ip, config);

      response.headers.set('X-RateLimit-Limit', String(config.limit));
      response.headers.set('X-RateLimit-Remaining', String(result.remaining));
      response.headers.set('X-RateLimit-Reset', String(Math.ceil(result.resetAt / 1000)));

      if (!result.success) {
        return NextResponse.json(
          {
            error: 'RATE_LIMITED',
            message: 'Too many requests. Please slow down.',
            retryAfterMs: result.retryAfterMs,
            retryAfterSeconds: Math.ceil(result.retryAfterMs / 1000),
          },
          {
            status: 429,
            headers: {
              ...Object.fromEntries(response.headers.entries()),
              'Retry-After': String(Math.ceil(result.retryAfterMs / 1000)),
              'Content-Type': 'application/json',
            },
          }
        );
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    // Apply to all routes except:
    // - Next.js internals (_next/static, _next/image)
    // - Static files (images, fonts, icons)
    // - SEO files (sitemap.xml, robots.txt) — must be served as clean XML/text
    '/((?!_next/static|_next/image|favicon.ico|sitemap\\.xml|sitemap-.*\\.xml|robots\\.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|otf|xml|txt)).*)',
  ],
};
