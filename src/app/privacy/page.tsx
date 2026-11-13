import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowLeft,
  Bell,
  Brain,
  Clock,
  Cookie,
  Database,
  Eye,
  Globe,
  HardDrive,
  Lock,
  Mail,
  Share2,
  Shield,
  UserCheck,
  Users,
} from 'lucide-react';
import { pageSEO } from '@/lib/seo-config';
import { PRIVACY_LAST_UPDATED, formatContentDate } from '@/lib/content-dates';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const metadata: Metadata = {
  title: pageSEO.privacy.title,
  description: pageSEO.privacy.description,
  keywords: pageSEO.privacy.keywords,
  alternates: { canonical: 'https://soham-ai.vercel.app/privacy' },
  openGraph: {
    title: pageSEO.privacy.title,
    description: pageSEO.privacy.description,
    url: 'https://soham-ai.vercel.app/privacy',
    siteName: 'SOHAM',
    images: [{ url: 'https://soham-ai.vercel.app/Multi-Chat.png', width: 1200, height: 630, alt: 'SOHAM Privacy Policy' }],
    type: 'website',
  },
};

const LAST_UPDATED = formatContentDate(PRIVACY_LAST_UPDATED);
const CONTACT_EMAIL = 'codeex@email.com';

const SECTIONS = [
  { id: 'introduction', title: 'Introduction' },
  { id: 'information', title: 'Information We Collect' },
  { id: 'memory', title: 'Memory and the Shared Knowledge Base' },
  { id: 'usage', title: 'How We Use Your Information' },
  { id: 'storage', title: 'Where Your Information Is Stored' },
  { id: 'third-party', title: 'Service Providers' },
  { id: 'sharing', title: 'When Information Is Shared or Public' },
  { id: 'retention', title: 'How Long We Keep Information' },
  { id: 'rights', title: 'Your Choices and Rights' },
  { id: 'cookies', title: 'Cookies and Browser Storage' },
  { id: 'google-api', title: 'Google API Services and User Data' },
  { id: 'children', title: "Children's Privacy" },
  { id: 'international', title: 'International Users' },
  { id: 'security', title: 'Security' },
  { id: 'changes', title: 'Changes to This Policy' },
  { id: 'contact', title: 'Contact Us' },
] as const;

type SectionId = (typeof SECTIONS)[number]['id'];

function heading(id: SectionId): string {
  const index = SECTIONS.findIndex((section) => section.id === id);
  return `${index + 1}. ${SECTIONS[index].title}`;
}

function Section({ id, icon: Icon, children }: { id: SectionId; icon: LucideIcon; children: ReactNode }) {
  return (
    <Card id={id} className="scroll-mt-20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
          <CardTitle>{heading(id)}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 text-sm leading-relaxed">{children}</CardContent>
    </Card>
  );
}

function Subheading({ children }: { children: ReactNode }) {
  return <h3 className="font-semibold mb-2">{children}</h3>;
}

function Bullets({ children }: { children: ReactNode }) {
  return <ul className="list-disc space-y-1.5 pl-5">{children}</ul>;
}

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
      {children}
    </a>
  );
}

function EmailLink() {
  return (
    <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:underline">
      {CONTACT_EMAIL}
    </a>
  );
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Privacy Policy</h1>
              <p className="text-muted-foreground mt-1">
                Last updated: <time dateTime={PRIVACY_LAST_UPDATED}>{LAST_UPDATED}</time>
              </p>
            </div>
          </div>

          <Alert className="mt-4">
            <Eye className="h-4 w-4" />
            <AlertDescription>
              This policy explains what SOHAM collects, where it is stored, who it is shared with and how
              you can delete it. It describes how SOHAM works today, including the memory that SOHAM&apos;s
              server keeps for signed-in users.
            </AlertDescription>
          </Alert>
        </div>

        {/* Short version */}
        <Card className="mb-8 border-primary/30">
          <CardHeader>
            <CardTitle className="text-lg">The short version</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed">
            <Bullets>
              <li>You need an account to chat. Sign-in is handled by Firebase Authentication, a Google service.</li>
              <li>
                Your chat list is saved in your browser. When you are signed in, SOHAM&apos;s server also saves
                your messages and the replies, facts it picks up from your chats, and a profile built from
                them, so the assistant can remember context across sessions and devices.
              </li>
              <li>
                To answer you, your messages are sent to AI model providers (Google Gemini, OpenRouter and
                Groq) and, for some questions, to search and live-data services.
              </li>
              <li>
                Some questions and answers, and messages that look like corrections or suggestions, can be
                added to a knowledge base that SOHAM uses when answering everyone. These entries are not
                linked to your account.
              </li>
              <li>Images you generate are stored at public links. Community posts are public.</li>
              <li>We use Google Analytics. We don&apos;t sell your personal information and we don&apos;t show ads.</li>
              <li>
                You can delete chats in the app and delete your account in Account settings. To delete what
                SOHAM&apos;s server has saved, email <EmailLink />.
              </li>
            </Bullets>
          </CardContent>
        </Card>

        {/* Quick Navigation */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Quick Navigation</CardTitle>
          </CardHeader>
          <CardContent>
            <nav aria-label="Privacy policy sections" className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {SECTIONS.map((section) => (
                <a key={section.id} href={`#${section.id}`} className="text-sm text-primary hover:underline">
                  {heading(section.id)}
                </a>
              ))}
            </nav>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Section id="introduction" icon={Shield}>
            <p>
              This Privacy Policy explains what information SOHAM collects, how it is used, who it is shared
              with and the choices you have. It applies to the SOHAM website and app at soham-ai.vercel.app,
              including the version you can install on your device.
            </p>
            <p>
              SOHAM is built and run by Heoster (Harsh) under the CODEEX-AI name, from Khatauli, Uttar Pradesh,
              India. In this policy, &quot;SOHAM&quot;, &quot;we&quot; and &quot;us&quot; mean that operator.
            </p>
            <p>By using SOHAM you agree to this policy. If you don&apos;t agree, please don&apos;t use SOHAM.</p>
          </Section>

          <Section id="information" icon={Database}>
            <div>
              <Subheading>Account information</Subheading>
              <p>When you create an account or sign in, Firebase Authentication (a Google service) processes:</p>
              <Bullets>
                <li>your email address;</li>
                <li>your display name and, if you sign in with Google, your profile photo;</li>
                <li>the user ID that Firebase gives your account;</li>
                <li>your password, if you sign up with email and password. Firebase handles it and we never receive it.</li>
              </Bullets>
            </div>

            <div>
              <Subheading>What you send in chat</Subheading>
              <p>Each time you send a message, SOHAM&apos;s server receives:</p>
              <Bullets>
                <li>your message and the recent messages in that conversation;</li>
                <li>your tone, technical level and model settings;</li>
                <li>your user ID, if you are signed in.</li>
              </Bullets>
              <p className="mt-2">
                Section 3 explains what the server keeps from these messages.
              </p>
            </div>

            <div>
              <Subheading>Images, files and voice</Subheading>
              <Bullets>
                <li>
                  <strong>Images you add in chat</strong> (upload or camera) are uploaded to our website server,
                  which schedules them for deletion after about an hour, and sent to Google Gemini for analysis.
                  What Gemini recognises in the image becomes part of your message.
                </li>
                <li>
                  <strong>PDFs</strong> you upload to the PDF Analyzer (up to 5 MB) are sent with your question to
                  SOHAM&apos;s server and to an AI model provider. We don&apos;t keep a copy.
                </li>
                <li>
                  <strong>Images you generate</strong> are saved in a public storage bucket (Supabase Storage) so
                  they can be shown in chat. Anyone who has the link can open them. Your prompt is sent to the
                  image generation service.
                </li>
                <li>
                  <strong>Voice input</strong> uses your browser&apos;s speech recognition. Depending on your
                  browser, the browser maker may process the audio; Chrome, for example, sends it to Google. If
                  you use <em>Record audio</em>, the clip is sent to SOHAM&apos;s server for transcription and is
                  not stored.
                </li>
                <li>
                  <strong>Read aloud</strong> uses your browser&apos;s built-in voices. Some browsers use online
                  voices, in which case the browser maker processes the text being read.
                </li>
              </Bullets>
            </div>

            <div>
              <Subheading>Community board, contact form and emails</Subheading>
              <Bullets>
                <li>
                  <strong>Community posts are public.</strong> A post includes the name you enter (or
                  &quot;Anonymous&quot;), the text and tags you write, your profile photo if your account has one,
                  and your user ID. Reports you send about posts are saved too.
                </li>
                <li>
                  <strong>Contact form:</strong> your name, email address, subject and message are sent to us by
                  email through EmailJS.
                </li>
                <li>
                  <strong>Welcome email:</strong> when you create an account, we send a welcome email through
                  EmailJS, which receives your email address and display name.
                </li>
              </Bullets>
            </div>

            <div>
              <Subheading>Technical and usage information</Subheading>
              <Bullets>
                <li>
                  <strong>IP address:</strong> used to apply rate limits. Our hosting providers also record it in
                  server request logs, with the time and the page or API path requested.
                </li>
                <li>
                  <strong>Server logs:</strong> SOHAM&apos;s servers log errors and some processing steps. These logs
                  can include your user ID and short snippets of message text.
                </li>
                <li>
                  <strong>Google Analytics:</strong> the pages you visit, your approximate location (worked out
                  from your IP address), your device and browser, and how you reached the site. It uses cookies.
                </li>
              </Bullets>
            </div>
          </Section>

          <Section id="memory" icon={Brain}>
            <div>
              <Subheading>Memory linked to your account</Subheading>
              <p>
                When you are signed in, SOHAM&apos;s server saves the following, linked to your user ID, and uses it
                as context when it answers you, on any device:
              </p>
              <Bullets>
                <li><strong>Chat history:</strong> a copy of each message you send and each reply.</li>
                <li>
                  <strong>Memories:</strong> facts and preferences that SOHAM picks out of your conversations, such
                  as your name, interests or details about your work. They are extracted automatically, by an AI
                  model or by simple rules.
                </li>
                <li>
                  <strong>Profile:</strong> a summary built from those memories. It can include your name, age,
                  location, language, time zone, occupation, likes, dislikes and preferred response style, but
                  only if they come up in your chats.
                </li>
                <li>
                  <strong>Searchable copies:</strong> embeddings (numeric representations) of your messages and
                  the replies, used to find relevant past context. Google&apos;s embedding service may be used to
                  create them.
                </li>
              </Bullets>
              <p className="mt-2">
                The chat list you see in the sidebar is separate: it is stored in your browser and is not synced
                between devices.
              </p>
            </div>

            <div>
              <Subheading>Shared knowledge base</Subheading>
              <p>To answer common questions faster, SOHAM&apos;s server can also save, without your user ID:</p>
              <Bullets>
                <li>
                  the text of a question that looks factual (up to 200 characters) together with the start of the
                  reply;
                </li>
                <li>messages that look like a correction or a suggestion (up to a few hundred characters);</li>
                <li>results from search and live-data tools, such as news, weather and prices.</li>
              </Bullets>
              <p className="mt-2">
                These entries can be used as background context when SOHAM answers other people. Please
                don&apos;t include personal details in a message if you don&apos;t want them to end up there.
              </p>
            </div>
          </Section>

          <Section id="usage" icon={Bell}>
            <p>We use the information above to:</p>
            <Bullets>
              <li>sign you in and keep your account working;</li>
              <li>answer your messages and run tools such as web search, image generation, image analysis and PDF analysis;</li>
              <li>personalise replies with your settings and the memory described in Section 3;</li>
              <li>keep SOHAM available and secure, for example with rate limits, and find and fix errors;</li>
              <li>understand how the site is used, in aggregate, through Google Analytics;</li>
              <li>send the welcome email and reply when you contact us;</li>
              <li>meet legal obligations and enforce our Terms of Service.</li>
            </Bullets>
            <p>
              We don&apos;t sell your personal information, we don&apos;t use it for advertising and we don&apos;t train
              AI models on it ourselves. The providers in Section 6 handle what they receive under their own terms.
            </p>
          </Section>

          <Section id="storage" icon={HardDrive}>
            <div>
              <Subheading>On your device</Subheading>
              <Bullets>
                <li>your chats and messages, and your settings (browser IndexedDB);</li>
                <li>your sign-in session (kept by Firebase in your browser);</li>
                <li>your theme and your community votes (browser local storage);</li>
                <li>app pages, static files and recently viewed generated images (service worker cache).</li>
              </Bullets>
            </div>
            <div>
              <Subheading>On servers we use</Subheading>
              <Bullets>
                <li>account records: Firebase Authentication (Google);</li>
                <li>chat history, memories, profiles, community posts and reports: a Supabase database;</li>
                <li>generated images: Supabase Storage, at public links;</li>
                <li>searchable copies of messages and the shared knowledge base: Upstash Vector;</li>
                <li>images uploaded in chat, temporarily: our website server (hosted on Vercel);</li>
                <li>request and error logs: our hosting providers, Vercel and Render.</li>
              </Bullets>
            </div>
          </Section>

          <Section id="third-party" icon={Globe}>
            <p>These services receive information so that SOHAM can work:</p>

            <div>
              <Subheading>Hosting, accounts and storage</Subheading>
              <Bullets>
                <li>
                  <strong>Firebase Authentication (Google):</strong> sign-in and account records.{' '}
                  <ExternalLink href="https://firebase.google.com/support/privacy">Firebase privacy</ExternalLink>
                </li>
                <li>
                  <strong>Vercel:</strong> hosts the website and its API routes.{' '}
                  <ExternalLink href="https://vercel.com/legal/privacy-policy">Vercel privacy</ExternalLink>
                </li>
                <li>
                  <strong>Render:</strong> hosts SOHAM&apos;s backend server, which handles chat, memory, search and
                  image generation. <ExternalLink href="https://render.com/privacy">Render privacy</ExternalLink>
                </li>
                <li>
                  <strong>Supabase:</strong> database and file storage (see Section 5).{' '}
                  <ExternalLink href="https://supabase.com/privacy">Supabase privacy</ExternalLink>
                </li>
                <li><strong>Upstash:</strong> vector database for searchable copies of messages and the shared knowledge base.</li>
              </Bullets>
            </div>

            <div>
              <Subheading>AI models</Subheading>
              <Bullets>
                <li>
                  <strong>Google (Gemini API):</strong> chat replies, image analysis, PDF analysis and embeddings.{' '}
                  <ExternalLink href="https://ai.google.dev/gemini-api/terms">Gemini API terms</ExternalLink>
                </li>
                <li>
                  <strong>OpenRouter:</strong> passes some requests to free models run by other companies, which
                  then receive the request.{' '}
                  <ExternalLink href="https://openrouter.ai/privacy">OpenRouter privacy</ExternalLink>
                </li>
                <li>
                  <strong>Groq:</strong> runs the GPT-OSS and Qwen models when Groq is switched on for SOHAM.{' '}
                  <ExternalLink href="https://groq.com/privacy-policy">Groq privacy</ExternalLink>
                </li>
                <li>
                  <strong>Image generation:</strong> Pollinations.ai receives your image prompt. Cloudflare Workers AI
                  is used instead only if it is switched on for SOHAM.
                </li>
              </Bullets>
              <p className="mt-2">
                SOHAM uses free tiers of these services. Some free tiers let the provider keep what it receives and
                use it to improve its products, and providers that OpenRouter routes to may log requests. Please
                check their terms, and avoid sending sensitive information.
              </p>
            </div>

            <div>
              <Subheading>Search and live data</Subheading>
              <p>
                When a question needs current information, search terms taken from your message (not your account
                details) are sent to services such as Tavily, Firecrawl, You.com, Wikipedia, DuckDuckGo, GNews,
                Open-Meteo, CricAPI, CoinGecko, Alpha Vantage, Binance and ExchangeRate-API.
              </p>
            </div>

            <div>
              <Subheading>Email and analytics</Subheading>
              <Bullets>
                <li>
                  <strong>EmailJS:</strong> welcome emails and the contact form.{' '}
                  <ExternalLink href="https://www.emailjs.com/legal/privacy-policy/">EmailJS privacy</ExternalLink>
                </li>
                <li>
                  <strong>Google Analytics:</strong> usage statistics.{' '}
                  <ExternalLink href="https://policies.google.com/technologies/partner-sites">
                    How Google uses this data
                  </ExternalLink>
                </li>
              </Bullets>
            </div>
          </Section>

          <Section id="sharing" icon={Share2}>
            <p>We don&apos;t sell, trade or rent your personal information. Information is shared or made public only:</p>
            <Bullets>
              <li>with the service providers in Section 6, so that SOHAM can work;</li>
              <li>when you publish it yourself, as with community posts and the links to images you generate;</li>
              <li>as entries in the shared knowledge base described in Section 3, without your user ID;</li>
              <li>when you ask us to, or agree to it;</li>
              <li>
                when the law requires it, or to protect the rights, property or safety of SOHAM, its users or
                others;
              </li>
              <li>to a new owner, if SOHAM is ever sold or merged. This policy would continue to apply to your information.</li>
            </Bullets>
          </Section>

          <Section id="retention" icon={Clock}>
            <Bullets>
              <li>
                <strong>Chats in your browser:</strong> until you delete them in the chat sidebar, use{' '}
                <em>Clear</em>, or clear this site&apos;s data in your browser.
              </li>
              <li>
                <strong>Chat history, memories, profile and searchable copies on the server:</strong> kept until
                you ask us to delete them. There is no automatic expiry at the moment, and deleting your account does
                not remove them by itself.
              </li>
              <li>
                <strong>Shared knowledge base:</strong> question-and-answer entries are treated as expired after 7
                days and tool results after a few hours, but they can stay in storage until removed. Corrections and
                suggestions don&apos;t expire.
              </li>
              <li><strong>Generated images:</strong> kept in storage until they are removed.</li>
              <li><strong>Images uploaded in chat:</strong> scheduled for deletion about an hour after upload.</li>
              <li><strong>Community posts and reports:</strong> until you or we delete them.</li>
              <li>
                <strong>Account:</strong> until you delete it in Account settings. Firebase deletes your sign-in
                record when you do.
              </li>
              <li>
                <strong>Emails:</strong> contact messages and welcome emails stay in our inbox and in EmailJS for as
                long as we need them.
              </li>
              <li>
                <strong>Logs and analytics:</strong> kept by our hosting providers and Google Analytics for their
                retention periods.
              </li>
            </Bullets>
          </Section>

          <Section id="rights" icon={UserCheck}>
            <Bullets>
              <li><strong>See or change your account details:</strong> in Account settings.</li>
              <li>
                <strong>Delete chats:</strong> delete a chat from the chat sidebar, or use <em>Clear</em> to delete
                every chat stored in this browser.
              </li>
              <li><strong>Export a chat:</strong> download any chat as a JSON file from the chat sidebar.</li>
              <li>
                <strong>Delete your account:</strong> Account settings → Delete Account. This deletes your Firebase
                sign-in record.
              </li>
              <li>
                <strong>Get or delete server-side data:</strong> email <EmailLink /> from the address on your
                account. We will send you, or delete, the chat history, memories, profile, searchable copies and
                community posts linked to your user ID. Knowledge base entries are not linked to you, so tell us the
                text and we will look for it.
              </li>
              <li>
                <strong>Analytics:</strong> block cookies for this site, or use the{' '}
                <ExternalLink href="https://tools.google.com/dlpage/gaoptout">
                  Google Analytics opt-out browser add-on
                </ExternalLink>
                .
              </li>
              <li>
                <strong>Withdraw consent:</strong> stop using SOHAM at any time and ask us to delete your data.
              </li>
            </Bullets>
            <p>
              Depending on where you live, laws such as India&apos;s Digital Personal Data Protection Act 2023, the
              GDPR in the EU and UK, or the CCPA in California may give you rights to access, correct, delete or
              port your personal data, to object to some uses of it, and to complain to a data protection
              authority. Email us to use any of these rights.
            </p>
          </Section>

          <Section id="cookies" icon={Cookie}>
            <Bullets>
              <li><strong>Google Analytics cookies</strong> (named _ga and _ga_ followed by an ID): usage statistics.</li>
              <li><strong>Firebase Authentication:</strong> keeps you signed in, using your browser&apos;s storage.</li>
              <li><strong>IndexedDB:</strong> your chats, messages, settings and whether you dismissed the install prompt.</li>
              <li><strong>Local storage:</strong> your theme choice and your likes and votes on the community board.</li>
              <li>
                <strong>Service worker cache:</strong> app pages, static files and recently viewed generated images,
                so the app loads faster and can show an offline page.
              </li>
            </Bullets>
            <p>
              SOHAM doesn&apos;t use advertising cookies. You can clear all of this in your browser settings. Signing
              out does not delete the chats saved in your browser.
            </p>
          </Section>

          <Section id="google-api" icon={Lock}>
            <Alert className="mb-2">
              <Bell className="h-4 w-4" />
              <AlertDescription>
                SOHAM&apos;s use and transfer of information received from Google APIs adheres to the{' '}
                <ExternalLink href="https://developers.google.com/terms/api-services-user-data-policy">
                  Google API Services User Data Policy
                </ExternalLink>
                , including the Limited Use requirements.
              </AlertDescription>
            </Alert>

            <div>
              <Subheading>What Google data we access</Subheading>
              <p>
                When you sign in with Google, Firebase Authentication asks Google for basic sign-in information
                only (the openid, email and profile scopes): your email address, name and profile photo.
              </p>
              <p className="mt-2 text-muted-foreground">
                SOHAM does not access your Gmail, Google Drive, Calendar, Contacts or any other Google service.
              </p>
            </div>

            <div>
              <Subheading>How we use it</Subheading>
              <Bullets>
                <li>to create your SOHAM account and sign you in;</li>
                <li>to show your name and photo in the app;</li>
                <li>to fill in the author name on community posts, which you can change before posting;</li>
                <li>to send the welcome email.</li>
              </Bullets>
              <p className="mt-2">
                We don&apos;t use Google user data for advertising, we don&apos;t sell it, and we don&apos;t send it to
                AI model providers or use it to train AI models.
              </p>
            </div>

            <div>
              <Subheading>Who receives it</Subheading>
              <Bullets>
                <li>Firebase (Google), which handles sign-in;</li>
                <li>EmailJS, which receives your email address and name to send the welcome email;</li>
                <li>everyone who reads the community board, if you publish a post (your photo and the name you choose);</li>
                <li>authorities, only if the law requires it.</li>
              </Bullets>
            </div>

            <div>
              <Subheading>Storage, retention and deletion</Subheading>
              <p>
                Google user data travels over HTTPS and is stored by Firebase while your account exists. Deleting
                your account in Account settings deletes your Firebase sign-in record. Community posts keep the
                name and photo link until the post is deleted; email us to remove them. You can also revoke
                SOHAM&apos;s access at any time in your{' '}
                <ExternalLink href="https://myaccount.google.com/permissions">Google Account permissions</ExternalLink>.
              </p>
            </div>

            <p className="font-semibold">
              SOHAM is an independent service and is not affiliated with, endorsed by or sponsored by Google. Your
              use of Google Sign-In is also subject to{' '}
              <ExternalLink href="https://policies.google.com/privacy">Google&apos;s Privacy Policy</ExternalLink> and{' '}
              <ExternalLink href="https://policies.google.com/terms">Google&apos;s Terms of Service</ExternalLink>.
            </p>
          </Section>

          <Section id="children" icon={Users}>
            <p>
              SOHAM is intended for people aged 13 and over. We don&apos;t knowingly collect personal information
              from children under 13. If you are under 18, you should have permission from a parent or guardian
              before using SOHAM.
            </p>
            <p>
              If you believe a child under 13 has given us personal information, contact us at <EmailLink /> and we
              will delete it.
            </p>
          </Section>

          <Section id="international" icon={Globe}>
            <p>
              SOHAM is run from India. The providers listed in Section 6 process information in the United States
              and other countries. By using SOHAM, you understand that your information may be processed outside
              your country, where data protection laws can differ.
            </p>
          </Section>

          <Section id="security" icon={Lock}>
            <Bullets>
              <li>Connections to SOHAM use HTTPS.</li>
              <li>API keys for AI providers are kept on our servers and are never sent to your browser.</li>
              <li>Rate limits reduce abuse of the service.</li>
            </Bullets>
            <Alert className="mt-2">
              <AlertDescription>
                No service can be completely secure, and we can&apos;t guarantee the security of your information.
                Please don&apos;t share passwords, financial details, health information or other sensitive data in
                chat.
              </AlertDescription>
            </Alert>
          </Section>

          <Section id="changes" icon={Bell}>
            <p>
              We will update this policy when SOHAM&apos;s features or data practices change. When we do, we will
              change the &quot;Last updated&quot; date at the top of this page and, for significant changes, post a
              notice in the app. If you keep using SOHAM after a change, the updated policy applies.
            </p>
          </Section>

          <Section id="contact" icon={Mail}>
            <p>
              If you have a question about this policy or want to use your rights, contact us:
            </p>
            <div className="space-y-1">
              <p><strong>Developer:</strong> Heoster (Harsh)</p>
              <p><strong>Email:</strong> <EmailLink /></p>
              <p><strong>Location:</strong> Khatauli, Uttar Pradesh, India</p>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <Link href="/contact">
                <Button variant="outline" size="sm">Contact Form</Button>
              </Link>
              <Link href="/terms">
                <Button variant="outline" size="sm">Terms of Service</Button>
              </Link>
              <Link href="/account-settings">
                <Button variant="outline" size="sm">Account Settings</Button>
              </Link>
            </div>
          </Section>

          {/* Summary */}
          <Card className="border-primary/30 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>✓ We don&apos;t sell your personal information or show ads</p>
              <p>✓ Your chat list is saved in your browser; when you&apos;re signed in, SOHAM&apos;s server also saves your chats and memories</p>
              <p>✓ Messages are sent to AI providers (Google Gemini, OpenRouter, Groq) to generate replies</p>
              <p>✓ Some questions and corrections can be added to a shared knowledge base, without your user ID</p>
              <p>✓ Generated images and community posts are public</p>
              <p>✓ You can delete chats and your account in the app, and ask us to delete server-side data</p>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© 2026 SOHAM. All rights reserved.</p>
          <p className="mt-2">This Privacy Policy is effective as of {LAST_UPDATED}.</p>
        </div>
      </div>
    </div>
  );
}
