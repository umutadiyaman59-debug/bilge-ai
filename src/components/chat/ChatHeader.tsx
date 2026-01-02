import React from 'react';
import { Menu, ChevronDown, Share, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BilgeLogo } from '@/components/BilgeLogo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ChatHeaderProps {
  onMenuClick: () => void;
  onProfileClick: () => void;
  onShareClick?: () => void;
  onInviteClick?: () => void;
  hasActiveConversation?: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  onMenuClick,
  onProfileClick,
  onShareClick,
  onInviteClick,
  hasActiveConversation = false,
}) => {
  return (
    <header className="h-12 bg-background flex items-center justify-between px-3 sticky top-0 z-10">
      {/* Left side - Menu (mobile) + Bilge dropdown */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-9 w-9 text-foreground hover:bg-accent"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* ChatGPT style dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-9 px-3 gap-1.5 text-foreground hover:bg-accent font-medium"
            >
              <BilgeLogo size="xs" />
              <span>Bilge</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-72">
            <DropdownMenuItem className="flex items-center gap-3 py-3">
              <BilgeLogo size="sm" />
              <div>
                <p className="font-medium">Bilge</p>
                <p className="text-xs text-muted-foreground">Türkiye'nin ilk yerli yapay zekası</p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Right side - Share & Add person (ChatGPT style) */}
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3 gap-1.5 text-muted-foreground hover:text-foreground hover:bg-accent hidden sm:flex disabled:opacity-50"
              onClick={onShareClick}
              disabled={!hasActiveConversation}
            >
              <Share className="h-4 w-4" />
              <span className="text-sm">Paylaş</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {hasActiveConversation ? 'Sohbeti paylaş' : 'Paylaşmak için bir sohbet başlatın'}
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3 gap-1.5 text-muted-foreground hover:text-foreground hover:bg-accent hidden sm:flex disabled:opacity-50"
              onClick={onInviteClick}
              disabled={!hasActiveConversation}
            >
              <UserPlus className="h-4 w-4" />
              <span className="text-sm">Kişi ekle</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {hasActiveConversation ? 'Sohbete kişi davet et' : 'Davet için bir sohbet başlatın'}
          </TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
};
