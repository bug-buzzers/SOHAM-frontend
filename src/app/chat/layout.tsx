import type {Metadata} from 'next';
import { formatProviderList } from '@/lib/model-catalog';

export const metadata: Metadata = {
  title: 'AI Chat App | SOHAM - Free Chat, Coding Help, Smart Search',
  description:
    `Use SOHAM AI chat for coding help, web search, reasoning and everyday questions, with models from ${formatProviderList()}. Sign in to start.`,
  alternates: {
    canonical: 'https://soham-ai.vercel.app/chat',
  },
  openGraph: {
    title: 'AI Chat App | SOHAM - Free Chat, Coding Help, Smart Search',
    description:
      `Use SOHAM AI chat for coding help, web search, reasoning and everyday questions, with models from ${formatProviderList()}. Sign in to start.`,
    url: 'https://soham-ai.vercel.app/chat',
    images: [
      {
        url: 'https://soham-ai.vercel.app/Multi-Chat.png',
        width: 1536,
        height: 1024,
        alt: 'SOHAM AI chat interface',
      },
    ],
  },
};

export default function ChatLayout({children}: {children: React.ReactNode}) {
  return children;
}
