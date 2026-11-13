'use client';

import {useState} from 'react';
import {
  GraduationCap,
  PenLine,
  Globe,
  ImagePlus,
  Lightbulb,
  Laugh,
  Pencil,
  type LucideIcon,
} from 'lucide-react';
import {cn} from '@/lib/utils';

interface Suggestion {
  /** Short label shown on the card. */
  title: string;
  /** The message that is sent. */
  prompt: string;
}

interface SuggestionGroup {
  id: string;
  label: string;
  icon: LucideIcon;
  hint: string;
  suggestions: Suggestion[];
}

/*
 * Each prompt is written to reach a real SOHAM feature. Where a prompt names
 * a tool, the wording matches the backend's tool detection
 * (SOHAM-backend tools/agent-tools.ts and core/intent-detector.ts):
 * weather, news, cricket, web search, image generation, grammar, recipe,
 * joke, fact check, dictionary and translation. The rest are answered
 * directly by the chat model.
 */
const SUGGESTION_GROUPS: SuggestionGroup[] = [
  {
    id: 'study',
    label: 'Study',
    icon: GraduationCap,
    hint: 'Clear explanations, maths steps and practice questions.',
    suggestions: [
      {title: 'Explain simply', prompt: 'Explain photosynthesis in simple words with a real-life example'},
      {title: 'Solve step by step', prompt: 'Solve step by step: 2x^2 - 7x + 3 = 0'},
      {title: 'Study plan', prompt: 'Make a 30-day study plan for my exams, 3 hours a day'},
      {title: 'Practice questions', prompt: 'Ask me 5 multiple-choice questions on the solar system, one at a time'},
    ],
  },
  {
    id: 'write',
    label: 'Write',
    icon: PenLine,
    hint: 'Applications, messages and emails, plus grammar fixes.',
    suggestions: [
      {title: 'Leave application', prompt: 'Write a leave application to my class teacher for 2 days because of fever'},
      {title: 'Fix my grammar', prompt: 'Fix the grammar: me and my friend goes to the market yesterday and buyed vegetables'},
      {title: 'Birthday wishes', prompt: 'Write a heartfelt birthday message for my best friend'},
      {title: 'Polite email', prompt: 'Draft a polite email to my landlord asking him to fix a leaking tap'},
    ],
  },
  {
    id: 'live',
    label: 'Live info',
    icon: Globe,
    hint: 'Checks current weather, news, cricket and the web.',
    suggestions: [
      {title: 'Weather today', prompt: "What's the weather like today in Delhi?"},
      {title: 'Top headlines', prompt: "What are today's top news headlines in India?"},
      {title: 'Cricket scores', prompt: 'Show me the latest cricket scores'},
      {title: 'Search the web', prompt: 'Search the web for the best budget phones under ₹15,000'},
    ],
  },
  {
    id: 'create',
    label: 'Images',
    icon: ImagePlus,
    hint: 'Describe a picture and SOHAM generates it.',
    suggestions: [
      {title: 'Watercolor scene', prompt: 'Create an image of a cozy reading corner with fairy lights, watercolor style'},
      {title: 'Birthday poster', prompt: 'Make a happy birthday poster for my best friend'},
      {title: 'Cartoon', prompt: 'Draw a cute cartoon cat astronaut floating in space'},
      {title: 'Thank-you poster', prompt: 'Design a thank-you poster for my teacher with flowers'},
    ],
  },
  {
    id: 'everyday',
    label: 'Everyday',
    icon: Lightbulb,
    hint: 'Trips, workouts, budgets and recipes.',
    suggestions: [
      {title: 'Trip plan', prompt: 'Plan a 3-day trip to Jaipur on a ₹10,000 budget'},
      {title: 'Home workout', prompt: 'Give me a 20-minute home workout with no equipment'},
      {title: 'Monthly budget', prompt: 'Help me make a monthly budget for a ₹30,000 salary'},
      {title: 'Recipe', prompt: 'How do I make masala chai at home?'},
    ],
  },
  {
    id: 'fun',
    label: 'Fun & words',
    icon: Laugh,
    hint: 'Jokes, fact checks, word meanings and translation.',
    suggestions: [
      {title: 'Tell a joke', prompt: 'Tell me a joke about school'},
      {title: 'Fact check', prompt: 'Is it true that goldfish only have a 3-second memory?'},
      {title: 'Word meaning', prompt: 'Define serendipity and use it in a sentence'},
      {title: 'Translate', prompt: "Translate 'Where is the railway station?' to Hindi"},
    ],
  },
];

interface ExamplePromptsProps {
  /** Sends the prompt right away. */
  onSendMessage: (message: string) => void;
  /** Puts the prompt in the message box so it can be changed first. */
  onEditPrompt?: (message: string) => void;
}

export function ExamplePrompts({onSendMessage, onEditPrompt}: ExamplePromptsProps) {
  const [groupId, setGroupId] = useState(SUGGESTION_GROUPS[0].id);
  const group = SUGGESTION_GROUPS.find(g => g.id === groupId) ?? SUGGESTION_GROUPS[0];

  return (
    <section aria-labelledby="quick-suggestions-title" className="w-full">
      <div className="mb-3 flex items-baseline justify-between gap-3 px-1">
        <h3 id="quick-suggestions-title" className="text-sm font-semibold text-foreground">
          Quick suggestions
        </h3>
        <p className="hidden text-xs text-muted-foreground sm:block">
          Tap to send{onEditPrompt ? ', or use the pencil to edit first' : ''}
        </p>
      </div>

      <div
        className="chat-suggestion-tabs -mx-4 mb-3 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-1"
        role="group"
        aria-label="Suggestion topics"
      >
        {SUGGESTION_GROUPS.map(g => {
          const Icon = g.icon;
          const selected = g.id === group.id;
          return (
            <button
              key={g.id}
              type="button"
              aria-pressed={selected}
              onClick={() => setGroupId(g.id)}
              className={cn(
                'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-medium transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                selected
                  ? 'border-primary/60 bg-primary/10 text-foreground'
                  : 'border-border/80 bg-background/60 text-muted-foreground hover:border-primary/40 hover:text-foreground'
              )}
            >
              <Icon className={cn('h-3.5 w-3.5', selected ? 'text-primary' : '')} aria-hidden="true" />
              {g.label}
            </button>
          );
        })}
      </div>

      <p className="mb-3 px-1 text-xs text-muted-foreground">{group.hint}</p>

      <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {group.suggestions.map(s => (
          <li key={s.prompt} className="group relative">
            <button
              type="button"
              onClick={() => onSendMessage(s.prompt)}
              className={cn(
                'flex h-full w-full flex-col items-start gap-1 rounded-2xl border border-border/80 bg-card/70 py-3 pl-4 text-left transition-all',
                onEditPrompt ? 'pr-14' : 'pr-4',
                'hover:-translate-y-px hover:border-primary/50 hover:bg-card hover:shadow-sm',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'
              )}
            >
              <span className="text-xs font-semibold text-foreground">{s.title}</span>
              <span className="line-clamp-2 text-[13px] leading-snug text-muted-foreground">{s.prompt}</span>
            </button>
            {onEditPrompt && (
              <button
                type="button"
                onClick={() => onEditPrompt(s.prompt)}
                aria-label={`Edit before sending: ${s.title}`}
                title="Edit before sending"
                className={cn(
                  'absolute right-1.5 top-1.5 inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors',
                  'hover:bg-primary/10 hover:text-primary',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                )}
              >
                <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
