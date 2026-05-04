'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Menu, X, Zap } from 'lucide-react';

interface HeaderProps {
  isScrolled: boolean;
  mobileNavOpen?: boolean;
  onToggleMobileNav?: () => void;
}

const navLinks = [
  { href: '/#features',     label: 'Features' },
  { href: '/#compare',      label: 'Compare' },
  { href: '/documentation', label: 'Docs' },
  { href: '/about',         label: 'About' },
];

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-2.5 group" aria-label="SOHAM home">
      <div className="relative">
        <Image src="/FINALSOHAM.png" alt="SOHAM" width={30} height={30} priority className="rounded-lg" />
        {/* Primary-colored status dot */}
        <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-background" />
      </div>
      <span className="text-base font-bold tracking-tight text-foreground">SOHAM</span>
    </Link>
  );
}

function SystemStatus() {
  return (
    <div className="flex items-center gap-1.5">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-400" />
      </span>
      <span className="text-green-500 font-medium" style={{ fontSize: '11px' }}>All systems operational</span>
    </div>
  );
}

export function DesktopLandingHeader({ isScrolled }: HeaderProps) {
  return (
    <header
      className="sticky top-0 z-50 transition-all duration-200"
      style={{
        borderBottom: isScrolled ? '1px solid hsl(var(--border))' : '1px solid transparent',
        background: isScrolled ? 'hsl(var(--background) / 0.95)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(20px)' : 'none',
        boxShadow: isScrolled ? '0 4px 32px rgba(0,0,0,0.4)' : 'none',
      }}
    >
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-6">
        <Brand />

        <nav className="flex items-center gap-0.5" aria-label="Main navigation">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-all hover:text-primary hover:bg-primary/8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <SystemStatus />
          <Link href="/login">
            <button className="px-4 py-1.5 text-sm rounded-lg transition-all text-muted-foreground border border-border hover:text-foreground hover:border-foreground/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2">
              Sign in
            </button>
          </Link>
          <Link href="/chat">
            <button
              className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold rounded-lg transition-all bg-primary text-primary-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
              style={{ boxShadow: '0 0 20px hsl(var(--primary) / 0.3)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 28px hsl(var(--primary) / 0.5)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px hsl(var(--primary) / 0.3)'; }}
            >
              <Zap className="h-3.5 w-3.5" />
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}

export function MobileLandingHeader({ isScrolled, mobileNavOpen = false, onToggleMobileNav }: HeaderProps) {
  return (
    <header
      className="sticky top-0 z-50 transition-all duration-200"
      style={{
        borderBottom: (isScrolled || mobileNavOpen) ? '1px solid hsl(var(--border))' : '1px solid transparent',
        background: (isScrolled || mobileNavOpen) ? 'hsl(var(--background) / 0.97)' : 'transparent',
        backdropFilter: (isScrolled || mobileNavOpen) ? 'blur(20px)' : 'none',
      }}
    >
      <div className="flex h-14 items-center justify-between px-4">
        <Brand />
        <div className="flex items-center gap-2">
          <Link href="/chat">
            <button className="flex items-center gap-1 h-8 px-3 text-xs font-semibold rounded-lg bg-primary text-primary-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2">
              <Zap className="h-3 w-3" />
              Start
            </button>
          </Link>
          <button
            onClick={onToggleMobileNav}
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-all text-muted-foreground border border-border hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
            aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileNavOpen}
          >
            {mobileNavOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {mobileNavOpen && (
        <div className="px-4 pb-4 pt-2 border-t border-border">
          <div className="grid grid-cols-2 gap-1.5">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl px-4 py-3 text-sm transition-all text-muted-foreground border border-border bg-card/80 hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-center gap-1.5 py-1">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-400" />
            </span>
            <span className="text-green-500" style={{ fontSize: '11px' }}>All systems operational</span>
          </div>
          <Link href="/login" className="mt-2 block">
            <button className="w-full py-2.5 text-sm rounded-xl transition-all text-muted-foreground border border-border hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2">
              Sign in to your account
            </button>
          </Link>
        </div>
      )}
    </header>
  );
}
