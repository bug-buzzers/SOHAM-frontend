'use client';

import type { ReactNode } from 'react';
import {
  Sparkles,
  Code,
  MessageCircle,
  Image as ImageIcon,
  Zap,
  CheckCircle,
  Info
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/page-header';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  CATEGORY_LABELS,
  formatContextWindow,
  getEnabledModels,
  groupModels,
  formatProviderList,
} from '@/lib/model-catalog';
import modelsConfigData from '@/lib/models-config.json';

const CATEGORY_STYLES: Record<string, { icon: ReactNode; color: string; bgColor: string; description: string }> = {
  general: {
    icon: <Sparkles className="h-6 w-6" />,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    description: 'Versatile models for everyday questions, writing and broad knowledge tasks',
  },
  coding: {
    icon: <Code className="h-6 w-6" />,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    description: 'Models suited to code generation, debugging and multi-step reasoning',
  },
  conversation: {
    icon: <MessageCircle className="h-6 w-6" />,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    description: 'Lightweight models for quick conversational replies',
  },
  multimodal: {
    icon: <ImageIcon className="h-6 w-6" />,
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/10',
    description: 'Models that can work with images as well as text',
  },
};

// Built from models-config.json (enabled models only), the same list the chat model selector shows.
const enabledModels = getEnabledModels();

const modelCategories = groupModels(enabledModels, 'category').map(({ key, models }) => {
  const style = CATEGORY_STYLES[key] ?? CATEGORY_STYLES.general;
  return {
    name: CATEGORY_LABELS[key] ?? key,
    icon: style.icon,
    color: style.color,
    bgColor: style.bgColor,
    description: style.description,
    models: models.map((model) => ({
      name: model.name,
      provider: model.providerLabel,
      description: model.description,
      contextWindow: formatContextWindow(model.contextWindow),
      features: model.supportsStreaming ? ['Streaming'] : [],
      recommended: false,
    })),
  };
});

const apiKeyEnvVars = Object.values(modelsConfigData.providers as Record<string, { apiKeyEnvVar: string }>)
  .map((provider) => provider.apiKeyEnvVar)
  .join(', ');

export default function ModelsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageHeader 
        backLink="/" 
        backText="Back to Home" 
        title="AI Models"
      />
      
      <main className="container mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        {/* Hero Section */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Choose the Right Model{' '}
            <span className="block gradient-text">for Every Task</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            SOHAM currently offers {enabledModels.length} models from {formatProviderList(enabledModels)}.
            Pick one yourself, or let Auto mode choose one for each request.
          </p>
        </div>

        {/* Auto-Routing Feature */}
        <Card className="mb-12 border-primary/50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <CardTitle>Smart Auto-Routing</CardTitle>
                <CardDescription>
                  Let SOHAM choose a model for each request
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Leave the model selector on Auto (Smart Routing) and SOHAM looks at your request to
              choose a model for it. Each reply shows which model answered, so you can switch
              manually whenever you prefer a different one.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Automatic Selection</p>
                  <p className="text-sm text-muted-foreground">No manual model switching needed</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Matched to the request</p>
                  <p className="text-sm text-muted-foreground">Chooses by the kind of task</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Transparent</p>
                  <p className="text-sm text-muted-foreground">See which model was used</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Model Categories */}
        <div className="space-y-8">
          {modelCategories.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-3 rounded-lg ${category.bgColor} ${category.color}`}>
                  {category.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{category.name}</h2>
                  <p className="text-muted-foreground">{category.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {category.models.map((model, modelIndex) => (
                  <Card key={modelIndex} className={model.recommended ? 'border-primary/50' : ''}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {model.name}
                            {model.recommended && (
                              <Badge variant="default" className="text-xs">
                                Recommended
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {model.provider}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        {model.description}
                      </p>
                      <div className="flex items-center gap-2 text-sm">
                        <Info className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Context: {model.contextWindow}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {model.features.map((feature, featureIndex) => (
                          <Badge key={featureIndex} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="max-w-3xl mx-auto">
            <AccordionItem value="item-1">
              <AccordionTrigger>How does auto-routing work?</AccordionTrigger>
              <AccordionContent>
                SOHAM&apos;s server works out what kind of request you sent, such as everyday chat, code,
                an explanation, a fact check or a web search. It then tries a preferred list of models
                for that kind of request, in order, until one answers. The reply shows which model
                answered.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Can I manually select a model?</AccordionTrigger>
              <AccordionContent>
                Yes. Pick a model in the model selector or in Settings, and SOHAM uses it for your
                messages. If that model can&apos;t answer at the moment, another available model answers
                instead, and the reply shows which one it was.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Which models require API keys?</AccordionTrigger>
              <AccordionContent>
                You don&apos;t need any API keys to use SOHAM. The server that runs SOHAM is
                configured with one key per provider ({apiKeyEnvVars}), and a provider&apos;s
                models are only available while its key and quota are valid. The Groq models also need
                Groq to be switched on for the server; when it is off, another model answers.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>What happens if a model is unavailable?</AccordionTrigger>
              <AccordionContent>
                SOHAM tries the next model on its fallback list, which can include models from other
                providers. The reply always shows which model answered.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center space-y-6 py-12 border-t">
          <h2 className="text-3xl font-bold">Ready to Try Different Models?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Sign in to access all available models and experience the power of
            specialized AI for every task.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="btn-gradient">
                Get Started
              </Button>
            </Link>
            <Link href="/documentation">
              <Button size="lg" variant="outline">
                View Documentation
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
