import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import type { UIMessage } from '../types/chat';

interface ChatMessageProps {
  message: UIMessage;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex items-start gap-2 sm:gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      {isUser ? (
        <Avatar className="h-7 w-7 shrink-0 sm:h-8 sm:w-8">
          <AvatarFallback className="bg-primary text-primary-foreground">
            <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </AvatarFallback>
        </Avatar>
      ) : (
        <Avatar className="h-7 w-7 shrink-0 sm:h-8 sm:w-8">
          <AvatarImage
            src="/assets/generated/abdl-chat-bot-avatar.dim_256x256.png"
            alt="Assistant"
          />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
      )}

      {/* Message Content */}
      <div
        className={`flex-1 rounded-2xl px-3 py-2 text-sm sm:px-4 sm:py-3 sm:text-base ${
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-accent text-accent-foreground'
        }`}
      >
        <p className="whitespace-pre-wrap break-words leading-relaxed">{message.content}</p>
      </div>
    </div>
  );
}
