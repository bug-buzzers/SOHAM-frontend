'use client';

import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowUp,
  Check,
  Dices,
  Image as ImageIcon,
  MessageSquare,
  Sparkles,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import { SohamLogo } from '@/components/soham-logo';
import { prefersReducedMotion } from '@/components/landing/landing-motion';
import {
  PROMPT_PARAM_MAX_LENGTH,
  SUGGESTION_GROUPS,
  chatHrefWithPrompt,
  type SohamToolName,
  type Suggestion,
} from '@/lib/quick-suggestions';
import { cn } from '@/lib/utils';

const ALL_SUGGESTIONS = SUGGESTION_GROUPS.flatMap((group) =>
  group.suggestions.map((suggestion) => ({ groupId: group.id, suggestion }))
);

/** Topic shown first. Its first prompt plays as a demo the first time the section is seen. */
const DEMO_GROUP_ID = 'live';

const TYPE_INTERVAL_MS = 24;
const STEP_INTERVAL_MS = 850;

const TOOL_LABELS: Record<SohamToolName, string> = {
  weather_search: 'Live weather',
  news_search: 'News search',
  sports_search: 'Cricket scores',
  web_search: 'Web search',
  grammar: 'Grammar check',
  recipe: 'Recipe tool',
  joke: 'Joke tool',
  fact_check: 'Fact check',
  dictionary: 'Dictionary',
  translate: 'Translator',
};

/** What each tool does before a model writes the reply (SOHAM-backend tools/agent-tools.ts). */
const TOOL_DETAILS: Record<SohamToolName, string> = {
  weather_search: 'The weather tool looks up current conditions for the place you name.',
  news_search: 'The news tool searches recent articles.',
  sports_search: 'The sports tool looks up current cricket matches.',
  web_search: 'The search tool looks the topic up on the web.',
  grammar: 'The grammar tool checks your sentence.',
  recipe: 'The recipe tool puts a recipe together.',
  joke: 'The joke tool writes a joke on your topic.',
  fact_check: 'The fact-check tool weighs up the claim.',
  dictionary: "The dictionary tool explains the word, with an example and synonyms.",
  translate: 'The translation tool translates the text.',
};

const TAB_CLASS =
  'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';

/** The status lines the chat shows while it works (SOHAM-backend routes/chat-stream.ts). */
function statusLines(suggestion: Suggestion | null): string[] {
  if (suggestion?.image) return ['Generating image…'];
  if (suggestion?.tool) return ['Thinking…', `Using: ${suggestion.tool}…`, 'Generating response…'];
  return ['Thinking…', 'Generating response…'];
}

function describeOutcome(suggestion: Suggestion | null): { icon: LucideIcon; title: string; body: string } {
  if (suggestion?.image) {
    return {
      icon: ImageIcon,
      title: 'The picture appears in the chat',
      body: 'SOHAM reads this as an image request and generates it, ready to preview or download.',
    };
  }
  if (suggestion?.tool) {
    return {
      icon: Wrench,
      title: `${TOOL_LABELS[suggestion.tool]} first, then the answer`,
      body: `${TOOL_DETAILS[suggestion.tool]} A model then writes the reply, which streams in with the model's name under it.`,
    };
  }
  if (suggestion) {
    return {
      icon: MessageSquare,
      title: 'A model answers straight away',
      body: "No tool is needed for this one. Auto picks a model unless you choose one, and the reply streams in with the model's name under it.",
    };
  }
  return {
    icon: Sparkles,
    title: 'SOHAM works out what you need',
    body: 'It checks whether your message needs a tool, such as live weather, news, web search or an image, before a model writes the reply.',
  };
}

function findSuggestion(text: string): Suggestion | null {
  const trimmed = text.trim();
  return ALL_SUGGESTIONS.find(({ suggestion }) => suggestion.prompt === trimmed)?.suggestion ?? null;
}

function RouteTag({ suggestion }: { suggestion: Suggestion }) {
  const Icon = suggestion.image ? ImageIcon : suggestion.tool ? Wrench : MessageSquare;
  const label = suggestion.image ? 'Image' : suggestion.tool ? TOOL_LABELS[suggestion.tool] : 'Chat answer';
  return (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-md border border-border/60 bg-background/60 px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
      <Icon className="h-3 w-3" aria-hidden />
      {label}
    </span>
  );
}

/**
 * Starter prompts from the chat plus a real message box. Picking a prompt
 * shows the status lines the chat displays for it; sending opens the chat
 * (after sign-in) with the text waiting in the message box. Nothing here
 * calls the AI, and no reply is shown.
 */
export function LandingTryIt({ isSignedIn }: { isSignedIn: boolean }) {
  const router = useRouter();
  const [groupId, setGroupId] = useState(DEMO_GROUP_ID);
  const [text, setText] = useState('');
  const [picked, setPicked] = useState<Suggestion | null>(null);
  const [typing, setTyping] = useState(false);
  /** Index of the status line in progress. Lines before it are done. */
  const [step, setStep] = useState(0);

  const previewRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<number>();
  const targetRef = useRef('');
  const interactedRef = useRef(false);

  const group = SUGGESTION_GROUPS.find((g) => g.id === groupId) ?? SUGGESTION_GROUPS[0];
  const lines = statusLines(picked);
  const done = !typing && step >= lines.length;
  const idle = !typing && text.trim() === '';
  const outcome = describeOutcome(picked);
  const OutcomeIcon = outcome.icon;

  const playSteps = useCallback((count: number) => {
    window.clearInterval(timerRef.current);
    let current = 0;
    setStep(0);
    timerRef.current = window.setInterval(() => {
      current += 1;
      setStep(current);
      if (current >= count) window.clearInterval(timerRef.current);
    }, STEP_INTERVAL_MS);
  }, []);

  /** Types the prompt into the message box, then plays its status lines. */
  const pick = useCallback(
    (suggestion: Suggestion) => {
      window.clearInterval(timerRef.current);
      const count = statusLines(suggestion).length;
      setPicked(suggestion);
      targetRef.current = suggestion.prompt;

      if (prefersReducedMotion()) {
        setTyping(false);
        setText(suggestion.prompt);
        setStep(count);
        return;
      }

      let length = 0;
      setTyping(true);
      setText('');
      setStep(0);
      timerRef.current = window.setInterval(() => {
        length += 2;
        setText(suggestion.prompt.slice(0, length));
        if (length >= suggestion.prompt.length) {
          window.clearInterval(timerRef.current);
          setTyping(false);
          playSteps(count);
        }
      }, TYPE_INTERVAL_MS);
    },
    [playSteps]
  );

  /** Ends any animation and shows the finished state for the current text. */
  const settle = useCallback((value: string) => {
    window.clearInterval(timerRef.current);
    const match = findSuggestion(value);
    setTyping(false);
    setText(value);
    setPicked(match);
    setStep(statusLines(match).length);
  }, []);

  const choose = (suggestion: Suggestion) => {
    interactedRef.current = true;
    pick(suggestion);
    // On phones the preview sits under the cards, so bring it into view.
    previewRef.current?.scrollIntoView({
      block: 'nearest',
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  };

  const surprise = () => {
    const options = ALL_SUGGESTIONS.filter(({ suggestion }) => suggestion !== picked);
    const choice = options[Math.floor(Math.random() * options.length)];
    if (!choice) return;
    setGroupId(choice.groupId);
    choose(choice.suggestion);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    interactedRef.current = true;
    const value = (typing ? targetRef.current : text).trim();
    if (!value) {
      inputRef.current?.focus();
      return;
    }
    window.clearInterval(timerRef.current);
    const chatHref = chatHrefWithPrompt(value);
    router.push(isSignedIn ? chatHref : `/login?next=${encodeURIComponent(chatHref)}`);
  };

  // Play one prompt on its own the first time the preview scrolls into view.
  useEffect(() => {
    const preview = previewRef.current;
    const demo = SUGGESTION_GROUPS.find((g) => g.id === DEMO_GROUP_ID)?.suggestions[0];
    if (!preview || !demo || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        if (!interactedRef.current) pick(demo);
      },
      { threshold: 0.5 }
    );
    observer.observe(preview);
    return () => observer.disconnect();
  }, [pick]);

  useEffect(() => () => window.clearInterval(timerRef.current), []);

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-6">
      <div className="min-w-0">
        <div
          className="chat-suggestion-tabs -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
          role="group"
          aria-label="Prompt topics"
        >
          {SUGGESTION_GROUPS.map((g) => {
            const Icon = g.icon;
            const selected = g.id === group.id;
            return (
              <button
                key={g.id}
                type="button"
                aria-pressed={selected}
                onClick={() => {
                  interactedRef.current = true;
                  setGroupId(g.id);
                }}
                className={cn(
                  TAB_CLASS,
                  selected
                    ? 'border-primary/60 bg-primary/10 text-foreground'
                    : 'border-border/80 bg-background/60 text-muted-foreground hover:border-primary/40 hover:text-foreground'
                )}
              >
                <Icon className={cn('h-3.5 w-3.5', selected && 'text-primary')} aria-hidden />
                {g.label}
              </button>
            );
          })}
          <button
            type="button"
            onClick={surprise}
            className={cn(
              TAB_CLASS,
              'border-dashed border-primary/50 text-primary hover:bg-primary/10'
            )}
          >
            <Dices className="h-3.5 w-3.5" aria-hidden />
            Surprise me
          </button>
        </div>

        <p className="mt-3 text-sm text-muted-foreground">{group.hint}</p>

        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {group.suggestions.map((suggestion) => {
            const selected = picked === suggestion;
            return (
              <li key={suggestion.prompt}>
                <button
                  type="button"
                  aria-pressed={selected}
                  onClick={() => choose(suggestion)}
                  className={cn(
                    'flex h-full w-full flex-col items-start gap-2 rounded-2xl border bg-card p-4 text-left transition-all',
                    'hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-sm',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                    selected ? 'border-primary/60 shadow-sm ring-1 ring-primary/40' : 'border-border/70'
                  )}
                >
                  <span className="flex w-full items-start justify-between gap-2">
                    <span className="text-sm font-semibold">{suggestion.title}</span>
                    <RouteTag suggestion={suggestion} />
                  </span>
                  <span className="text-[13px] leading-snug text-muted-foreground">{suggestion.prompt}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div
        ref={previewRef}
        className="flex min-w-0 scroll-mt-24 flex-col overflow-hidden rounded-3xl border bg-background shadow-sm"
      >
        <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <SohamLogo size={24} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">New chat</p>
              <p className="truncate text-[11px] text-muted-foreground">Model: Auto (Smart Routing)</p>
            </div>
          </div>
          <span className="shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Preview
          </span>
        </div>

        {/* Tall enough for the longest flow, so the box keeps its size while it plays. */}
        <div className="flex min-h-[23.5rem] flex-1 flex-col gap-4 px-4 py-5 sm:min-h-[21rem] md:px-5">
          {idle ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Sparkles className="h-5 w-5" aria-hidden />
              </span>
              <p className="max-w-xs text-sm leading-6 text-muted-foreground">
                Pick a prompt or type your own question to see what SOHAM does with it.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  When you send it
                </p>
                <ol className="space-y-2.5">
                  {lines.map((line, index) => {
                    const state = typing ? 'pending' : index < step ? 'done' : index === step ? 'active' : 'pending';
                    return (
                      <li
                        key={`${line}-${index}`}
                        className={cn(
                          'flex items-center gap-3 transition-opacity duration-300',
                          state === 'pending' && 'opacity-40'
                        )}
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                          {state === 'done' ? (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-primary">
                              <Check className="h-3 w-3" aria-hidden />
                            </span>
                          ) : (
                            <span className="relative flex h-2 w-2">
                              {state === 'active' && (
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75 motion-reduce:animate-none" />
                              )}
                              <span
                                className={cn(
                                  'relative inline-flex h-2 w-2 rounded-full',
                                  state === 'active' ? 'bg-primary' : 'bg-muted-foreground/50'
                                )}
                              />
                            </span>
                          )}
                        </span>
                        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs text-muted-foreground">
                          {line}
                        </span>
                      </li>
                    );
                  })}
                </ol>
                <p className="text-[11px] text-muted-foreground/80">
                  These are the status messages the chat shows while it works.
                </p>
              </div>

              <div aria-live="polite" className="mt-auto min-h-[10.5rem] sm:min-h-[8rem]">
                {done ? (
                  <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-4 animate-in fade-in-0 slide-in-from-bottom-1 duration-500 motion-reduce:animate-none">
                    <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <OutcomeIcon className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                      {outcome.title}
                    </p>
                    <p className="mt-1.5 text-[13px] leading-5 text-muted-foreground">{outcome.body}</p>
                  </div>
                ) : null}
              </div>
            </>
          )}
        </div>

        <form onSubmit={handleSubmit} className="border-t bg-card/60 p-3">
          <label htmlFor="landing-try-input" className="sr-only">
            Your question for SOHAM
          </label>
          <div className="flex items-center gap-1.5 rounded-3xl border bg-background py-1.5 pl-4 pr-1.5 shadow-sm transition-shadow focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20">
            <input
              id="landing-try-input"
              ref={inputRef}
              type="text"
              value={text}
              onChange={(event) => {
                interactedRef.current = true;
                settle(event.target.value);
              }}
              onFocus={() => {
                interactedRef.current = true;
                if (typing) settle(targetRef.current);
              }}
              maxLength={PROMPT_PARAM_MAX_LENGTH}
              placeholder="Ask SOHAM anything…"
              autoComplete="off"
              enterKeyHint="go"
              className="h-9 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-2xl bg-primary px-3.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Open in chat
              <ArrowUp className="h-4 w-4" aria-hidden />
            </button>
          </div>
          <p className="mt-2 px-1 text-[11px] leading-4 text-muted-foreground">
            {isSignedIn
              ? 'Opens an empty chat with this in the message box. Nothing is sent until you press send.'
              : 'You sign in with Google or email first. Then the chat opens with this in the message box, and nothing is sent until you press send.'}
          </p>
        </form>
      </div>
    </div>
  );
}
