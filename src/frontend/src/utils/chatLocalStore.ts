import type { UIMessage } from '../types/chat';

const STORAGE_VERSION = '1.0';
const CHATS_KEY = 'abdl-chatbot-chats';
const SELECTED_CHAT_KEY = 'abdl-chatbot-selected';

interface LocalChat {
  id: number;
  title: string;
  messages: UIMessage[];
  timestamp: number;
}

interface LocalChatsStore {
  version: string;
  chats: Record<number, LocalChat>;
}

export function loadLocalChats(): Record<number, LocalChat> {
  try {
    const stored = localStorage.getItem(CHATS_KEY);
    if (!stored) return {};

    const parsed: LocalChatsStore = JSON.parse(stored);
    if (parsed.version !== STORAGE_VERSION) {
      // Version mismatch, clear old data
      localStorage.removeItem(CHATS_KEY);
      return {};
    }

    // Parse dates
    Object.values(parsed.chats).forEach((chat) => {
      chat.messages.forEach((msg) => {
        msg.timestamp = new Date(msg.timestamp);
      });
    });

    return parsed.chats;
  } catch (err) {
    console.error('Failed to load local chats:', err);
    return {};
  }
}

export function saveLocalChat(chatId: number, messages: UIMessage[], title: string) {
  try {
    const chats = loadLocalChats();
    chats[chatId] = {
      id: chatId,
      title,
      messages,
      timestamp: Date.now(),
    };

    const store: LocalChatsStore = {
      version: STORAGE_VERSION,
      chats,
    };

    localStorage.setItem(CHATS_KEY, JSON.stringify(store));
  } catch (err) {
    console.error('Failed to save local chat:', err);
  }
}

export function getSelectedChatId(): number | null {
  try {
    const stored = localStorage.getItem(SELECTED_CHAT_KEY);
    return stored ? parseInt(stored, 10) : null;
  } catch (err) {
    return null;
  }
}

export function setSelectedChatId(chatId: number | null) {
  try {
    if (chatId === null) {
      localStorage.removeItem(SELECTED_CHAT_KEY);
    } else {
      localStorage.setItem(SELECTED_CHAT_KEY, chatId.toString());
    }
  } catch (err) {
    console.error('Failed to save selected chat ID:', err);
  }
}

export function clearLocalChats() {
  try {
    localStorage.removeItem(CHATS_KEY);
    localStorage.removeItem(SELECTED_CHAT_KEY);
  } catch (err) {
    console.error('Failed to clear local chats:', err);
  }
}
