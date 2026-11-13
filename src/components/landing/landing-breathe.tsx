'use client';

import { useEffect, useState } from 'react';
import { Wind } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SohamLogo } from '@/components/soham-logo';
import { prefersReducedMotion } from '@/components/landing/landing-motion';
import { DEVELOPER_INFO } from '@/lib/developer-info';
import { cn } from '@/lib/utils';

const INHALE_MS = 4000;
const EXHALE_MS = 6000;
const ROUNDS = 3;

type Phase = 'idle' | 'in' | 'out' | 'done';

/**
 * The meaning of the name, made into a short breathing exercise: in
 * meditation "So" goes with the in-breath and "Ham" with the out-breath
 * (see DEVELOPER_INFO.product.meditationMeaning). Three slow breaths take
 * about 30 seconds. Reduced-motion visitors get a gentle fade, not a scale.
 */
export function BreathingName() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [round, setRound] = useState(1);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (phase !== 'in' && phase !== 'out') return;
    const timer = window.setTimeout(
      () => {
        if (phase === 'in') setPhase('out');
        else if (round < ROUNDS) {
          setRound(round + 1);
          setPhase('in');
        } else setPhase('done');
      },
      phase === 'in' ? INHALE_MS : EXHALE_MS
    );
    return () => window.clearTimeout(timer);
  }, [phase, round]);

  const running = phase === 'in' || phase === 'out';
  const duration = phase === 'in' ? INHALE_MS : phase === 'out' ? EXHALE_MS : 700;
  const scale = reduced ? 1 : phase === 'in' ? 1.32 : phase === 'out' ? 0.86 : 1;
  const glow = phase === 'in' ? 1 : phase === 'out' ? 0.35 : 0.7;

  const start = () => {
    setReduced(prefersReducedMotion());
    setRound(1);
    setPhase('in');
  };

  let caption: string;
  if (phase === 'in') caption = `Breathe in: “So”. Breath ${round} of ${ROUNDS}.`;
  else if (phase === 'out') caption = `Breathe out: “Ham”. Breath ${round} of ${ROUNDS}.`;
  else if (phase === 'done') caption = 'That is Soham: “So” on the way in, “Ham” on the way out.';
  else caption = 'In meditation, “So” goes with breathing in and “Ham” with breathing out.';

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative flex h-32 w-32 items-center justify-center">
        <div
          aria-hidden
          className="absolute inset-0 rounded-full bg-primary/20 blur-2xl ease-in-out"
          style={{
            transform: `scale(${scale})`,
            opacity: glow,
            transitionProperty: 'transform, opacity',
            transitionDuration: `${duration}ms`,
          }}
        />
        <div
          aria-hidden
          className={cn(
            'absolute inset-2 rounded-full border ease-in-out',
            running ? 'border-primary/50' : 'border-primary/20'
          )}
          style={{
            transform: `scale(${scale})`,
            transitionProperty: 'transform, border-color',
            transitionDuration: `${duration}ms`,
          }}
        />
        <SohamLogo
          size={64}
          className={cn('relative transition-opacity duration-500', running && 'opacity-0')}
        />
        <span
          aria-hidden
          className={cn(
            'absolute text-2xl font-semibold tracking-tight text-primary transition-opacity duration-500',
            running ? 'opacity-100' : 'opacity-0'
          )}
        >
          {phase === 'out' ? 'Ham' : 'So'}
        </span>
      </div>

      <div className="space-y-1">
        <p lang="sa" className="text-3xl font-semibold tracking-tight">
          सोऽहम्
        </p>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/80">
          “{DEVELOPER_INFO.product.sanskritMeaning}”
        </p>
      </div>

      <p aria-live="polite" className="min-h-[3.75rem] max-w-[17rem] text-sm leading-5 text-muted-foreground">
        {caption}
      </p>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="rounded-full"
        onClick={running ? () => setPhase('idle') : start}
      >
        <Wind className="h-4 w-4" aria-hidden />
        {running ? 'Stop' : phase === 'done' ? 'Breathe again' : 'Take three breaths'}
      </Button>
    </div>
  );
}
