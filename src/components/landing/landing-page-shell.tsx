'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState, type MouseEvent, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  BookOpen,
  FileText,
  Globe,
  HardDrive,
  History,
  Image as ImageIcon,
  KeyRound,
  LogIn,
  Mail,
  MessageSquare,
  Mic,
  ScanLine,
  Server,
  Shuffle,
  SquareSlash,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SohamLogo } from '@/components/soham-logo';
import { LandingFooter } from '@/components/landing/landing-footer';
import { LandingHeader } from '@/components/landing/landing-header';
import { HERO_GRADIENT, LandingHero } from '@/components/landing/landing-hero';
import type { LandingFaq, LandingModelStats } from '@/components/landing/landing-content';
import { useAuth } from '@/hooks/use-auth';
import { idbGet, idbSet } from '@/lib/indexed-db';
import { cn } from '@/lib/utils';

// ─── Content ──────────────────────────────────────────────────────────────────
// Only describe behaviour that exists in this codebase. No usage numbers,
// ratings, uptime, comparisons or "forever" promises.

/** Slash commands the backend recognises (SOHAM-backend tools/agent-tools.ts). */
const SLASH_COMMANDS = [
  '/weather',
  '/news',
  '/sports',
  '/finance',
  '/search',
  '/translate',
  '/define',
  '/grammar',
  '/factcheck',
  '/quiz',
  '/recipe',
  '/joke',
  '/sentiment',
];

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  /** Something the user could actually type, shown as a hint. */
  example?: string;
  /** Short labels shown instead of an example. */
  tags?: string[];
}

const FEATURES: Feature[] = [
  {
    icon: MessageSquare,
    title: 'Streaming chat',
    description:
      'Replies appear as they are written, and every answer is labelled with the model that produced it.',
    example: 'Explain recursion with an example',
  },
  {
    icon: Shuffle,
    title: 'Auto mode or your pick',
    description:
      'Leave the selector on Auto (Smart Routing) and SOHAM chooses a model for each request, or pin the one you prefer.',
    tags: ['Auto (Smart Routing)', 'Manual choice'],
  },
  {
    icon: Globe,
    title: 'Web search',
    description:
      'Start with /search, or ask about something recent, and SOHAM can look it up on the web before answering.',
    example: '/search latest ISRO launch',
  },
  {
    icon: ImageIcon,
    title: 'Image generation',
    description:
      'Describe a picture in plain words. The image appears in the chat, ready to preview or download.',
    example: 'Create an image of a lighthouse',
  },
  {
    icon: Mic,
    title: 'Voice in and out',
    description:
      'Talk with voice chat in browsers that support speech recognition, and have any reply read aloud by your browser\'s built-in voices.',
    tags: ['Voice chat', 'Read aloud'],
  },
  {
    icon: SquareSlash,
    title: 'Slash commands',
    description:
      'Start a message with a command to go straight to a tool, for example /weather Mumbai. Plain questions work too.',
    tags: SLASH_COMMANDS,
  },
];

const TOOLS = [
  {
    icon: FileText,
    title: 'PDF Analyzer',
    description: 'Upload a PDF and ask questions about what it says.',
    href: '/pdf-analyzer',
    cta: 'Analyze a PDF',
  },
  {
    icon: ScanLine,
    title: 'Visual Math',
    description: 'Upload a photo of an equation to see it recognised and solved step by step.',
    href: '/visual-math',
    cta: 'Solve from an image',
  },
];

const STEPS = [
  {
    icon: LogIn,
    title: 'Sign in',
    description:
      'Continue with Google or use an email and password. An account is required to chat, and sign-in is handled by Firebase Authentication.',
  },
  {
    icon: MessageSquare,
    title: 'Ask your way',
    description:
      'Type, speak or upload. Start with a slash command such as /search, /weather or /translate when you want a specific tool, and leave the model on Auto or choose one.',
  },
  {
    icon: History,
    title: 'Keep your chats',
    description:
      'Replies stream in with the model name attached. Your chat list is kept in this browser, where you can rename, export or delete any chat.',
  },
];

const DATA_POINTS = [
  {
    icon: HardDrive,
    title: 'In your browser',
    description:
      "Your chat list lives in this browser's IndexedDB storage and isn't synced to other devices. Deleting a chat removes it from this browser.",
  },
  {
    icon: Server,
    title: 'Sent to answer you',
    description:
      "Each message and its recent context go to SOHAM's servers and to the AI provider that writes the reply. Search, image and voice requests go to the services that handle them.",
  },
  {
    icon: KeyRound,
    title: 'Saved with your account',
    description:
      "Sign-in uses Firebase Authentication. SOHAM's server also saves your messages, and facts it picks up from them such as your name or interests, to give later answers context. The privacy policy explains what is kept and how to ask for deletion.",
  },
];

// ─── Building blocks ──────────────────────────────────────────────────────────

function IconTile({ icon: Icon, className }: { icon: LucideIcon; className?: string }) {
  return (
    <div
      className={cn(
        'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary',
        className
      )}
    >
      <Icon className="h-5 w-5" />
    </div>
  );
}

function SectionHeading({
  id,
  eyebrow,
  title,
  description,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description?: ReactNode;
}) {
  return (
    <div className="max-w-2xl space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-primary">{eyebrow}</p>
      <h2 id={`${id}-title`} className="text-2xl font-bold tracking-tight md:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="text-sm leading-6 text-muted-foreground md:text-base md:leading-7">{description}</p>
      ) : null}
    </div>
  );
}

function Section({
  id,
  eyebrow,
  title,
  description,
  muted = false,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description?: ReactNode;
  muted?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn('scroll-mt-16 py-14 md:py-20', muted && 'border-y border-border/60 bg-muted/30')}
    >
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <SectionHeading id={id} eyebrow={eyebrow} title={title} description={description} />
        <div className="mt-8 md:mt-10">{children}</div>
      </div>
    </section>
  );
}

// ─── Sections ─────────────────────────────────────────────────────────────────

function FactsStrip({ modelStats }: { modelStats: LandingModelStats }) {
  const facts = [
    { value: modelStats.total, label: 'AI models', detail: 'in the chat model selector' },
    { value: modelStats.providers.length, label: 'providers', detail: 'from Groq to OpenRouter' },
    { value: SLASH_COMMANDS.length, label: 'slash commands', detail: '/weather, /news, /define and more' },
  ];

  return (
    <ul aria-label="SOHAM at a glance" className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3 md:mt-5 md:gap-4">
      {facts.map((fact) => (
        <li key={fact.label} className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm md:p-5">
          <p className="text-2xl font-bold tracking-tight md:text-3xl">{fact.value}</p>
          <p className="mt-1 text-sm font-medium">{fact.label}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{fact.detail}</p>
        </li>
      ))}
    </ul>
  );
}

function FeaturesSection() {
  return (
    <Section
      id="features"
      eyebrow="Features"
      title="Everything happens in one chat"
      description="The same workspace you get after signing in: chat, search, images and voice, without switching apps."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-5">
        {FEATURES.map((feature) => (
          <Card
            key={feature.title}
            className="flex flex-col rounded-3xl border-border/70 transition-colors hover:border-primary/40"
          >
            <CardHeader className="space-y-4">
              <IconTile icon={feature.icon} />
              <div className="space-y-2">
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription className="leading-6">{feature.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="mt-auto">
              {feature.example ? (
                <p className="truncate rounded-xl border border-border/60 bg-background/60 px-3 py-2 font-mono text-xs text-muted-foreground">
                  {feature.example}
                </p>
              ) : (
                <ul className="flex flex-wrap gap-2">
                  {feature.tags?.map((tag) => (
                    <li
                      key={tag}
                      className={cn(
                        'rounded-md border border-border/50 bg-background/50 px-2 py-1 text-xs font-medium',
                        tag.startsWith('/') && 'font-mono'
                      )}
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function ToolsSection() {
  return (
    <Section
      id="tools"
      eyebrow="Workspace tools"
      title="Focused tools beside the chat"
      description="These live under Workspace in the chat sidebar. The PDF Analyzer and Visual Math open after you sign in."
    >
      <div className="grid gap-5 md:grid-cols-2">
        {TOOLS.map((tool) => (
          <Card key={tool.href} className="flex flex-col rounded-3xl border-border/70">
            <CardHeader className="space-y-4">
              <IconTile icon={tool.icon} />
              <div className="space-y-2">
                <CardTitle className="text-lg">{tool.title}</CardTitle>
                <CardDescription className="leading-6">{tool.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="mt-auto">
              <Button asChild variant="outline" className="w-full justify-between">
                <Link href={tool.href}>
                  {tool.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function ModelsSection({ modelStats }: { modelStats: LandingModelStats }) {
  return (
    <Section
      id="models"
      muted
      eyebrow="Models"
      title={`${modelStats.total} models from ${modelStats.providers.length} providers`}
      description="Every model below is listed in the chat's model selector. Pick one for a conversation or stay on Auto. Availability depends on each provider, so a model can occasionally be busy or rate-limited."
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-5">
        {modelStats.providers.map((provider) => (
          <Card key={provider.id} className="rounded-3xl border-border/70">
            <CardHeader className="flex-row items-center justify-between gap-3 space-y-0 pb-4">
              <CardTitle className="text-lg">{provider.name}</CardTitle>
              <Badge variant="secondary" className="shrink-0 rounded-full">
                {provider.models.length} {provider.models.length === 1 ? 'model' : 'models'}
              </Badge>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-wrap gap-2">
                {provider.models.map((model) => (
                  <li
                    key={model}
                    className="rounded-md border border-border/50 bg-background/50 px-2 py-1 text-xs font-medium"
                  >
                    {model}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}

        <Card className="rounded-3xl border-primary/30 bg-primary/5">
          <CardHeader className="space-y-4">
            <IconTile icon={Zap} />
            <div className="space-y-2">
              <CardTitle className="text-lg">Auto (Smart Routing)</CardTitle>
              <CardDescription className="leading-6">
                Not sure which model to use? Auto chooses one for each request, and the chip under the
                reply shows which model answered.
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
      </div>
    </Section>
  );
}

function HowItWorksSection() {
  return (
    <Section
      id="how-it-works"
      eyebrow="How it works"
      title="Three steps to your first answer"
    >
      <ol className="grid gap-4 md:grid-cols-3 md:gap-5">
        {STEPS.map((step, index) => (
          <li key={step.title}>
            <Card className="h-full rounded-3xl border-border/70">
              <CardHeader className="space-y-4">
                <div className="flex items-center justify-between">
                  <IconTile icon={step.icon} />
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Step {index + 1}
                  </span>
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                  <CardDescription className="leading-6">{step.description}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          </li>
        ))}
      </ol>
    </Section>
  );
}

function YourDataSection() {
  return (
    <Section
      id="your-data"
      muted
      eyebrow="Your data"
      title="What happens to your data"
      description="A plain summary of where your information goes when you use SOHAM."
    >
      <div className="grid gap-4 md:grid-cols-3 md:gap-5">
        {DATA_POINTS.map((point) => (
          <Card key={point.title} className="rounded-3xl border-border/70">
            <CardHeader className="space-y-4">
              <IconTile icon={point.icon} />
              <div className="space-y-2">
                <CardTitle className="text-lg">{point.title}</CardTitle>
                <CardDescription className="leading-6">{point.description}</CardDescription>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
      <div className="mt-6">
        <Button asChild variant="outline">
          <Link href="/privacy">
            Read the privacy policy
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </Section>
  );
}

function AboutSection() {
  return (
    <section id="about" aria-labelledby="about-title" className="scroll-mt-16 py-14 md:py-20">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <Card className="overflow-hidden rounded-3xl border-border/70">
          <div className="grid md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div className="relative flex flex-col items-center justify-center gap-4 border-b border-border/70 bg-muted/30 p-8 text-center md:border-b-0 md:border-r md:p-10">
              <div className="relative">
                <div aria-hidden className="absolute inset-0 rounded-full bg-primary/15 blur-2xl" />
                <SohamLogo size={64} className="relative" />
              </div>
              <p lang="sa" className="text-3xl font-semibold tracking-tight">
                सोऽहम्
              </p>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/80">
                “I am That”
              </p>
            </div>

            <div className="space-y-4 p-6 md:p-10">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">Who builds it</p>
              <h2 id="about-title" className="text-2xl font-bold tracking-tight md:text-3xl">
                Made in Bharat by CODEEX-AI
              </h2>
              <p className="text-sm leading-6 text-muted-foreground md:text-base md:leading-7">
                SOHAM stands for Self Organising Hyper Adaptive Machine and takes its name from the
                Sanskrit mantra Soham, “I am That.” It is built by Heoster (Harsh), founder of
                CODEEX-AI, in Khatauli, Uttar Pradesh. CODEEX-AI was founded in 2024.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button asChild variant="outline">
                  <Link href="/about">About SOHAM</Link>
                </Button>
                <Button asChild variant="ghost">
                  <Link href="/contact">
                    <Mail className="h-4 w-4" />
                    Contact
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}

function FaqSection({ faqs }: { faqs: LandingFaq[] }) {
  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="scroll-mt-16 border-y border-border/60 bg-muted/30 py-14 md:py-20"
    >
      <div className="container mx-auto grid max-w-6xl gap-8 px-4 md:px-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-12">
        <div className="space-y-6">
          <SectionHeading
            id="faq"
            eyebrow="FAQ"
            title="Common questions"
            description="Short answers about cost, accounts, models and your data."
          />
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href="/documentation">
                <BookOpen className="h-4 w-4" />
                Read the docs
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/contact">
                <Mail className="h-4 w-4" />
                Ask us
              </Link>
            </Button>
          </div>
        </div>

        <Card className="rounded-3xl border-border/70 px-5 py-1 md:px-6">
          <Accordion type="single" collapsible defaultValue="faq-0">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={faq.question}
                value={`faq-${index}`}
                className={cn(index === faqs.length - 1 && 'border-b-0')}
              >
                <AccordionTrigger className="gap-4 text-left text-sm font-semibold hover:no-underline md:text-base">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="leading-6 text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>
      </div>
    </section>
  );
}

function FinalCta({ isSignedIn }: { isSignedIn: boolean }) {
  return (
    <section aria-labelledby="cta-title" className="py-14 md:py-20">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <div className="relative overflow-hidden rounded-3xl border bg-card px-6 py-12 text-center shadow-sm md:px-12 md:py-16">
          <div aria-hidden className={`pointer-events-none absolute inset-0 ${HERO_GRADIENT}`} />
          <div className="relative mx-auto flex max-w-xl flex-col items-center gap-5">
            <div className="relative">
              <div aria-hidden className="absolute inset-0 rounded-full bg-primary/15 blur-2xl" />
              <SohamLogo size={56} className="relative" />
            </div>
            <h2 id="cta-title" className="text-2xl font-bold tracking-tight md:text-4xl">
              {isSignedIn ? 'Pick up where you left off' : 'Start your first chat'}
            </h2>
            <p className="text-sm leading-6 text-muted-foreground md:text-base">
              {isSignedIn
                ? 'Your chats are saved in this browser and ready when you are.'
                : 'Sign in with Google or email and ask anything. SOHAM is free to use.'}
            </p>
            <div className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
              <Button asChild size="lg">
                <Link href="/chat">
                  {isSignedIn ? 'Open chat' : 'Start chatting'}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/documentation/quick-start">Quick start guide</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Shell ────────────────────────────────────────────────────────────────────

interface LandingPageShellProps {
  modelStats: LandingModelStats;
  faqs: LandingFaq[];
}

export function LandingPageShell({ modelStats, faqs }: LandingPageShellProps) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const isSignedIn = Boolean(user);

  // Installed PWA opens straight into the app; returning signed-in visitors go to chat.
  useEffect(() => {
    if (typeof window === 'undefined' || loading) return;
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    if (isStandalone) {
      router.push(user ? '/chat' : '/login');
      return;
    }
    idbGet<string>('hasVisitedBefore').then((visited) => {
      if (user && visited) router.push('/chat');
      else if (!visited) idbSet('hasVisitedBefore', 'true');
    });
  }, [user, loading, router]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Escape closes the mobile nav (the Sheet also handles this while focused).
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileNavOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleNavigate = useCallback(
    (event: MouseEvent<HTMLAnchorElement>, href: string) => {
      if (!href.startsWith('#')) {
        setMobileNavOpen(false);
        return;
      }
      const target = document.getElementById(href.slice(1));
      if (!target) return;

      event.preventDefault();
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const scrollToTarget = () => {
        target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
        window.history.replaceState(null, '', href);
      };

      if (mobileNavOpen) {
        // Let the sheet close and release its scroll lock before scrolling.
        setMobileNavOpen(false);
        window.setTimeout(scrollToTarget, 320);
      } else {
        scrollToTarget();
      }
    },
    [mobileNavOpen]
  );

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[60] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
      >
        Skip to content
      </a>

      <LandingHeader
        isScrolled={isScrolled}
        isSignedIn={isSignedIn}
        authResolved={!loading}
        mobileNavOpen={mobileNavOpen}
        onMobileNavOpenChange={setMobileNavOpen}
        onNavigate={handleNavigate}
      />

      <main id="main-content">
        <div className="container mx-auto max-w-6xl px-4 pt-6 md:px-6 md:pt-10">
          <LandingHero modelStats={modelStats} isSignedIn={isSignedIn} onNavigate={handleNavigate} />
          <FactsStrip modelStats={modelStats} />
        </div>

        <FeaturesSection />
        <ToolsSection />
        <ModelsSection modelStats={modelStats} />
        <HowItWorksSection />
        <YourDataSection />
        <AboutSection />
        <FaqSection faqs={faqs} />
        <FinalCta isSignedIn={isSignedIn} />
      </main>

      <LandingFooter />
    </div>
  );
}
