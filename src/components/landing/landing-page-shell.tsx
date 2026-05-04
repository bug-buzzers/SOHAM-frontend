'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Cpu, Globe, Zap, Image as ImageIcon, Brain, Code2, Search, Mic,
  FileText, ShieldCheck, ArrowRight, Check, Github, Star,
  MessageSquare, ScanSearch, AudioLines, ChevronDown, ChevronUp,
} from 'lucide-react';
import { type CoreMode } from '@/components/landing/soham-core';
import { DesktopLandingHeader, MobileLandingHeader } from '@/components/landing/landing-header';
import { DesktopLandingHero, MobileLandingHero } from '@/components/landing/landing-hero';
import { DEVELOPER_INFO } from '@/lib/developer-info';
import { useAuth } from '@/hooks/use-auth';
import { idbGet, idbSet } from '@/lib/indexed-db';

const NeuralLatticeBackground = dynamic(
  () => import('@/components/landing/neural-lattice-background').then((mod) => mod.NeuralLatticeBackground),
  { ssr: false }
);

const T = {
  bgPrimary:    '#0a0e1a',
  bgCard:       '#0f1629',
  bgCardHover:  '#131d35',
  gold:         '#f5c842',
  blue:         '#3b82f6',
  border:       'rgba(59,130,246,0.15)',
  borderSubtle: 'rgba(59,130,246,0.1)',
  textPrimary:  '#ffffff',
  textSecondary:'#94a3b8',
  textMuted:    '#64748b',
};

const heroFeatures = [
  { mode: 'chat' as CoreMode, title: '35+ AI Models', description: 'Groq, Cerebras, Gemini, DeepSeek.', icon: MessageSquare },
  { mode: 'pdf' as CoreMode, title: 'PDF Analyzer', description: 'Upload up to 5MB.', icon: FileText },
  { mode: 'vision' as CoreMode, title: 'Image Math Solver', description: 'Photo of any equation.', icon: ScanSearch },
  { mode: 'voice' as CoreMode, title: 'Voice Both Ways', description: 'Groq Whisper STT + Orpheus TTS.', icon: AudioLines },
];

const trustStats = [
  { label: 'AI Models', value: '35+' },
  { label: 'Countries', value: DEVELOPER_INFO.projectStats.countriesReached },
  { label: 'Uptime',    value: DEVELOPER_INFO.projectStats.uptime },
  { label: 'Price',     value: '$0' },
];

const features = [
  { icon: Cpu,        title: '35+ AI Models',        desc: 'Groq (Llama 4, GPT-OSS 120B), Cerebras (Qwen 3 235B), Gemini 2.5 Pro, DeepSeek R1, NVIDIA Nemotron 120B — all free.', example: 'Ask anything — SOHAM picks the right model automatically. No account upgrades. No model tiers.', tag: 'Core',     tagColor: '#3b82f6', wide: false },
  { icon: Brain,      title: 'Smart Auto-Routing',    desc: 'Intent detector classifies every query into 13 types. Coding goes to DeepSeek. Long docs go to Gemini. Speed goes to Groq.', example: 'Ask "debug my Python code" — SOHAM routes it to DeepSeek R1 automatically. No settings. No toggles.', tag: 'AI',       tagColor: '#8b5cf6', wide: false },
  { icon: Globe,      title: 'Real-Time Web Search',  desc: 'DuckDuckGo + GNews + Open-Meteo + CricAPI + CoinGecko. Auto-triggers on news, weather, sports, finance.', example: 'Ask "India vs Australia score right now" — SOHAM queries CricAPI and responds with live data, not training data.', tag: 'Live',     tagColor: '#22c55e', wide: false },
  { icon: ImageIcon,  title: 'Image Generation',      desc: 'Pollinations.ai FLUX + Cloudflare Workers AI + HuggingFace fallback. Around 5 seconds. Describe what you want.', example: null, tag: 'Creative', tagColor: '#ec4899', wide: true  },
  { icon: Mic,        title: 'Voice Input & Output',  desc: 'Groq Whisper V3 Turbo STT. Groq Orpheus TTS with 6 voices. Vocal direction: [cheerful], [whisper], [laughs].', example: null, tag: 'Voice',    tagColor: '#06b6d4', wide: false },
  { icon: FileText,   title: 'PDF Analysis',          desc: 'Upload PDFs up to 5MB. Ask questions, get summaries. Gemini 2.5 Flash with 1M token context window.', example: null, tag: 'Docs',     tagColor: '#f5c842', wide: false },
  { icon: Code2,      title: '13 Specialized Skills', desc: 'Translation (50+ languages), Grammar Check, Quiz Generator, Recipe, Sentiment Analysis, Fact-Check, Dictionary.', example: null, tag: 'Skills',   tagColor: '#f97316', wide: false },
  { icon: Search,     title: '16 Slash Commands',     desc: '/solve /summarize /search /news /weather /translate /grammar /quiz /recipe /joke /define /factcheck and more.', example: null, tag: 'Commands', tagColor: '#a78bfa', wide: true  },
  { icon: ShieldCheck,title: 'Privacy-First',         desc: "Conversations stored in your browser's localStorage. The SOHAM backend never receives conversation content — only API routing instructions.", example: 'See the source code on GitHub to verify every claim.', tag: 'Privacy',  tagColor: '#14b8a6', wide: false },
];

const comparisonRows = [
  { feature: 'Price',            soham: '$0 forever',                other: 'Requires $20/mo subscription' },
  { feature: 'AI Models',        soham: '35+ from 5 providers',       other: 'OpenAI models only' },
  { feature: 'Image Generation', soham: 'Free, included',             other: 'Requires $20/mo subscription' },
  { feature: 'Web Search',       soham: 'Free, auto-triggers',        other: 'Requires $20/mo subscription' },
  { feature: 'Voice (STT+TTS)',  soham: 'Free, 6 voices',             other: 'Advanced Voice = $20/mo' },
  { feature: 'PDF Analysis',     soham: 'Free, up to 5MB',            other: 'Requires $20/mo subscription' },
  { feature: 'Privacy',          soham: 'Local storage, open source', other: 'Trains on chats by default' },
];

const faqItems = [
  { q: 'Is SOHAM really free? How?', a: 'Yes. SOHAM uses free tiers from Groq, Cerebras, Google, HuggingFace, and other providers. These providers offer generous free API quotas. SOHAM routes your queries across them intelligently so you never hit a single provider limit. There is no premium tier, no credit system, and no hidden cost.' },
  { q: 'What is the difference between SOHAM and ChatGPT?', a: 'ChatGPT is a single model (GPT-4o) behind a $20/month paywall for advanced features. SOHAM gives you 35+ models from 5 different providers — including models that outperform GPT-4o on specific tasks — completely free. SOHAM also includes image generation, voice I/O, real-time web search, and PDF analysis without any subscription.' },
  { q: 'Who is Heoster / CODEEX-AI?', a: 'Heoster (Harsh) is a 16-year-old developer from Khatauli, Uttar Pradesh, India. He built SOHAM while studying Class 12 PCM. CODEEX-AI is his AI startup, founded in 2024.' },
  { q: 'Is my data safe? Where are my conversations stored?', a: "Your conversations are stored in your browser's localStorage — they never leave your device. The SOHAM backend only receives the text of your current message to route it to the right AI model. It does not store, log, or train on your conversations. Authentication is handled by Firebase. You can verify all of this in the open source code on GitHub." },
  { q: 'Which AI models are available?', a: 'Groq: Llama 4 Scout 17B, GPT-OSS 120B, Qwen3 32B. Cerebras: Qwen 3 235B, GPT-OSS 120B, GLM 4.7. Google: Gemini 2.5 Pro, Gemini 2.5 Flash. HuggingFace: DeepSeek R1 70B, Llama 3.3 70B. OpenRouter: NVIDIA Nemotron 120B, Arcee Trinity 400B. Plus 20+ more. All free.' },
  { q: 'Does SOHAM work on mobile?', a: 'Yes. SOHAM is a Progressive Web App (PWA) built mobile-first. It works in any browser on iOS and Android. You can also install it to your home screen for an app-like experience without going through an app store.' },
  { q: 'Is SOHAM open source? Where is the code?', a: 'Yes. SOHAM is MIT licensed. The full codebase — 50,000+ lines — is on GitHub at github.com/heoster. You can read the code, fork it, and build on it.' },
];

const sectionVariant = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.12 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
};