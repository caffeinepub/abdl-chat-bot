import { useCallback } from 'react';
import { useInternetIdentity } from './useInternetIdentity';
import { useActor } from './useActor';
import { useGetChat, useAddMessage, useCreateChat } from './useChats';
import { loadLocalChats, saveLocalChat, getSelectedChatId, setSelectedChatId as saveSelectedChatId } from '../utils/chatLocalStore';
import type { UIMessage } from '../types/chat';

export function useChatAutosave(
  selectedChatId: number | null,
  setSelectedChatId: (id: number | null) => void,
  setLocalMessages: (messages: UIMessage[] | ((prev: UIMessage[]) => UIMessage[])) => void
) {
  const { identity } = useInternetIdentity();
  const { actor } = useActor();
  const isAuthenticated = !!identity;
  const addMessageMutation = useAddMessage();
  const createChatMutation = useCreateChat();

  // Fetch selected chat from backend
  const { data: selectedChat } = useGetChat(selectedChatId);

  const restoreOnLoad = useCallback(() => {
    if (isAuthenticated && actor) {
      // Authenticated: load from selected chat
      if (selectedChat) {
        const messages: UIMessage[] = selectedChat.messages.map((msg) => ({
          id: `${msg.author}-${msg.timestamp}`,
          role: msg.author === 'user' ? 'user' : 'assistant',
          content: msg.content,
          timestamp: new Date(Number(msg.timestamp)),
        }));
        setLocalMessages(messages);
      } else {
        setLocalMessages([]);
      }
    } else {
      // Anonymous: load from local storage
      const localChats = loadLocalChats();
      const savedChatId = getSelectedChatId();
      
      if (savedChatId !== null && localChats[savedChatId]) {
        setSelectedChatId(savedChatId);
        setLocalMessages(localChats[savedChatId].messages);
      } else {
        setSelectedChatId(null);
        setLocalMessages([]);
      }
    }
  }, [isAuthenticated, actor, selectedChat, setSelectedChatId, setLocalMessages]);

  const persistOnUserSend = useCallback(
    async (message: UIMessage) => {
      if (isAuthenticated && selectedChatId !== null) {
        // Authenticated: save to backend
        try {
          await addMessageMutation.mutateAsync({
            chatId: selectedChatId,
            author: 'user',
            content: message.content,
          });
        } catch (err) {
          console.error('Failed to persist user message:', err);
        }
      } else {
        // Anonymous: save to local storage
        const chatId = selectedChatId ?? 0;
        setLocalMessages((prev) => {
          const updated = [...prev];
          saveLocalChat(chatId, updated, 'New Chat');
          saveSelectedChatId(chatId);
          return updated;
        });
      }
    },
    [isAuthenticated, selectedChatId, addMessageMutation, setLocalMessages]
  );

  const persistOnAssistantReply = useCallback(
    async (message: UIMessage) => {
      if (isAuthenticated && selectedChatId !== null) {
        // Authenticated: save to backend
        try {
          await addMessageMutation.mutateAsync({
            chatId: selectedChatId,
            author: 'assistant',
            content: message.content,
          });
        } catch (err) {
          console.error('Failed to persist assistant message:', err);
        }
      } else {
        // Anonymous: save to local storage
        const chatId = selectedChatId ?? 0;
        setLocalMessages((prev) => {
          const updated = [...prev];
          saveLocalChat(chatId, updated, 'New Chat');
          saveSelectedChatId(chatId);
          return updated;
        });
      }
    },
    [isAuthenticated, selectedChatId, addMessageMutation, setLocalMessages]
  );

  return {
    restoreOnLoad,
    persistOnUserSend,
    persistOnAssistantReply,
  };
}
