'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Menu, X, Zap } from 'lucide-react';

interface HeaderProps {
  isScrolled: boolean;
  mobileNavOpen?: boolean;
  onToggleMobileNav?: () => void;
}

// Reduced to 4 focused nav links — "Chat" and "AI Services" are app features, not marketing pages
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
        {/* Gold status dot — only shown with full icon */}
        <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[#f5c842] ring-2 ring-[#0a0e1a]" />
      </div>
      <span className="text-base font-bold tracking-tight text-white">SOHAM</span>
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
      <span style={{ fontSize: '11px', color: '#22c55e', fontWeight: 500 }}>All systems operational</span>
    </div>
  );
}

export function DesktopLandingHeader({ isScrolled }: HeaderProps) {
  return (
    <header
      className="sticky top-0 z-50 transition-all duration-200"
      style={{
        borderBottom: isScrolled ? '1px solid rgba(59,130,246,0.15)' : '1px solid transparent',
        background: isScrolled ? 'rgba(10,14,26,0.95)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(20px)' : 'none',
        boxShadow: isScrolled ? '0 4px 32px rgba(0,0,0,0.4)' : 'none',
      }}
    >
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-6">
        <Brand />

        {/* Tab order: Logo → Nav links → Sign In → Get Started */}
        <nav className="flex items-center gap-0.5" aria-label="Main navigation">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-1.5 text-sm transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#3b82f6] focus-visible:outline-offset-2"
              style={{ color: '#94a3b8' }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.color = '#3b82f6';
                (e.currentTarget as HTMLElement).style.background = 'rgba(59,130,246,0.08)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.color = '#94a3b8';
                (e.currentTarget as HTMLElement).style.background = 'transparent';
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <SystemStatus />
          <Link href="/login">
            <button
              className="px-4 py-1.5 text-sm rounded-lg transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#3b82f6] focus-visible:outline-offset-2"
              style={{ color: '#94a3b8', border: '1px solid rgba(148,163,184,0.2)' }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.color = '#fff';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.3)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.color = '#94a3b8';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(148,163,184,0.2)';
              }}
            >
              Sign in
            </button>
          </Link>
          <Link href="/chat">
            <button
              className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold rounded-lg transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#3b82f6] focus-visible:outline-offset-2"
              style={{ background: '#f5c842', color: '#0a0e1a', boxShadow: '0 0 20px rgba(245,200,66,0.3)' }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = '#fde047';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 0 28px rgba(245,200,66,0.5)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = '#f5c842';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px rgba(245,200,66,0.3)';
              }}
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
        borderBottom: (isScrolled || mobileNavOpen) ? '1px solid rgba(59,130,246,0.15)' : '1px solid transparent',
        background: (isScrolled || mobileNavOpen) ? 'rgba(10,14,26,0.97)' : 'transparent',
        backdropFilter: (isScrolled || mobileNavOpen) ? 'blur(20px)' : 'none',
      }}
    >
      <div className="flex h-14 items-center justify-between px-4">
        <Brand />
        <div className="flex items-center gap-2">
          <Link href="/chat">
            <button
              className="flex items-center gap-1 h-8 px-3 text-xs font-semibold rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#3b82f6] focus-visible:outline-offset-2"
              style={{ background: '#f5c842', color: '#0a0e1a' }}
            >
              <Zap className="h-3 w-3" />
              Start
            </button>
          </Link>
          <button
            onClick={onToggleMobileNav}
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#3b82f6] focus-visible:outline-offset-2"
            style={{ color: '#94a3b8', border: '1px solid rgba(148,163,184,0.2)' }}
            aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileNavOpen}
          >
            {mobileNavOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {mobileNavOpen && (
        <div className="px-4 pb-4 pt-2" style={{ borderTop: '1px solid rgba(59,130,246,0.15)' }}>
          <div className="grid grid-cols-2 gap-1.5">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl px-4 py-3 text-sm transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#3b82f6] focus-visible:outline-offset-2"
                style={{ color: '#94a3b8', border: '1px solid rgba(59,130,246,0.15)', background: 'rgba(15,22,41,0.8)' }}
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
            <span style={{ fontSize: '11px', color: '#22c55e' }}>All systems operational</span>
          </div>
          <Link href="/login" className="mt-2 block">
            <button
              className="w-full py-2.5 text-sm rounded-xl transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#3b82f6] focus-visible:outline-offset-2"
              style={{ color: '#94a3b8', border: '1px solid rgba(148,163,184,0.2)' }}
            >
              Sign in to your account
            </button>
          </Link>
        </div>
      )}
    </header>
  );
}
