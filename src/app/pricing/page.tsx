import Link from 'next/link';
import { ArrowRight, CheckCircle2, Info } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getEnabledModels, groupModels } from '@/lib/model-catalog';

// Counts come from models-config.json, the same list the chat model selector shows.
const models = getEnabledModels();
const providerCount = groupModels(models, 'provider').length;

const included = [
  `Chat with ${models.length} models from ${providerCount} providers, or let Auto mode choose`,
  'Web search with /search and live data sources',
  'Image generation in chat',
  'Voice input and read-aloud replies',
  'PDF Analyzer for files up to 5 MB',
  'Visual Math: solve an equation from a photo',
  'Chat history saved in your browser, with JSON export',
  'Installable on phone and desktop (PWA)',
];

const goodToKnow = [
  'A free account is required to chat (Google, or email and password).',
  'Rate limits apply, for example 30 chat requests per minute.',
  'SOHAM relies on third-party AI providers, so a model can be temporarily unavailable when its provider is busy or out of quota.',
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageHeader backLink="/" backText="Back to Home" title="Pricing" />
      <main className="container mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12">
        <div className="space-y-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Pricing</p>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">SOHAM is free to use</h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            There are no paid plans, subscriptions or credits today. Everything below is included with a
            free account.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <Card className="flex flex-col rounded-3xl border-primary/40 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Free</CardTitle>
              <CardDescription>Everything SOHAM offers today.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3 text-sm">
                {included.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild size="lg" className="w-full justify-between">
                <Link href="/chat">
                  Start chatting
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="flex flex-col rounded-3xl border-border/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Info className="h-5 w-5 text-primary" />
                Good to know
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3 text-sm text-muted-foreground">
                {goodToKnow.map((item) => (
                  <li key={item} className="leading-6">
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href="/faq">Read the FAQ</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
