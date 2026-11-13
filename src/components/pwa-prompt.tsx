'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {Download, Rocket, ShieldCheck, Smartphone, Wifi} from 'lucide-react';
import {usePWAInstall} from '@/hooks/use-pwa-install';

export function PWAPrompt() {
  const {
    open,
    setOpen,
    dismiss,
    install,
    isIos,
    isInstallable,
    canShowInstallUi,
  } = usePWAInstall();

  if (!canShowInstallUi) {
    return null;
  }

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen && open) {
      void dismiss();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="overflow-hidden border-border/70 bg-card p-0 text-card-foreground shadow-2xl sm:max-w-[34rem] sm:rounded-[28px]">
        <div className="relative">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--info)/0.16),transparent_34%),radial-gradient(circle_at_bottom_left,hsl(var(--primary)/0.16),transparent_42%)]" />
          <div className="relative p-6 sm:p-7">
            <DialogHeader className="text-left">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
                <Download className="h-5 w-5" />
              </div>
              <DialogTitle className="text-2xl font-semibold tracking-tight text-foreground">
                Install SOHAM
              </DialogTitle>
              <DialogDescription className="max-w-md text-sm leading-6 text-muted-foreground">
                Turn SOHAM into an app on your phone or desktop for faster launch, cleaner navigation, and an always-ready chat workspace.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
                <Rocket className="mb-2 h-4 w-4 text-primary" />
                <p className="text-sm font-medium text-foreground">Quick launch</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">Open from your home screen without browser clutter.</p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
                <Wifi className="mb-2 h-4 w-4 text-primary" />
                <p className="text-sm font-medium text-foreground">Offline shell</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">Keep the app shell available even when the network is unstable.</p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
                <ShieldCheck className="mb-2 h-4 w-4 text-primary" />
                <p className="text-sm font-medium text-foreground">Better focus</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">Use SOHAM like a dedicated tool instead of a browser tab.</p>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-border/70 bg-muted/40 p-4">
              <div className="mb-3 flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium text-foreground">How it works</p>
              </div>
              {isIos ? (
                <ol className="space-y-2 text-sm leading-6 text-muted-foreground">
                  <li>1. Open SOHAM in Safari.</li>
                  <li>2. Tap the Share button.</li>
                  <li>3. Choose <span className="font-medium text-foreground">Add to Home Screen</span>.</li>
                </ol>
              ) : isInstallable ? (
                <ol className="space-y-2 text-sm leading-6 text-muted-foreground">
                  <li>1. Press <span className="font-medium text-foreground">Install app</span>.</li>
                  <li>2. Accept the browser install prompt.</li>
                  <li>3. Launch SOHAM from your home screen or app launcher.</li>
                </ol>
              ) : (
                <ol className="space-y-2 text-sm leading-6 text-muted-foreground">
                  <li>1. Open SOHAM in a supported browser.</li>
                  <li>2. Use the browser install option from the address bar or app menu.</li>
                  <li>3. Return here if you need install guidance again.</li>
                </ol>
              )}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button
                variant="ghost"
                onClick={() => void dismiss()}
                className="border border-border/70 bg-background/60 text-foreground/90 hover:bg-muted hover:text-foreground"
              >
                Remind me later
              </Button>
              {!isIos && isInstallable ? (
                <Button
                  onClick={() => void install()}
                  className="bg-[linear-gradient(135deg,#68d5ff,#5b8cff)] text-slate-950 hover:opacity-95"
                >
                  Install app
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
