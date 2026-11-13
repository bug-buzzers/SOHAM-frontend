/**
 * Shared copy for the landing page.
 *
 * Every statement here must be backed by code in this repository. Do not add
 * usage numbers, ratings, uptime figures, competitor comparisons, or "forever"
 * promises. Model counts come from `src/lib/models-config.json` at build time
 * (see `landing-model-stats.ts`), so they stay in sync with the model selector.
 */

export interface LandingProviderGroup {
  /** Provider key from models-config.json, e.g. "groq". */
  id: string;
  /** Human-readable provider name, e.g. "Hugging Face". */
  name: string;
  /** Display names of the enabled models for this provider. */
  models: string[];
}

export interface LandingModelStats {
  /** Number of enabled models, i.e. what the chat model selector lists. */
  total: number;
  providers: LandingProviderGroup[];
}

export interface LandingFaq {
  question: string;
  answer: string;
}

export interface LandingNavLink {
  label: string;
  href: string;
}

export const LANDING_NAV_LINKS: LandingNavLink[] = [
  { label: 'Try it', href: '#try' },
  { label: 'Features', href: '#features' },
  { label: 'Models', href: '#models' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Your data', href: '#your-data' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Docs', href: '/documentation' },
];

/** Joins items as "A, B and C". */
export function formatList(items: string[]): string {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

/**
 * FAQ shown on the page and emitted as FAQPage JSON-LD. Both use this one
 * source so the structured data always matches the visible answers.
 */
export function buildLandingFaqs({ total, providers }: LandingModelStats): LandingFaq[] {
  const providerNames = formatList(providers.map((provider) => provider.name));

  return [
    {
      question: 'Is SOHAM free to use?',
      answer:
        'Yes. There is nothing to pay for in the app today: no subscriptions and no credits. SOHAM relies on third-party AI providers, so usage limits apply (chat is currently limited to 30 requests per minute), and a model can be temporarily unavailable when its provider is busy.',
    },
    {
      question: 'Do I need an account?',
      answer:
        'Yes. You need to sign in to chat. You can continue with Google or use an email address and password. Sign-in is handled by Firebase Authentication.',
    },
    {
      question: 'Which AI models can I use?',
      answer: `The model selector currently lists ${total} models from ${providerNames}. You can choose one yourself or leave it on Auto (Smart Routing), and each reply shows which model wrote it.`,
    },
    {
      question: 'Where are my chats stored?',
      answer:
        "The chat list in the sidebar is saved in your browser's IndexedDB storage, so it stays on that device. To answer you, each message and its recent context are sent to SOHAM's servers and to the AI provider that writes the reply. SOHAM's server also saves your messages, and facts it picks up from them, linked to your account. The privacy policy has the details.",
    },
    {
      question: 'Can SOHAM search the web or create images?',
      answer:
        'Yes. Start a message with /search, or ask about something recent, and SOHAM can look it up before answering. Describe a picture in the chat and SOHAM can generate it for you to preview or download.',
    },
    {
      question: 'Does SOHAM work on my phone?',
      answer:
        "Yes. SOHAM runs in modern mobile and desktop browsers, and you can install it as a Progressive Web App from your browser's menu.",
    },
    {
      question: 'Who builds SOHAM?',
      answer:
        'SOHAM is built by Heoster (Harsh), founder of CODEEX-AI, in Khatauli, Uttar Pradesh, India. CODEEX-AI was founded in 2024.',
    },
  ];
}
