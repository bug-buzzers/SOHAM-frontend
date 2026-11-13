'use client';

import Link from 'next/link';
import type { MouseEvent } from 'react';
import { ArrowRight, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { SohamLogo } from '@/components/soham-logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { LANDING_NAV_LINKS } from '@/components/landing/landing-content';
import { ScrollProgress } from '@/components/landing/landing-motion';
import { cn } from '@/lib/utils';

interface LandingHeaderProps {
  isScrolled: boolean;
  isSignedIn: boolean;
  /** False while Firebase is still restoring the session. */
  authResolved: boolean;
  mobileNavOpen: boolean;
  onMobileNavOpenChange: (open: boolean) => void;
  onNavigate: (event: MouseEvent<HTMLAnchorElement>, href: string) => void;
}

export function LandingHeader({
  isScrolled,
  isSignedIn,
  authResolved,
  mobileNavOpen,
  onMobileNavOpenChange,
  onNavigate,
}: LandingHeaderProps) {
  const chatLabel = isSignedIn ? 'Open chat' : 'Start chatting';

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm transition-[border-color,box-shadow] duration-200',
        isScrolled ? 'border-border/70 shadow-sm' : 'border-transparent'
      )}
    >
      <ScrollProgress />
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 md:px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <SohamLogo size={30} priority />
          <span className="flex flex-col leading-none">
            <span className="text-lg font-bold tracking-tight">SOHAM</span>
            <span className="mt-1 hidden text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:block">
              by CODEEX-AI
            </span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {LANDING_NAV_LINKS.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              label={link.label}
              onNavigate={onNavigate}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            />
          ))}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <ThemeToggle />
          {authResolved && !isSignedIn && (
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link href="/login">Sign in</Link>
            </Button>
          )}
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/chat">
              {chatLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>

          <Sheet open={mobileNavOpen} onOpenChange={onMobileNavOpenChange}>
            <SheetTrigger asChild>
              <Button type="button" variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex w-[85vw] max-w-sm flex-col gap-0 p-0">
              <SheetHeader className="border-b px-5 py-4 text-left">
                <SheetTitle className="flex items-center gap-2.5">
                  <SohamLogo size={26} />
                  SOHAM
                </SheetTitle>
                <SheetDescription>Adaptive AI workspace by CODEEX-AI</SheetDescription>
              </SheetHeader>

              <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-3 py-4">
                <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  On this page
                </p>
                <ul className="space-y-1">
                  {LANDING_NAV_LINKS.map((link) => (
                    <li key={link.href}>
                      <NavLink
                        href={link.href}
                        label={link.label}
                        onNavigate={onNavigate}
                        className="flex items-center rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                      />
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="space-y-2 border-t p-4">
                <Button asChild className="w-full justify-between">
                  <Link href="/chat" onClick={() => onMobileNavOpenChange(false)}>
                    {chatLabel}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                {authResolved && !isSignedIn && (
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/login" onClick={() => onMobileNavOpenChange(false)}>
                      Sign in
                    </Link>
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function NavLink({
  href,
  label,
  className,
  onNavigate,
}: {
  href: string;
  label: string;
  className: string;
  onNavigate: (event: MouseEvent<HTMLAnchorElement>, href: string) => void;
}) {
  // In-page anchors are scrolled manually so the mobile sheet can close first.
  if (href.startsWith('#')) {
    return (
      <a href={href} className={className} onClick={(event) => onNavigate(event, href)}>
        {label}
      </a>
    );
  }

  return (
    <Link href={href} className={className} onClick={(event) => onNavigate(event, href)}>
      {label}
    </Link>
  );
}
