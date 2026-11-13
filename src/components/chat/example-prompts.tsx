'use client';

import {useState} from 'react';
import {Pencil} from 'lucide-react';
import {SUGGESTION_GROUPS} from '@/lib/quick-suggestions';
import {cn} from '@/lib/utils';

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
