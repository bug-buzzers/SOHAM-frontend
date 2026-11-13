import Link from 'next/link';
import type { MouseEvent } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Image as ImageIcon,
  KeyRound,
  Mic,
  Paperclip,
  Send,
  Smartphone,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SohamLogo } from '@/components/soham-logo';
import { formatList, type LandingModelStats } from '@/components/landing/landing-content';

/** Same accent wash as the AI Services hero, so the landing page matches the app. */
export const HERO_GRADIENT =
  'bg-[radial-gradient(circle_at_top_right,rgba(251,146,60,0.15),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.12),transparent_30%)]';

interface LandingHeroProps {
  modelStats: LandingModelStats;
  isSignedIn: boolean;
  onNavigate: (event: MouseEvent<HTMLAnchorElement>, href: string) => void;
}

export function LandingHero({ modelStats, isSignedIn, onNavigate }: LandingHeroProps) {
  const providerNames = formatList(modelStats.providers.map((provider) => provider.name));

  return (
    <section
      aria-labelledby="landing-hero-title"
      className="relative overflow-hidden rounded-3xl border bg-card p-6 shadow-sm sm:p-8 md:p-10 lg:p-12"
    >
      <div aria-hidden className={`pointer-events-none absolute inset-0 ${HERO_GRADIENT}`} />

      <div className="relative grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Adaptive AI workspace by CODEEX-AI
          </div>

          <div className="space-y-4">
            <h1
              id="landing-hero-title"
              className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl md:leading-[1.1]"
            >
              Ask anything. Pick a model, or let SOHAM choose.
            </h1>
            <p className="max-w-xl text-sm leading-6 text-muted-foreground md:text-base md:leading-7">
              SOHAM brings {modelStats.total} AI models from {providerNames} into one chat, with web
              search, image generation, voice, a PDF analyzer and an image math solver alongside.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button asChild size="lg">
              <Link href="/chat">
                {isSignedIn ? 'Open chat' : 'Start chatting'}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#features" onClick={(event) => onNavigate(event, '#features')}>
                Explore features
              </a>
            </Button>
          </div>

          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground sm:text-sm">
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Free to use
            </li>
            <li className="flex items-center gap-1.5">
              <KeyRound className="h-4 w-4 text-primary" />
              Sign in with Google or email
            </li>
            <li className="flex items-center gap-1.5">
              <Smartphone className="h-4 w-4 text-primary" />
              Installable on phone and desktop
            </li>
          </ul>
        </div>

        <ExampleChatPreview />
      </div>
    </section>
  );
}

/**
 * A static, clearly labelled illustration that reuses the chat workspace's
 * bubble, attribution chip and composer styles. It is not a live response.
 */
function ExampleChatPreview() {
  return (
    <figure className="relative mx-auto w-full max-w-lg lg:max-w-none">
      <div aria-hidden className="pointer-events-none absolute inset-8 rounded-full bg-primary/15 blur-[80px]" />

      <div className="relative overflow-hidden rounded-3xl border bg-background shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <SohamLogo size={26} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">Solve a quadratic</p>
              <p className="truncate text-[11px] text-muted-foreground">Model: Auto (Smart Routing)</p>
            </div>
          </div>
          <Badge
            variant="outline"
            className="shrink-0 rounded-full text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Example
          </Badge>
        </div>

        <div className="space-y-4 px-4 py-5">
          <div className="flex justify-end">
            <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground shadow-sm">
              <span className="font-mono">/solve</span> 2x² − 8x + 6 = 0
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-background ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
              <SohamLogo size={22} />
            </span>
            <div className="min-w-0 flex-1 space-y-2">
              <div className="space-y-1.5 rounded-2xl rounded-tl-sm bg-muted px-4 py-3 text-sm leading-6 text-foreground shadow-sm">
                <p>Divide every term by 2:</p>
                <p className="font-mono text-[13px]">x² − 4x + 3 = 0</p>
                <p>Factor the left side:</p>
                <p className="font-mono text-[13px]">(x − 1)(x − 3) = 0</p>
                <p>
                  So <strong>x = 1</strong> or <strong>x = 3</strong>.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="flex items-center gap-1.5 rounded-md border border-border/50 bg-background/50 px-2 py-1">
                  <Sparkles className="h-3.5 w-3.5 text-blue-500" />
                  <span className="font-medium text-foreground">Gemini 3.6 Flash</span>
                </span>
                <span className="flex items-center gap-1 rounded-md border border-primary/20 bg-primary/10 px-2 py-1">
                  <Zap className="h-3 w-3 text-primary" />
                  <span className="font-medium text-primary">Auto-routed</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t bg-card/60 p-3" aria-hidden>
          <div className="flex items-center gap-1 rounded-3xl border bg-background py-1.5 pl-4 pr-1.5 shadow-sm">
            <span className="flex-1 truncate text-sm text-muted-foreground">Ask me anything...</span>
            <span className="hidden h-8 w-8 items-center justify-center rounded-xl text-muted-foreground sm:flex">
              <ImageIcon className="h-4 w-4" />
            </span>
            <span className="hidden h-8 w-8 items-center justify-center rounded-xl text-muted-foreground sm:flex">
              <Paperclip className="h-4 w-4" />
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground">
              <Mic className="h-4 w-4" />
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Send className="h-4 w-4" />
            </span>
          </div>
        </div>
      </div>

      <figcaption className="mt-3 text-center text-xs text-muted-foreground">
        Illustration only. Real replies and the model chosen depend on your question.
      </figcaption>
    </figure>
  );
}
