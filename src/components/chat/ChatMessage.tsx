import React, { useState } from 'react';
import { Copy, Check, Volume2, VolumeX, FileText, File, Image, Download, ThumbsUp, ThumbsDown, RotateCcw, MoreHorizontal } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message, Attachment } from '@/types/chat';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useTextToSpeech } from '@/hooks/useVoiceInput';
import { BilgeLogo } from '@/components/BilgeLogo';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';

interface ChatMessageProps {
  message: Message;
  isStreaming?: boolean;
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

const getFileIcon = (mimeType: string) => {
  if (mimeType.startsWith('image/')) return Image;
  if (mimeType.includes('pdf')) return FileText;
  return File;
};

// Attachment Preview Component
const AttachmentPreview: React.FC<{ attachment: Attachment }> = ({ attachment }) => {
  const [showPreview, setShowPreview] = useState(false);
  const FileIcon = getFileIcon(attachment.mimeType);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = attachment.url;
    link.download = attachment.name;
    link.click();
  };

  if (attachment.type === 'image') {
    return (
      <>
        <div
          className="cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => setShowPreview(true)}
        >
          <img
            src={attachment.thumbnail || attachment.url}
            alt={attachment.name}
            className="max-w-[200px] max-h-[200px] rounded-lg object-cover"
          />
        </div>
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-none">
            <img
              src={attachment.url}
              alt={attachment.name}
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <div
      className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors max-w-[250px]"
      onClick={handleDownload}
    >
      <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center">
        <FileIcon className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{attachment.name}</p>
        <p className="text-xs text-muted-foreground">{formatFileSize(attachment.size)}</p>
      </div>
      <Download className="h-4 w-4 text-muted-foreground" />
    </div>
  );
};

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isStreaming }) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  const { speak, stop, isSpeaking, isSupported: ttsSupported } = useTextToSpeech({ language: 'tr-TR' });

  // Debug log for attachment rendering
  if (message.attachments && message.attachments.length > 0) {
    console.log('Rendering message with attachments:', message.attachments.map(a => ({ id: a.id, type: a.type, name: a.name, hasUrl: !!a.url })));
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (isSpeaking) {
      stop();
    } else {
      speak(message.content);
    }
  };

  // ChatGPT style - user messages on right, AI on left with logo
  if (isUser) {
    return (
      <div className="flex justify-end animate-message-appear group">
        <div className="flex flex-col gap-2 max-w-[85%] md:max-w-[70%]">
          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-end">
              {message.attachments.map((attachment) => (
                <AttachmentPreview key={attachment.id} attachment={attachment} />
              ))}
            </div>
          )}

          {/* User message bubble - ChatGPT style */}
          {message.content && (
            <div className="bg-chat-user-bubble text-chat-user-bubble-foreground px-4 py-2.5 rounded-3xl">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // AI message - ChatGPT style
  return (
    <div className="flex gap-3 animate-message-appear group">
      {/* AI Avatar - Bilge logo */}
      <div className="flex-shrink-0 mt-1">
        <BilgeLogo size="xs" />
      </div>

      {/* AI Message content */}
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        {/* Attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {message.attachments.map((attachment) => (
              <AttachmentPreview key={attachment.id} attachment={attachment} />
            ))}
          </div>
        )}

        {/* Text content - no bubble, just text like ChatGPT */}
        {message.content && (
          <div className="text-sm leading-relaxed prose prose-sm dark:prose-invert max-w-none prose-p:my-2 prose-headings:my-3 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 prose-pre:my-3 prose-pre:bg-muted prose-pre:p-3 prose-pre:rounded-xl prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none text-foreground">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
            {isStreaming && (
              <span className="inline-block w-1.5 h-4 ml-0.5 bg-current animate-pulse" />
            )}
          </div>
        )}

        {/* ChatGPT style action buttons */}
        {!isStreaming && message.content && (
          <div className="flex items-center gap-0.5 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {/* Copy button */}
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg" onClick={handleCopy}>
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>

            {/* Thumbs up */}
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg">
              <ThumbsUp className="h-4 w-4 text-muted-foreground" />
            </Button>

            {/* Thumbs down */}
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg">
              <ThumbsDown className="h-4 w-4 text-muted-foreground" />
            </Button>

            {/* Regenerate */}
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg">
              <RotateCcw className="h-4 w-4 text-muted-foreground" />
            </Button>

            {/* Text-to-Speech */}
            {ttsSupported && (
              <Button
                variant="ghost"
                size="icon"
                className={cn('h-7 w-7 rounded-lg', isSpeaking && 'text-primary')}
                onClick={handleSpeak}
              >
                {isSpeaking ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            )}

            {/* More options */}
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg">
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
