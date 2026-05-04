'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

interface SohamLogoProps {
  /** Size in pixels (width = height). Default 32. */
  size?: number;
  /** Extra classes on the outer wrapper */
  className?: string;
  /** Show the pulsing green status dot. Default false. */
  showDot?: boolean;
  /** Priority load (above-the-fold). Default false. */
  priority?: boolean;
}

/**
 * SOHAM brand logo — uses the SVG asset for crisp rendering at any size.
 * Drop-in replacement for the old <Image src="/FINALSOHAM.png" /> pattern.
 */
export function SohamLogo({ size = 32, className, showDot = false, priority = false }: SohamLogoProps) {
  return (
    <span className={cn('relative inline-flex shrink-0', className)} style={{ width: size, height: size }}>
      <Image
        src="/soham-logo.svg"
        alt="SOHAM"
        width={size}
        height={size}
        priority={priority}
        className="rounded-xl"
        style={{ width: size, height: size }}
      />
      {showDot && (
        <span
          className="absolute -bottom-0.5 -right-0.5 rounded-full bg-primary ring-2 ring-background"
          style={{ width: Math.max(8, Math.round(size * 0.28)), height: Math.max(8, Math.round(size * 0.28)) }}
        />
      )}
    </span>
  );
}
