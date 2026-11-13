import type {Metadata} from 'next';
import DocLayout from '@/components/documentation/doc-layout';
import { StructuredData } from '@/components/seo/structured-data';

export const metadata: Metadata = {
  title: 'Documentation | SOHAM — AI Chat, Models, Commands & Setup',
  description:
    'Complete SOHAM documentation: how to use the model selector and Auto mode, slash commands (/solve, /search, /summarize), voice features, PDF analysis, image generation and mobile installation.',
  keywords: [
    'SOHAM documentation',
    'SOHAM guide',
    'AI chat docs',
    'slash commands',
    'AI models guide',
    'PDF analyzer docs',
    'SOHAM setup',
    'CODEEX-AI docs',
  ].join(', '),
  alternates: {
    canonical: 'https://soham-ai.vercel.app/documentation',
  },
  openGraph: {
    title: 'Documentation | SOHAM — AI Chat, Models, Commands & Setup',
    description:
      'Complete SOHAM documentation: AI models, slash commands, voice features, PDF analysis, image generation and mobile installation guides.',
    url: 'https://soham-ai.vercel.app/documentation',
    siteName: 'SOHAM',
    images: [
      {
        url: 'https://soham-ai.vercel.app/Multi-Chat.png',
        width: 1200,
        height: 630,
        alt: 'SOHAM documentation and AI product guides',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Documentation | SOHAM — AI Chat, Models, Commands & Setup',
    description:
      'Complete SOHAM documentation: AI models, slash commands, voice features, PDF analysis and more.',
    images: ['https://soham-ai.vercel.app/Multi-Chat.png'],
  },
};

const docFaqs = [
  { question: 'How do I use slash commands in SOHAM?', answer: 'Type /solve for math, /search for web search, or /summarize for text summarization directly in the chat input.' },
  { question: 'How do I install SOHAM as a mobile app?', answer: 'On Android, open SOHAM in Chrome and tap "Install app" from the menu. On iOS, open in Safari, tap Share, then "Add to Home Screen".' },
  { question: 'Which AI models are available in SOHAM?', answer: 'The model selector lists models from Groq, Cerebras, Google Gemini, Hugging Face and OpenRouter, including Llama 3.3 70B, Gemini 2.5 Flash, Qwen 3 235B and DeepSeek R1 Distill 70B. You can also leave it on Auto.' },
  { question: 'How does PDF analysis work?', answer: 'Upload a PDF up to 5MB on the PDF Analyzer page, then ask any question about the document. The AI extracts text and answers based on the content.' },
];

export default function DocsLayout({children}: {children: React.ReactNode}) {
  return (
    <>
      <StructuredData type="faq" data={{ faqs: docFaqs }} />
      <DocLayout>{children}</DocLayout>
    </>
  );
}
