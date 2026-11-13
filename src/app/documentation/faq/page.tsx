'use client';

import React from 'react';
import Link from 'next/link';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from '@/components/ui/accordion';
import {HelpCircle, Cpu, MessageSquare, Settings, Shield, Smartphone, Zap, ArrowRight} from 'lucide-react';
import {formatProviderList, getEnabledModels} from '@/lib/model-catalog';

// Built from models-config.json, the same list the chat model selector shows.
const ENABLED_MODELS = getEnabledModels();
const PROVIDERS = formatProviderList(ENABLED_MODELS);

export default function FAQPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-2 text-sm">
          <HelpCircle className="h-4 w-4 text-primary" />
          <span className="font-medium">FAQ & Troubleshooting</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Frequently Asked Questions</h1>
        <p className="text-xl text-muted-foreground">
          Answers to the most common questions about SOHAM features, setup, and troubleshooting.
        </p>
      </div>

      {/* Quick nav */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Jump to a Section
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {[
              {title: 'Getting Started', href: '#getting-started', icon: Zap},
              {title: 'AI Models', href: '#ai-models', icon: Cpu},
              {title: 'Features', href: '#features', icon: MessageSquare},
              {title: 'Technical Issues', href: '#technical', icon: Settings},
            ].map((s) => (
              <a key={s.href} href={s.href} className="block">
                <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg hover:bg-background/80 transition-colors">
                  <s.icon className="h-4 w-4 text-primary" />
                  <span className="font-medium text-sm">{s.title}</span>
                </div>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>

      <FAQSection
        id="getting-started"
        title="Getting Started"
        icon={Zap}
        questions={[
          {
            q: 'What is SOHAM?',
            a: `SOHAM (Self Organising Hyper Adaptive Machine) is a multi-model AI assistant built by Heoster (CODEEX-AI). It brings AI models from ${PROVIDERS} into one interface, with Auto mode, voice chat, PDF analysis, image generation and web search.`,
          },
          {
            q: 'Is SOHAM free?',
            a: 'Yes. There is nothing to pay for in SOHAM today: no subscriptions, no credits and no credit card. SOHAM relies on third-party AI providers, so usage limits apply (chat is currently limited to 30 requests per minute), and a model can be temporarily unavailable when its provider is busy.',
          },
          {
            q: 'Do I need to create an account?',
            a: 'Yes. You need to sign in to chat, either with Google or with an email address and password (handled by Firebase Authentication). Creating an account is free. Your chat list and settings are saved in the browser you use and don\'t sync between devices. When you\'re signed in, SOHAM\'s server also keeps a memory of your chats (see Privacy & Security below).',
          },
          {
            q: 'What can I ask SOHAM?',
            a: 'Anything: coding help, maths problems, general knowledge, homework, document analysis, image generation, web searches, creative writing, debugging and more. In Auto mode SOHAM also chooses a model for each request.',
          },
          {
            q: 'What does "SOHAM" mean?',
            a: 'SOHAM has two meanings. In the product, it stands for "Self Organising Hyper Adaptive Machine." The name is also inspired by the Sanskrit mantra Soham (So Hum), meaning "I am That" — representing unity of individual self with universal consciousness. Heoster chose this name to give the product both technical identity and human depth.',
          },
        ]}
      />

      <FAQSection
        id="ai-models"
        title="AI Models & Selection"
        icon={Cpu}
        questions={[
          {
            q: 'How many AI models are available?',
            a: `The model selector lists ${ENABLED_MODELS.length} models from ${PROVIDERS}: ${ENABLED_MODELS.map((model) => model.name).join(', ')}. The Groq models only answer when Groq is switched on for SOHAM; otherwise another model replies. The Models page has the details.`,
          },
          {
            q: 'What is Auto mode?',
            a: 'Auto mode (Auto (Smart Routing) in the model selector) lets SOHAM choose a model for each request based on what you ask. Each reply shows which model answered, and you can switch to a specific model at any time. It\'s a good default for most people.',
          },
          {
            q: 'Which models are completely free with no limits?',
            a: 'None are unlimited. SOHAM applies rate limits (for example, 30 chat requests per minute), and every model runs on a provider\'s free tier with its own quotas, so a model can be temporarily unavailable. When that happens another model answers, and the reply shows which one.',
          },
          {
            q: 'Which model is fastest?',
            a: 'The Flash-Lite Gemini models (Gemini 3.5 Flash-Lite and Gemini 3.1 Flash-Lite) are the lighter, quicker options. GPT-OSS 20B on Groq is also fast when Groq is switched on.',
          },
          {
            q: 'Which model is best for coding?',
            a: 'Try GPT-OSS 120B or Qwen 3.8 27B, or stay on Auto, which tries those coding models first when you ask for code. Both run on Groq, so when Groq is switched off a Gemini model answers instead.',
          },
        ]}
      />

      <FAQSection
        id="features"
        title="Features & Commands"
        icon={MessageSquare}
        questions={[
          {
            q: 'What are slash commands?',
            a: 'Slash commands are shortcuts at the start of a message: /solve for step-by-step answers to maths and coding problems, /search to look something up on the web, and /summarize to condense long text. You can also just ask naturally.',
          },
          {
            q: 'Does web search trigger automatically?',
            a: 'It can. When a message looks like it needs current information (words like "today", "latest" or "news"), SOHAM may search the web before answering. Start your message with /search to make sure it does.',
          },
          {
            q: 'How does voice input work?',
            a: 'Click the microphone button to start voice chat. Your browser\'s speech recognition turns what you say into text and sends it, and SOHAM listens again after each reply until you click the button again. It works in Chrome, Edge and Safari. The separate Record audio option needs server-side transcription, which is currently switched off.',
          },
          {
            q: 'How does text-to-speech work?',
            a: 'Turn on speech output in Settings (Voice tab) or Quick Settings, and replies are read aloud with your browser\'s built-in voices. You can also click the speaker icon on any reply. The voice presets (Troy, Diana, Hannah, Autumn, Austin and Daniel) only apply if your browser has a voice with that name.',
          },
          {
            q: 'How does image generation work?',
            a: 'Ask for an image in chat, for example "generate an image of a lighthouse at dawn". SOHAM creates it with the FLUX model on Pollinations.ai and shows it in the chat, where you can download it. Generated images are saved at a public link. Rate limits apply.',
          },
          {
            q: 'How does PDF analysis work?',
            a: 'Open the PDF Analyzer (/pdf-analyzer, also linked from /ai-services). Upload a PDF of up to 5 MB and ask a question about it. The PDF and your question are sent to SOHAM\'s server, where an AI model reads the document and answers. SOHAM doesn\'t keep the file. Useful for research papers, reports and documentation.',
          },
          {
            q: 'Does SOHAM remember our conversation?',
            a: 'Within a chat, yes: the earlier messages are sent with each new one, so you can say "explain that differently" or "give me another example". When you\'re signed in, SOHAM\'s server also keeps your chat history and facts from your chats, and can use them as context in other chats and on other devices.',
          },
        ]}
      />

      <FAQSection
        id="technical"
        title="Technical Issues & Troubleshooting"
        icon={Settings}
        questions={[
          {
            q: 'The AI isn\'t responding or is very slow',
            a: 'Try: (1) Refresh the page. (2) Check your internet connection. (3) Switch to a different model in Settings, because free-tier models can be busy at peak times. (4) Use Auto, which moves on to another model if one fails. (5) Clear your browser cache if the issue persists.',
          },
          {
            q: 'Voice input isn\'t working',
            a: 'Check that your browser has microphone permission (click the lock icon in the address bar) and that your microphone works in other apps. Use Chrome, Edge or Safari: Firefox doesn\'t support the speech recognition voice chat relies on. Voice input also needs HTTPS. Disable extensions that might block microphone access.',
          },
          {
            q: 'I can\'t install the mobile app',
            a: 'Android: Use Chrome, visit the site, tap the menu (⋮), and select "Add to Home screen." iOS: Use Safari only (not Chrome), tap the share button (□↑), then "Add to Home Screen." Make sure you\'re on the latest browser version.',
          },
          {
            q: 'My settings aren\'t saving',
            a: 'Settings are stored in your browser\'s storage (IndexedDB). Make sure site storage is allowed. Settings won\'t persist in private or incognito mode, and they don\'t sync between devices.',
          },
          {
            q: 'The AI gave an incorrect answer',
            a: 'Try: (1) Rephrase with more specific details. (2) Use /solve for math/coding, /search for current info. (3) Switch to a different model manually. (4) For current events, start your message with /search so SOHAM looks it up first. (5) Ask the AI to "try again" or "reconsider."',
          },
          {
            q: 'Image generation failed',
            a: 'Image generation has rate limits and depends on the image providers being available. Wait a minute and try again, make sure your prompt is clear and descriptive, and avoid prompts that might break content policies.',
          },
        ]}
      />

      <FAQSection
        id="mobile"
        title="Mobile & PWA"
        icon={Smartphone}
        questions={[
          {
            q: 'How do I install SOHAM on my phone?',
            a: 'SOHAM is a Progressive Web App (PWA). Android: Open in Chrome → menu (⋮) → "Add to Home screen." iOS: Open in Safari → share button (□↑) → "Add to Home Screen." The app will work like a native app with its own icon.',
          },
          {
            q: 'Does the installed app work offline?',
            a: 'Partly. The chat screen is cached, so the installed app can open without internet and chats saved in your browser stay on your device. Getting new AI responses always needs a connection.',
          },
          {
            q: 'Why install instead of using the browser?',
            a: 'The installed PWA gives you: full-screen experience without browser UI, faster loading with cached resources, home screen icon for quick access, and better integration with your device\'s app switcher.',
          },
        ]}
      />

      <FAQSection
        id="privacy"
        title="Privacy & Security"
        icon={Shield}
        questions={[
          {
            q: 'Is my data safe?',
            a: 'Connections use HTTPS and sign-in is handled by Firebase. Your chat list is saved in your browser (IndexedDB). When you\'re signed in, SOHAM\'s server also saves your messages, the replies and facts from your chats as memory, and your messages go to an AI provider to write the reply. No service is completely secure, so avoid sharing sensitive information. The Privacy Policy has the details.',
          },
          {
            q: 'Do you use my conversations to train AI models?',
            a: `SOHAM doesn't train AI models. Your messages are sent to AI providers (${PROVIDERS}) to generate replies, and each provider's terms apply; some free tiers let a provider use what it receives to improve its services. SOHAM also saves some questions and corrections, without your user ID, to a shared knowledge base that it uses when answering everyone.`,
          },
          {
            q: 'Can I delete my conversation history?',
            a: 'Yes. Delete individual chats from the chat sidebar, or use Clear to delete every chat stored in this browser. To delete the copy of your chats and the memories on SOHAM\'s server, email codeex@email.com from the address on your account.',
          },
        ]}
      />

      {/* Contact */}
      <Card>
        <CardHeader>
          <CardTitle>Still Need Help?</CardTitle>
          <CardDescription>Can't find the answer? Get in touch.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-semibold">📧 Email Support</h4>
              <p className="text-sm text-muted-foreground">
                Send a detailed message about your issue.
              </p>
              <Link href="/contact">
                <Button variant="outline" size="sm">
                  Contact Support
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">📚 More Docs</h4>
              <p className="text-sm text-muted-foreground">
                Browse all guides and tutorials.
              </p>
              <Link href="/documentation">
                <Button variant="outline" size="sm">
                  Browse Docs
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function FAQSection({
  id,
  title,
  icon: Icon,
  questions,
}: {
  id: string;
  title: string;
  icon: React.ElementType;
  questions: Array<{q: string; a: string}>;
}) {
  return (
    <div id={id} className="space-y-4 scroll-mt-20">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Icon className="h-6 w-6 text-primary" />
        {title}
      </h2>
      <Card>
        <CardContent className="p-0">
          <Accordion type="single" collapsible className="w-full">
            {questions.map((faq, i) => (
              <AccordionItem key={i} value={`${id}-${i}`} className="px-6">
                <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
