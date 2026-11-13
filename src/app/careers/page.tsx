import Link from 'next/link';
import { Mail } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/page-header';

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageHeader backLink="/" backText="Back to Home" title="Careers" />
      <main className="container mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-12">
        <div className="space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Careers at CODEEX-AI</h2>
          <p className="text-lg text-muted-foreground">
            There are no open positions right now. SOHAM is built by Heoster, with a group of friends
            helping as testers.
          </p>
        </div>

        <Card className="mt-10 rounded-3xl border-border/70">
          <CardHeader>
            <CardTitle>Want to help?</CardTitle>
            <CardDescription>
              If you&apos;d like to collaborate, test new features or share feedback, get in touch.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/contact">
                <Mail className="h-4 w-4" />
                Contact us
              </Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
