import { Metadata } from 'next';
import Link from 'next/link';
import { structuredData, pageSEO } from '@/lib/seo-config';
import { DEVELOPER_INFO } from '@/lib/developer-info';
import { formatProviderList, getEnabledModels, groupModels } from '@/lib/model-catalog';
import { PageHeader } from '@/components/page-header';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  HelpCircle,
  Cpu,
  MessageSquare,
  Settings,
  Shield,
  Smartphone,
  Zap,
  ArrowRight,
  Users,
  BookOpen,
  Search,
  Code2,
  Globe,
  Lock,
  Mic,
  Image as ImageIcon,
  FileText,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'FAQ — Frequently Asked Questions | SOHAM by CODEEX-AI',
  description:
    'Find answers to the most common questions about SOHAM: free AI models, features, voice, PDF analysis, image generation, privacy, mobile PWA, and troubleshooting.',
  keywords: [
    'SOHAM FAQ',
    'SOHAM frequently asked questions',
    'CODEEX-AI FAQ',
    'AI chatbot FAQ',
    'free AI FAQ',
    'SOHAM help',
    'SOHAM support',
    'AI models questions',
    'how to use SOHAM',
    'SOHAM troubleshooting',
    'SOHAM voice',
    'SOHAM PDF',
    'SOHAM image generation',
    'SOHAM privacy',
    'SOHAM PWA',
  ],
  alternates: { canonical: 'https://soham-ai.vercel.app/faq' },
  openGraph: {
    title: 'FAQ | SOHAM by CODEEX-AI',
    description: 'Answers to the most common questions about SOHAM — free AI, models, features, and troubleshooting.',
    url: 'https://soham-ai.vercel.app/faq',
    type: 'website',
    siteName: 'SOHAM',
    images: [{ url: 'https://soham-ai.vercel.app/Multi-Chat.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FAQ | SOHAM by CODEEX-AI',
    description: 'Answers to the most common questions about SOHAM.',
  },
};

// ── FAQ data ──────────────────────────────────────────────────────────────────

// Counts come from models-config.json, the same list the chat model selector shows.
const ENABLED_MODELS = getEnabledModels();
const MODEL_COUNT = ENABLED_MODELS.length;
const PROVIDERS = formatProviderList(ENABLED_MODELS);
const MODEL_NAMES = ENABLED_MODELS.map((model) => model.shortName).join(', ');
const CONTACT_EMAIL = DEVELOPER_INFO.contact.email;
const PROVIDER_COUNT = groupModels(ENABLED_MODELS, 'provider').length;

const sections = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: Zap,
    color: 'text-yellow-500',
    bg: 'bg-yellow-500/10',
    questions: [
      {
        q: 'What is SOHAM?',
        a: `SOHAM (Self Organising Hyper Adaptive Machine) is a multi-model AI assistant built by Heoster at CODEEX-AI. It brings AI models from ${PROVIDERS} into one interface, with Auto mode, voice features, PDF analysis, image generation and web search. The name is also inspired by the Sanskrit mantra Soham (So Hum), meaning "I am That".`,
      },
      {
        q: 'Is SOHAM completely free?',
        a: `Yes. There is nothing to pay for in SOHAM today: no subscriptions, no credits and no credit card. SOHAM relies on third-party AI providers, so usage limits apply (chat is currently limited to 30 requests per minute), and a model can be temporarily unavailable when its provider is busy.`,
      },
      {
        q: 'Do I need to create an account?',
        a: `Yes. You need to sign in to chat, either with Google or with an email address and password (handled by Firebase Authentication). Creating an account is free. Your chat list and settings are saved in the browser you use and aren't synced between devices, while SOHAM's server also saves your messages with your account (see the Privacy Policy).`,
      },
      {
        q: 'What can I ask SOHAM?',
        a: `Anything: coding help, maths problems, general knowledge, homework, document analysis, image generation, web searches, creative writing, debugging, translations, summaries and more. In Auto mode SOHAM also chooses a model for each request.`,
      },
      {
        q: 'What does "SOHAM" mean?',
        a: 'SOHAM has two meanings. In the product, it stands for "Self Organising Hyper Adaptive Machine." The name is also inspired by the Sanskrit mantra Soham (So Hum), meaning "I am That" — representing unity of individual self with universal consciousness. Heoster chose this name to give the product both technical identity and human depth.',
      },
      {
        q: 'Who built SOHAM?',
        a: `SOHAM was built by Heoster (Harsh), a ${DEVELOPER_INFO.age}-year-old developer from ${DEVELOPER_INFO.location.city}, India. He founded CODEEX-AI in ${DEVELOPER_INFO.company.founded} and built SOHAM as the flagship product. You can learn more on the About page.`,
      },
    ],
  },
  {
    id: 'ai-models',
    title: 'AI Models & Selection',
    icon: Cpu,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    questions: [
      {
        q: 'How many AI models are available?',
        a: `The model selector currently lists ${MODEL_COUNT} models from ${PROVIDERS}: ${MODEL_NAMES}. The Groq models answer only while Groq is switched on for SOHAM; otherwise another model replies. The Models page lists all of them.`,
      },
      {
        q: 'What is Auto mode?',
        a: `Auto mode (Auto (Smart Routing) in the model selector) lets SOHAM choose a model for each request based on what you ask. Each reply shows which model answered, and you can switch to a specific model at any time. It's a good default for most people.`,
      },
      {
        q: 'Which models are completely free with no limits?',
        a: `None are unlimited. SOHAM applies rate limits (for example, 30 chat requests per minute), and each AI provider has its own quotas. SOHAM uses providers' free tiers, so a model can be temporarily unavailable when its quota runs out.`,
      },
      {
        q: 'Which model is fastest?',
        a: `Gemini 3.5 Flash-Lite and Gemini 3.1 Flash-Lite are built for quick, low-latency answers. GPT-OSS 20B on Groq is also fast when Groq is available. Use them when speed matters more than depth.`,
      },
      {
        q: 'Which model is best for coding?',
        a: `Try GPT-OSS 120B or Qwen 3.8 27B on Groq, or Gemini 3.6 Flash. In Auto mode, coding questions go to GPT-OSS 120B first and to other models if it isn't available.`,
      },
      {
        q: 'Which model is best for long documents?',
        a: `The Gemini models have the largest context window in SOHAM (about 1 million tokens), so they suit long documents and multi-step tasks.`,
      },
      {
        q: 'Can I switch models mid-conversation?',
        a: 'Yes. Open the model selector in the top bar and switch at any time. The conversation history is preserved and passed to the new model.',
      },
    ],
  },
  {
    id: 'features',
    title: 'Features & Commands',
    icon: MessageSquare,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    questions: [
      {
        q: 'What are slash commands?',
        a: `Slash commands are shortcuts at the start of a message: /solve for step-by-step answers to maths and coding problems, /search to look something up on the web, and /summarize to condense long text. You can also just ask naturally.`,
      },
      {
        q: 'Does web search trigger automatically?',
        a: `It can. When a message looks like it needs current information (words like "today", "latest" or "news"), SOHAM may search the web before answering. Start your message with /search to make sure it does.`,
      },
      {
        q: 'How does voice input work?',
        a: `Use the microphone button for voice chat. It relies on your browser's speech recognition (best supported in Chrome and Edge) and listens in US English until you click the microphone again. Check the text before you send it.`,
      },
      {
        q: 'How does text-to-speech work?',
        a: 'Turn on speech output in settings, or click the speaker icon on any assistant message to hear it read aloud. Replies are read by your browser\'s built-in voices; a voice preset applies only if your browser has a voice with that name.',
      },
      {
        q: 'How does image generation work?',
        a: `Ask for an image in chat, for example "generate an image of a lighthouse at dawn". SOHAM creates it with the FLUX model on Pollinations.ai and shows it in the chat with preview and download options. Generated images are saved at a public link. Rate limits apply.`,
      },
      {
        q: 'How does PDF analysis work?',
        a: `Open the PDF Analyzer (also listed under AI Services). Upload a PDF up to 5 MB and ask a question about it, such as a summary or the key points. Useful for research papers, reports and notes.`,
      },
      {
        q: 'Does SOHAM remember our conversation?',
        a: `Within a chat, yes. Recent messages are sent along with each new one, so you can refer back naturally: "explain that differently" or "give me another example". SOHAM's server also saves your messages and facts it picks up from them, such as your name or interests, and can use them as context in later chats. The Privacy Policy explains this and how to ask for deletion.`,
      },
      {
        q: 'Can I export my conversations?',
        a: 'Yes. Use the export button in the chat sidebar to download conversations as JSON. You can also copy individual messages or use the share feature.',
      },
    ],
  },
  {
    id: 'technical',
    title: 'Technical Issues & Troubleshooting',
    icon: Settings,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
    questions: [
      {
        q: "The AI isn't responding or is very slow",
        a: 'Try: (1) Refresh the page. (2) Check your internet connection. (3) Switch to a different model — free models can be slower at busy times. (4) Leave the model on Auto so SOHAM can try another model if one fails. (5) Clear your browser cache if the issue persists.',
      },
      {
        q: "Voice input isn't working",
        a: 'Check that your browser has microphone permissions (click the lock icon in the address bar). Make sure your microphone works in other apps. Voice input requires HTTPS. Try Chrome or Edge for best compatibility. Disable browser extensions that might block microphone access.',
      },
      {
        q: "I can't install the mobile app",
        a: 'Android: Use Chrome, visit the site, tap the menu (⋮), and select "Add to Home screen." iOS: Use Safari only (not Chrome), tap the share button (□↑), then "Add to Home Screen." Make sure you\'re on the latest browser version.',
      },
      {
        q: "My settings aren't saving",
        a: "Settings are stored in your browser's storage (IndexedDB). Make sure cookies and local storage are enabled. Settings won't persist in private/incognito mode. Try clearing browser cache and reconfiguring.",
      },
      {
        q: 'The AI gave an incorrect answer',
        a: 'Try: (1) Rephrase with more specific details. (2) Use /solve for math/coding, /search for current info. (3) Switch to a different model manually. (4) For current events, start your message with /search so SOHAM looks it up first. (5) Ask the AI to "try again" or "reconsider."',
      },
      {
        q: 'Image generation failed',
        a: 'The image service may be busy, or you may have reached the rate limit. Wait a minute and try again. Keep the prompt clear and descriptive, simplify it if it is very complex, and avoid prompts for violent or explicit content.',
      },
      {
        q: 'The page is loading slowly',
        a: 'SOHAM is a PWA — after the first load, it caches resources for faster subsequent loads. If it\'s consistently slow, try: clearing cache, disabling browser extensions, or switching to a faster network.',
      },
    ],
  },
  {
    id: 'mobile',
    title: 'Mobile & PWA',
    icon: Smartphone,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    questions: [
      {
        q: 'How do I install SOHAM on my phone?',
        a: 'SOHAM is a Progressive Web App (PWA). Android: Open in Chrome → menu (⋮) → "Add to Home screen." iOS: Open in Safari → share button (□↑) → "Add to Home Screen." The app will work like a native app with its own icon.',
      },
      {
        q: 'Does the installed app work offline?',
        a: `Partly. The chat screen is cached, so the installed app can open without internet and chats saved in your browser stay on your device. Getting new AI responses always needs a connection.`,
      },
      {
        q: 'Why install instead of using the browser?',
        a: 'The installed PWA gives you: full-screen experience without browser UI, faster loading with cached resources, home screen icon for quick access, and better integration with your device\'s app switcher.',
      },
      {
        q: 'Is there a native Android or iOS app?',
        a: `Not at the moment. The installable web app (PWA) works on both Android and iOS.`,
      },
    ],
  },
  {
    id: 'privacy',
    title: 'Privacy & Security',
    icon: Shield,
    color: 'text-red-500',
    bg: 'bg-red-500/10',
    questions: [
      {
        q: 'Is my data safe?',
        a: `Your messages and their recent context are sent over HTTPS to SOHAM's servers and to the AI provider that writes the reply. Your chat list is saved in your browser (IndexedDB), and SOHAM's server also saves your messages, facts picked up from them and a profile built from those facts. No system is perfectly secure, so don't share passwords or very sensitive details in chat. The Privacy Policy explains what is collected, where it is stored and how long it is kept.`,
      },
      {
        q: 'Do you use my conversations to train AI models?',
        a: `SOHAM doesn't train AI models on your conversations. Your messages are sent to third-party AI providers (${PROVIDERS}) to generate replies, and each provider's own terms apply to that data. SOHAM also saves some questions and answers, without your user ID, to a shared knowledge base that can help answer other users.`,
      },
      {
        q: 'Can I delete my conversation history?',
        a: `Yes. Delete individual chats from the chat sidebar, or clear this site's data in your browser, to remove the chats stored on that device. To delete the copies saved on SOHAM's server (chat history, memories and profile), email ${CONTACT_EMAIL} from the address on your account.`,
      },
      {
        q: 'What are my privacy rights?',
        a: `The Privacy Policy explains what SOHAM collects, how it is used and how to ask for access or deletion, including the additional rights of users in the European Economic Area under GDPR.`,
      },
      {
        q: 'What data does SOHAM collect?',
        a: `Your account details (such as email and display name) for sign-in; the messages you send, which go to SOHAM's servers and AI providers and are saved with your account along with facts picked up from them; images and PDFs you upload; anything you post on the community board; and usage analytics such as page views via Google Analytics. The Privacy Policy has the full list.`,
      },
    ],
  },
  {
    id: 'community',
    title: 'Feedback & Contributions',
    icon: Users,
    color: 'text-pink-500',
    bg: 'bg-pink-500/10',
    questions: [
      {
        q: 'How can I contribute to SOHAM?',
        a: 'Visit our GitHub repository to open issues, suggest features, or submit pull requests. Community feedback directly shapes the product roadmap.',
      },
      {
        q: 'How can I report a bug?',
        a: 'Use the contact form at /contact, email us directly, or open a GitHub issue. Include: what you were doing, what happened, what you expected, your browser and OS, and any error messages.',
      },
      {
        q: 'Can I suggest new AI models to add?',
        a: 'Absolutely. Use the contact form or GitHub issues to suggest models. We evaluate new models based on quality, availability, cost, and user demand.',
      },
    ],
  },
];

export default function FAQPage() {
  const totalQuestions = sections.reduce((sum, s) => sum + s.questions.length, 0);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageHeader backLink="/" backText="Back to Home" title="FAQ" />

      {/* JSON-LD: FAQPage structured data for Google rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            name: 'SOHAM FAQ — Frequently Asked Questions',
            url: 'https://soham-ai.vercel.app/faq',
            description: 'Answers to the most common questions about SOHAM by CODEEX-AI.',
            mainEntity: sections.flatMap((s) =>
              s.questions.map((faq) => ({
                '@type': 'Question',
                name: faq.q,
                acceptedAnswer: { '@type': 'Answer', text: faq.a },
              }))
            ),
          }),
        }}
      />

      {/* Breadcrumb JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://soham-ai.vercel.app' },
              { '@type': 'ListItem', position: 2, name: 'FAQ', item: 'https://soham-ai.vercel.app/faq' },
            ],
          }),
        }}
      />

      <main className="container mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-12 space-y-10">

        {/* ── Hero ── */}
        <section className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-2 text-sm">
            <HelpCircle className="h-4 w-4 text-primary" />
            <span className="font-medium">Frequently Asked Questions</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Everything you need to know about{' '}
            <span className="text-primary">SOHAM</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            {totalQuestions} answers across {sections.length} categories — from getting started to advanced
            troubleshooting. Can&apos;t find what you need?{' '}
            <Link href="/contact" className="text-primary hover:underline font-medium">
              Contact us
            </Link>
            .
          </p>
        </section>

        {/* ── Quick nav ── */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Search className="h-4 w-4 text-primary" />
              Jump to a Section
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {sections.map((s) => (
                <a key={s.id} href={`#${s.id}`} className="group block">
                  <div className="flex items-center gap-2.5 rounded-xl bg-background/60 p-3 transition-all hover:bg-background hover:border-primary/30 border border-transparent">
                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${s.bg}`}>
                      <s.icon className={`h-3.5 w-3.5 ${s.color}`} />
                    </div>
                    <div>
                      <span className="text-xs font-medium group-hover:text-primary transition-colors">{s.title}</span>
                      <p className="text-[10px] text-muted-foreground">{s.questions.length} questions</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ── Stats bar ── */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Total Questions', value: String(totalQuestions), icon: HelpCircle },
            { label: 'AI Models', value: String(MODEL_COUNT), icon: Cpu },
            { label: 'Providers', value: String(PROVIDER_COUNT), icon: Globe },
            { label: 'Slash Commands', value: '3', icon: Zap },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border bg-card p-4 text-center">
              <stat.icon className="h-4 w-4 text-primary mx-auto mb-1.5" />
              <p className="text-xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* ── FAQ Sections ── */}
        {sections.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-20 space-y-4">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${section.bg}`}>
                <section.icon className={`h-5 w-5 ${section.color}`} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{section.title}</h2>
                <p className="text-xs text-muted-foreground">{section.questions.length} questions</p>
              </div>
            </div>
            <Card>
              <CardContent className="p-0">
                <Accordion type="single" collapsible className="w-full">
                  {section.questions.map((faq, i) => (
                    <AccordionItem
                      key={i}
                      value={`${section.id}-${i}`}
                      className="px-6 last:border-0"
                    >
                      <AccordionTrigger className="text-left text-sm font-medium hover:text-primary transition-colors py-4">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </section>
        ))}

        {/* ── Feature quick links ── */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Explore SOHAM Features</h2>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {[
              { icon: MessageSquare, label: 'AI Chat', desc: `${MODEL_COUNT} models, Auto mode`, href: '/chat' },
              { icon: FileText, label: 'PDF Analyzer', desc: 'Upload & ask questions', href: '/pdf-analyzer' },
              { icon: ImageIcon, label: 'Image Solver', desc: 'Solve math from photos', href: '/visual-math' },
              { icon: Mic, label: 'Voice Input', desc: 'Speak to SOHAM', href: '/chat' },
              { icon: Globe, label: 'Web Search', desc: 'Real-time search results', href: '/chat' },
              { icon: Code2, label: 'Code Assistant', desc: 'Debug & write code', href: '/chat' },
            ].map((f) => (
              <Link key={f.label} href={f.href} className="group block">
                <div className="flex items-center gap-3 rounded-xl border bg-card p-4 transition-all hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-sm">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <f.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold group-hover:text-primary transition-colors">{f.label}</p>
                    <p className="text-xs text-muted-foreground">{f.desc}</p>
                  </div>
                  <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Still need help ── */}
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <CardTitle>Still Need Help?</CardTitle>
            <CardDescription>
              Can&apos;t find the answer? We respond to every message.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  Contact Support
                </h4>
                <p className="text-xs text-muted-foreground">Send a detailed message about your issue.</p>
                <Link href="/contact">
                  <Button variant="outline" size="sm" className="gap-2">
                    Contact Us
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  Documentation
                </h4>
                <p className="text-xs text-muted-foreground">Browse all guides and tutorials.</p>
                <Link href="/documentation">
                  <Button variant="outline" size="sm" className="gap-2">
                    Browse Docs
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

      </main>
    </div>
  );
}
