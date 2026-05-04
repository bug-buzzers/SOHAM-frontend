'use client';

import {useEffect, useRef} from 'react';
import {cn} from '@/lib/utils';
import {type Message, type Settings} from '@/lib/types';
import {ChatMessage} from './chat-message';
import {ThinkingAnimation} from './thinking-animation';

interface ChatMessagesProps extends React.HTMLAttributes<HTMLDivElement> {
  messages: Message[];
  isLoading?: boolean;
  onRegenerateMessage?: (messageId: string) => void;
  settings: Settings;
}

export function ChatMessages({
  messages,
  isLoading,
  className,
  onRegenerateMessage,
  settings,
}: ChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevMessagesLengthRef = useRef(messages.length);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    // Auto-scroll when new messages are added, loading state changes, or on initial mount
    const isNewMessage = messages.length > prevMessagesLengthRef.current;
    const isInitialMount = prevMessagesLengthRef.current === 0 && messages.length > 0;

    if (isNewMessage || isLoading || isInitialMount) {
      // Small delay to ensure DOM is updated
      const timer = setTimeout(scrollToBottom, 100);
      return () => clearTimeout(timer);
    }
    prevMessagesLengthRef.current = messages.length;
  }, [messages.length, isLoading]);

  return (
    <div 
      ref={scrollRef}
      className={cn('w-full h-full overflow-y-auto overflow-x-hidden scroll-smooth custom-scrollbar', className)}
    >
      <div className="mx-auto w-full max-w-5xl px-3 py-4 md:px-5 md:py-6 lg:px-8">
        <div className="space-y-6 md:space-y-8">
          {messages.map((message, index) => (
            <ChatMessage 
              key={message.id} 
              message={message}
              settings={settings}
              onRegenerate={
                message.role === 'assistant' && index === messages.length - 1 && onRegenerateMessage
                  ? () => onRegenerateMessage(message.id)
                  : undefined
              }
            />
          ))}
          {isLoading && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <ThinkingAnimation />
            </div>
          )}
        </div>
        {/* Invisible anchor for scrolling */}
        <div className="h-4 w-full" />
      </div>
    </div>
  );
}
