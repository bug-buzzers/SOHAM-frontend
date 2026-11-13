import {
  GraduationCap,
  PenLine,
  Globe,
  ImagePlus,
  Lightbulb,
  Laugh,
  type LucideIcon,
} from 'lucide-react';

/**
 * Tool names as SOHAM-backend reports them in the chat's status line
 * ("Using: weather_search…"). See tools/agent-tools.ts in SOHAM-backend.
 */
export type SohamToolName =
  | 'weather_search'
  | 'news_search'
  | 'sports_search'
  | 'web_search'
  | 'grammar'
  | 'recipe'
  | 'joke'
  | 'fact_check'
  | 'dictionary'
  | 'translate';

export interface Suggestion {
  /** Short label shown on the card. */
  title: string;
  /** The message that is sent. */
  prompt: string;
  /** The backend tool this prompt triggers before the model answers. */
  tool?: SohamToolName;
  /** The backend treats this prompt as an image request. */
  image?: true;
}

export interface SuggestionGroup {
  id: string;
  label: string;
  icon: LucideIcon;
  hint: string;
  suggestions: Suggestion[];
}

/*
 * Each prompt is written to reach a real SOHAM feature. `tool` and `image`
 * record what the backend's detection does with the exact wording
 * (SOHAM-backend tools/agent-tools.ts and core/intent-detector.ts), so change
 * them together with the prompt. Prompts without either are answered directly
 * by the chat model. The chat shows these as Quick Suggestions and the home
 * page uses them in its "Try it" section.
 */
export const SUGGESTION_GROUPS: SuggestionGroup[] = [
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
      {
        title: 'Fix my grammar',
        prompt: 'Fix the grammar: me and my friend goes to the market yesterday and buyed vegetables',
        tool: 'grammar',
      },
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
      {title: 'Weather today', prompt: "What's the weather like today in Delhi?", tool: 'weather_search'},
      {title: 'Top headlines', prompt: "What are today's top news headlines in India?", tool: 'news_search'},
      {title: 'Cricket scores', prompt: 'Show me the latest cricket scores', tool: 'sports_search'},
      {title: 'Search the web', prompt: 'Search the web for the best budget phones under ₹15,000', tool: 'web_search'},
    ],
  },
  {
    id: 'create',
    label: 'Images',
    icon: ImagePlus,
    hint: 'Describe a picture and SOHAM generates it.',
    suggestions: [
      {
        title: 'Watercolor scene',
        prompt: 'Create an image of a cozy reading corner with fairy lights, watercolor style',
        image: true,
      },
      {title: 'Birthday poster', prompt: 'Make a happy birthday poster for my best friend', image: true},
      {title: 'Cartoon', prompt: 'Draw a cute cartoon cat astronaut floating in space', image: true},
      {title: 'Thank-you poster', prompt: 'Design a thank-you poster for my teacher with flowers', image: true},
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
      {title: 'Recipe', prompt: 'How do I make masala chai at home?', tool: 'recipe'},
    ],
  },
  {
    id: 'fun',
    label: 'Fun & words',
    icon: Laugh,
    hint: 'Jokes, fact checks, word meanings and translation.',
    suggestions: [
      {title: 'Tell a joke', prompt: 'Tell me a joke about school', tool: 'joke'},
      {title: 'Fact check', prompt: 'Is it true that goldfish only have a 3-second memory?', tool: 'fact_check'},
      {title: 'Word meaning', prompt: 'Define serendipity and use it in a sentence', tool: 'dictionary'},
      {title: 'Translate', prompt: "Translate 'Where is the railway station?' to Hindi", tool: 'translate'},
    ],
  },
];

/** Query parameter that hands a prompt to the chat, e.g. /chat?prompt=Hello. */
export const PROMPT_PARAM = 'prompt';

/** Longest prompt the chat takes from the URL. */
export const PROMPT_PARAM_MAX_LENGTH = 1000;

/**
 * Link that opens an empty chat with `prompt` in the message box. The chat
 * never sends it on its own; the user presses send.
 */
export function chatHrefWithPrompt(prompt: string): string {
  const text = prompt.trim().slice(0, PROMPT_PARAM_MAX_LENGTH);
  return text ? `/chat?${PROMPT_PARAM}=${encodeURIComponent(text)}` : '/chat';
}
