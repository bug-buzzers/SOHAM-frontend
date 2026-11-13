import type { Metadata } from 'next';
import { LandingPageShell } from '@/components/landing/landing-page-shell';
import { buildLandingFaqs } from '@/components/landing/landing-content';
import { getLandingModelStats } from '@/components/landing/landing-model-stats';
import { StructuredData } from '@/components/seo/structured-data';
import { pageSEO } from '@/lib/seo-config';

const SITE_URL = 'https://soham-ai.vercel.app';
const OG_IMAGE = `${SITE_URL}/Multi-Chat.png`;

export const metadata: Metadata = {
  title: pageSEO.home.title,
  description: pageSEO.home.description,
  keywords: pageSEO.home.keywords,
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: pageSEO.home.title,
    description: pageSEO.home.description,
    url: SITE_URL,
    siteName: 'SOHAM',
    images: [{ url: OG_IMAGE, width: 1536, height: 1024, alt: 'SOHAM, the adaptive AI workspace by CODEEX-AI' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: pageSEO.home.title,
    description: pageSEO.home.description,
    images: [OG_IMAGE],
  },
};

export default function HomePage() {
  // Derived from models-config.json on the server so the page always matches the model selector.
  const modelStats = getLandingModelStats();
  const faqs = buildLandingFaqs(modelStats);

  return (
    <>
      <StructuredData type="faq" data={{ faqs }} />
      <LandingPageShell modelStats={modelStats} faqs={faqs} />
    </>
  );
}
