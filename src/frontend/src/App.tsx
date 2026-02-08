import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useActor } from './hooks/useActor';
import { ChatMessage } from './components/ChatMessage';
import { ChatComposer } from './components/ChatComposer';
import { SafetyUsage } from './components/SafetyUsage';
import { DeveloperSafetyNote } from './components/DeveloperSafetyNote';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trash2, Info } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

function App() {
  const { actor } = useActor();
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);

  const sendMessageMutation = useMutation({
    mutationFn: async (prompt: string) => {
      if (!actor) throw new Error('Backend connection not available');
      return await actor.getChatbotReply(prompt);
    },
    onSuccess: (reply, prompt) => {
      setMessages((prev) => [
        ...prev,
        {
          id: `user-${Date.now()}`,
          role: 'user',
          content: prompt,
          timestamp: new Date(),
        },
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: reply,
          timestamp: new Date(),
        },
      ]);
      setError(null);
    },
    onError: (err) => {
      setError(
        'We encountered an issue processing your message. Please try again or start a new conversation.'
      );
    },
  });

  const handleSend = (message: string) => {
    if (!message.trim()) return;
    setError(null);
    sendMessageMutation.mutate(message);
  };

  const handleClearChat = () => {
    setMessages([]);
    setError(null);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <img
              src="/assets/generated/abdl-chat-bot-logo.dim_512x512.png"
              alt="Abdl Chat Bot"
              className="h-10 w-auto"
            />
          </div>
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Info className="mr-2 h-4 w-4" />
                  Safety & Usage
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <SafetyUsage />
              </DialogContent>
            </Dialog>
            {messages.length > 0 && (
              <Button variant="outline" size="sm" onClick={handleClearChat}>
                <Trash2 className="mr-2 h-4 w-4" />
                Clear Chat
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="container mx-auto flex flex-1 flex-col px-4 py-6">
        <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col">
          {/* Messages */}
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-6 pb-6">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <img
                    src="/assets/generated/abdl-chat-bot-avatar.dim_256x256.png"
                    alt="Assistant"
                    className="mb-6 h-24 w-24 rounded-full"
                  />
                  <h2 className="mb-2 text-2xl font-semibold text-foreground">
                    Welcome to Abdl Chat Bot
                  </h2>
                  <p className="max-w-md text-muted-foreground">
                    Start a conversation by typing a message below. I'm here to help with general
                    questions and friendly conversation.
                  </p>
                </div>
              )}
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {sendMessageMutation.isPending && (
                <div className="flex items-start gap-3">
                  <img
                    src="/assets/generated/abdl-chat-bot-avatar.dim_256x256.png"
                    alt="Assistant"
                    className="h-8 w-8 rounded-full"
                  />
                  <div className="flex-1 rounded-2xl bg-accent px-4 py-3">
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
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Composer */}
          <div className="mt-4">
            <ChatComposer
              onSend={handleSend}
              disabled={sendMessageMutation.isPending || !actor}
            />
          </div>

          {/* Developer Note */}
          <div className="mt-4">
            <DeveloperSafetyNote />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
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
