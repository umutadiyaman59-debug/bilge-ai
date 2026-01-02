import React, { useState } from 'react';
import { PenSquare, Search, MessageSquare, Trash2, Download, Settings, X, Moon, Sun, MoreHorizontal, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Conversation } from '@/types/chat';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ChatSidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onDeleteConversation: (id: string) => void;
  onClearAll: () => void;
  onExport: () => void;
  onOpenSettings: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  onClearAll,
  onExport,
  onOpenSettings,
  isOpen,
  onClose,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* ChatGPT style Sidebar */}
      <aside
        className={cn(
          "fixed md:relative z-50 h-full w-[260px] bg-sidebar flex flex-col transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Header - ChatGPT style */}
        <div className="p-2 flex items-center gap-2">
          {/* New chat button */}
          <Button
            onClick={onNewChat}
            variant="ghost"
            className="flex-1 justify-start gap-2 h-10 px-3 text-sidebar-foreground hover:bg-sidebar-accent rounded-lg"
          >
            <PenSquare className="h-4 w-4" />
            <span className="text-sm">Yeni sohbet</span>
          </Button>

          {/* Close button (mobile) */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-10 w-10 text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Search */}
        <div className="px-2 pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Sohbetleri ara"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 bg-sidebar-accent/50 border-0 text-sm placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-sidebar-ring"
            />
          </div>
        </div>

        {/* Section label */}
        <div className="px-3 py-2">
          <span className="text-xs font-medium text-muted-foreground">Sohbetlerin</span>
        </div>

        {/* Conversations list - ChatGPT style */}
        <ScrollArea className="flex-1 scrollbar-thin">
          <div className="px-2 pb-2">
            {filteredConversations.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                {searchQuery ? 'Sonuç bulunamadı' : 'Henüz sohbet yok'}
              </p>
            ) : (
              <div className="space-y-0.5">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={cn(
                      "group flex items-center gap-2 py-2 px-3 rounded-lg cursor-pointer transition-colors",
                      activeConversationId === conversation.id
                        ? "bg-sidebar-accent"
                        : "hover:bg-sidebar-accent/50"
                    )}
                    onClick={() => onSelectConversation(conversation.id)}
                  >
                    <MessageSquare className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    <span className="flex-1 text-sm truncate text-sidebar-foreground">
                      {conversation.title}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteConversation(conversation.id);
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer - ChatGPT style user area */}
        <div className="p-2 border-t border-sidebar-border">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 h-12 px-3 text-sidebar-foreground hover:bg-sidebar-accent rounded-lg"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium truncate">Kullanıcı</p>
                  <p className="text-xs text-muted-foreground">Kişisel hesap</p>
                </div>
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem onClick={onOpenSettings}>
                <Settings className="h-4 w-4 mr-2" />
                Ayarlar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={toggleTheme}>
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4 mr-2" />
                ) : (
                  <Moon className="h-4 w-4 mr-2" />
                )}
                {theme === 'dark' ? 'Açık Mod' : 'Koyu Mod'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onExport}>
                <Download className="h-4 w-4 mr-2" />
                Dışa Aktar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onClearAll} className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Tümünü Temizle
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
    </>
  );
};
