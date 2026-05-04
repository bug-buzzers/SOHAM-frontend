'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Cpu, Globe, Zap, Image as ImageIcon, Brain, Code2, Search, Mic,
  FileText, ShieldCheck, ArrowRight, Check, Github, Star,
  MessageSquare, ScanSearch, AudioLines, ChevronDown, ChevronUp,
} from 'lucide-react';
import { type CoreMode } from '@/components/landing/soham-core';
import { DesktopLandingHeader, MobileLandingHeader } from '@/components/landing/landing-header';
import { DesktopLandingHero, MobileLandingHero } from '@/components/landing/landing-hero';
import { DEVELOPER_INFO } from '@/lib/developer-info';
import { useAuth } from '@/hooks/use-auth';
import { idbGet, idbSet } from '@/lib/indexed-db';

const NeuralLatticeBackground = dynamic(
  () => import('@/components/landing/neural-lattice-background').then((mod) => mod.NeuralLatticeBackground),
  { ssr: false }
);

// Design tokens removed — using CSS variables via Tailwind classes throughout

// ─── Data ─────────────────────────────────────────────────────────────────────
const heroFeatures = [
  { mode: 'chat' as CoreMode, title: '35+ AI Models', description: 'Groq, Cerebras, Gemini, DeepSeek.', icon: MessageSquare },
  { mode: 'pdf' as CoreMode, title: 'PDF Analyzer', description: 'Upload up to 5MB.', icon: FileText },
  { mode: 'vision' as CoreMode, title: 'Image Math Solver', description: 'Photo of any equation.', icon: ScanSearch },
  { mode: 'voice' as CoreMode, title: 'Voice Both Ways', description: 'Groq Whisper STT + Orpheus TTS.', icon: AudioLines },
];

const trustStats = [
  { label: 'AI Models', value: '35+' },
  { label: 'Countries', value: DEVELOPER_INFO.projectStats.countriesReached },
  { label: 'Uptime',    value: DEVELOPER_INFO.projectStats.uptime },
  { label: 'Price',     value: '$0' },
];

// Each accent color is unique per feature category.
const features = [
  { icon: Cpu,        title: '35+ AI Models',        desc: 'Groq (Llama 4, GPT-OSS 120B), Cerebras (Qwen 3 235B), Gemini 2.5 Pro, DeepSeek R1, NVIDIA Nemotron 120B — all free.', example: 'Ask anything — SOHAM picks the right model automatically. No account upgrades. No model tiers.', tag: 'Core',     tagColor: '#3b82f6', wide: false },
  { icon: Brain,      title: 'Smart Auto-Routing',    desc: 'Intent detector classifies every query into 13 types. Coding goes to DeepSeek. Long docs go to Gemini. Speed goes to Groq.', example: 'Ask "debug my Python code" — SOHAM routes it to DeepSeek R1 automatically. No settings. No toggles.', tag: 'AI',       tagColor: '#8b5cf6', wide: false },
  { icon: Globe,      title: 'Real-Time Web Search',  desc: 'DuckDuckGo + GNews + Open-Meteo + CricAPI + CoinGecko. Auto-triggers on news, weather, sports, finance.', example: 'Ask "India vs Australia score right now" — SOHAM queries CricAPI and responds with live data, not training data.', tag: 'Live',     tagColor: '#22c55e', wide: false },
  { icon: ImageIcon,  title: 'Image Generation',      desc: 'Pollinations.ai FLUX + Cloudflare Workers AI + HuggingFace fallback. Around 5 seconds. Describe what you want.', example: null, tag: 'Creative', tagColor: '#ec4899', wide: true  },
  { icon: Mic,        title: 'Voice Input & Output',  desc: 'Groq Whisper V3 Turbo STT. Groq Orpheus TTS with 6 voices. Vocal direction: [cheerful], [whisper], [laughs].', example: null, tag: 'Voice',    tagColor: '#06b6d4', wide: false },
  { icon: FileText,   title: 'PDF Analysis',          desc: 'Upload PDFs up to 5MB. Ask questions, get summaries. Gemini 2.5 Flash with 1M token context window.', example: null, tag: 'Docs',     tagColor: 'hsl(var(--primary))', wide: false },
  { icon: Code2,      title: '13 Specialized Skills', desc: 'Translation (50+ languages), Grammar Check, Quiz Generator, Recipe, Sentiment Analysis, Fact-Check, Dictionary.', example: null, tag: 'Skills',   tagColor: '#f97316', wide: false },
  { icon: Search,     title: '16 Slash Commands',     desc: '/solve /summarize /search /news /weather /translate /grammar /quiz /recipe /joke /define /factcheck and more.', example: null, tag: 'Commands', tagColor: '#a78bfa', wide: true  },
  { icon: ShieldCheck,title: 'Privacy-First',         desc: "Conversations stored in your browser's localStorage. The SOHAM backend never receives conversation content — only API routing instructions.", example: 'See the source code on GitHub to verify every claim.', tag: 'Privacy',  tagColor: '#14b8a6', wide: false },
];

// "unlimited" removed — replaced with "Free, included" per honesty rule
const comparisonRows = [
  { feature: 'Price',            soham: '$0 forever',                 other: 'Requires $20/mo subscription' },
  { feature: 'AI Models',        soham: '35+ from 5 providers',       other: 'OpenAI models only' },
  { feature: 'Image Generation', soham: 'Free, included',             other: 'Requires $20/mo subscription' },
  { feature: 'Web Search',       soham: 'Free, auto-triggers',        other: 'Requires $20/mo subscription' },
  { feature: 'Voice (STT+TTS)',  soham: 'Free, 6 voices',             other: 'Advanced Voice = $20/mo' },
  { feature: 'PDF Analysis',     soham: 'Free, up to 5MB',            other: 'Requires $20/mo subscription' },
  { feature: 'Privacy',          soham: 'Local storage, open source', other: 'Trains on chats by default' },
];

const faqItems = [
  {
    q: 'Is SOHAM really free? How?',
    a: 'Yes. SOHAM uses free tiers from Groq, Cerebras, Google, HuggingFace, and other providers. These providers offer generous free API quotas. SOHAM routes your queries across them intelligently so you never hit a single provider limit. There is no premium tier, no credit system, and no hidden cost.',
  },
  {
    q: 'What is the difference between SOHAM and ChatGPT?',
    a: 'ChatGPT is a single model (GPT-4o) behind a $20/month paywall for advanced features. SOHAM gives you 35+ models from 5 different providers — including models that outperform GPT-4o on specific tasks — completely free. SOHAM also includes image generation, voice I/O, real-time web search, and PDF analysis without any subscription.',
  },
  {
    q: 'Who is Heoster / CODEEX-AI?',
    a: 'Heoster (Harsh) is a 16-year-old developer from Khatauli, Uttar Pradesh, India. He built SOHAM while studying Class 12 PCM. CODEEX-AI is his AI startup, founded in 2024. The full story is in the "Built by one person" section above.',
  },
  {
    q: 'Is my data safe? Where are my conversations stored?',
    a: "Your conversations are stored in your browser's localStorage — they never leave your device. The SOHAM backend only receives the text of your current message to route it to the right AI model. It does not store, log, or train on your conversations. Authentication is handled by Firebase. You can verify all of this in the open source code on GitHub.",
  },
  {
    q: 'Which AI models are available?',
    a: 'Groq: Llama 4 Scout 17B, GPT-OSS 120B, Qwen3 32B. Cerebras: Qwen 3 235B, GPT-OSS 120B, GLM 4.7. Google: Gemini 2.5 Pro, Gemini 2.5 Flash. HuggingFace: DeepSeek R1 70B, Llama 3.3 70B. OpenRouter: NVIDIA Nemotron 120B, Arcee Trinity 400B. Plus 20+ more. All free.',
  },
  {
    q: 'Does SOHAM work on mobile?',
    a: 'Yes. SOHAM is a Progressive Web App (PWA) built mobile-first. It works in any browser on iOS and Android. You can also install it to your home screen for an app-like experience without going through an app store.',
  },
  {
    q: 'Is SOHAM open source? Where is the code?',
    a: 'Yes. SOHAM is MIT licensed. The full codebase — 50,000+ lines — is on GitHub at github.com/heoster. You can read the code, fork it, and build on it. The open source nature is also how you can verify the privacy claims above.',
  },
];

const sectionVariant = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.12 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
};

// ─── FAQ accordion ────────────────────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`rounded-xl overflow-hidden transition-all border ${open ? 'border-primary/25 bg-card' : 'border-primary/12 bg-transparent'}`}
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
        aria-expanded={open}
      >
        <span className={`text-sm font-semibold ${open ? 'text-foreground' : 'text-muted-foreground'}`}>{q}</span>
        {open
          ? <ChevronUp className="h-4 w-4 shrink-0 text-primary" />
          : <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        }
      </button>
      {open && (
        <div className="px-5 pb-4">
          <p className="text-sm leading-relaxed text-muted-foreground" style={{ lineHeight: 1.65 }}>{a}</p>
        </div>
      )}
    </div>
  );
}

// ─── Main shell ───────────────────────────────────────────────────────────────
export function LandingPageShell({ isMobile }: { isMobile: boolean }) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [activeMode, setActiveMode] = useState<CoreMode>('general');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [shouldRender3D, setShouldRender3D] = useState(!isMobile);

  useEffect(() => {
    if (typeof window === 'undefined' || loading) return;
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    if (isStandalone) { router.push(user ? '/chat' : '/login'); return; }
    idbGet<string>('hasVisitedBefore').then((v) => {
      if (user && v) router.push('/chat');
      else if (!v) idbSet('hasVisitedBefore', 'true');
    });
  }, [user, loading, router]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const nav = navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string }; deviceMemory?: number };
    const conn = nav.connection;
    const mem = nav.deviceMemory ?? 4;
    const update = () => setShouldRender3D(
      !(window.innerWidth < 768 || mq.matches || conn?.saveData === true ||
        ['slow-2g', '2g'].includes(conn?.effectiveType ?? '') || mem <= 4)
    );
    update();
    mq.addEventListener('change', update);
    window.addEventListener('resize', update, { passive: true });
    return () => { mq.removeEventListener('change', update); window.removeEventListener('resize', update); };
  }, []);

  // Escape closes mobile nav
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileNavOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Ambient radial glows */}
      <div className="pointer-events-none fixed inset-0 -z-10" style={{
        background: `radial-gradient(ellipse 70% 40% at 50% -5%, hsl(var(--primary)/0.12), transparent),
                     radial-gradient(ellipse 50% 30% at 80% 80%, hsl(var(--primary)/0.06), transparent)`,
      }} />

      {shouldRender3D && <NeuralLatticeBackground />}

      {isMobile ? (
        <MobileLandingHeader
          isScrolled={isScrolled}
          mobileNavOpen={mobileNavOpen}
          onToggleMobileNav={() => setMobileNavOpen(o => !o)}
        />
      ) : (
        <DesktopLandingHeader isScrolled={isScrolled} />
      )}

      <main>
        {/* ── Hero ── */}
        {isMobile ? (
          <MobileLandingHero
            activeMode={activeMode}
            setActiveMode={setActiveMode}
            heroFeatures={heroFeatures}
            trustStats={trustStats}
            sectionVariant={sectionVariant}
          />
        ) : (
          <DesktopLandingHero
            activeMode={activeMode}
            setActiveMode={setActiveMode}
            heroFeatures={heroFeatures}
            trustStats={trustStats}
            sectionVariant={sectionVariant}
          />
        )}

        {/* ── Provider ticker — with descriptors and fade masks ── */}
        <div className="border-y border-border bg-card/50 overflow-hidden relative">
          {/* Fade masks so items don't pop in/out at edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent" />
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 py-4">
            {[
              { name: 'Groq',            descriptor: 'Speed',       color: '#f97316' },
              { name: 'Cerebras',        descriptor: 'Scale',       color: 'hsl(var(--primary))' },
              { name: 'Google Gemini',   descriptor: 'Multimodal',  color: '#22c55e' },
              { name: 'HuggingFace',     descriptor: 'Open Models', color: 'hsl(var(--primary))' },
              { name: 'DeepSeek R1',     descriptor: 'Reasoning',   color: '#ec4899' },
              { name: 'NVIDIA Nemotron', descriptor: '120B Params', color: '#06b6d4' },
              { name: 'OpenRouter',      descriptor: 'Aggregator',  color: '#a78bfa' },
            ].map((p) => (
              <div key={p.name} className="flex flex-col items-center gap-0.5">
                <span className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: p.color }}>
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: p.color }} />
                  {p.name}
                </span>
                <span className="text-[10px]" style={{ color: p.color, opacity: 0.65 }}>{p.descriptor}</span>
              </div>
            ))}
            <span className="text-xs text-muted-foreground">+ 28 more · all free</span>
          </div>
        </div>

        {/* ── How It Works — 3 steps ── */}
        <motion.section {...sectionVariant} className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="mb-10 text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary"
              style={{ letterSpacing: '0.12em' }}>
              Get started in seconds
            </p>
            <h2 className="text-foreground" style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: '-0.04em',
            }}>
              How it works
            </h2>
          </div>
          <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'sm:grid-cols-3'}`}>
            {[
              {
                step: '01',
                title: 'Open the platform',
                desc: 'Go to soham-ai.vercel.app in any browser. Nothing to install. No app store. No account required to start.',
              },
              {
                step: '02',
                title: 'Choose your task',
                desc: 'Type a question, upload a PDF, speak a prompt, or request an image. SOHAM detects what you need automatically.',
              },
              {
                step: '03',
                title: 'Get a response',
                desc: 'The auto-router selects the best model for your query from 35+ options. You get the best answer, free.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative rounded-2xl p-6 border border-border bg-card"
                style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.3), 0 0 0 1px hsl(var(--primary)/0.1)' }}
              >
                <p
                  className="mb-4 text-5xl font-bold select-none text-muted/40"
                  style={{ lineHeight: 1, letterSpacing: '-0.04em' }}
                  aria-hidden="true"
                >
                  {item.step}
                </p>
                <p className="mb-2 text-base font-bold text-foreground" style={{ lineHeight: 1.15 }}>
                  {item.title}
                </p>
                <p className="text-sm text-muted-foreground" style={{ lineHeight: 1.65 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── Features ── */}
        <motion.section id="features" {...sectionVariant} className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="mb-10">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary"
              style={{ letterSpacing: '0.12em' }}>
              Everything included
            </p>
            {/* H2 split across two lines — "At $0." gets its own primary-colored line */}
            <h2 className="text-foreground" style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: '-0.04em',
            }}>
              More than ChatGPT Plus.
            </h2>
            <p className="text-primary" style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: '-0.04em',
            }}>
              At $0.
            </p>
            <p className="mt-3 text-base max-w-xl text-muted-foreground" style={{ lineHeight: 1.65 }}>
              Every feature a power user needs — from 35+ AI models to image generation, voice, and live web search — in one free platform.
            </p>
          </div>

          {/* Top 3 large cards */}
          <div className={`grid gap-4 mb-4 ${isMobile ? 'grid-cols-1' : 'sm:grid-cols-3'}`}>
            {features.slice(0, 3).map((f) => (
              <div
                key={f.title}
                className="rounded-2xl p-6 transition-all border border-border bg-card hover:bg-card/80"
                style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.3), 0 0 0 1px hsl(var(--primary)/0.1)' }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.4), 0 0 0 1px hsl(var(--primary)/0.2)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.3), 0 0 0 1px hsl(var(--primary)/0.1)';
                }}
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ background: `${f.tagColor}18` }}>
                    <f.icon className="h-5 w-5" style={{ color: f.tagColor }} />
                  </div>
                  <span className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold"
                    style={{ background: `${f.tagColor}18`, color: f.tagColor, border: `1px solid ${f.tagColor}30` }}>
                    {f.tag}
                  </span>
                </div>
                <p className="mb-2 text-base font-bold text-foreground">{f.title}</p>
                <p className="text-sm text-muted-foreground" style={{ lineHeight: 1.65 }}>{f.desc}</p>
                {f.example && (
                  <p className="mt-3 text-xs italic text-muted-foreground"
                    style={{ borderLeft: `2px solid ${f.tagColor}40`, paddingLeft: '10px', lineHeight: 1.65 }}>
                    {f.example}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Bento grid — wide cards for Image Gen and Slash Commands */}
          <div className={`grid gap-3 ${isMobile ? 'grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
            {features.slice(3).map((f) => (
              <div
                key={f.title}
                className={`rounded-xl p-4 transition-all border border-border/60 bg-card ${f.wide && !isMobile ? 'sm:col-span-2 lg:col-span-2' : ''}`}
                style={{
                  background: f.tag === 'Privacy' ? 'color-mix(in srgb, hsl(var(--card)) 96%, #14b8a6 4%)' : undefined,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.4), 0 0 0 1px hsl(var(--primary)/0.2)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.3)';
                }}
              >
                <div className="mb-2.5 flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg"
                    style={{ background: `${f.tagColor}18` }}>
                    <f.icon className="h-3.5 w-3.5" style={{ color: f.tagColor }} />
                  </div>
                  <p className="text-sm font-semibold text-foreground">{f.title}</p>
                  <span className="ml-auto rounded-full px-2 py-0.5 text-[10px] font-medium"
                    style={{ background: `${f.tagColor}15`, color: f.tagColor }}>
                    {f.tag}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground" style={{ lineHeight: 1.65 }}>{f.desc}</p>
                {f.example && (
                  <p className="mt-2 text-[11px] italic text-muted-foreground"
                    style={{ borderLeft: `2px solid ${f.tagColor}40`, paddingLeft: '8px', lineHeight: 1.65 }}>
                    {f.example}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link href="/chat">
              <button
                className="flex items-center gap-2 mx-auto h-11 px-8 rounded-xl font-semibold text-sm transition-all bg-primary text-primary-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-3"
                style={{ boxShadow: '0 0 24px hsl(var(--primary)/0.3)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 36px hsl(var(--primary)/0.5)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 24px hsl(var(--primary)/0.3)'; }}
              >
                <Zap className="h-4 w-4" />
                Try all features free
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </motion.section>

        {/* ── Comparison ── */}
        <motion.section
          id="compare"
          {...sectionVariant}
          className="border-y border-border bg-card/50"
        >
          <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <div className={`grid gap-10 ${isMobile ? '' : 'lg:grid-cols-2 lg:items-start'}`}>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest"
                  style={{ color: '#8b5cf6', letterSpacing: '0.12em' }}>
                  SOHAM vs ChatGPT
                </p>
                <h2 className="text-foreground" style={{
                  fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                  fontWeight: 700,
                  lineHeight: 1.15,
                  letterSpacing: '-0.04em',
                }}>
                  Why pay <span className="text-destructive">$20/month</span> for less?
                </h2>
                <p className="mt-3 text-base text-muted-foreground" style={{ lineHeight: 1.65 }}>
                  ChatGPT Plus locks image generation, voice, and advanced models behind a $20/month paywall.
                  SOHAM gives you all of that — plus 35+ models from 5 providers — for free.
                </p>
              </div>

              <div>
                <div className="overflow-hidden rounded-2xl border border-border bg-card"
                  style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.3), 0 0 0 1px hsl(var(--primary)/0.1)' }}>
                  <div className="grid grid-cols-3 px-4 py-3 text-[11px] font-semibold uppercase border-b border-border bg-primary/5"
                    style={{ letterSpacing: '0.12em' }}>
                    <span className="text-muted-foreground">Feature</span>
                    <span className="text-primary">SOHAM ✓</span>
                    <span className="text-muted-foreground">ChatGPT</span>
                  </div>
                  {comparisonRows.map((row, i) => (
                    <div
                      key={row.feature}
                      className="grid grid-cols-3 items-center gap-2 px-4 py-3 text-xs"
                      style={{ borderBottom: i < comparisonRows.length - 1 ? '1px solid hsl(var(--border)/0.6)' : 'none' }}
                    >
                      <span className="font-medium text-foreground/80">{row.feature}</span>
                      <span className="flex items-center gap-1.5 text-green-500">
                        <Check className="h-3.5 w-3.5 shrink-0" />
                        {row.soham}
                      </span>
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <span className="h-3.5 w-3.5 shrink-0 text-center">—</span>
                        {row.other}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Honest disclaimer — signals factual comparison, not tribal */}
                <p className="mt-3 text-[11px] text-muted-foreground/60" style={{ lineHeight: 1.65 }}>
                  ChatGPT data based on publicly listed Plus plan features as of 2025. SOHAM is an independent platform and is not affiliated with OpenAI.
                </p>

                {/* CTAs below the table — user reads evidence first, then acts */}
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href="/chat">
                    <button
                      className="h-10 px-5 rounded-xl font-semibold text-sm transition-all bg-primary text-primary-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px hsl(var(--primary)/0.4)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
                    >
                      Open SOHAM
                    </button>
                  </Link>
                  <Link href="/faq">
                    <button
                      className="h-10 px-5 rounded-xl text-sm transition-all border border-primary/30 text-primary bg-primary/6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
                    >
                      See FAQ
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── Founder — "Built by one person" ── */}
        {/* ── Founder — "Built by one person" ── */}
        <motion.section {...sectionVariant} className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="mb-8">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary"
              style={{ letterSpacing: '0.12em' }}>
              Built by one person
            </p>
            <h2 className="text-foreground" style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: '-0.04em',
            }}>
              A 16-year-old from Khatauli built this.
            </h2>
          </div>

          <div className={`grid gap-8 ${isMobile ? '' : 'lg:grid-cols-2 lg:items-start'}`}>
            {/* Founder card */}
            <div
              className="rounded-2xl p-6 space-y-5 border border-border bg-card"
              style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.3), 0 0 0 1px hsl(var(--primary)/0.1)' }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-xl font-bold bg-primary text-primary-foreground"
                  aria-hidden="true"
                >
                  H
                </div>
                <div>
                  <p className="font-bold text-foreground">Heoster (Harsh)</p>
                  <p className="text-sm text-muted-foreground">Founder, CODEEX-AI · Age 16 · Khatauli, UP, India</p>
                  <p className="text-xs mt-0.5 text-muted-foreground/60">Class 12 PCM · Maples Academy Khatauli</p>
                </div>
              </div>

              <blockquote className="rounded-xl p-4 bg-primary/6 border-l-[3px] border-primary">
                <p className="text-sm italic text-foreground/80" style={{ lineHeight: 1.65 }}>
                  "Advanced AI should not cost money. Every student, regardless of background, should have access to the same tools as someone paying $20 a month."
                </p>
                <footer className="mt-2 text-[11px] text-muted-foreground">
                  — Heoster, CODEEX-AI · 2025
                </footer>
              </blockquote>

              {/* Testers — with context line so names mean something */}
              <div>
                <p className="text-xs mb-2.5 text-muted-foreground">
                  Before any public launch, SOHAM was tested by friends from Khatauli — they broke it, questioned it, and made it better.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {DEVELOPER_INFO.friends.slice(0, 8).map((f) => (
                    <span
                      key={f.name}
                      className="rounded-full px-2.5 py-1 text-[11px] font-medium bg-primary/10 text-muted-foreground border border-primary/15"
                    >
                      {f.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-xs text-muted-foreground">Made in Bharat</span>
                <span className="text-sm" aria-label="India flag">🇮🇳</span>
                <span className="mx-2 text-border">·</span>
                <span className="text-xs text-muted-foreground">सोऽहम् — I am That</span>
              </div>
            </div>

            {/* Timeline — vertical on both mobile and desktop */}
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest mb-4 text-muted-foreground"
                style={{ letterSpacing: '0.12em' }}>
                Development timeline
              </p>
              {DEVELOPER_INFO.timeline.slice(-6).map((item, i) => {
                const isLast = i === DEVELOPER_INFO.timeline.slice(-6).length - 1;
                return (
                  <div key={item.year} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${isLast ? 'bg-primary text-primary-foreground' : 'bg-primary/15 text-primary'}`}
                      >
                        {item.year.replace('20', "'")}
                      </div>
                      {!isLast && (
                        <div className="mt-1 w-px flex-1 bg-primary/15" style={{ minHeight: '20px' }} />
                      )}
                    </div>
                    <div className="pb-4">
                      <p className="text-sm font-semibold text-foreground">{item.milestone}</p>
                      <p className="text-xs mt-0.5 text-muted-foreground" style={{ lineHeight: 1.65 }}>{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* ── Open Source banner ── */}
        <motion.section
          {...sectionVariant}
          className="border-y border-border bg-card/50"
        >
          <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
            <div className={`flex ${isMobile ? 'flex-col gap-4' : 'items-center justify-between gap-6'}`}>
              <div className="flex items-center gap-4">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/12 border border-border"
                  aria-hidden="true"
                >
                  <Github className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">SOHAM is open source</p>
                  <p className="text-xs mt-0.5 text-muted-foreground">
                    The full codebase — 50,000+ lines — is on GitHub under MIT license. Read the code. Fork it. Build on it.
                  </p>
                </div>
              </div>
              <a
                href={DEVELOPER_INFO.contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 shrink-0 rounded-xl px-4 py-2 text-sm font-semibold transition-all border border-primary/30 text-primary bg-primary/6 hover:bg-primary/12 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
              >
                <Star className="h-4 w-4" />
                Star on GitHub
              </a>
            </div>
          </div>
        </motion.section>

        {/* ── Privacy & Security ── */}
        <motion.section {...sectionVariant} className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="mb-8">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest"
              style={{ color: '#14b8a6', letterSpacing: '0.12em' }}>
              Privacy & Security
            </p>
            <h2 className="text-foreground" style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: '-0.04em',
            }}>
              Your conversations stay yours.
            </h2>
            <p className="mt-3 text-base max-w-xl text-muted-foreground" style={{ lineHeight: 1.65 }}>
              Conversations are stored in your browser's localStorage. The SOHAM backend never receives conversation content — only API routing instructions.
            </p>
          </div>
          <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'sm:grid-cols-2'}`}>
            {/* Privacy — what we don't do */}
            {[
              {
                label: 'Privacy',
                color: '#14b8a6',
                points: [
                  'Conversations stored in your browser only — never on our servers',
                  'No data selling. No training on your conversations.',
                  'GDPR compliant. MIT licensed — verify every claim on GitHub.',
                ],
              },
              {
                label: 'Security',
                color: '#3b82f6',
                points: [
                  'Secure authentication via Firebase · HTTPS enforced',
                  'Per-IP rate limiting on all API routes',
                  'Open source codebase — no hidden data collection',
                ],
              },
            ].map((section) => (
              <div
                key={section.label}
                className="rounded-2xl p-6 bg-card"
                style={{ border: `1px solid ${section.color}30`, boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}
              >
                <p className="mb-4 text-xs font-semibold uppercase tracking-widest"
                  style={{ color: section.color, letterSpacing: '0.12em' }}>
                  {section.label}
                </p>
                <ul className="space-y-3">
                  {section.points.map((point) => (
                    <li key={point} className="flex items-start gap-3">
                      <div
                        className="mt-0.5 h-4 w-4 shrink-0 rounded-full flex items-center justify-center"
                        style={{ background: `${section.color}20` }}
                      >
                        <Check className="h-2.5 w-2.5" style={{ color: section.color }} />
                      </div>
                      <span className="text-sm text-muted-foreground" style={{ lineHeight: 1.65 }}>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── FAQ ── */}
        <motion.section
          {...sectionVariant}
          className="border-t border-border bg-card/30"
        >
          <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
            <div className="mb-10 text-center">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary"
                style={{ letterSpacing: '0.12em' }}>
                Common questions
              </p>
              <h2 className="text-foreground" style={{
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                fontWeight: 700,
                lineHeight: 1.15,
                letterSpacing: '-0.04em',
              }}>
                FAQ
              </h2>
            </div>
            <div className="space-y-2">
              {faqItems.map((item) => (
                <FaqItem key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          </div>
        </motion.section>

        {/* ── Final CTA — emotional close, not a fifth repetition of the same button ── */}
        <motion.section {...sectionVariant} className="border-t border-border">
          <div className="mx-auto w-full max-w-3xl px-4 py-20 sm:px-6 sm:py-28 text-center">
            <p className="mb-6 text-base max-w-xl mx-auto text-muted-foreground" style={{ lineHeight: 1.65 }}>
              Harsh built this while preparing for his Class 12 exams. Not for a grade. Not for a hackathon.
              Because he believed advanced AI should not cost money.
              If you agree — open SOHAM.
            </p>
            <Link href="/chat">
              <button
                className="flex items-center gap-2 mx-auto h-12 px-10 rounded-xl font-semibold text-base transition-all bg-primary text-primary-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-3"
                style={{ boxShadow: '0 0 32px hsl(var(--primary)/0.35)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 48px hsl(var(--primary)/0.55)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 32px hsl(var(--primary)/0.35)'; }}
              >
                Open SOHAM
                <ArrowRight className="h-5 w-5" />
              </button>
            </Link>
            <p className="mt-4 text-xs text-muted-foreground">
              soham-ai.vercel.app · Always free · MIT licensed
            </p>
          </div>
        </motion.section>

        {/* ── Footer ── */}
        <footer className="border-t border-border bg-card">
          <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
            <div className={`grid gap-8 mb-8 ${isMobile ? 'grid-cols-2' : 'sm:grid-cols-4'}`}>
              {/* Brand — Sanskrit meaning in footer elevates it from a link list */}
              <div className="col-span-2 sm:col-span-1 space-y-3">
                <p className="font-bold text-foreground tracking-tight">SOHAM</p>
                <p className="text-xs text-muted-foreground" style={{ lineHeight: 1.65 }}>
                  SOHAM — Sanskrit for "I am That." The unity of individual intelligence with universal knowledge.
                </p>
                <p className="text-xs text-muted-foreground/50">Made in Bharat 🇮🇳 · CODEEX-AI · 2024–2026</p>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground"
                  style={{ letterSpacing: '0.12em' }}>
                  Product
                </p>
                {[
                  { href: '/chat',          label: 'Open SOHAM' },
                  { href: '/documentation', label: 'Documentation' },
                  { href: '/faq',           label: 'FAQ' },
                  { href: '/about',         label: 'About' },
                ].map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="block text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>

              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground"
                  style={{ letterSpacing: '0.12em' }}>
                  Developer
                </p>
                {[
                  { href: DEVELOPER_INFO.contact.github,                          label: 'GitHub',      external: true  },
                  { href: DEVELOPER_INFO.contact.linkedin,                         label: 'LinkedIn',    external: true  },
                  { href: `https://twitter.com/${DEVELOPER_INFO.social.Twitter}`,  label: 'Twitter / X', external: true  },
                  { href: '/community',                                             label: 'Community',   external: false },
                ].map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    target={l.external ? '_blank' : undefined}
                    rel={l.external ? 'noopener noreferrer' : undefined}
                    className="block text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                  >
                    {l.label}
                  </a>
                ))}
              </div>

              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground"
                  style={{ letterSpacing: '0.12em' }}>
                  Legal
                </p>
                {[
                  { href: '/privacy',                    label: 'Privacy Policy', external: false },
                  { href: '/terms',                      label: 'Terms of Service', external: false },
                  { href: DEVELOPER_INFO.contact.github, label: 'MIT License',    external: true  },
                ].map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    target={l.external ? '_blank' : undefined}
                    rel={l.external ? 'noopener noreferrer' : undefined}
                    className="block text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-border/60">
              <p className="text-xs text-muted-foreground/50">
                © 2024–2026 CODEEX-AI · Heoster (Harsh) · Khatauli, India
              </p>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-400" />
                </span>
                <span className="text-xs text-green-500">All systems operational</span>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
