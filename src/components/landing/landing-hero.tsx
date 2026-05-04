'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, ChevronDown, Zap } from 'lucide-react';
import { type CoreMode } from '@/components/landing/soham-core';
import { cn } from '@/lib/utils';
import { DEVELOPER_INFO } from '@/lib/developer-info';

interface HeroFeature {
  mode: CoreMode;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface TrustStat {
  label: string;
  value: string;
}

interface HeroProps {
  activeMode: CoreMode;
  setActiveMode: (mode: CoreMode) => void;
  heroFeatures: HeroFeature[];
  trustStats: TrustStat[];
  sectionVariant: object;
}

const MODEL_GROUPS = [
  { provider: 'Groq',       color: '#f97316', models: ['Llama 4 Scout 17B', 'GPT-OSS 120B', 'Qwen3 32B'] },
  { provider: 'Cerebras',   color: '#3b82f6', models: ['Qwen 3 235B', 'GPT-OSS 120B', 'GLM 4.7'] },
  { provider: 'Google',     color: '#22c55e', models: ['Gemini 2.5 Pro', 'Gemini 2.5 Flash'] },
  { provider: 'HuggingFace',color: 'hsl(var(--primary))', models: ['DeepSeek R1 70B', 'Llama 3.3 70B'] },
  { provider: 'OpenRouter', color: '#a78bfa', models: ['NVIDIA Nemotron 120B', 'Arcee Trinity 400B'] },
];

// Real testers — names make the social proof feel true
const TESTERS = DEVELOPER_INFO.friends.slice(0, 8);

function ModelSelector() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState('Auto (Recommended)');

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm text-white transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#3b82f6] focus-visible:outline-offset-2"
        style={{ border: '1px solid rgba(59,130,246,0.25)', background: 'rgba(59,130,246,0.06)' }}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
          </span>
          <span className="font-medium">{selected}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold bg-primary/15 text-primary">
            Free
          </span>
          <ChevronDown className={cn('h-4 w-4 transition-transform duration-150 text-muted-foreground', open && 'rotate-180')} />
        </div>
      </button>

      {open && (
        <div
          className="absolute left-0 right-0 top-full z-20 mt-1.5 overflow-hidden rounded-xl shadow-2xl border border-border bg-card"
          style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}
          role="listbox"
        >
          <div className="px-3 py-2" style={{ borderBottom: '1px solid rgba(59,130,246,0.1)' }}>
            <button
              onClick={() => { setSelected('Auto (Recommended)'); setOpen(false); }}
              className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-white transition-all hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#3b82f6]"
              role="option"
              aria-selected={selected === 'Auto (Recommended)'}
            >
              <span className="h-2 w-2 rounded-full bg-green-400" />
              Auto (Recommended)
              <span className="ml-auto text-[10px] text-muted-foreground">Picks best model per query</span>
            </button>
          </div>
          <div className="max-h-56 overflow-y-auto py-1">
            {MODEL_GROUPS.map((group) => (
              <div key={group.provider}>
                <p className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider" style={{ color: group.color }}>
                  {group.provider}
                </p>
                {group.models.map((model) => (
                  <button
                    key={model}
                    onClick={() => { setSelected(model); setOpen(false); }}
                    className="flex w-full items-center gap-2 px-4 py-1.5 text-sm transition-all hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#3b82f6] text-foreground/80"
                    role="option"
                    aria-selected={selected === model}
                  >
                    {model}
                    <span className="ml-auto text-[10px]" style={{ color: '#22c55e' }}>Free</span>
                  </button>
                ))}
              </div>
            ))}
          </div>
          <div className="px-4 py-2 text-[11px] text-muted-foreground" style={{ borderTop: '1px solid rgba(59,130,246,0.1)' }}>
            35+ models · All free · Auto-routing included
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Live preview card — shows the product working, not just describing it.
 * A sample interaction with model attribution chip.
 */
function LivePreviewCard() {
  return (
    <div
      className="rounded-2xl overflow-hidden border border-border bg-card"
      style={{
        boxShadow: '0 8px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(59,130,246,0.1)',
      }}
    >
      {/* Window chrome */}
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{ borderBottom: '1px solid rgba(59,130,246,0.12)', background: 'rgba(59,130,246,0.04)' }}
      >
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full" style={{ background: '#ef4444', opacity: 0.7 }} />
          <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground/40" style={{ opacity: 0.7 }} />
          <div className="h-2.5 w-2.5 rounded-full" style={{ background: '#22c55e', opacity: 0.7 }} />
        </div>
        <span className="ml-2 text-[11px] text-muted-foreground/60">SOHAM Chat</span>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-400" />
          </span>
          <span className="text-[10px]" style={{ color: '#22c55e' }}>Live</span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* User message */}
        <div className="flex justify-end">
          <div
            className="max-w-[80%] rounded-2xl rounded-tr-sm px-3.5 py-2.5 text-sm text-foreground"
            style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.2)' }}
          >
            Explain quantum entanglement simply
          </div>
        </div>

        {/* AI response */}
        <div className="flex gap-2.5">
          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold bg-primary text-primary-foreground"
          >
            S
          </div>
          <div className="space-y-2 flex-1">
            <div
              className="rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-sm leading-relaxed text-foreground/80 bg-card border border-border/60"
            >
              Imagine two coins flipped at the same time — no matter how far apart they are, when one lands heads, the other instantly lands tails. Quantum entanglement works the same way: two particles share a linked state, and measuring one instantly determines the other, regardless of distance.
            </div>
            {/* Model attribution chip */}
            <div className="flex items-center gap-1.5 pl-1">
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                style={{ background: 'rgba(249,115,22,0.12)', color: '#f97316', border: '1px solid rgba(249,115,22,0.2)' }}
              >
                Llama 4 via Groq
              </span>
              <span className="text-[10px] text-muted-foreground/60">· auto-routed · 0.4s</span>
            </div>
          </div>
        </div>

        {/* Input bar */}
        <div
          className="flex items-center gap-2 rounded-xl px-3 py-2.5 mt-1"
          style={{ border: '1px solid rgba(59,130,246,0.2)', background: 'rgba(59,130,246,0.04)' }}
        >
          <span className="flex-1 text-sm text-muted-foreground/60">Ask anything...</span>
          <div
            className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary"
          >
            <ArrowRight className="h-3 w-3 text-primary-foreground" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function DesktopLandingHero({ trustStats }: HeroProps) {
  return (
    <section className="relative mx-auto w-full max-w-6xl px-6 pt-16 pb-20">
      <div className="grid gap-14 lg:grid-cols-2 lg:items-start">

        {/* ── Left column ── */}
        <div className="space-y-8">
          {/* Founder badge */}
          <div className="inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-xs border border-primary/25 bg-primary/6 text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Built by Heoster, age 16 · Khatauli, India · CODEEX-AI
          </div>

          {/* H1 — crescendo structure: each line grows in visual weight */}
          <div className="space-y-4">
            <h1 style={{ lineHeight: 1.05, fontWeight: 800, letterSpacing: '-0.04em' }}>
              <span
                className="block"
                style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', color: '#ffffff' }}
              >
                One platform.
              </span>
              <span
                className="block text-primary"
                style={{ fontSize: 'clamp(2.2rem, 4.2vw, 3.2rem)', fontWeight: 800, letterSpacing: '-0.04em' }}
              >
                Thirty-five AI models.
              </span>
              <span
                className="block"
                style={{ fontSize: 'clamp(2.6rem, 5vw, 3.75rem)', color: '#3b82f6' }}
              >
                Always free.
              </span>
            </h1>

            {/* Sanskrit identity — distinctive, authentic, no Western AI product has this */}
            <p style={{ fontSize: '13px', letterSpacing: '0.02em' }} className="text-muted-foreground">
              सोऽहम् — <em>So Hum</em> — I am That
            </p>

            <p style={{ fontSize: '1.05rem', lineHeight: 1.65, maxWidth: '28rem' }} className="text-muted-foreground">
              Chat, generate images, search the web, analyze PDFs, and use voice — all powered by the best AI models from Groq, Cerebras, Google, and more.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/chat">
              <button
                className="flex items-center gap-2 h-11 px-6 rounded-xl font-semibold text-sm transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#3b82f6] focus-visible:outline-offset-3 bg-primary text-primary-foreground"
                style={{ boxShadow: '0 0 24px hsl(var(--primary)/0.35)' }}
                onMouseEnter={e => { (e.currentTarget).style.boxShadow = '0 0 36px hsl(var(--primary)/0.55)'; }}
                onMouseLeave={e => { (e.currentTarget).style.boxShadow = '0 0 24px hsl(var(--primary)/0.35)'; }}
              >
                <Zap className="h-4 w-4" />
                Open SOHAM
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
            <Link href="/documentation">
              <button
                className="h-11 px-6 rounded-xl text-sm font-medium transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#3b82f6] focus-visible:outline-offset-3"
                style={{ border: '1px solid rgba(59,130,246,0.3)', color: '#3b82f6', background: 'rgba(59,130,246,0.06)' }}
                onMouseEnter={e => { (e.currentTarget).style.background = 'rgba(59,130,246,0.12)'; }}
                onMouseLeave={e => { (e.currentTarget).style.background = 'rgba(59,130,246,0.06)'; }}
              >
                View Documentation
              </button>
            </Link>
          </div>

          {/* Social proof — real names, real city, real achievement */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2" aria-hidden="true">
                {TESTERS.slice(0, 5).map((tester) => (
                  <div
                    key={tester.name}
                    className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold text-white ring-2 ring-background"
                    style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
                    title={tester.name}
                  >
                    {tester.name[0]}
                  </div>
                ))}
              </div>
             
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-muted-foreground">Made in Bharat</span>
              <span className="text-sm" aria-label="India flag">🇮🇳</span>
              <span className="mx-1.5" style={{ color: '#1e293b' }}>·</span>
              <span className="text-xs text-muted-foreground">Open source MIT</span>
              <span className="mx-1.5" style={{ color: '#1e293b' }}>·</span>
              <span className="text-xs text-muted-foreground">Privacy-first</span>
            </div>
          </div>
        </div>

        {/* ── Right column ── */}
        <div className="space-y-3">
          {/* Stats row */}
          <div className="grid grid-cols-4 gap-2">
            {trustStats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl p-3 text-center transition-all border border-border bg-card"
                style={{
                  boxShadow: s.label === 'AI Models' || s.label === 'Uptime'
                    ? '0 1px 3px rgba(0,0,0,0.3), 0 0 0 1px rgba(59,130,246,0.1)'
                    : 'none',
                }}
              >
                <div className="flex items-center justify-center gap-1">
                  <p className={cn('text-xl font-bold', s.label === 'Price' ? 'text-primary' : 'text-foreground')}>
                    {s.value}
                  </p>
                  {s.label === 'Uptime' && (
                    <span className="relative flex h-2 w-2" aria-hidden="true">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
                    </span>
                  )}
                </div>
                <p className="text-[10px] mt-0.5 text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Model selector */}
          <div
            className="rounded-2xl p-4 space-y-3 border border-border bg-card"
            style={{ borderColor: 'rgba(59,130,246,0.15)' }}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-foreground">Select AI Model</p>
              <span className="text-[10px] text-muted-foreground">35+ available</span>
            </div>
            <ModelSelector />
            <p className="text-[11px] text-muted-foreground/60">
              Auto mode routes each query to the best model. No settings needed.
            </p>
          </div>

          {/* Live preview card — shows the product working */}
          <LivePreviewCard />
        </div>
      </div>
    </section>
  );
}

export function MobileLandingHero({ trustStats }: HeroProps) {
  return (
    <section className="w-full px-4 pt-8 pb-12 space-y-7" style={{ maxWidth: '100vw', overflowX: 'hidden' }}>

      {/* Founder badge */}
      <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] border border-primary/25 bg-primary/6 text-primary">
        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
        Built by Heoster, 16 · CODEEX-AI · India
      </div>

      {/* H1 — crescendo structure */}
      <div className="space-y-2">
        <h1 style={{ lineHeight: 1.05, fontWeight: 800, letterSpacing: '-0.04em' }}>
          <span className="block" style={{ fontSize: 'clamp(1.6rem, 7vw, 2.2rem)', color: '#ffffff' }}>
            One platform.
          </span>
          <span className="block text-primary" style={{ fontSize: 'clamp(1.9rem, 8.5vw, 2.6rem)', fontWeight: 800, letterSpacing: '-0.04em' }}>
            Thirty-five AI models.
          </span>
          <span className="block" style={{ fontSize: 'clamp(2.2rem, 9.5vw, 3rem)', color: '#3b82f6' }}>
            Always free.
          </span>
        </h1>
        {/* Sanskrit identity */}
        <p className="text-muted-foreground" style={{ fontSize: '12px' }}>
          सोऽहम् — <em>So Hum</em> — I am That
        </p>
        <p className="text-base leading-relaxed text-muted-foreground" style={{ lineHeight: 1.65 }}>
          Chat, image gen, voice, web search, PDF analysis — powered by the best AI models.
        </p>
      </div>

      {/* CTAs */}
      <div className="flex gap-3">
        <Link href="/chat" className="flex-1">
          <button
            className="flex w-full items-center justify-center gap-2 h-11 rounded-xl font-semibold text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#3b82f6] focus-visible:outline-offset-2 bg-primary text-primary-foreground"
            style={{ boxShadow: '0 0 20px hsl(var(--primary)/0.3)' }}
          >
            <Zap className="h-4 w-4" />
            Open SOHAM
          </button>
        </Link>
        <Link href="/faq">
          <button
            className="h-11 px-4 rounded-xl text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#3b82f6] focus-visible:outline-offset-2"
            style={{ border: '1px solid rgba(59,130,246,0.3)', color: '#3b82f6', background: 'rgba(59,130,246,0.06)' }}
          >
            FAQ
          </button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2">
        {trustStats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl p-2.5 text-center border border-border bg-card"
            style={{
              boxShadow: s.label === 'AI Models' ? '0 1px 3px rgba(0,0,0,0.3), 0 0 0 1px rgba(59,130,246,0.1)' : 'none',
            }}
          >
            <p className={cn('text-base font-bold', s.label === 'Price' ? 'text-primary' : 'text-foreground')}>
              {s.value}
            </p>
            <p className="text-[9px] mt-0.5 leading-tight text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Model selector */}
      <div className="rounded-xl p-3.5 space-y-2.5 border border-border bg-card" style={{ borderColor: 'rgba(59,130,246,0.15)' }}>
        <p className="text-xs font-semibold text-foreground">Select AI Model</p>
        <ModelSelector />
      </div>

      {/* Live preview card — mobile version */}
      <LivePreviewCard />

      {/* Social proof — real names */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2.5">
          <div className="flex -space-x-1.5" aria-hidden="true">
            {TESTERS.slice(0, 4).map((tester) => (
              <div
                key={tester.name}
                className="flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-bold text-white ring-2 ring-background"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
                title={tester.name}
              >
                {tester.name[0]}
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Tested by {TESTERS.slice(0, 4).map(t => t.name).join(', ')} and others
          </p>
        </div>
        <p className="text-xs text-muted-foreground/60">
          Made in Bharat 🇮🇳 · Reached 100+ countries as of 2025
        </p>
      </div>
    </section>
  );
}
