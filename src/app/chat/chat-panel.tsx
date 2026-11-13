'use client';

import {type Chat, type Settings, type Message} from '@/lib/types';
import {ChatInput} from '@/components/chat/chat-input';
import {ChatMessages} from '@/components/chat/chat-messages';
import {ExamplePrompts} from '@/components/chat/example-prompts';
import {useState, useRef, useEffect, useCallback} from 'react';
import { SohamLogo } from '@/components/soham-logo';
import Link from 'next/link';
import {useAuth} from '@/hooks/use-auth';
import {hybridTTS} from '@/lib/hybrid-tts';
import {VoiceFilter} from '@/lib/voice-filter';

/** Client-side image request check — mirrors the server intent detector for UI feedback only */
function looksLikeImageRequest(msg: string): boolean {
  return (
    /\b(generate|create|make|draw|paint|design|produce|sketch|illustrate|render|visualize|depict)\b.*(image|picture|photo|illustration|artwork|painting|drawing|sketch|wallpaper|poster|logo|banner|thumbnail|avatar|portrait|landscape|scene)/i.test(msg) ||
    /\b(draw|paint|sketch|illustrate|render|visualize)\s+(me|a|an|the|this)\b/i.test(msg) ||
    /\b(image|picture|photo|illustration|pic|painting|sketch|drawing|artwork)\s+(of|showing|depicting|with|featuring)\b/i.test(msg) ||
    /\b(show|give|send)\s+me\s+(an?|the)?\s*(image|picture|photo|illustration|drawing|painting|sketch)\b/i.test(msg) ||
    /\b(i\s+)?(want|need|would like)\s+(an?|the|me\s+an?)?\s*(image|picture|photo|illustration|drawing|painting|sketch|artwork)\b/i.test(msg) ||
    /\b(photo-?realistic|photorealistic|anime|manga|cartoon|3d render|watercolor|oil painting|digital art|pixel art|concept art)\b/i.test(msg) ||
    /\b(tasveer|chitra)\s+(bana|banao|dikhao|chahiye)\b/i.test(msg) ||
    /\bgenerate\s+image\b/i.test(msg)
  );
}

interface ChatPanelProps {
  chat: Chat;
  settings: Settings;
  messages: Message[];
  addMessage: (
    chatId: string,
    message: Omit<Message, 'id' | 'createdAt'>,
    newTitle?: string,
    skipPersist?: boolean,
  ) => string;
  updateMessage: (
    chatId: string,
    messageId: string,
    patch: Partial<Pick<Message, 'content' | 'modelUsed' | 'autoRouted' | 'imageUrl' | 'imageProvider'>>
  ) => void;
  finalizeMessage: (chatId: string, messageId: string) => void;
}

function cleanResponseHeaders(text: string): string {
  return text
    .replace(/^#{1,6}\s+(.+)$/gm, '**$1**')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// ── SSE event types ────────────────────────────────────────────────────────────
interface SSEEvent {
  type: 'status' | 'token' | 'done' | 'error' | 'image';
  text?: string;
  url?: string;
  provider?: string;
  modelUsed?: string;
  autoRouted?: boolean;
  responseTime?: string;
}

/**
 * Stream from /api/chat-stream via SSE.
 * Calls onToken for each token, onStatus for pipeline stage labels,
 * and resolves with final metadata when done.
 */
async function streamFromBackend(
  message: string,
  history: Array<{role: 'user' | 'assistant'; content: string}>,
  settings: Settings,
  userId: string | undefined,
  signal: AbortSignal,
  onToken: (token: string) => void,
  onStatus: (status: string) => void,
): Promise<{
  modelUsed?: string;
  autoRouted?: boolean;
  imageUrl?: string;
  imageProvider?: string;
  imageText?: string;
  error?: string;
}> {
  const res = await fetch('/api/chat-stream', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      message,
      history,
      settings: {
        model: settings.model,
        tone: settings.tone,
        technicalLevel: settings.technicalLevel,
      },
      userId,
    }),
    signal,
  });

  if (!res.ok || !res.body) {
    return {error: `HTTP ${res.status}`};
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let meta: ReturnType<typeof streamFromBackend> extends Promise<infer T> ? T : never = {};

  try {
    while (true) {
      const {done, value} = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, {stream: true});
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        try {
          const event = JSON.parse(line.slice(6)) as SSEEvent;

          switch (event.type) {
            case 'token':
              if (event.text) onToken(event.text);
              break;
            case 'status':
              if (event.text) onStatus(event.text);
              break;
            case 'image':
              meta = {
                imageUrl: event.url,
                imageProvider: event.provider,
                imageText: event.text,
              };
              break;
            case 'done':
              meta = {
                ...meta,
                modelUsed: event.modelUsed,
                autoRouted: event.autoRouted,
              };
              break;
            case 'error':
              return {error: event.text ?? 'Unknown error'};
          }
        } catch {
          // malformed chunk — skip
        }
      }
    }
  } finally {
    reader.releaseLock();
  }

  return meta;
}

export function ChatPanel({
  chat,
  settings,
  messages,
  addMessage,
  updateMessage,
  finalizeMessage,
}: ChatPanelProps) {
  const [isLoadingFromAI, setIsLoadingFromAI] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [streamStatus, setStreamStatus] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const {user} = useAuth();

  const settingsRef = useRef(settings);
  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  const isLoading = isLoadingFromAI || isSpeaking;

  // A suggestion the user wants to edit before sending. A new object each
  // time, so picking the same suggestion twice still refills the box.
  const [draft, setDraft] = useState<{text: string; id: number} | null>(null);
  const handleEditPrompt = useCallback((text: string) => {
    setDraft({text, id: Date.now()});
  }, []);

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleSendMessage = useCallback(
    async (messageContent: string) => {
      if (isLoading || !user) return;

      // Cancel any in-flight request
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setIsLoadingFromAI(true);
      setStreamStatus('');

      if (looksLikeImageRequest(messageContent)) {
        setIsGeneratingImage(true);
      }

      const isNewChat = messages.length === 0;
      const newTitle = isNewChat
        ? messageContent.substring(0, 30) + (messageContent.length > 30 ? '...' : '')
        : undefined;

      // Add user message immediately
      addMessage(chat.id, {role: 'user', content: messageContent}, newTitle);

      // Build history
      const historyMessages = messages.map(({role, content}) => ({role, content}));
      const firstUserIndex = historyMessages.findIndex(m => m.role === 'user');
      const filteredHistory = firstUserIndex >= 0 ? historyMessages.slice(firstUserIndex) : [];
      const updatedHistory = [
        ...filteredHistory,
        {role: 'user' as const, content: messageContent},
      ];

      // Add a placeholder assistant message — we'll stream tokens into it
      // skipPersist=true so the empty placeholder is never written to IndexedDB
      const placeholderId = addMessage(chat.id, {
        role: 'assistant',
        content: '',
      }, undefined, true);

      let accumulatedText = '';

      try {
        const result = await streamFromBackend(
          messageContent,
          updatedHistory,
          settingsRef.current,
          user.uid,
          controller.signal,
          // onToken — update placeholder in real-time
          (token) => {
            accumulatedText += token;
            updateMessage(chat.id, placeholderId, {content: accumulatedText});
          },
          // onStatus — show pipeline stage
          (status) => {
            setStreamStatus(status);
          },
        );

        setStreamStatus('');
        setIsGeneratingImage(false);

        if (result.error) {
          // Replace placeholder with error message
          updateMessage(chat.id, placeholderId, {
            content: `Sorry, I couldn't reach the AI server. ${result.error}`,
          });
          finalizeMessage(chat.id, placeholderId);
          return;
        }

        // Image generation result
        if (result.imageUrl) {
          const imageContent = result.imageText ?? '✨ Here\'s your image!';
          updateMessage(chat.id, placeholderId, {
            content: imageContent,
            modelUsed: result.modelUsed,
            autoRouted: result.autoRouted,
            imageUrl: result.imageUrl,
            imageProvider: result.imageProvider,
          });
          finalizeMessage(chat.id, placeholderId);
          return;
        }

        // Finalize streamed text
        const finalContent = cleanResponseHeaders(accumulatedText);
        updateMessage(chat.id, placeholderId, {
          content: finalContent,
          modelUsed: result.modelUsed,
          autoRouted: result.autoRouted,
        });
        finalizeMessage(chat.id, placeholderId);

        // Extract memories asynchronously
        if (user.uid && finalContent) {
          fetch('/api/extract-memories', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              userMessage: messageContent,
              assistantMessage: finalContent,
              userId: user.uid,
            }),
          }).catch(() => {});
        }

        // Auto-speak if enabled
        if (settingsRef.current.enableSpeech && finalContent) {
          setIsSpeaking(true);

          const filteredText = VoiceFilter.filterForTTS(finalContent, {
            removeRepetition: true,
            normalizeText: true,
            addPauses: true,
            fixPronunciation: true,
          });

          if (filteredText.length >= 3) {
            const voiceMap: Record<string, string> = {
              'Algenib': 'en-US-AriaNeural',
              'Enceladus': 'en-US-GuyNeural',
              'Achernar': 'en-US-JennyNeural',
              'Heka': 'en-IN-NeerjaNeural',
            };
            const selectedVoice =
              voiceMap[settingsRef.current.voice] || settingsRef.current.voice || 'en-US-AriaNeural';

            hybridTTS.speak({
              text: filteredText,
              voice: selectedVoice,
              rate: 1.0,
              pitch: 1.0,
              volume: 1.0,
              onEnd: () => setIsSpeaking(false),
              onError: () => setIsSpeaking(false),
            });
          } else {
            setIsSpeaking(false);
          }
        }
      } catch (err) {
        if ((err as Error)?.name === 'AbortError') {
          // User cancelled — leave partial text as-is
          finalizeMessage(chat.id, placeholderId);
        } else {
          updateMessage(chat.id, placeholderId, {
            content: 'Sorry, something went wrong. Please try again.',
          });
          finalizeMessage(chat.id, placeholderId);
        }
      } finally {
        setIsLoadingFromAI(false);
        setIsGeneratingImage(false);
        setStreamStatus('');
      }
    },
    [isLoading, user, messages, addMessage, updateMessage, finalizeMessage, chat.id]
  );

  const stopSpeaking = useCallback(() => {
    hybridTTS.cancel();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsSpeaking(false);
  }, []);

  const handleRegenerateMessage = useCallback(
    async (messageId: string) => {
      if (isLoading || !user) return;

      const messageIndex = messages.findIndex(m => m.id === messageId);
      if (messageIndex === -1 || messageIndex === 0) return;

      const userMessage = messages[messageIndex - 1];
      if (!userMessage || userMessage.role !== 'user') return;

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setIsLoadingFromAI(true);
      setStreamStatus('');

      // Reset the existing assistant message to empty and stream into it
      updateMessage(chat.id, messageId, {content: '', modelUsed: undefined, autoRouted: undefined});

      let accumulatedText = '';

      try {
        const result = await streamFromBackend(
          userMessage.content,
          messages.slice(0, messageIndex).map(m => ({role: m.role, content: m.content})),
          settingsRef.current,
          user.uid,
          controller.signal,
          (token) => {
            accumulatedText += token;
            updateMessage(chat.id, messageId, {content: accumulatedText});
          },
          (status) => setStreamStatus(status),
        );

        setStreamStatus('');

        const finalContent = result.error
          ? `Sorry, I couldn't regenerate the response. ${result.error}`
          : cleanResponseHeaders(accumulatedText);

        updateMessage(chat.id, messageId, {
          content: finalContent,
          modelUsed: result.modelUsed,
          autoRouted: result.autoRouted,
          imageUrl: result.imageUrl,
          imageProvider: result.imageProvider,
        });
        finalizeMessage(chat.id, messageId);
      } catch (err) {
        if ((err as Error)?.name !== 'AbortError') {
          updateMessage(chat.id, messageId, {content: 'Regeneration failed. Please try again.'});
          finalizeMessage(chat.id, messageId);
        }
      } finally {
        setIsLoadingFromAI(false);
        setStreamStatus('');
      }
    },
    [isLoading, user, messages, chat.id, updateMessage, finalizeMessage]
  );

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <div className="flex flex-col w-full h-full overflow-hidden bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.06),transparent_28%)]">

      {/* ── Scrollable area (messages OR welcome screen) ── */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-4 py-6 md:py-8 min-h-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-6 md:mb-8 flex flex-col items-center text-center w-full max-w-lg">
              <div className="mb-5 md:mb-6 relative flex items-center justify-center">
                <div className="absolute inset-0 bg-primary/15 blur-[80px] rounded-full scale-150" />
                <SohamLogo
                  size={120}
                  priority
                  className="relative shadow-2xl opacity-90 transition-transform hover:scale-105 duration-500 md:!w-[136px] md:!h-[136px]"
                />
              </div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-3 leading-tight">
                {getTimeGreeting()},{' '}
                <span className="text-primary">{user?.displayName?.split(' ')[0] || 'User'}</span>
              </h2>
              <p className="text-xs text-muted-foreground/70 font-medium uppercase tracking-widest max-w-xs md:max-w-sm leading-relaxed">
                Advanced adaptive AI workspace by CODEEX-AI
              </p>
            </div>

            <div className="mb-6 md:mb-8 w-full max-w-lg text-center px-2">
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-[10px] md:text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.2em]">
                <Link href="/about" className="hover:text-primary transition-colors">About</Link>
                <Link href="/documentation" className="hover:text-primary transition-colors">Docs</Link>
                <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
                <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
                <button onClick={() => window.open('mailto:support@codeex.ai')} className="hover:text-primary transition-colors">Help</button>
              </div>
            </div>

            <div className="w-full max-w-2xl px-0">
              <ExamplePrompts onSendMessage={handleSendMessage} onEditPrompt={handleEditPrompt} />
            </div>
          </div>
        ) : (
          <ChatMessages
            messages={messages}
            isLoading={isLoadingFromAI}
            className="h-full"
            onRegenerateMessage={handleRegenerateMessage}
            settings={settings}
          />
        )}
      </div>

      {/* ── Input bar — always visible, never shrinks ── */}
      <div className="shrink-0 border-t bg-background/95 px-3 py-3 backdrop-blur md:px-4 md:py-4">

        {/* Stream status pill */}
        {streamStatus && !isSpeaking && (
          <div className="mb-2 flex items-center justify-center">
            <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs text-muted-foreground">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              {streamStatus}
            </div>
          </div>
        )}

        {/* Image generation indicator */}
        {isGeneratingImage && !isSpeaking && !streamStatus && (
          <div className="mb-2 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              <span>Generating image…</span>
            </div>
          </div>
        )}

        {/* Speaking indicator */}
        {isSpeaking && (
          <div className="mb-2 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              <span>Speaking...</span>
              <button
                onClick={stopSpeaking}
                className="ml-2 rounded-full bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive hover:bg-destructive/20 transition-colors"
              >
                Stop
              </button>
            </div>
          </div>
        )}

        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} userId={user?.uid} draft={draft} />
        <p className="px-1 pt-1.5 text-center text-[10px] text-muted-foreground">
          SOHAM by CODEEX-AI
        </p>
      </div>
    </div>
  );
}
