import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Zap, Volume2, Palette, Share2, MessageSquare, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Personalization - SOHAM Documentation',
  description:
    'How to personalise SOHAM: model choice, response tone, technical level, reply font weight, theme, voice output and sharing.',
};

// Every option below exists in the chat settings dialog (src/components/settings-dialog.tsx)
// or the Account page. Keep this page in sync with those screens.

const responseSettings = [
  {
    title: 'Model',
    options: ['Auto (Smart Routing)', 'Any model in the selector'],
    description: 'Let SOHAM choose a model for each request, or pin the one you prefer.',
  },
  {
    title: 'Tone',
    options: ['Helpful', 'Formal', 'Casual'],
    description: 'Sets the overall voice of replies.',
  },
  {
    title: 'Technical level',
    options: ['Beginner', 'Intermediate', 'Expert'],
    description: 'Controls how much background is explained and how technical the wording is.',
  },
];

const voicePresets = [
  'Troy (Balanced)',
  'Diana (Professional)',
  'Hannah (Warm)',
  'Autumn (Gentle)',
  'Austin (Energetic)',
  'Daniel (Commanding)',
];

const faqs = [
  {
    q: 'Where are my personalization settings stored?',
    a: 'They are saved in your browser (IndexedDB) on the device you use, so they do not follow you to other devices. Your tone, technical level and model choice are sent along with each message so the AI can follow them.',
  },
  {
    q: 'Can I reset my settings?',
    a: "Change any option back in the settings dialog. Clearing this site's data in your browser resets everything stored on that device, including your chat history.",
  },
  {
    q: 'Do these settings work with every model?',
    a: 'Yes. Tone and technical level are applied to whichever model answers, including when Auto mode chooses the model.',
  },
];

export default function PersonalizationDocsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <User className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">AI Personalization</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Adjust how SOHAM answers, sounds and looks. Open the settings dialog from the chat header, or
            use the Account page.
          </p>
        </div>

        {/* Response settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Response Behavior
            </CardTitle>
            <CardDescription>Shape how SOHAM responds to your questions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {responseSettings.map((setting) => (
                <div key={setting.title} className="space-y-2">
                  <h3 className="font-semibold">{setting.title}</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {setting.options.map((option) => (
                      <Badge key={option} variant="outline">
                        {option}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">{setting.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Voice */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="h-5 w-5" />
              Voice Output
            </CardTitle>
            <CardDescription>Have replies read aloud</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Turn on <strong className="text-foreground">Speech output</strong> to hear assistant replies,
              or press the speaker icon on any message. Voices come from Groq Orpheus text-to-speech, with
              Edge TTS and your browser&apos;s speech engine as fallbacks.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {voicePresets.map((voice) => (
                <Badge key={voice} variant="secondary">
                  {voice}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Appearance
            </CardTitle>
            <CardDescription>Make the workspace comfortable to read</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h3 className="font-semibold">Theme</h3>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="outline">Light</Badge>
                  <Badge variant="outline">Dark</Badge>
                  <Badge variant="outline">System</Badge>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Reply font weight</h3>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="outline">Regular</Badge>
                  <Badge variant="outline">Medium</Badge>
                  <Badge variant="outline">Bold</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sharing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Sharing & Export
            </CardTitle>
            <CardDescription>Keep or share what SOHAM writes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2 text-sm">
                <h3 className="font-semibold">Share a reply</h3>
                <p className="text-muted-foreground">
                  Copy a reply as plain text, Markdown or HTML, or share it by email, on X, LinkedIn or
                  Facebook, or through your device&apos;s share menu.
                </p>
              </div>
              <div className="space-y-2 text-sm">
                <h3 className="font-semibold">Export a chat</h3>
                <p className="text-muted-foreground">
                  Use the export button next to a chat in the sidebar to download the whole conversation as
                  JSON.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Getting started */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Suggested Starting Point
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Leave the model on Auto, pick the tone you like, and set the technical level to match how much
              detail you want. You can change any of these at any time, and the next reply will follow the
              new setting.
            </p>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q}>
                <h3 className="font-semibold">Q: {faq.q}</h3>
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
