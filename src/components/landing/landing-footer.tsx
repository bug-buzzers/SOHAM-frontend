import Link from 'next/link';
import { SohamLogo } from '@/components/soham-logo';

const FOOTER_COLUMNS = [
  {
    title: 'Product',
    links: [
      { label: 'Chat', href: '/chat' },
      { label: 'AI Services', href: '/ai-services' },
      { label: 'PDF Analyzer', href: '/pdf-analyzer' },
      { label: 'Visual Math', href: '/visual-math' },
      { label: 'Community', href: '/community' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', href: '/documentation' },
      { label: 'Quick start', href: '/documentation/quick-start' },
      { label: 'Commands', href: '/documentation/commands' },
      { label: 'Install the app', href: '/documentation/pwa' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Privacy policy', href: '/privacy' },
      { label: 'Terms of service', href: '/terms' },
    ],
  },
];

export function LandingFooter() {
  return (
    <footer className="border-t border-border/70 bg-card/40">
      <div className="container mx-auto max-w-6xl px-4 py-12 md:px-6">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-[1.4fr_repeat(3,minmax(0,1fr))]">
          <div className="space-y-4 sm:col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <SohamLogo size={30} />
              <span className="text-lg font-bold tracking-tight">SOHAM</span>
            </Link>
            <p className="max-w-xs text-sm leading-6 text-muted-foreground">
              Adaptive AI workspace by CODEEX-AI. Self Organising Hyper Adaptive Machine.
            </p>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/80">
              Made in Bharat 🇮🇳
            </p>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {column.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border/70 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          {/* The page is statically rendered, so the year can differ from the build year. */}
          <p suppressHydrationWarning>© {new Date().getFullYear()} CODEEX-AI. All rights reserved.</p>
          <p>Built by Heoster in Khatauli, Uttar Pradesh.</p>
        </div>
      </div>
    </footer>
  );
}
