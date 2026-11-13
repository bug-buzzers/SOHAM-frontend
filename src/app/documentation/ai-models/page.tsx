'use client';

import React from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {Cpu, Code, MessageSquare, Image, Settings, CheckCircle, Sparkles} from 'lucide-react';
import {
  CATEGORY_LABELS,
  formatContextWindow,
  getEnabledModels,
  groupModels,
  PROVIDER_LABELS,
} from '@/lib/model-catalog';

// Built from models-config.json, the same list the chat model selector shows.
const ENABLED_MODELS = getEnabledModels();

const CATEGORY_STYLES: Record<string, {icon: React.ElementType; color: string; description: string}> = {
  general: {icon: Sparkles, color: 'text-blue-500', description: 'Versatile models for everyday questions and general tasks'},
  coding: {icon: Code, color: 'text-green-500', description: 'Models suited to code generation, debugging and multi-step reasoning'},
  conversation: {icon: MessageSquare, color: 'text-orange-500', description: 'Lightweight models for quick conversational replies'},
  multimodal: {icon: Image, color: 'text-pink-500', description: 'Models that can work with images as well as text'},
};

const PROVIDER_DETAILS: Record<string, {desc: string; features: string[]}> = {
  groq: {desc: 'Low-latency inference with streaming', features: ['Streaming', 'Low latency']},
  cerebras: {desc: 'Fast inference on Cerebras hardware', features: ['Streaming', 'Large Qwen model']},
  google: {desc: 'Multimodal Gemini models', features: ['Vision support', 'About 1M token context']},
  huggingface: {desc: 'Open-weight models via the Hugging Face router', features: ['Open-weight models', 'Used as fallbacks']},
  openrouter: {desc: 'Free-tier models from several labs', features: ['Free tier', 'Several model families']},
};

const modelCategories = groupModels(ENABLED_MODELS, 'category').map(({key, models}) => ({
  key,
  title: CATEGORY_LABELS[key] ?? key,
  ...(CATEGORY_STYLES[key] ?? CATEGORY_STYLES.general),
  models: models.map((model) => ({
    name: model.name,
    provider: model.providerLabel,
    desc: model.description,
    features: [`${formatContextWindow(model.contextWindow)} context`],
    free: /free/i.test(model.name),
  })),
}));

const providerSummaries = groupModels(ENABLED_MODELS, 'provider').map(({key, models}) => ({
  name: PROVIDER_LABELS[key] ?? key,
  models: models.length,
  ...(PROVIDER_DETAILS[key] ?? {desc: '', features: []}),
}));

export default function AIModelsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-2 text-sm">
          <Cpu className="h-4 w-4 text-primary" />
          <span className="font-medium">AI Models Guide</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">AI Models & Selection</h1>
        <p className="text-xl text-muted-foreground">
          The model selector lists {ENABLED_MODELS.length} models from Groq, Cerebras, Google Gemini, Hugging
          Face and OpenRouter. Here&apos;s what&apos;s available and when to use each.
        </p>
      </div>

      {/* Auto mode */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Auto Mode — Recommended for Most Users
          </CardTitle>
          <CardDescription>
            SOHAM analyzes your query and routes it to the most capable model automatically
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              {emoji: '🧮', label: 'Math problems', desc: 'Use /solve for step-by-step working'},
              {emoji: '💻', label: 'Code questions', desc: '/solve requests that contain code go to a coding model'},
              {emoji: '🖼️', label: 'Image tasks', desc: 'Visual Math and image questions use multimodal models'},
              {emoji: '🔍', label: 'Web queries', desc: 'Can trigger a web search before answering'},
              {emoji: '💬', label: 'General chat', desc: 'Handled by general-purpose models'},
              {emoji: '📄', label: 'Document tasks', desc: 'The PDF Analyzer uses multimodal models'},
            ].map((r) => (
              <div key={r.label} className="flex items-start gap-3 bg-background/50 p-3 rounded-lg">
                <span className="text-xl">{r.emoji}</span>
                <div>
                  <h4 className="font-medium text-sm">{r.label}</h4>
                  <p className="text-xs text-muted-foreground">{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Model categories */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Available Models</h2>
        {modelCategories.map((category) => (
          <ModelCategory
            key={category.key}
            title={category.title}
            icon={category.icon}
            color={category.color}
            description={category.description}
            models={category.models}
          />
        ))}
      </div>

      {/* How to select */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            How to Select a Model
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-semibold">Desktop</h4>
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li>1. Click the Settings icon (⚙️) in the header</li>
                <li>2. Find the "AI Model" dropdown</li>
                <li>3. Select "Auto" or a specific model</li>
                <li>4. Settings save automatically</li>
              </ol>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Mobile</h4>
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li>1. Tap the model button in the chat header</li>
                <li>2. A bottom sheet opens with all models</li>
                <li>3. Tap to select your preferred model</li>
                <li>4. Sheet closes and model is applied</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle>💡 Model Selection Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                title: 'For coding tasks',
                desc: 'Try GPT-OSS 120B or DeepSeek R1 Distill 70B for programming, debugging and architecture questions.',
              },
              {
                title: 'For math problems',
                desc: 'Start with /solve to get step-by-step working, or use Visual Math for a photo of an equation.',
              },
              {
                title: 'For image analysis',
                desc: 'Gemini 2.5 Flash and Llama 4 Scout can work with images as well as text.',
              },
              {
                title: 'For speed',
                desc: 'Groq\'s Llama 3.1 8B Instant is usually the quickest to respond.',
              },
              {
                title: 'About limits',
                desc: 'Every model has rate limits and provider quotas. Models marked Free run on free tiers and can be busy at peak times.',
              },
              {
                title: 'For general chat',
                desc: 'Auto mode, Llama 3.3 70B or Gemini 2.5 Flash Lite are good choices for everyday conversations.',
              },
            ].map((tip) => (
              <div key={tip.title} className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium text-sm mb-1">{tip.title}</h4>
                <p className="text-xs text-muted-foreground">{tip.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Providers */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Model Providers</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {providerSummaries.map((p) => (
            <Card key={p.name}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{p.name}</CardTitle>
                <CardDescription>{p.desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>{p.models} model{p.models > 1 ? 's' : ''} available</span>
                  </div>
                  {p.features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="h-1 w-1 rounded-full bg-muted-foreground" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function ModelCategory({
  title,
  icon: Icon,
  color,
  description,
  models,
}: {
  title: string;
  icon: React.ElementType;
  color: string;
  description: string;
  models: Array<{name: string; provider: string; desc: string; features: string[]; free?: boolean}>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className={`h-5 w-5 ${color}`} />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {models.map((model) => (
            <div key={model.name} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold flex items-center gap-2">
                    {model.name}
                    {model.free && (
                      <Badge variant="secondary" className="text-xs">
                        Free
                      </Badge>
                    )}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {model.provider} — {model.desc}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {model.features.map((f) => (
                  <Badge key={f} variant="outline" className="text-xs">
                    {f}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
