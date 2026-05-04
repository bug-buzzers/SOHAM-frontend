/**
 * /api/chat-stream — SSE proxy
 *
 * Forwards the POST body to the backend /api/chat/stream endpoint and
 * pipes the SSE response back to the browser verbatim.
 *
 * The browser connects to this Next.js route (same origin) so there are
 * no CORS issues. This route adds rate-limiting and auth header injection.
 */

import { NextRequest } from 'next/server';
import { checkRateLimit, getClientIp, LIMITS } from '@/lib/rate-limiter';

const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  process.env.SERVER_URL ||
  'http://localhost:8080';

const SOHAM_API_KEY = process.env.SOHAM_API_KEY;

export const dynamic = 'force-dynamic'; // never cache this route

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(request: NextRequest) {
  // ── Rate limit ──────────────────────────────────────────────────────────────
  const ip = getClientIp(request);
  const rl = checkRateLimit(ip, LIMITS.chat);
  if (!rl.success) {
    return new Response(
      `data: ${JSON.stringify({ type: 'error', text: 'Too many requests. Please wait a moment.' })}\n\n`,
      {
        status: 429,
        headers: {
          'Content-Type': 'text/event-stream',
          'Retry-After': String(Math.ceil(rl.retryAfterMs / 1000)),
        },
      }
    );
  }

  // ── Parse body ──────────────────────────────────────────────────────────────
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return new Response(
      `data: ${JSON.stringify({ type: 'error', text: 'Invalid JSON in request body.' })}\n\n`,
      { status: 400, headers: { 'Content-Type': 'text/event-stream' } }
    );
  }

  if (!body.message || typeof body.message !== 'string' || !String(body.message).trim()) {
    return new Response(
      `data: ${JSON.stringify({ type: 'error', text: 'Message is required.' })}\n\n`,
      { status: 400, headers: { 'Content-Type': 'text/event-stream' } }
    );
  }

  // ── Proxy to backend SSE endpoint ──────────────────────────────────────────
  try {
    const upstream = await fetch(`${SERVER_URL}/api/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SOHAM_API_KEY}`,
      },
      body: JSON.stringify(body),
      // @ts-ignore — Node 18+ fetch supports duplex
      duplex: 'half',
    });

    if (!upstream.ok || !upstream.body) {
      const errText = await upstream.text().catch(() => '');
      return new Response(
        `data: ${JSON.stringify({ type: 'error', text: `Backend error: ${upstream.status} ${errText}` })}\n\ndata: ${JSON.stringify({ type: 'done' })}\n\n`,
        { status: 200, headers: { 'Content-Type': 'text/event-stream' } }
      );
    }

    // Pipe the upstream SSE stream directly to the browser
    return new Response(upstream.body, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Backend unreachable';
    return new Response(
      `data: ${JSON.stringify({ type: 'error', text: msg })}\n\ndata: ${JSON.stringify({ type: 'done' })}\n\n`,
      { status: 200, headers: { 'Content-Type': 'text/event-stream' } }
    );
  }
}
