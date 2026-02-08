import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './hooks/useActor';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { ChatMessage } from './components/ChatMessage';
import { ChatComposer } from './components/ChatComposer';
import { SafetyUsage } from './components/SafetyUsage';
import { DeveloperSafetyNote } from './components/DeveloperSafetyNote';
import { AuthButton } from './components/AuthButton';
import { ProfileSetupDialog } from './components/ProfileSetupDialog';
import { ResponsiveChatHistory } from './components/ResponsiveChatHistory';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trash2, Info } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useGetCallerUserProfile } from './hooks/useCurrentUserProfile';
import { useChats, useCreateChat, useDeleteChat } from './hooks/useChats';
import { useChatAutosave } from './hooks/useChatAutosave';
import type { UIMessage } from './types/chat';

function App() {
  const { actor } = useActor();
  const { identity, clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;

  // User profile
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  // Chat state
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [localMessages, setLocalMessages] = useState<UIMessage[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch chats for authenticated users
  const { data: chats = [] } = useChats();
  const createChatMutation = useCreateChat();
  const deleteChatMutation = useDeleteChat();

  // Auto-save hook
  const { restoreOnLoad, persistOnUserSend, persistOnAssistantReply } = useChatAutosave(
    selectedChatId,
    setSelectedChatId,
    setLocalMessages
  );

  // Restore chats on mount/auth change
  useEffect(() => {
    restoreOnLoad();
  }, [isAuthenticated, actor, restoreOnLoad]);

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (prompt: string) => {
      if (!actor) throw new Error('Backend connection not available');
      return await actor.getChatbotReply(prompt);
    },
    onSuccess: async (reply, prompt) => {
      const userMessage: UIMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: prompt,
        timestamp: new Date(),
      };
      const assistantMessage: UIMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date(),
      };

      // Update UI immediately
      setLocalMessages((prev) => [...prev, userMessage, assistantMessage]);

      // Persist both messages
      await persistOnUserSend(userMessage);
      await persistOnAssistantReply(assistantMessage);

      setError(null);
    },
    onError: (err) => {
      setError(
        'We encountered an issue processing your message. Please try again or start a new conversation.'
      );
    },
  });

  const handleSend = async (message: string) => {
    if (!message.trim()) return;
    setError(null);

    // For authenticated users, ensure we have a chat
    if (isAuthenticated && !selectedChatId) {
      try {
        const newChatId = await createChatMutation.mutateAsync('New Chat');
        setSelectedChatId(newChatId);
      } catch (err) {
        setError('Failed to create chat. Please try again.');
        return;
      }
    }

    sendMessageMutation.mutate(message);
  };

  const handleClearChat = async () => {
    if (isAuthenticated && selectedChatId !== null) {
      // Delete current chat and create a new one
      try {
        await deleteChatMutation.mutateAsync(selectedChatId);
        const newChatId = await createChatMutation.mutateAsync('New Chat');
        setSelectedChatId(newChatId);
        setLocalMessages([]);
        setError(null);
      } catch (err) {
        setError('Failed to clear chat. Please try again.');
      }
    } else {
      // Anonymous: just clear local messages
      setLocalMessages([]);
      setError(null);
    }
  };

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    setSelectedChatId(null);
    setLocalMessages([]);
    setError(null);
    // Restore anonymous state
    restoreOnLoad();
  };

  const handleNewChat = async () => {
    if (isAuthenticated) {
      try {
        const newChatId = await createChatMutation.mutateAsync('New Chat');
        setSelectedChatId(newChatId);
        setLocalMessages([]);
        setError(null);
      } catch (err) {
        setError('Failed to create new chat. Please try again.');
      }
    } else {
      // Anonymous: create new local chat
      setSelectedChatId(null);
      setLocalMessages([]);
      setError(null);
    }
  };

  const handleSelectChat = (chatId: number) => {
    setSelectedChatId(chatId);
    setError(null);
  };

  const handleDeleteChat = async (chatId: number) => {
    try {
      await deleteChatMutation.mutateAsync(chatId);
      if (selectedChatId === chatId) {
        // If deleting current chat, create a new one
        const newChatId = await createChatMutation.mutateAsync('New Chat');
        setSelectedChatId(newChatId);
        setLocalMessages([]);
      }
      setError(null);
    } catch (err) {
      setError('Failed to delete chat. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-3 py-3 sm:px-4 sm:py-4">
          <div className="flex items-center gap-3">
            <img
              src="/assets/generated/abdl-chat-bot-logo.dim_512x512.png"
              alt="Abdl Chat Bot"
              className="h-8 w-auto sm:h-10"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {isAuthenticated && userProfile && (
              <span className="hidden text-sm text-muted-foreground sm:inline">
                Signed in as <span className="font-medium text-foreground">{userProfile.name}</span>
              </span>
            )}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-10 min-w-[44px]">
                  <Info className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Safety & Usage</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] max-w-[95vw] overflow-y-auto sm:max-h-[85vh] sm:max-w-2xl">
                <SafetyUsage />
              </DialogContent>
            </Dialog>
            {localMessages.length > 0 && (
              <Button variant="outline" size="sm" onClick={handleClearChat} className="h-10 min-w-[44px]">
                <Trash2 className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Clear Chat</span>
              </Button>
            )}
            <AuthButton onLogout={handleLogout} />
          </div>
        </div>
      </header>

      {/* Profile Setup Dialog */}
      {showProfileSetup && <ProfileSetupDialog />}

      {/* Main Content */}
      <main className="flex flex-1 overflow-hidden">
        <div className="flex w-full">
          {/* Chat History - Responsive */}
          {isAuthenticated && (
            <ResponsiveChatHistory
              chats={chats}
              selectedChatId={selectedChatId}
              onSelectChat={handleSelectChat}
              onNewChat={handleNewChat}
              onDeleteChat={handleDeleteChat}
            />
          )}

          {/* Chat Area */}
          <div className="flex flex-1 flex-col px-3 py-4 sm:px-4 sm:py-6">
            <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col">
              {/* Messages */}
              <ScrollArea className="flex-1 pr-2 sm:pr-4">
                <div className="space-y-4 pb-4 sm:space-y-6 sm:pb-6">
                  {localMessages.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-8 text-center sm:py-12">
                      <img
                        src="/assets/generated/abdl-chat-bot-avatar.dim_256x256.png"
                        alt="Assistant"
                        className="mb-4 h-16 w-16 rounded-full sm:mb-6 sm:h-24 sm:w-24"
                      />
                      <h2 className="mb-2 text-xl font-semibold text-foreground sm:text-2xl">
                        Welcome to Abdl Chat Bot
                      </h2>
                      <p className="max-w-md px-4 text-sm text-muted-foreground sm:text-base">
                        Start a conversation by typing a message below. I'm here to help with general
                        questions and friendly conversation.
                      </p>
                    </div>
                  )}
                  {localMessages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                  ))}
                  {sendMessageMutation.isPending && (
                    <div className="flex items-start gap-2 sm:gap-3">
                      <img
                        src="/assets/generated/abdl-chat-bot-avatar.dim_256x256.png"
                        alt="Assistant"
                        className="h-7 w-7 rounded-full sm:h-8 sm:w-8"
                      />
                      <div className="flex-1 rounded-2xl bg-accent px-3 py-2 sm:px-4 sm:py-3">
                        <div className="flex gap-1">
                          <div className="h-2 w-2 animate-bounce rounded-full bg-accent-foreground [animation-delay:-0.3s]"></div>
                          <div className="h-2 w-2 animate-bounce rounded-full bg-accent-foreground [animation-delay:-0.15s]"></div>
                          <div className="h-2 w-2 animate-bounce rounded-full bg-accent-foreground"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Error Display */}
              {error && (
                <Alert variant="destructive" className="mb-3 sm:mb-4">
                  <AlertDescription className="text-sm">{error}</AlertDescription>
                </Alert>
              )}

              {/* Composer */}
              <div className="mt-3 sm:mt-4">
                <ChatComposer
                  onSend={handleSend}
                  disabled={sendMessageMutation.isPending || !actor}
                />
              </div>

              {/* Developer Note */}
              <div className="mt-3 sm:mt-4">
                <DeveloperSafetyNote />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-3 sm:py-4">
        <div className="mx-auto max-w-7xl px-3 text-center text-xs text-muted-foreground sm:px-4 sm:text-sm">
          © 2026. Built with ❤️ using{' '}
          <a
            href="https://caffeine.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground hover:underline"
          >
            caffeine.ai
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
