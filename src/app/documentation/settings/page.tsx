'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatProviderList, getEnabledModels, groupModels, PROVIDER_LABELS } from '@/lib/model-catalog';
import {
  Settings,
  Brain,
  MessageSquare,
  GraduationCap,
  Volume2,
  Palette,
  Shield,
  ArrowRight,
  CheckCircle,
  Monitor,
  Sun,
  Moon,
  Laptop,
} from 'lucide-react';

const PROVIDER_NOTES: Record<string, string> = {
  google: 'Free-tier Gemini models with very long context (about 1M tokens)',
  openrouter: 'A free router that picks one of OpenRouter\'s free models per request',
  groq: 'Open-weight reasoning and coding models. They answer only when Groq is switched on for SOHAM.',
};

// Built from models-config.json, the same list the chat model selector shows.
const providerGroups = groupModels(getEnabledModels(), 'provider').map(({ key, models }) => ({
  provider: PROVIDER_LABELS[key] ?? key,
  models: models.map((model) => model.shortName),
  note: PROVIDER_NOTES[key] ?? '',
}));

export default function SettingsPage() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-2 text-sm">
          <Settings className="h-4 w-4 text-primary" />
          <span className="font-medium">Settings & Customization</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Settings Guide</h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Tailor SOHAM to your workflow — choose your AI model, response style, voice, and more.
          All settings are saved locally in your browser.
        </p>
      </div>

      {/* How to open */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Settings className="h-4 w-4 text-primary" />
            How to Open Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border bg-background p-4 space-y-2">
            <p className="font-semibold text-sm flex items-center gap-2">
              <Monitor className="h-4 w-4 text-muted-foreground" /> Desktop
            </p>
            <p className="text-sm text-muted-foreground">
              Click the <strong className="text-foreground">⚙️ gear icon</strong> at the top right of the
              chat, or <strong className="text-foreground">Settings</strong> at the bottom of the sidebar.
              Settings opens in a window with four tabs: AI, Voice, Look and Account. The sliders button
              next to the gear opens Quick Settings for theme, tone, font weight and speech output.
            </p>
          </div>
          <div className="rounded-lg border bg-background p-4 space-y-2">
            <p className="font-semibold text-sm flex items-center gap-2">
              <Monitor className="h-4 w-4 text-muted-foreground" /> Mobile
            </p>
            <p className="text-sm text-muted-foreground">
              Tap <strong className="text-foreground">Settings</strong> in the bottom bar. The same
              window opens, with the same four tabs. On the AI tab, the model list opens as a bottom
              sheet.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* AI Model */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
            <Brain className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">AI Model Selection</h2>
            <p className="text-sm text-muted-foreground">Choose which model powers your conversations</p>
          </div>
        </div>
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="rounded-lg border-2 border-primary/30 bg-primary/5 p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-sm">Auto (Recommended)</p>
                <Badge>Default</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                In Auto mode SOHAM chooses a model for each message. You can also pick one yourself
                from the model selector.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {providerGroups.map(({ provider, models, note }) => (
                <div key={provider} className="rounded-lg border p-4">
                  <p className="font-semibold text-sm mb-1">{provider}</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {models.map(m => (
                      <Badge key={m} variant="outline" className="text-xs">{m}</Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">{note}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-green-500" />
              You don&apos;t need your own API keys. A free SOHAM account is required to chat, and rate limits apply.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Response Tone */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">
            <MessageSquare className="h-5 w-5 text-green-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Response Tone</h2>
            <p className="text-sm text-muted-foreground">Controls how SOHAM phrases its answers</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              tone: 'Helpful',
              badge: 'Default',
              desc: 'Balanced, friendly, and practical. Good for most use cases.',
              example: '"Sure! Here\'s how you can fix that — the issue is in line 12 where..."',
            },
            {
              tone: 'Formal',
              badge: null,
              desc: 'Professional and structured. Ideal for reports, emails, and business writing.',
              example: '"The error originates from an incorrect type assertion on line 12. The recommended resolution is..."',
            },
            {
              tone: 'Casual',
              badge: null,
              desc: 'Relaxed and conversational. Great for brainstorming and quick chats.',
              example: '"Oh yeah, that\'s a classic one! Line 12 is the culprit — just change the type and you\'re good."',
            },
          ].map(({ tone, badge, desc, example }) => (
            <Card key={tone}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-base">
                  {tone}
                  {badge && <Badge variant="secondary" className="text-xs">{badge}</Badge>}
                </CardTitle>
                <CardDescription>{desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg bg-muted/60 p-3">
                  <p className="text-xs text-muted-foreground italic">{example}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Technical Level */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
            <GraduationCap className="h-5 w-5 text-purple-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Technical Level</h2>
            <p className="text-sm text-muted-foreground">Adjusts the depth and vocabulary of explanations</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              level: 'Beginner',
              desc: 'Plain language, analogies, no assumed knowledge.',
              example: 'Explains recursion as "a function that calls itself, like Russian nesting dolls."',
            },
            {
              level: 'Intermediate',
              badge: 'Default',
              desc: 'Assumes basic familiarity. Uses standard terminology with brief explanations.',
              example: 'Explains recursion with a factorial example and mentions the call stack.',
            },
            {
              level: 'Expert',
              desc: 'Dense, precise, no hand-holding. Assumes deep domain knowledge.',
              example: 'Discusses tail-call optimisation, memoisation, and stack frame overhead directly.',
            },
          ].map(({ level, badge, desc, example }) => (
            <Card key={level}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-base">
                  {level}
                  {badge && <Badge variant="secondary" className="text-xs">{badge}</Badge>}
                </CardTitle>
                <CardDescription>{desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground italic">{example}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Voice Settings */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10">
            <Volume2 className="h-5 w-5 text-orange-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Voice Settings</h2>
            <p className="text-sm text-muted-foreground">Read-aloud and voice input use your browser&apos;s speech features</p>
          </div>
        </div>
        <Card>
          <CardContent className="pt-6 space-y-5">
            <div className="flex items-start gap-3 rounded-lg border p-4">
              <Volume2 className="h-4 w-4 text-orange-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-sm">Enable speech output</p>
                <p className="text-sm text-muted-foreground">
                  Turn on speech output and SOHAM reads each reply aloud with your browser&apos;s built-in
                  speech synthesis. Microphone permission isn&apos;t needed for this.
                </p>
              </div>
            </div>
            <div>
              <p className="font-semibold text-sm mb-3">Voice presets</p>
              <div className="flex flex-wrap gap-2">
                {['Troy', 'Diana', 'Hannah', 'Autumn', 'Austin', 'Daniel'].map((name) => (
                  <Badge key={name} variant="outline">{name}</Badge>
                ))}
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                The voice used depends on your browser and device. SOHAM uses a preset only if your
                browser has a voice with the same name; otherwise your browser&apos;s default voice reads
                the reply.
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Voice input works through the microphone button in the chat box and uses your
              browser&apos;s speech recognition. It works best in Chrome, Edge and Safari.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Theme */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/10">
            <Palette className="h-5 w-5 text-yellow-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Theme</h2>
            <p className="text-sm text-muted-foreground">Controls the visual appearance of the app</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { theme: 'Light', icon: Sun,     desc: 'White background, dark text. Best in bright environments.' },
            { theme: 'Dark',  icon: Moon,    desc: 'Dark navy background, light text. Easier on the eyes at night.', badge: 'Default' },
            { theme: 'System',icon: Laptop,  desc: 'Follows your device\'s light or dark setting.' },
          ].map(({ theme, icon: Icon, desc, badge }) => (
            <Card key={theme}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-base">
                  <span className="flex items-center gap-2">
                    <Icon className="h-4 w-4" /> {theme}
                  </span>
                  {badge && <Badge variant="secondary" className="text-xs">{badge}</Badge>}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Privacy */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10">
            <Shield className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Privacy</h2>
            <p className="text-sm text-muted-foreground">What is saved, and where</p>
          </div>
        </div>
        <Card>
          <CardContent className="pt-6 space-y-4">
            {[
              {
                title: 'Saved in your browser',
                desc: 'Your settings and your chat list are stored in this browser (IndexedDB). They don\'t sync to your other devices.',
              },
              {
                title: 'Saved on SOHAM\'s server',
                desc: 'When you\'re signed in, the server also keeps your messages and replies, plus facts it picks up from your chats, and uses them as context in later conversations. Email codeex@email.com to have them deleted.',
              },
              {
                title: 'Delete chats',
                desc: 'Delete a chat from the chat sidebar to remove it from this browser. Deleting is immediate and can\'t be undone. It doesn\'t delete the server\'s copy.',
              },
              {
                title: 'Account required',
                desc: 'Chatting requires a free account, with Google or with an email address and password.',
              },
              {
                title: 'Sent to AI providers',
                desc: `Messages are sent to AI model providers (${formatProviderList()}) to generate replies. Review their privacy policies for how they handle data.`,
              },
            ].map(({ title, desc }) => (
              <div key={title} className="flex items-start gap-3 rounded-lg border p-4">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-sm">{title}</p>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* CTA */}
      <div className="rounded-xl border bg-gradient-to-br from-primary/10 via-primary/5 to-background p-8 text-center space-y-4">
        <h2 className="text-xl font-bold">Configure SOHAM your way</h2>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Open the chat and click the ⚙️ icon to start customising.
        </p>
        <Button asChild size="lg">
          <Link href="/chat">
            Open Chat <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
