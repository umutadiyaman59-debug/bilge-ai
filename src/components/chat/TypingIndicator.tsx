import React from 'react';
import { Bot } from 'lucide-react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex gap-3 animate-message-appear">
      {/* Avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
        <Bot className="h-4 w-4" />
      </div>

      {/* Typing bubble */}
      <div className="bg-chat-ai-bubble rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
        <div className="flex gap-1.5">
          <span className="typing-dot w-2 h-2 bg-muted-foreground rounded-full" />
          <span className="typing-dot w-2 h-2 bg-muted-foreground rounded-full" />
          <span className="typing-dot w-2 h-2 bg-muted-foreground rounded-full" />
        </div>
      </div>
    </div>
  );
};
