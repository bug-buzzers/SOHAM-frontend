'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  MessageSquare,
  Mic,
  Volume2,
  Share2,
  Settings,
  Zap,
  Brain,
  Globe,
  ArrowRight,
  CheckCircle,
  Smartphone,
  History,
  Lightbulb,
  Terminal,
} from 'lucide-react';

const coreFeatures = [
  {
    icon: Brain,
    title: 'Context-Aware Conversations',
    desc: 'SOHAM sees the earlier messages of the chat you are in, so you can ask follow-up questions without repeating yourself.',
  },
  {
    icon: Zap,
    title: 'Smart Auto-Routing',
    desc: 'On Auto, SOHAM picks a model for each message and decides whether it needs a web search or image generation first.',
  },
  {
    icon: Mic,
    title: 'Voice Input',
    desc: 'Talk instead of typing. Voice chat uses your browser\'s speech recognition and sends what you say.',
  },
  {
    icon: Volume2,
    title: 'Read Aloud',
    desc: 'Turn on speech output and replies are read aloud with your browser\'s built-in voices.',
  },
  {
    icon: Share2,
    title: 'Sharing & Export',
    desc: 'Copy or share a reply as text, Markdown or HTML, or download a whole chat as a JSON file.',
  },
  {
    icon: Globe,
    title: 'Live Web Search',
    desc: 'SOHAM searches the web for time-sensitive questions, or whenever you start a message with /search.',
  },
];

const interfaceItems = [
  { label: 'Message Input',        desc: 'Type your message here. Supports multi-line input with Shift+Enter.' },
  { label: 'Voice Button (🎤)',     desc: 'Turns voice chat on or off. While it is on, SOHAM listens, sends what you say and listens again after each reply.' },
  { label: 'Model Selection',      desc: 'In Settings (AI tab), switch models at any time or choose Auto.' },
  { label: 'Settings (⚙️)',         desc: 'Adjust model, tone, technical level, speech output, voice preset, theme and font weight.' },
  { label: 'Clear (sidebar)',      desc: 'Deletes every chat stored in this browser. It can\'t be undone.' },
  { label: 'Export / Share',       desc: 'Download a chat as JSON from the sidebar, or share a single reply.' },
];

const voiceInputSteps = [
  { title: 'Allow microphone access', body: 'When prompted by your browser, click "Allow" to grant microphone permission.' },
  { title: 'Click the microphone button', body: 'The mic button is in the message box. A short tone plays when SOHAM starts listening.' },
  { title: 'Speak your message', body: 'Speak clearly in English. Your browser turns your speech into text, and the message is sent as soon as you stop speaking.' },
  { title: 'Keep talking or stop', body: 'After each reply SOHAM listens again. Click the mic button again to end voice chat.' },
];

const ttsSteps = [
  { title: 'Open Settings', body: 'Click the ⚙️ icon in the chat header, or Settings in the sidebar or bottom bar.' },
  { title: 'Enable speech output', body: 'On the Voice tab, turn on "Enable speech output". You can also switch it on in Quick Settings.' },
  { title: 'Pick a voice preset (optional)', body: 'A preset is used only if your browser has a voice with that name. Otherwise your browser\'s default voice is used.' },
  { title: 'Send a message', body: 'SOHAM reads each new reply aloud with your browser\'s speech synthesis.' },
];

const conversationTips = [
  {
    icon: Lightbulb,
    tip: 'Be specific',
    example: 'Instead of "explain sorting", try "explain merge sort vs quicksort for a job interview".',
  },
  {
    icon: History,
    tip: 'Use follow-ups',
    example: '"Now show me a Python implementation" — SOHAM remembers the context from earlier in the chat.',
  },
  {
    icon: Terminal,
    tip: 'Use slash commands',
    example: '/solve for step-by-step working, /search for live web results, /summarize for condensed output.',
  },
  {
    icon: Settings,
    tip: 'Set your technical level',
    example: 'Set "Expert" in settings for dense, precise answers without hand-holding.',
  },
];

export default function ChatPage() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-2 text-sm">
          <MessageSquare className="h-4 w-4 text-primary" />
          <span className="font-medium">Chat Interface</span>
          <Badge variant="secondary" className="text-xs">Multi-model</Badge>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Chat Interface Guide</h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Everything you need to know about SOHAM&apos;s chat — from basic messaging to voice input,
          TTS, and advanced conversation techniques.
        </p>
      </div>

      {/* Core features */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Core Features</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coreFeatures.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex gap-3 rounded-xl border bg-background p-4">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">{title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interface overview */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Interface Overview</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="divide-y">
              {interfaceItems.map(({ label, desc }) => (
                <div key={label} className="flex items-start gap-4 py-3">
                  <code className="shrink-0 rounded bg-muted px-2 py-0.5 text-xs font-semibold">{label}</code>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Voice input */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
            <Mic className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Voice Chat</h2>
            <p className="text-sm text-muted-foreground">Uses your browser&apos;s speech recognition</p>
          </div>
        </div>
        <Card>
          <CardContent className="pt-6 space-y-5">
            <ol className="space-y-4">
              {voiceInputSteps.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-sm">{step.title}</p>
                    <p className="text-sm text-muted-foreground">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 p-4 flex gap-3">
              <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Voice chat works in browsers with speech recognition, such as Chrome, Edge and Safari,
                and listens for English. Some browsers send the audio to their maker for processing;
                Chrome, for example, uses Google&apos;s servers. The separate Record audio button needs
                server-side transcription, which is currently switched off, so use the mic button.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* TTS setup */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10">
            <Volume2 className="h-5 w-5 text-orange-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Read-Aloud Setup</h2>
            <p className="text-sm text-muted-foreground">Uses your browser&apos;s built-in voices</p>
          </div>
        </div>
        <Card>
          <CardContent className="pt-6 space-y-5">
            <ol className="space-y-4">
              {ttsSteps.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-sm">{step.title}</p>
                    <p className="text-sm text-muted-foreground">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="text-xs text-muted-foreground">
              Voice presets: Troy, Diana, Hannah, Autumn, Austin and Daniel. How a reply sounds depends on
              the voices installed in your browser and device.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Conversation tips */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Conversation Tips</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {conversationTips.map(({ icon: Icon, tip, example }) => (
            <Card key={tip}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Icon className="h-4 w-4 text-primary" />
                  {tip}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg bg-muted/60 px-3 py-2">
                  <p className="text-xs text-muted-foreground italic">{example}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Advanced features */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Advanced Features</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <History className="h-4 w-4 text-primary" />
                Conversation Memory
              </CardTitle>
              <CardDescription>What SOHAM remembers, and where</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                Each message is sent with the earlier messages of the same chat, so you can refer back:
                &quot;go back to the code you wrote in step 2&quot; or &quot;now apply that to the second
                example&quot;.
              </p>
              <p>
                Your chats are saved in this browser until you delete them. When you are signed in,
                SOHAM&apos;s server also keeps your messages, the replies and facts from your chats, and
                can use them as context in new conversations. See{' '}
                <Link href="/documentation/security" className="text-primary hover:underline">
                  Security &amp; Privacy
                </Link>
                .
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Brain className="h-4 w-4 text-primary" />
                Personalised Responses
              </CardTitle>
              <CardDescription>Settings that shape every reply</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                Your tone (Helpful / Formal / Casual) and technical level (Beginner / Intermediate /
                Expert) settings apply to every message in the session. Change them mid-conversation
                and the next response will reflect the new settings immediately.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mobile experience */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">
            <Smartphone className="h-5 w-5 text-green-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Mobile Chat Experience</h2>
            <p className="text-sm text-muted-foreground">Touch-optimised for Android and iOS</p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { title: 'Touch-friendly layout',        desc: 'Larger tap targets, a bottom navigation bar and a message box you can reach with your thumb.' },
            { title: 'Bottom sheet model selector',  desc: 'In Settings, the model list opens as a bottom sheet with every available model.' },
            { title: 'Voice priority',               desc: 'The microphone button is prominently placed for quick voice input — ideal when typing is inconvenient.' },
            { title: 'PWA full-screen mode',         desc: 'Install as a PWA for a native app feel with no browser chrome. See the Installation guide.' },
          ].map(({ title, desc }) => (
            <div key={title} className="flex items-start gap-3 rounded-xl border p-4">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-sm">{title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-xl border bg-gradient-to-br from-primary/10 via-primary/5 to-background p-8 text-center space-y-4">
        <h2 className="text-xl font-bold">Start chatting</h2>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Sign in, open the chat and start typing, or speak your first message.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg">
            <Link href="/chat">
              Open Chat <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/documentation/commands">Slash Commands</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
