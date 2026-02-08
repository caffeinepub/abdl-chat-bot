import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { ChatSummary, ChatView } from '../backend';

export function useChats() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return useQuery<ChatSummary[]>({
    queryKey: ['chats'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserChats();
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
  });
}

export function useGetChat(chatId: number | null) {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return useQuery<ChatView | null>({
    queryKey: ['chat', chatId],
    queryFn: async () => {
      if (!actor || chatId === null) return null;
      return actor.getChat(BigInt(chatId));
    },
    enabled: !!actor && !actorFetching && isAuthenticated && chatId !== null,
  });
}

export function useCreateChat() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (title: string) => {
      if (!actor) throw new Error('Actor not available');
      const chatId = await actor.createChat(title);
      return Number(chatId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
  });
}

export function useDeleteChat() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (chatId: number) => {
      if (!actor) throw new Error('Actor not available');
      await actor.deleteChat(BigInt(chatId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
  });
}

export function useAddMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      chatId,
      author,
      content,
    }: {
      chatId: number;
      author: string;
      content: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.addMessage(
        BigInt(chatId),
        { author, content },
        BigInt(Date.now())
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['chat', variables.chatId] });
    },
  });
}
