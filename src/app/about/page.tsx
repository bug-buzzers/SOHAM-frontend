import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { pageSEO } from '@/lib/seo-config';
import { getEnabledModels, groupModels } from '@/lib/model-catalog';
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  Briefcase,
  Code2,
  FolderGit2,
  Github,
  Globe,
  GraduationCap,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Quote,
  Rocket,
  Twitter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/page-header';
import { DEVELOPER_INFO } from '@/lib/developer-info';
import { ABOUT_LAST_UPDATED, formatContentDate } from '@/lib/content-dates';

export const metadata: Metadata = {
  title: pageSEO.about.title,
  description: pageSEO.about.description,
  keywords: pageSEO.about.keywords,
  alternates: { canonical: 'https://soham-ai.vercel.app/about' },
  openGraph: {
    title: pageSEO.about.title,
    description: pageSEO.about.description,
    url: 'https://soham-ai.vercel.app/about',
    type: 'profile',
    siteName: 'SOHAM',
    images: [{ url: 'https://soham-ai.vercel.app/harsh.png', width: 1200, height: 630, alt: 'Heoster, founder of CODEEX-AI and creator of SOHAM' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: pageSEO.about.title,
    description: pageSEO.about.description,
    images: ['https://soham-ai.vercel.app/harsh.png'],
  },
};

const { location, education, company, contact } = DEVELOPER_INFO;

const companyFacts = [
  { label: 'Company', value: company.name },
  { label: 'Role', value: company.role },
  { label: 'Started', value: company.founded },
  { label: 'Based in', value: `${location.city}, ${location.district}` },
];

// Model counts come from models-config.json, the same list the chat model selector shows.
const ENABLED_MODELS = getEnabledModels();

const profileStats = [
  { label: 'Age', value: String(DEVELOPER_INFO.age) },
  { label: 'AI Models in SOHAM', value: String(ENABLED_MODELS.length) },
  { label: 'Lines of Code', value: DEVELOPER_INFO.projectStats.linesOfCode },
  { label: 'AI Providers', value: String(groupModels(ENABLED_MODELS, 'provider').length) },
];

const profileLinks = [
  { label: 'GitHub', handle: `@${DEVELOPER_INFO.social.github}`, href: contact.github, icon: Github },
  { label: 'LinkedIn', handle: DEVELOPER_INFO.social.linkedin, href: contact.linkedin, icon: Linkedin },
  { label: 'X (Twitter)', handle: `@${DEVELOPER_INFO.social.Twitter}`, href: contact.twitter, icon: Twitter },
  { label: 'Instagram', handle: `@${DEVELOPER_INFO.social.instagram}`, href: contact.instagram, icon: Instagram },
  { label: 'Portfolio', handle: contact.portfolio.replace(/^https:\/\//, ''), href: contact.portfolio, icon: Globe },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageHeader backLink="/" backText="Back to Home" title="About Heoster" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'Person',
                name: DEVELOPER_INFO.name,
                alternateName: [DEVELOPER_INFO.fullName, DEVELOPER_INFO.realName],
                givenName: DEVELOPER_INFO.realName,
                familyName: DEVELOPER_INFO.fullName.split(' ').slice(1).join(' '),
                jobTitle: company.role,
                worksFor: {
                  '@type': 'Organization',
                  name: company.name,
                },
                alumniOf: {
                  '@type': 'EducationalOrganization',
                  name: education.school,
                },
                address: {
                  '@type': 'PostalAddress',
                  addressLocality: location.city,
                  addressRegion: location.state,
                  addressCountry: location.country,
                },
                email: contact.email,
                url: 'https://soham-ai.vercel.app/about',
                image: 'https://soham-ai.vercel.app/harsh.png',
                description: DEVELOPER_INFO.humanizedBio,
                knowsAbout: DEVELOPER_INFO.skills,
                sameAs: profileLinks.map((link) => link.href),
              },
              {
                '@type': 'Organization',
                name: company.name,
                founder: {
                  '@type': 'Person',
                  name: DEVELOPER_INFO.name,
                },
                foundingDate: company.founded,
                url: 'https://soham-ai.vercel.app',
                logo: 'https://soham-ai.vercel.app/FINALSOHAM.png',
                description: 'CODEEX-AI is the name Heoster builds under. Its main product is SOHAM, a multi-model AI workspace for chat, PDF analysis and image maths solving.',
              },
            ],
          }),
        }}
      />

      <main className="container mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
        {/* ── Intro ── */}
        <section className="relative overflow-hidden rounded-[2rem] border bg-card p-6 shadow-sm md:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.12),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.14),transparent_34%)]" />
          <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-5">
              <div className="inline-flex items-center rounded-full border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground">
                Founder story and company profile
              </div>
              <div className="space-y-3">
                <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
                  I am HEOSTER.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
                  <strong className="text-foreground">{DEVELOPER_INFO.name}</strong> is the online name of{' '}
                  <strong className="text-foreground">{DEVELOPER_INFO.fullName}</strong>, a {DEVELOPER_INFO.age}-year-old
                  full-stack developer and {education.class} student from {location.city} in {location.district},{' '}
                  {location.state}. He started <strong className="text-foreground">{company.name}</strong> in{' '}
                  {company.founded} and builds <strong className="text-foreground">SOHAM</strong> to make advanced AI
                  tools free and useful for everyone.
                </p>
              </div>
              <figure className="max-w-2xl rounded-2xl border bg-background/70 px-5 py-4">
                <blockquote className="flex gap-3 text-base font-medium leading-7 md:text-lg">
                  <Quote className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <p>{DEVELOPER_INFO.quote}</p>
                </blockquote>
                <figcaption className="mt-1 pl-8 text-sm text-muted-foreground">
                  {DEVELOPER_INFO.name}, on his GitHub profile
                </figcaption>
              </figure>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="/soham">
                    Explore SOHAM
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/chat">Open Chat</Link>
                </Button>
              </div>
            </div>

            <div className="rounded-[2rem] border bg-background/80 p-6 backdrop-blur">
              <div className="flex items-center gap-4">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-3xl border">
                  <Image
                    src="/harsh.png"
                    alt={`${DEVELOPER_INFO.name} (${DEVELOPER_INFO.fullName}), founder of CODEEX-AI`}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-semibold">{DEVELOPER_INFO.name}</p>
                  <p className="text-sm text-muted-foreground">{DEVELOPER_INFO.fullName}</p>
                  <p className="text-sm font-medium text-primary">{company.role}</p>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {profileStats.map((item) => (
                  <div key={item.label} className="rounded-2xl border bg-card px-4 py-3">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">{item.label}</p>
                    <p className="mt-1 text-xl font-semibold">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap gap-2" aria-label={`${DEVELOPER_INFO.name} online`}>
                {profileLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${link.label}: ${link.handle}`}
                    title={`${link.label}: ${link.handle}`}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border bg-card text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                  >
                    <link.icon className="h-4 w-4" aria-hidden="true" />
                  </a>
                ))}
                <a
                  href={`mailto:${contact.email}`}
                  aria-label={`Email: ${contact.email}`}
                  title={`Email: ${contact.email}`}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border bg-card text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                >
                  <Mail className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── Company and background ── */}
        <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6 rounded-[2rem] border bg-card p-6">
            <div className="flex items-center gap-2 text-xl font-semibold">
              <Briefcase className="h-5 w-5 text-primary" />
              {company.name}
            </div>
            <div className="grid gap-3">
              {companyFacts.map((fact) => (
                <div key={fact.label} className="rounded-2xl border bg-background px-4 py-3">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{fact.label}</p>
                  <p className="mt-1 font-medium">{fact.value}</p>
                </div>
              ))}
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              {company.name} is the name Heoster builds under. SOHAM is its main product. His earlier CODEEX AI chat
              app is still online at{' '}
              <a href="https://codeex-ai.vercel.app" target="_blank" rel="noopener noreferrer" className="font-medium text-foreground hover:underline">
                codeex-ai.vercel.app
              </a>
              .
            </p>
          </div>

          <div className="space-y-6 rounded-[2rem] border bg-card p-6">
            <h2 className="text-2xl font-semibold">Background</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border bg-background p-5">
                <div className="flex items-center gap-2 text-base font-semibold">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  Education
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {education.class} {education.stream} at {education.school}.
                </p>
              </div>
              <div className="rounded-2xl border bg-background p-5">
                <div className="flex items-center gap-2 text-base font-semibold">
                  <MapPin className="h-4 w-4 text-primary" />
                  Location
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {location.city}, {location.district} district, {location.state}, {location.country}.
                </p>
              </div>
              <div className="rounded-2xl border bg-background p-5">
                <div className="flex items-center gap-2 text-base font-semibold">
                  <Code2 className="h-4 w-4 text-primary" />
                  Build Focus
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Full-stack web apps and AI products with React, Next.js, TypeScript, Node.js and Firebase, plus
                  multi-provider AI routing.
                </p>
              </div>
              <div className="rounded-2xl border bg-background p-5">
                <div className="flex items-center gap-2 text-base font-semibold">
                  <Globe className="h-4 w-4 text-primary" />
                  Product
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  SOHAM: multi-model AI chat with web search, image generation, voice, a PDF Analyzer and Visual Math.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Journey ── */}
        <section className="mt-8 rounded-[2rem] border bg-card p-6">
          <div className="flex items-center gap-2 text-xl font-semibold">
            <Rocket className="h-5 w-5 text-primary" />
            Journey
          </div>
          <ol className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {DEVELOPER_INFO.timeline.map((step) => (
              <li key={step.year} className="rounded-2xl border bg-background p-5">
                <p className="text-sm font-semibold text-primary">{step.year}</p>
                <p className="mt-1 font-semibold">{step.milestone}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.description}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ── Projects ── */}
        <section className="mt-8 rounded-[2rem] border bg-card p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xl font-semibold">
              <FolderGit2 className="h-5 w-5 text-primary" />
              Projects
            </div>
            <a
              href={contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              More on GitHub
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
          <ul className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {DEVELOPER_INFO.projects.map((project) => (
              <li key={project.name} className="flex flex-col rounded-2xl border bg-background p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-semibold">{project.name}</p>
                  <span className="text-xs text-muted-foreground">{project.year}</span>
                </div>
                <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">{project.description}</p>
                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium">
                  {project.url && (
                    <a href={project.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
                      Open site
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  )}
                  {project.repo && (
                    <a href={project.repo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground">
                      <Github className="h-3.5 w-3.5" />
                      Code
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Testing team ── */}
        <section className="mt-8 rounded-[2rem] border bg-card p-6">
          <h2 className="text-xl font-semibold">Testing Team</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Friends who help Heoster test and refine SOHAM with real-world feedback.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {DEVELOPER_INFO.friends.map((f) => (
              <span
                key={f.name}
                className="rounded-full border bg-background px-4 py-1.5 text-sm font-medium"
              >
                {f.name}
              </span>
            ))}
          </div>
        </section>

        {/* ── Achievements and contact ── */}
        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border bg-card p-6">
            <div className="flex items-center gap-2 text-xl font-semibold">
              <Award className="h-5 w-5 text-primary" />
              Achievements
            </div>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
              {DEVELOPER_INFO.achievements.map((achievement) => (
                <li key={achievement} className="rounded-2xl border bg-background px-4 py-3">
                  {achievement}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[2rem] border bg-card p-6">
            <h2 className="text-xl font-semibold">Mission and contact</h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              Heoster&apos;s aim is simple: “{DEVELOPER_INFO.mission}” In SOHAM that means free access with a free
              account and practical tools: live search, image generation, a PDF Analyzer and Visual Math.
            </p>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              If you want the product story, open <Link href="/soham" className="font-medium text-foreground hover:underline">the SOHAM page</Link>.
              If you want to use it immediately, go to <Link href="/chat" className="font-medium text-foreground hover:underline">AI chat</Link>.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild className="gap-2">
                <a href={`mailto:${contact.email}`}>
                  <Mail className="h-4 w-4" />
                  Email
                </a>
              </Button>
              {profileLinks.map((link) => (
                <Button key={link.label} asChild variant="outline" className="gap-2">
                  <a href={link.href} target="_blank" rel="noopener noreferrer">
                    <link.icon className="h-4 w-4" />
                    {link.label === 'X (Twitter)' ? 'X' : link.label}
                  </a>
                </Button>
              ))}
            </div>
          </div>
        </section>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Details on this page come from Heoster&apos;s public GitHub profile, portfolio and LinkedIn. Last checked{' '}
          {formatContentDate(ABOUT_LAST_UPDATED)}.
        </p>
      </main>
    </div>
  );
}
