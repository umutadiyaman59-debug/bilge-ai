import React, { useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';
import { EmptyState } from './EmptyState';
import { Message } from '@/types/chat';

interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
  streamingContent: string;
  onExampleClick: (message: string) => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  isLoading,
  streamingContent,
  onExampleClick,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingContent]);

  if (messages.length === 0) {
    return <EmptyState onExampleClick={onExampleClick} />;
  }

  return (
    <ScrollArea className="flex-1" ref={scrollRef}>
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {/* Streaming message */}
        {isLoading && streamingContent && (
          <ChatMessage
            message={{
              id: 'streaming',
              role: 'assistant',
              content: streamingContent,
              timestamp: new Date(),
            }}
            isStreaming
          />
        )}

        {/* Typing indicator when loading but no content yet */}
        {isLoading && !streamingContent && <TypingIndicator />}
      </div>
    </ScrollArea>
  );
};
