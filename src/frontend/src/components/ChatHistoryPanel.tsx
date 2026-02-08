import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, MessageSquare, Trash2 } from 'lucide-react';
import type { ChatSummary } from '../backend';

interface ChatHistoryPanelProps {
  chats: ChatSummary[];
  selectedChatId: number | null;
  onSelectChat: (chatId: number) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: number) => void;
}

export function ChatHistoryPanel({
  chats,
  selectedChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
}: ChatHistoryPanelProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<number | null>(null);

  const handleDeleteClick = (chatId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setChatToDelete(chatId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (chatToDelete !== null) {
      onDeleteChat(chatToDelete);
      setDeleteDialogOpen(false);
      setChatToDelete(null);
    }
  };

  return (
    <>
      <div className="flex h-full w-full flex-col border-r border-border bg-card lg:w-64">
        <div className="border-b border-border p-3 sm:p-4">
          <Button onClick={onNewChat} className="h-11 w-full" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Chat
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="space-y-1 p-2">
            {chats.length === 0 ? (
              <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                No chats yet. Start a new conversation!
              </div>
            ) : (
              chats.map((chat) => (
                <div
                  key={chat.chatId}
                  className={`group flex min-h-[44px] items-center gap-2 rounded-lg px-3 py-2.5 transition-colors hover:bg-accent ${
                    selectedChatId === Number(chat.chatId)
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground'
                  }`}
                >
                  <button
                    onClick={() => onSelectChat(Number(chat.chatId))}
                    className="flex flex-1 items-center gap-2 overflow-hidden text-left"
                  >
                    <MessageSquare className="h-4 w-4 shrink-0" />
                    <span className="truncate text-sm">{chat.title}</span>
                  </button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100"
                    onClick={(e) => handleDeleteClick(Number(chat.chatId), e)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Chat</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this chat? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
            <AlertDialogCancel className="h-11 w-full sm:w-auto">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="h-11 w-full sm:w-auto">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
