import { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Brain, Globe, HardDrive, Lock, Server, Share2, Shield, UserCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatProviderList } from '@/lib/model-catalog';

export const metadata: Metadata = {
  title: 'Security & Privacy - SOHAM',
  description:
    'What SOHAM saves in your browser and on its server, which services receive your messages, and how to delete your data.',
};

function InfoCard({
  icon: Icon,
  title,
  description,
  badge,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  badge: string;
  children: ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
            {title}
          </CardTitle>
          <Badge variant="outline">{badge}</Badge>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        <ul className="list-disc space-y-1.5 pl-5">{children}</ul>
      </CardContent>
    </Card>
  );
}

export default function SecurityPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-2 text-sm">
          <Shield className="h-4 w-4 text-primary" />
          <span className="font-medium">Security &amp; Privacy</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Security &amp; Privacy</h1>
        <p className="text-xl text-muted-foreground">
          What SOHAM saves, where your messages go and how to delete your data. The{' '}
          <Link href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>{' '}
          has the full details.
        </p>
      </div>

      <div className="grid gap-6">
        <InfoCard
          icon={HardDrive}
          title="Saved in your browser"
          description="Stays on the device you use"
          badge="On device"
        >
          <li>Your chat list, messages and settings are stored in this browser (IndexedDB).</li>
          <li>They don&apos;t sync to your other devices, and signing out doesn&apos;t delete them.</li>
          <li>
            Delete a chat from the chat sidebar, use <strong className="text-foreground">Clear</strong> to delete
            every chat in this browser, or clear this site&apos;s data in your browser settings.
          </li>
        </InfoCard>

        <InfoCard
          icon={Brain}
          title="Saved on SOHAM's server"
          description="Memory linked to your account, when you are signed in"
          badge="Server"
        >
          <li>A copy of each message you send and each reply (chat history).</li>
          <li>
            Facts and preferences SOHAM picks out of your chats, and a profile built from them. The profile can
            include your name, age, location, interests or job, if they come up.
          </li>
          <li>Searchable copies (embeddings) of your messages, used to find relevant past context.</li>
          <li>
            SOHAM uses all of this as context in later conversations, on any device. It is kept until you ask
            for it to be deleted, and deleting your account doesn&apos;t remove it. Email{' '}
            <a href="mailto:codeex@email.com" className="text-primary hover:underline">
              codeex@email.com
            </a>{' '}
            from the address on your account to get a copy or have it deleted.
          </li>
        </InfoCard>

        <InfoCard
          icon={Share2}
          title="Shared knowledge base"
          description="Used when SOHAM answers everyone"
          badge="Shared"
        >
          <li>
            Some factual questions and the start of their answers, messages that look like corrections or
            suggestions, and results from search tools can be saved to a knowledge base.
          </li>
          <li>These entries are saved without your user ID, but SOHAM can use them when answering other people.</li>
          <li>Leave personal details out of messages you wouldn&apos;t want to end up there.</li>
        </InfoCard>

        <InfoCard
          icon={Globe}
          title="Sent to other services"
          description="Needed to answer you"
          badge="Third party"
        >
          <li>Your messages go to AI model providers ({formatProviderList()}) to generate replies.</li>
          <li>Images you add in chat, and PDFs in the PDF Analyzer, are sent to an AI model to be read.</li>
          <li>Image prompts go to Pollinations.ai, which generates the image.</li>
          <li>
            For questions about current events, search terms from your message go to search and data services
            such as Tavily, Wikipedia, DuckDuckGo, GNews, Open-Meteo and CoinGecko.
          </li>
          <li>
            Voice chat and read-aloud use your browser&apos;s speech features, which may send audio or text to the
            browser maker.
          </li>
          <li>Google Analytics records which pages you visit.</li>
        </InfoCard>

        <InfoCard
          icon={UserCheck}
          title="Public by design"
          description="Visible to anyone"
          badge="Public"
        >
          <li>Images you generate are stored at public links that anyone with the link can open.</li>
          <li>
            Community posts show the name you enter, your text and tags, and your profile photo if your account
            has one.
          </li>
        </InfoCard>

        <InfoCard
          icon={Lock}
          title="How your account and data are protected"
          description="What SOHAM does today"
          badge="Security"
        >
          <li>Connections to SOHAM use HTTPS.</li>
          <li>Sign-in and passwords are handled by Firebase Authentication. SOHAM never receives your password.</li>
          <li>API keys for AI providers stay on the server and are never sent to your browser.</li>
          <li>Rate limits per IP address, such as 30 chat messages a minute, reduce abuse.</li>
          <li>No online service is completely secure, so SOHAM can&apos;t guarantee the security of your data.</li>
        </InfoCard>

        <InfoCard
          icon={Server}
          title="Good habits"
          description="Recommendations for using SOHAM safely"
          badge="Tips"
        >
          <li>Use Google sign-in, or a strong password you don&apos;t use anywhere else.</li>
          <li>Don&apos;t paste passwords, API keys, financial details or health information into chat.</li>
          <li>Check important answers. AI models can be wrong.</li>
          <li>On a shared device, sign out and clear the site&apos;s data to remove your chats from that browser.</li>
          <li>
            Report security concerns to{' '}
            <a href="mailto:codeex@email.com" className="text-primary hover:underline">
              codeex@email.com
            </a>
            .
          </li>
        </InfoCard>
      </div>
    </div>
  );
}
