'use client';

import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {idbGet, idbSet} from '@/lib/indexed-db';

const DISMISS_KEY = 'pwa-prompt-dismissed-at-v2';
const INSTALLED_KEY = 'pwa-installed-v2';
const FIRST_VISIT_KEY = 'pwa-first-visit-at-v2';
const DISMISS_DURATION_MS = 3 * 24 * 60 * 60 * 1000; // 3 days
const ENGAGEMENT_DELAY_MS = 10 * 60 * 1000;           // 10 minutes
const OPEN_EVENT = 'soham:pwa-open-request';

export interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function isStandaloneMode() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function requestPWAPromptOpen() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(OPEN_EVENT));
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [open, setOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(true);
  const [isInstallable, setIsInstallable] = useState(false);

  const isStandaloneRef = useRef(isStandalone);
  useEffect(() => { isStandaloneRef.current = isStandalone; }, [isStandalone]);

  useEffect(() => {
    const ios = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
    const standalone = isStandaloneMode();
    setIsIos(ios);
    setIsStandalone(standalone);

    let isMounted = true;
    let autoOpenTimer: number | null = null;

    const openIfAllowed = async () => {
      const dismissedAt = await idbGet<number>(DISMISS_KEY);
      const installed = await idbGet<boolean>(INSTALLED_KEY);
      const snoozed = !!dismissedAt && Date.now() - dismissedAt < DISMISS_DURATION_MS;

      if (!isMounted) return;
      setIsReady(true);

      // Already installed or snoozed — nothing to do
      if (standalone || installed || snoozed) return;

      // Record first visit timestamp if not already set
      let firstVisitAt = await idbGet<number>(FIRST_VISIT_KEY);
      if (!firstVisitAt) {
        firstVisitAt = Date.now();
        await idbSet(FIRST_VISIT_KEY, firstVisitAt);
      }

      // Only show for iOS or when the browser install prompt is available
      const canShow = ios || isInstallable || !!deferredPrompt;
      if (!canShow) return;

      const elapsed = Date.now() - firstVisitAt;
      const remaining = ENGAGEMENT_DELAY_MS - elapsed;

      if (remaining <= 0) {
        // 10 minutes already passed on a previous visit — show right away
        autoOpenTimer = window.setTimeout(() => {
          if (isMounted) setOpen(true);
        }, 800);
      } else {
        // Schedule for the remaining time in this session
        autoOpenTimer = window.setTimeout(() => {
          if (isMounted) setOpen(true);
        }, remaining);
      }
    };

    const handleBeforeInstallPrompt = (event: Event) => {
      // Keep the event so "Install app" can call prompt() from a click later.
      // No preventDefault(): prompt() works without it, and calling it makes
      // Chrome log "Banner not shown: beforeinstallpromptevent.preventDefault()
      // called…" on every page load. The only thing it would add is hiding
      // Chrome's own install badge on Android.
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setOpen(false);
      setDeferredPrompt(null);
      setIsInstallable(false);
      setIsStandalone(true);
      idbSet(INSTALLED_KEY, true);
    };

    const handleOpenRequest = () => {
      if (!isStandaloneRef.current) {
        setOpen(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener(OPEN_EVENT, handleOpenRequest);

    openIfAllowed();

    return () => {
      isMounted = false;
      if (autoOpenTimer) window.clearTimeout(autoOpenTimer);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener(OPEN_EVENT, handleOpenRequest);
    };
  }, [deferredPrompt, isInstallable]);

  const dismiss = useCallback(async () => {
    setOpen(false);
    await idbSet(DISMISS_KEY, Date.now());
  }, []);

  const install = useCallback(async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const {outcome} = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setOpen(false);
      setDeferredPrompt(null);
      setIsInstallable(false);
      await idbSet(INSTALLED_KEY, true);
    } else {
      await dismiss();
    }
  }, [deferredPrompt, dismiss]);

  const canShowInstallUi = useMemo(
    () => isReady && !isStandalone,
    [isReady, isStandalone]
  );

  return {
    open,
    setOpen,
    dismiss,
    install,
    isIos,
    isStandalone,
    isInstallable: isInstallable || !!deferredPrompt,
    canShowInstallUi,
  };
}
