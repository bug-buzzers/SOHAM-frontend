'use client';

import {useState, useEffect, useCallback, useRef} from 'react';
import {type Chat, type Message} from '@/lib/types';
import {useAuth} from './use-auth';
import {
  isIDBAvailable,
  idbGetChats,
  idbPutChat,
  idbDeleteChat,
  idbGetMessages,
  idbAddMessage,
  idbDeleteAllUserData,
  type DBChat,
  type DBMessage,
} from '@/lib/indexed-db';

/** Title given to a chat until its first message renames it. */
export const NEW_CHAT_TITLE = 'New Chat';

function toDBChat(chat: Chat): DBChat {
  return { id: chat.id, userId: chat.userId, title: chat.title, createdAt: chat.createdAt, updatedAt: chat.updatedAt };
}
function fromDBChat(db: DBChat): Chat {
  return { id: db.id, userId: db.userId, title: db.title, createdAt: db.createdAt, updatedAt: db.updatedAt };
}
function toDBMessage(msg: Message, chatId: string, userId: string): DBMessage {
  return { id: msg.id, chatId, userId, role: msg.role, content: msg.content, createdAt: msg.createdAt, modelUsed: msg.modelUsed, autoRouted: msg.autoRouted, imageUrl: msg.imageUrl, imageProvider: msg.imageProvider };
}
function fromDBMessage(db: DBMessage): Message {
  return { id: db.id, role: db.role, content: db.content, createdAt: db.createdAt, modelUsed: db.modelUsed, autoRouted: db.autoRouted, imageUrl: db.imageUrl, imageProvider: db.imageProvider };
}

function isLegacyWelcomeMessage(message: Message): boolean {
  return message.role === 'assistant' && message.content.trim() === 'How can I help you today?';
}

function sortByRecent(chats: Chat[]): Chat[] {
  return [...chats].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

async function loadChatMessages(chatId: string): Promise<Message[]> {
  const dbMsgs = await idbGetMessages(chatId);
  return dbMsgs.map(fromDBMessage).filter(msg => !isLegacyWelcomeMessage(msg));
}

/**
 * Whether a saved chat might have no messages. Every message moves `updatedAt`
 * forward, so an untouched chat still has `updatedAt === createdAt`. Chats
 * titled "New Chat" are checked too: an older bug could save a chat that had
 * messages back under that title. Each candidate is confirmed against
 * IndexedDB before it is treated as empty.
 */
function mightBeEmpty(chat: Chat): boolean {
  return chat.updatedAt === chat.createdAt || chat.title === NEW_CHAT_TITLE;
}

export function useChatHistory() {
  const {user} = useAuth();
  const userId = user?.uid;

  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [activeChatId, setActiveChatIdState] = useState<string>('');
  const [isLoaded, setIsLoadedState] = useState(false);
  const loadedChatIds = useRef<Set<string>>(new Set());

  // Mirrors of the state above, updated in the same call as the state. They
  // let callbacks read the latest values: two quick "new chat" calls cannot
  // both create a chat, and saves never write an outdated title.
  const chatsRef = useRef<Chat[]>([]);
  const messagesRef = useRef<Record<string, Message[]>>({});
  const activeChatIdRef = useRef('');
  const isLoadedRef = useRef(false);

  const commitChats = useCallback((next: Chat[]) => {
    chatsRef.current = next;
    setChats(next);
  }, []);
  const commitMessages = useCallback((next: Record<string, Message[]>) => {
    messagesRef.current = next;
    setMessages(next);
  }, []);
  const setActiveChatId = useCallback((chatId: string) => {
    activeChatIdRef.current = chatId;
    setActiveChatIdState(chatId);
  }, []);
  const setIsLoaded = useCallback((loaded: boolean) => {
    isLoadedRef.current = loaded;
    setIsLoadedState(loaded);
  }, []);

  /** True when a chat's messages are loaded and there are none. */
  const isChatEmpty = useCallback((chatId: string) => {
    return loadedChatIds.current.has(chatId) && (messagesRef.current[chatId]?.length ?? 0) === 0;
  }, []);

  // Load chats from IndexedDB on mount / user change
  useEffect(() => {
    if (!isIDBAvailable() || !userId) {
      setIsLoaded(true);
      return;
    }
    let cancelled = false;
    setIsLoaded(false);
    loadedChatIds.current = new Set();
    commitChats([]);
    commitMessages({});
    setActiveChatId('');

    (async () => {
      try {
        const saved = sortByRecent((await idbGetChats(userId)).map(fromDBChat));
        const loadedMessages: Record<string, Message[]> = {};
        for (const chat of saved) {
          if (mightBeEmpty(chat)) loadedMessages[chat.id] = await loadChatMessages(chat.id);
        }
        if (cancelled) return;

        // Earlier versions saved a blank chat on every visit. Keep the newest
        // untitled empty chat and delete the other ones. A chat is only
        // deleted if it never received a message (unchanged timestamp) and
        // has no saved messages. Renamed chats stay.
        const extraBlankIds = new Set(
          saved
            .filter(chat =>
              chat.title === NEW_CHAT_TITLE &&
              chat.updatedAt === chat.createdAt &&
              loadedMessages[chat.id]?.length === 0
            )
            .slice(1)
            .map(chat => chat.id)
        );
        extraBlankIds.forEach(id => {
          delete loadedMessages[id];
          idbDeleteChat(id).catch(console.warn);
        });
        const kept = saved.filter(chat => !extraBlankIds.has(chat.id));

        // Open the most recent chat.
        const recent = kept[0];
        if (recent && !loadedMessages[recent.id]) {
          loadedMessages[recent.id] = await loadChatMessages(recent.id);
        }
        if (cancelled) return;

        loadedChatIds.current = new Set(Object.keys(loadedMessages));
        commitChats(kept);
        commitMessages(loadedMessages);
        setActiveChatId(recent?.id ?? '');
        setIsLoaded(true);
      } catch (err) {
        console.warn('[useChatHistory] load failed:', err);
        if (!cancelled) setIsLoaded(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId, commitChats, commitMessages, setActiveChatId, setIsLoaded]);

  // Load messages for active chat when it changes
  useEffect(() => {
    if (!activeChatId || !isIDBAvailable() || loadedChatIds.current.has(activeChatId)) return;
    loadChatMessages(activeChatId).then((msgs) => {
      loadedChatIds.current.add(activeChatId);
      commitMessages({ ...messagesRef.current, [activeChatId]: msgs });
    }).catch(console.warn);
  }, [activeChatId, commitMessages]);

  /**
   * Opens an empty chat. If one already exists, it is reopened (the current
   * chat first, then the most recent empty one) instead of adding another.
   */
  const createNewChat = useCallback(() => {
    // Saved chats are still loading. Loading opens a chat when it finishes.
    if (!isLoadedRef.current) return;

    if (activeChatIdRef.current && isChatEmpty(activeChatIdRef.current)) return;

    const emptyChat = sortByRecent(chatsRef.current).find(chat => isChatEmpty(chat.id));
    if (emptyChat) {
      setActiveChatId(emptyChat.id);
      return;
    }

    const ownerId = userId ?? 'guest';
    const now = new Date().toISOString();
    const newChat: Chat = { id: crypto.randomUUID(), userId: ownerId, title: NEW_CHAT_TITLE, createdAt: now, updatedAt: now };

    loadedChatIds.current.add(newChat.id);
    commitChats([newChat, ...chatsRef.current]);
    commitMessages({ ...messagesRef.current, [newChat.id]: [] });
    setActiveChatId(newChat.id);

    if (isIDBAvailable()) {
      idbPutChat(toDBChat(newChat)).catch(console.warn);
    }
  }, [userId, isChatEmpty, commitChats, commitMessages, setActiveChatId]);

  // Make sure there is a chat to type into once loading has finished, and
  // again after the last chat is deleted.
  useEffect(() => {
    if (isLoaded && chats.length === 0) createNewChat();
  }, [isLoaded, chats.length, createNewChat]);

  const addMessage = useCallback(
    (chatId: string, message: Omit<Message, 'id' | 'createdAt'>, newTitle?: string, skipPersist = false) => {
      const ownerId = userId ?? 'guest';
      const now = new Date().toISOString();
      const newMsg: Message = { ...message, id: crypto.randomUUID(), createdAt: now };

      // Optimistic UI update
      commitMessages({ ...messagesRef.current, [chatId]: [...(messagesRef.current[chatId] || []), newMsg] });
      let updatedChat: Chat | undefined;
      commitChats(chatsRef.current.map(c => {
        if (c.id !== chatId) return c;
        updatedChat = { ...c, title: newTitle ?? c.title, updatedAt: now };
        return updatedChat;
      }));

      if (isIDBAvailable()) {
        // Streaming placeholders (empty assistant messages) are saved by
        // finalizeMessage() once the reply is complete.
        if (!skipPersist) {
          idbAddMessage(toDBMessage(newMsg, chatId, ownerId)).catch(console.warn);
        }
        // Save the title and timestamp from the latest state.
        if (updatedChat) {
          idbPutChat(toDBChat(updatedChat)).catch(console.warn);
        }
      }

      return newMsg.id;
    },
    [userId, commitChats, commitMessages]
  );

  /**
   * Patch an existing message in-place (used for streaming token accumulation).
   * Does NOT persist to IndexedDB — call finalizeMessage() when the stream is done.
   */
  const updateMessage = useCallback(
    (chatId: string, messageId: string, patch: Partial<Pick<Message, 'content' | 'modelUsed' | 'autoRouted' | 'imageUrl' | 'imageProvider'>>) => {
      const msgs = messagesRef.current[chatId];
      if (!msgs) return;
      commitMessages({
        ...messagesRef.current,
        [chatId]: msgs.map(m => m.id === messageId ? { ...m, ...patch } : m),
      });
    },
    [commitMessages]
  );

  /**
   * Persist a streamed message to IndexedDB once the stream is complete.
   * idbAddMessage upserts, so this works whether or not the message was saved before.
   */
  const finalizeMessage = useCallback(
    (chatId: string, messageId: string) => {
      const ownerId = userId ?? 'guest';
      const msg = messagesRef.current[chatId]?.find(m => m.id === messageId);
      if (msg && isIDBAvailable()) {
        idbAddMessage(toDBMessage(msg, chatId, ownerId)).catch(console.warn);
      }
    },
    [userId]
  );

  const deleteChat = useCallback((chatId: string) => {
    commitChats(chatsRef.current.filter(c => c.id !== chatId));
    const remaining = { ...messagesRef.current };
    delete remaining[chatId];
    commitMessages(remaining);
    if (activeChatIdRef.current === chatId) setActiveChatId('');
    loadedChatIds.current.delete(chatId);
    if (isIDBAvailable()) idbDeleteChat(chatId).catch(console.warn);
  }, [commitChats, commitMessages, setActiveChatId]);

  const renameChat = useCallback((chatId: string, newTitle: string) => {
    let renamed: Chat | undefined;
    commitChats(chatsRef.current.map(c => {
      if (c.id !== chatId) return c;
      renamed = { ...c, title: newTitle };
      return renamed;
    }));
    if (renamed && isIDBAvailable()) idbPutChat(toDBChat(renamed)).catch(console.warn);
  }, [commitChats]);

  const deleteAllUserChats = useCallback(() => {
    commitChats([]);
    commitMessages({});
    setActiveChatId('');
    loadedChatIds.current.clear();
    if (isIDBAvailable() && userId) idbDeleteAllUserData(userId).catch(console.warn);
  }, [userId, commitChats, commitMessages, setActiveChatId]);

  const exportChat = useCallback((chatId: string) => {
    const chat = chats.find(c => c.id === chatId);
    if (!chat) return null;
    return { chat, messages: messages[chatId] || [] };
  }, [chats, messages]);

  const activeChat = chats.find(c => c.id === activeChatId);
  const activeChatMessages = messages[activeChatId] || [];

  return {
    chats: sortByRecent(chats),
    activeChat,
    activeChatId,
    setActiveChatId,
    activeChatMessages,
    isLoaded,
    createNewChat,
    addMessage,
    updateMessage,
    finalizeMessage,
    deleteChat,
    renameChat,
    deleteAllUserChats,
    exportChat,
  };
}
