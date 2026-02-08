import { useState } from 'react';
import { ChatHistoryPanel } from './ChatHistoryPanel';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import type { ChatSummary } from '../backend';

interface ResponsiveChatHistoryProps {
  chats: ChatSummary[];
  selectedChatId: number | null;
  onSelectChat: (chatId: number) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: number) => void;
}

export function ResponsiveChatHistory({
  chats,
  selectedChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
}: ResponsiveChatHistoryProps) {
  const [open, setOpen] = useState(false);

  const handleSelectChat = (chatId: number) => {
    onSelectChat(chatId);
    setOpen(false);
  };

  const handleNewChat = () => {
    onNewChat();
    setOpen(false);
  };

  return (
    <>
      {/* Mobile: Sheet/Drawer */}
      <div className="lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="fixed left-3 top-[4.5rem] z-40 h-11 w-11 rounded-full shadow-lg sm:left-4"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] p-0 sm:w-[320px]">
            <ChatHistoryPanel
              chats={chats}
              selectedChatId={selectedChatId}
              onSelectChat={handleSelectChat}
              onNewChat={handleNewChat}
              onDeleteChat={onDeleteChat}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop: Persistent Sidebar */}
      <div className="hidden lg:block">
        <ChatHistoryPanel
          chats={chats}
          selectedChatId={selectedChatId}
          onSelectChat={onSelectChat}
          onNewChat={onNewChat}
          onDeleteChat={onDeleteChat}
        />
      </div>
    </>
  );
}
