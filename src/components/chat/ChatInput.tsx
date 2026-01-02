import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Plus, Image, Mic, MicOff, X, FileText, File, StopCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Attachment } from '@/types/chat';
import { useVoiceInput } from '@/hooks/useVoiceInput';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ChatInputProps {
  onSend: (message: string, attachments?: Attachment[]) => void;
  isLoading: boolean;
}

const generateId = () => Math.random().toString(36).substring(2, 15);

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

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading }) => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Voice input hook
  const {
    isListening,
    isSupported: voiceSupported,
    transcript,
    startListening,
    stopListening,
  } = useVoiceInput({
    language: 'tr-TR',
    onResult: (result) => {
      setMessage((prev) => prev + (prev ? ' ' : '') + result);
    },
  });

  // Update message with voice transcript
  useEffect(() => {
    if (transcript && isListening) {
      // Show interim results in real-time
    }
  }, [transcript, isListening]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [message]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if ((message.trim() || attachments.length > 0) && !isLoading) {
      // Debug log
      if (attachments.length > 0) {
        console.log('ChatInput: Submitting with attachments:', attachments.map(a => ({ id: a.id, type: a.type, name: a.name, urlLength: a.url?.length })));
      }
      onSend(message, attachments.length > 0 ? attachments : undefined);
      setMessage('');
      setAttachments([]);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const processFile = useCallback((file: File, type: 'file' | 'image'): Promise<Attachment> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const attachment: Attachment = {
          id: generateId(),
          type: type,
          name: file.name,
          size: file.size,
          mimeType: file.type,
          url: reader.result as string,
        };

        // Generate thumbnail for images
        if (type === 'image') {
          attachment.thumbnail = reader.result as string;
        }

        resolve(attachment);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, type: 'file' | 'image') => {
    const files = e.target.files;
    if (!files) return;

    const maxSize = 10 * 1024 * 1024; // 10MB limit
    const newAttachments: Attachment[] = [];

    for (const file of Array.from(files)) {
      if (file.size > maxSize) {
        alert(`${file.name} dosyası çok büyük. Maksimum 10MB yükleyebilirsiniz.`);
        continue;
      }

      try {
        const attachment = await processFile(file, type);
        newAttachments.push(attachment);
      } catch (error) {
        console.error('Error processing file:', error);
      }
    }

    setAttachments((prev) => [...prev, ...newAttachments]);

    // Reset input
    e.target.value = '';
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const hasContent = message.trim() || attachments.length > 0;

  return (
    <div className="bg-background p-4 pb-6">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        {/* Attachments Preview */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3 p-2 bg-muted/30 rounded-2xl">
            {attachments.map((attachment) => {
              const FileIcon = getFileIcon(attachment.mimeType);
              return (
                <div
                  key={attachment.id}
                  className="relative group flex items-center gap-2 bg-background rounded-lg p-2 pr-8 border border-border/50"
                >
                  {attachment.type === 'image' && attachment.thumbnail ? (
                    <img
                      src={attachment.thumbnail}
                      alt={attachment.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                      <FileIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                  <div className="min-w-0 max-w-[120px]">
                    <p className="text-xs font-medium truncate">{attachment.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {formatFileSize(attachment.size)}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeAttachment(attachment.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}

        {/* Voice Recording Indicator */}
        {isListening && (
          <div className="flex items-center justify-center gap-2 mb-3 py-2 px-4 bg-red-500/10 text-red-600 dark:text-red-400 rounded-full animate-pulse">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
            <span className="text-sm font-medium">Dinleniyor...</span>
            {transcript && <span className="text-sm italic">"{transcript}"</span>}
          </div>
        )}

        {/* ChatGPT style Main Input Area */}
        <div className="relative flex items-end gap-2 bg-chat-input-bg border border-chat-input-border rounded-3xl px-4 py-3 shadow-sm focus-within:border-muted-foreground/30">
          {/* Left side - Plus button for attachments (ChatGPT style) */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent/50 flex-shrink-0"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
              >
                <Plus className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Dosya veya görsel ekle</TooltipContent>
          </Tooltip>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            multiple
            accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.xls,.json,image/*"
            onChange={(e) => {
              const files = e.target.files;
              if (files) {
                Array.from(files).forEach(file => {
                  if (file.type.startsWith('image/')) {
                    handleFileSelect(e, 'image');
                  } else {
                    handleFileSelect(e, 'file');
                  }
                });
              }
            }}
          />
          <input
            ref={imageInputRef}
            type="file"
            className="hidden"
            multiple
            accept="image/*"
            onChange={(e) => handleFileSelect(e, 'image')}
          />

          {/* Text Input */}
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? 'Konuşun...' : 'Herhangi bir şey sor'}
            className={cn(
              'flex-1 resize-none bg-transparent border-none outline-none px-1 py-1 text-sm',
              'placeholder:text-muted-foreground min-h-[24px] max-h-[200px]',
              'scrollbar-thin'
            )}
            rows={1}
            disabled={isLoading || isListening}
          />

          {/* Right side buttons */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Voice Input */}
            {voiceSupported && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={cn(
                      'h-8 w-8 rounded-full transition-colors',
                      isListening
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                    )}
                    onClick={handleVoiceToggle}
                    disabled={isLoading}
                  >
                    {isListening ? (
                      <StopCircle className="h-4 w-4" />
                    ) : (
                      <Mic className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{isListening ? 'Kaydı Durdur' : 'Sesle Yaz'}</TooltipContent>
              </Tooltip>
            )}

            {/* Send Button - ChatGPT style circular */}
            <Button
              type="submit"
              size="icon"
              disabled={!hasContent || isLoading}
              className={cn(
                'flex-shrink-0 h-8 w-8 rounded-full transition-all',
                hasContent && !isLoading
                  ? 'bg-foreground text-background hover:bg-foreground/90'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              )}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <p className="text-xs text-center text-muted-foreground mt-3">
          Bilge hata yapabilir. Önemli bilgileri kontrol edin.
        </p>
      </form>
    </div>
  );
};
