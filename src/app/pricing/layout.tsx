import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing | SOHAM - Free to Use',
  description: 'SOHAM is free to use. There are no paid plans, subscriptions or credits today. Sign in to chat with AI models, analyze PDFs, solve maths from images and search the web. Rate limits apply.',
  keywords: ['free ai', 'free ai platform', 'SOHAM pricing', 'free llm', 'free ai chat'],
  alternates: { canonical: 'https://soham-ai.vercel.app/pricing' },
  openGraph: {
    title: 'Pricing | SOHAM - Free to Use',
    description: 'SOHAM is free to use. No paid plans, subscriptions or credits today.',
    url: 'https://soham-ai.vercel.app/pricing',
    siteName: 'SOHAM',
    images: [{ url: 'https://soham-ai.vercel.app/Multi-Chat.png', width: 1536, height: 1024, alt: 'SOHAM pricing' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pricing | SOHAM - Free to Use',
    description: 'SOHAM is free to use. No paid plans, subscriptions or credits today.',
    images: ['https://soham-ai.vercel.app/Multi-Chat.png'],
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
