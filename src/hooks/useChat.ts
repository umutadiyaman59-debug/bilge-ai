import { useState, useCallback } from 'react';
import { Message, Conversation, Attachment } from '@/types/chat';
import { streamAIMessage, hasCurrentProviderAPIKey, AIMessage, getCurrentProviderInfo } from '@/services/ai-service';

const generateId = () => Math.random().toString(36).substring(2, 15);

const generateTitle = (content: string) => {
  const words = content.split(' ').slice(0, 5).join(' ');
  return words.length > 30 ? words.substring(0, 30) + '...' : words;
};

// Demo mode responses when no API key is provided
const demoResponses = [
  "Merhaba! Ben Bilge, Türkiye'nin ilk yerli yapay zeka asistanıyım. Size nasıl yardımcı olabilirim?",
  "Bu demo modunda çalışıyorum. Tam deneyim için API anahtarınızı Ayarlar bölümünden ekleyebilirsiniz.",
  "Anlıyorum. Gerçek yanıtlar almak için lütfen API anahtarınızı yapılandırın.",
  "Demo modunda birkaç örnek yanıt gösteriyorum. Ayarlar > API Anahtarı bölümünden gerçek AI'ya bağlanabilirsiniz.",
  "Türkçe veya İngilizce sorularınızı yanıtlayabilirim. API bağlantısı için Ayarlar menüsünü kullanın.",
];

const simulateResponse = async (
  message: string,
  onChunk: (chunk: string) => void
): Promise<string> => {
  const baseResponse = demoResponses[Math.floor(Math.random() * demoResponses.length)];
  const response = message.toLowerCase().includes('merhaba')
    ? "Merhaba! Ben Bilge, Türkiye'nin yapay zeka asistanı. 🇹🇷 Size yardımcı olmaktan mutluluk duyarım! Bu demo modunda çalışıyorum. Gerçek AI yanıtları için Ayarlar bölümünden Claude veya GPT-5 API anahtarınızı ekleyin."
    : baseResponse;

  const words = response.split(' ');
  let accumulated = '';

  for (const word of words) {
    await new Promise((resolve) => setTimeout(resolve, 40 + Math.random() * 60));
    accumulated += (accumulated ? ' ' : '') + word;
    onChunk(accumulated);
  }

  return accumulated;
};

export const useChat = () => {
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const stored = localStorage.getItem('bilge-conversations');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        return parsed.map((c: Conversation) => ({
          ...c,
          createdAt: new Date(c.createdAt),
          updatedAt: new Date(c.updatedAt),
          messages: c.messages.map((m: Message) => ({
            ...m,
            timestamp: new Date(m.timestamp),
          })),
        }));
      } catch {
        return [];
      }
    }
    return [];
  });
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  const saveConversations = useCallback((convs: Conversation[]) => {
    try {
      const data = JSON.stringify(convs);
      localStorage.setItem('bilge-conversations', data);
    } catch (error) {
      console.error('Failed to save conversations to localStorage:', error);
      // localStorage quota exceeded - still update state but warn user
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        console.warn('localStorage quota exceeded. Some data may not be persisted.');
      }
    }
    setConversations(convs);
  }, []);

  const activeConversation = conversations.find((c) => c.id === activeConversationId) || null;

  // Create new conversation - optionally skip saving (used internally by sendMessage)
  const createNewConversation = useCallback((skipSave = false) => {
    const newConversation: Conversation = {
      id: generateId(),
      title: 'Yeni Sohbet',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    if (!skipSave) {
      const updated = [newConversation, ...conversations];
      saveConversations(updated);
    }
    setActiveConversationId(newConversation.id);
    return newConversation;
  }, [conversations, saveConversations]);

  const sendMessage = useCallback(
    async (content: string, attachments?: Attachment[]) => {
      if (!content.trim() && (!attachments || attachments.length === 0)) return;

      setError(null);
      let currentConversation = activeConversation;
      let isNewConversation = false;

      if (!currentConversation) {
        // Skip saving in createNewConversation - we'll save with the message below
        currentConversation = createNewConversation(true);
        isNewConversation = true;
      }

      const userMessage: Message = {
        id: generateId(),
        role: 'user',
        content: content.trim(),
        timestamp: new Date(),
        attachments: attachments && attachments.length > 0 ? attachments : undefined,
      };

      // Debug log for attachment flow
      if (attachments && attachments.length > 0) {
        console.log('Sending message with attachments:', attachments.map(a => ({ id: a.id, type: a.type, name: a.name })));
      }

      // Update conversation with user message
      let updatedConversations = conversations.map((c) =>
        c.id === currentConversation!.id
          ? {
              ...c,
              messages: [...c.messages, userMessage],
              title: c.messages.length === 0 ? generateTitle(content) : c.title,
              updatedAt: new Date(),
            }
          : c
      );

      if (isNewConversation) {
        // For new conversations, add to the front of the list
        updatedConversations = [
          {
            ...currentConversation,
            messages: [userMessage],
            title: generateTitle(content),
            updatedAt: new Date(),
          },
          ...conversations,
        ];
      }

      saveConversations(updatedConversations);
      setIsLoading(true);
      setStreamingContent('');

      try {
        let response = '';

        // Check if we have an API key for the current provider
        if (hasCurrentProviderAPIKey()) {
          // Use real AI API (Claude or GPT-5)
          const providerInfo = getCurrentProviderInfo();
          console.log(`Using ${providerInfo.providerName} - ${providerInfo.modelName}`);

          // Get conversation history for context (including attachments for vision)
          const currentConv = updatedConversations.find((c) => c.id === currentConversation!.id);
          const history: AIMessage[] =
            currentConv?.messages.map((m) => ({
              role: m.role,
              content: m.content,
              attachments: m.attachments, // Include images for vision model
            })) || [];

          // Stream the response
          try {
            const stream = streamAIMessage(history, (chunk) => {
              setStreamingContent(chunk);
            });

            for await (const chunk of stream) {
              response += chunk;
            }
          } catch (streamError) {
            console.error('Stream error:', streamError);
            throw streamError;
          }
        } else {
          // Use demo mode
          response = await simulateResponse(content, (chunk) => {
            setStreamingContent(chunk);
          });
        }

        const assistantMessage: Message = {
          id: generateId(),
          role: 'assistant',
          content: response,
          timestamp: new Date(),
        };

        const finalConversations = updatedConversations.map((c) =>
          c.id === currentConversation!.id
            ? {
                ...c,
                messages: [...c.messages, assistantMessage],
                updatedAt: new Date(),
              }
            : c
        );

        saveConversations(finalConversations);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Yanıt alınırken bir hata oluştu.';
        setError(errorMessage);
        console.error('Chat error:', err);
      } finally {
        setIsLoading(false);
        setStreamingContent('');
      }
    },
    [activeConversation, conversations, createNewConversation, saveConversations]
  );

  const deleteConversation = useCallback(
    (id: string) => {
      const updated = conversations.filter((c) => c.id !== id);
      saveConversations(updated);
      if (activeConversationId === id) {
        setActiveConversationId(updated[0]?.id || null);
      }
    },
    [conversations, activeConversationId, saveConversations]
  );

  const clearAllConversations = useCallback(() => {
    saveConversations([]);
    setActiveConversationId(null);
  }, [saveConversations]);

  const exportConversations = useCallback(() => {
    const data = JSON.stringify(conversations, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bilge-sohbetler-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [conversations]);

  const exportToPDF = useCallback(async () => {
    if (!activeConversation || activeConversation.messages.length === 0) {
      setError('Dışa aktarılacak sohbet bulunamadı.');
      return;
    }

    // Create printable HTML content
    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Bilge Sohbet - ${activeConversation.title}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            padding: 40px;
            max-width: 800px;
            margin: 0 auto;
            color: #1a1a2e;
            line-height: 1.6;
          }
          .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 2px solid #e0e0e0;
          }
          .header h1 {
            font-size: 28px;
            color: #2d3748;
            margin-bottom: 8px;
          }
          .header .logo {
            width: 60px;
            height: 60px;
            background: #2d3748;
            color: white;
            border-radius: 12px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 12px;
          }
          .header p {
            color: #718096;
            font-size: 14px;
          }
          .message {
            margin-bottom: 24px;
            page-break-inside: avoid;
          }
          .message-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 8px;
          }
          .avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-weight: 600;
          }
          .user .avatar {
            background: #4a5568;
            color: white;
          }
          .assistant .avatar {
            background: #2d3748;
            color: white;
          }
          .role {
            font-weight: 600;
            font-size: 14px;
          }
          .user .role { color: #4a5568; }
          .assistant .role { color: #2d3748; }
          .timestamp {
            color: #a0aec0;
            font-size: 12px;
            margin-left: auto;
          }
          .content {
            padding: 16px 20px;
            border-radius: 12px;
            font-size: 15px;
            white-space: pre-wrap;
          }
          .user .content {
            background: #f7fafc;
            border: 1px solid #e2e8f0;
            margin-left: 42px;
          }
          .assistant .content {
            background: #edf2f7;
            border: 1px solid #e2e8f0;
            margin-left: 42px;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e0e0e0;
            text-align: center;
            color: #a0aec0;
            font-size: 12px;
          }
          @media print {
            body { padding: 20px; }
            .message { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">B</div>
          <h1>Bilge Sohbet Kaydı</h1>
          <p>${activeConversation.title}</p>
          <p>Oluşturulma: ${new Date(activeConversation.createdAt).toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}</p>
        </div>

        ${activeConversation.messages
          .map(
            (msg) => `
          <div class="message ${msg.role}">
            <div class="message-header">
              <div class="avatar">${msg.role === 'user' ? 'S' : 'B'}</div>
              <span class="role">${msg.role === 'user' ? 'Siz' : 'Bilge'}</span>
              <span class="timestamp">${new Date(msg.timestamp).toLocaleTimeString('tr-TR', {
                hour: '2-digit',
                minute: '2-digit',
              })}</span>
            </div>
            <div class="content">${msg.content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
          </div>
        `
          )
          .join('')}

        <div class="footer">
          <p>Bu sohbet Bilge AI tarafından oluşturulmuştur.</p>
          <p>Dışa aktarma tarihi: ${new Date().toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}</p>
        </div>
      </body>
      </html>
    `;

    // Open in new window and print
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(content);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  }, [activeConversation, setError]);

  return {
    conversations,
    activeConversation,
    activeConversationId,
    setActiveConversationId,
    isLoading,
    streamingContent,
    error,
    sendMessage,
    createNewConversation,
    deleteConversation,
    clearAllConversations,
    exportConversations,
    exportToPDF,
  };
};
