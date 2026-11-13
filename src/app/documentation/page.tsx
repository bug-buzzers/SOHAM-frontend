import type { Metadata } from 'next';
import Link from 'next/link';
import { pageSEO } from '@/lib/seo-config';
import {
  ArrowRight,
  BookOpen,
  FileText,
  MessageSquare,
  Search,
  Sparkles,
  Calculator,
  Cpu,
  Mic,
  Image as ImageIcon,
  Globe,
  Zap,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getEnabledModels, groupModels, PROVIDER_LABELS } from '@/lib/model-catalog';

export const metadata: Metadata = {
  title: pageSEO.documentation.title,
  description: pageSEO.documentation.description,
  keywords: pageSEO.documentation.keywords,
  alternates: { canonical: 'https://soham-ai.vercel.app/documentation' },
  openGraph: {
    title: pageSEO.documentation.title,
    description: pageSEO.documentation.description,
    url: 'https://soham-ai.vercel.app/documentation',
    type: 'website',
    siteName: 'SOHAM',
  },
};

// Provider names from models-config.json, e.g. "Google Gemini · OpenRouter · Groq".
const PROVIDER_DETAIL = groupModels(getEnabledModels(), 'provider')
  .map(({ key }) => PROVIDER_LABELS[key] ?? key)
  .join(' · ');

const coreGuides = [
  {
    title: 'AI Chat & Model Selection',
    description: 'How to use the model selector, what Auto mode does, how fallback works, and when to switch models manually.',
    href: '/documentation/chat',
    icon: MessageSquare,
    badge: 'Core',
    detail: PROVIDER_DETAIL,
  },
  {
    title: 'PDF Analyzer',
    description: 'Upload a PDF up to 5 MB and ask questions about it, such as a summary or the key points.',
    href: '/documentation/pdf-analysis',
    icon: FileText,
    badge: 'Core',
    detail: 'Up to 5 MB · Questions and summaries',
  },
  {
    title: 'Image Math Solver',
    description: 'Upload a photo of an equation, handwritten or printed, to see it recognised and solved step by step.',
    href: '/documentation/math-solver',
    icon: Calculator,
    badge: 'Core',
    detail: 'Photo upload · Step-by-step',
  },
  {
    title: 'Web Search',
    description: 'Use /search, or ask about something recent, and SOHAM can search the web before answering. Sources include Tavily, Wikipedia and DuckDuckGo, plus GNews, Open-Meteo, CricAPI, CoinGecko and Alpha Vantage for news, weather, cricket and prices.',
    href: '/documentation/web-search',
    icon: Search,
    badge: 'Live Data',
    detail: '/search or automatic · Live data sources',
  },
  {
    title: 'Image Generation',
    description: 'Describe an image in chat and SOHAM generates it with the FLUX model on Pollinations.ai. Images are saved at a public link so they can be shown in chat. Rate limits apply.',
    href: '/documentation/image-generation',
    icon: ImageIcon,
    badge: 'Creative',
    detail: 'FLUX · Pollinations.ai · Download in chat',
  },
  {
    title: 'Voice Features',
    description: 'Dictate messages with your browser\'s speech recognition, and have replies read aloud with your browser\'s built-in voices.',
    href: '/documentation/settings',
    icon: Mic,
    badge: 'Voice',
    detail: 'Browser speech · Read aloud',
  },
];

const askExamples = [
  { title: 'Translate', prompt: 'Translate this paragraph into Hindi', icon: Globe },
  { title: 'Fix grammar', prompt: 'Check the grammar of this email and suggest fixes', icon: Sparkles },
  { title: 'Practice quiz', prompt: 'Make a 5-question quiz on photosynthesis', icon: HelpCircle },
  { title: 'Explain a word', prompt: 'What does "ephemeral" mean? Give two example sentences', icon: BookOpen },
  { title: 'Summarize', prompt: '/summarize followed by the text you want condensed', icon: FileText },
  { title: 'Solve step by step', prompt: '/solve 3x + 5 = 20', icon: Calculator },
];

const operationsGuides = [
  {
    title: 'Quick Start',
    description: 'Sign in with Google or email and send your first message.',
    href: '/documentation/quick-start',
  },
  {
    title: 'Slash Commands',
    description: '/solve, /search and /summarize: what each command does and when to use it.',
    href: '/documentation/commands',
  },
  {
    title: 'Settings',
    description: 'Model selection, tone, technical level, voice preferences, speech output toggle.',
    href: '/documentation/settings',
  },
  {
    title: 'Security & Privacy',
    description: 'What is saved in your browser and on SOHAM\'s server, how sign-in works, and what is sent to AI providers.',
    href: '/documentation/security',
  },
  {
    title: 'PWA Installation',
    description: 'Install SOHAM as a native-like app on Android (Chrome), iOS (Safari), Windows, and Mac.',
    href: '/documentation/pwa',
  },
  {
    title: 'API Reference',
    description: 'The HTTP endpoints behind SOHAM: chat, AI tools, image generation, voice and web search.',
    href: '/documentation/api-reference',
  },
];

const PROVIDER_STYLES: Record<string, { color: string; bg: string }> = {
  google: { color: 'text-green-400', bg: 'bg-green-400/10' },
  openrouter: { color: 'text-purple-400', bg: 'bg-purple-400/10' },
  groq: { color: 'text-orange-400', bg: 'bg-orange-400/10' },
};

// Built from models-config.json, the same list the chat model selector shows.
const enabledModels = getEnabledModels();
const modelProviders = groupModels(enabledModels, 'provider').map(({ key, models }) => ({
  name: PROVIDER_LABELS[key] ?? key,
  models: models.map((model) => model.shortName).join(', '),
  ...(PROVIDER_STYLES[key] ?? { color: 'text-primary', bg: 'bg-primary/10' }),
}));

export default function DocsHomePage() {
  return (
    <div className="space-y-12">

      {/* ── Hero ── */}
      <section className="space-y-5">
        <div className="inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-2 text-sm">
          <BookOpen className="h-4 w-4 text-primary" />
          <span className="font-medium">SOHAM Documentation</span>
        </div>
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">
            Everything you need to use SOHAM
          </h1>
          <p className="max-w-3xl text-lg text-muted-foreground">
            {enabledModels.length} AI models, web search, image generation, voice input and read-aloud,
            PDF analysis and an image math solver, and how to use each of them.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/chat">
            <Button size="lg">
              Open Chat
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/documentation/quick-start">
            <Button size="lg" variant="outline">
              Quick Start Guide
            </Button>
          </Link>
          <Link href="/faq">
            <Button size="lg" variant="outline">
              FAQ
            </Button>
          </Link>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'AI Models', value: String(enabledModels.length), icon: Cpu },
          { label: 'Providers', value: String(modelProviders.length), icon: Globe },
          { label: 'Slash Commands', value: '3', icon: Zap },
          { label: 'PDF Size Limit', value: '5 MB', icon: FileText },
        ].map((s) => (
          <Card key={s.label} className="text-center">
            <CardContent className="p-4">
              <s.icon className="h-5 w-5 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* ── AI Models ── */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Cpu className="h-6 w-6 text-primary" />
            {enabledModels.length} AI Models — {modelProviders.length} Providers
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Leave the selector on Auto and SOHAM chooses a model for each request, or pick one yourself.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {modelProviders.map((p) => (
            <div key={p.name} className="rounded-2xl border bg-card p-4 space-y-2">
              <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${p.bg} ${p.color}`}>
                {p.name}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{p.models}</p>
            </div>
          ))}
          <div className="rounded-2xl border bg-primary/5 border-primary/20 p-4 space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-primary/10 text-primary">
              Auto Mode
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Auto (Smart Routing) looks at what you ask and chooses a model for it. Each reply shows which
              model answered, and you can switch manually at any time.
            </p>
          </div>
        </div>
      </section>

      {/* ── Core Guides ── */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold">Core Feature Guides</h2>
          <p className="text-sm text-muted-foreground mt-1">Deep dives into every major SOHAM feature.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {coreGuides.map((guide) => {
            const Icon = guide.icon;
            return (
              <Link key={guide.href} href={guide.href}>
                <Card className="h-full transition-all hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5">
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="rounded-2xl bg-primary/10 p-2 text-primary shrink-0">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <CardTitle className="text-base">{guide.title}</CardTitle>
                          <Badge variant="secondary" className="text-xs">{guide.badge}</Badge>
                        </div>
                        <CardDescription className="text-xs leading-relaxed">{guide.description}</CardDescription>
                        <p className="text-[10px] text-primary/70 font-medium">{guide.detail}</p>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Things to ask ── */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            Things you can ask
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            SOHAM is a general assistant, so plain requests work. A few examples to try in chat:
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {askExamples.map((example) => (
            <Link key={example.title} href="/chat">
              <div className="flex items-start gap-3 rounded-xl border bg-card p-4 transition-all hover:border-primary/40 hover:bg-card/80 h-full">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <example.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{example.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{example.prompt}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Operations ── */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold">Setup & Reference</h2>
          <p className="text-sm text-muted-foreground mt-1">Quick start, commands, settings, security, and API docs.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {operationsGuides.map((guide) => (
            <Link key={guide.href} href={guide.href}>
              <Card className="h-full transition-all hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Sparkles className="h-4 w-4 text-primary" />
                    {guide.title}
                  </CardTitle>
                  <CardDescription className="text-xs leading-relaxed">{guide.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="rounded-2xl border bg-gradient-to-br from-primary/5 to-transparent p-6 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Ready to start?</h2>
            <p className="text-sm text-muted-foreground max-w-lg">
              Sign in with Google or email to start chatting. Your chat list and settings are saved in this browser,
              and SOHAM&apos;s server keeps a memory of your chats so it can pick up context later.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/chat">
              <Button className="gap-2">
                Open Chat
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/faq">
              <Button variant="outline" className="gap-2">
                <HelpCircle className="h-4 w-4" />
                FAQ
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
