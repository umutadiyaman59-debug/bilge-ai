// Bilge AI API Service
// This service handles communication with the Claude API

export interface StreamCallbacks {
  onChunk: (chunk: string) => void;
  onComplete: (fullResponse: string) => void;
  onError: (error: Error) => void;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// API configuration - stored in localStorage
const getApiConfig = () => {
  const stored = localStorage.getItem('bilge-api-config');
  if (stored) {
    return JSON.parse(stored);
  }
  return {
    apiKey: '',
    model: 'claude-sonnet-4-20250514',
    systemPrompt: `Sen Bilge'sin - Türkiye'nin ilk yerli yapay zeka asistanı.
Kullanıcılara Türkçe olarak yardımcı oluyorsun. Samimi, yardımsever ve profesyonel bir üslupla yanıt ver.
Yanıtlarını açık ve anlaşılır tut. Gerektiğinde örnekler ve açıklamalar ekle.
Markdown formatını kullanabilirsin: **kalın**, *italik*, \`kod\`, listeler, vs.`
  };
};

export const saveApiConfig = (config: { apiKey?: string; model?: string; systemPrompt?: string }) => {
  const current = getApiConfig();
  const updated = { ...current, ...config };
  localStorage.setItem('bilge-api-config', JSON.stringify(updated));
};

export const getStoredApiKey = () => {
  return getApiConfig().apiKey;
};

export const getSystemPrompt = () => {
  return getApiConfig().systemPrompt;
};

export const getModel = () => {
  return getApiConfig().model;
};

// Stream chat response from Claude API
export async function streamChatResponse(
  messages: ChatMessage[],
  callbacks: StreamCallbacks,
  customSystemPrompt?: string
): Promise<void> {
  const config = getApiConfig();

  if (!config.apiKey) {
    // Fallback to simulated response if no API key
    await simulateResponse(messages, callbacks);
    return;
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: config.model,
        max_tokens: 4096,
        stream: true,
        system: customSystemPrompt || config.systemPrompt,
        messages: messages.map(m => ({
          role: m.role,
          content: m.content
        }))
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'API isteği başarısız oldu');
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let fullContent = '';

    if (!reader) {
      throw new Error('Yanıt okunamadı');
    }

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
              fullContent += parsed.delta.text;
              callbacks.onChunk(fullContent);
            }
          } catch {
            // Skip invalid JSON
          }
        }
      }
    }

    callbacks.onComplete(fullContent);
  } catch (error) {
    console.error('API Error:', error);
    callbacks.onError(error instanceof Error ? error : new Error('Bilinmeyen hata'));

    // Fallback to simulation on error
    await simulateResponse(messages, callbacks);
  }
}

// Simulated response for demo/offline mode
async function simulateResponse(
  messages: ChatMessage[],
  callbacks: StreamCallbacks
): Promise<void> {
  const lastMessage = messages[messages.length - 1]?.content.toLowerCase() || '';

  const responses: { [key: string]: string } = {
    merhaba: `Merhaba! Ben **Bilge**, Türkiye'nin ilk yerli yapay zeka asistanıyım. Size bugün nasıl yardımcı olabilirim?

Bana şunları sorabilirsiniz:
- 📝 Metin yazımı ve düzenleme
- 💡 Fikir üretme ve beyin fırtınası
- 📊 Analiz ve araştırma
- 💻 Programlama ve teknik sorular
- 🎯 Günlük problemlerin çözümü`,

    nasılsın: `Teşekkür ederim, harika çalışıyorum! 🌟

Size yardımcı olmak için buradayım. Bugün hangi konuda destek alabilirim?`,

    yapay: `**Yapay Zeka (AI)** hakkında bilgi:

Yapay zeka, insan zekasını taklit eden ve öğrenme, problem çözme, karar verme gibi görevleri gerçekleştirebilen bilgisayar sistemleridir.

### Temel Alanlar:
1. **Makine Öğrenimi** - Veriden öğrenme
2. **Derin Öğrenme** - Sinir ağları ile kompleks örüntüler
3. **Doğal Dil İşleme** - Dil anlama ve üretme
4. **Bilgisayarlı Görü** - Görüntü analizi

Daha detaylı bilgi almak ister misiniz?`,

    default: `Bu ilginç bir soru! İşte düşüncelerim:

Ben **Bilge** olarak size yardımcı olmaya hazırım. Şu anda demo modundayım, ancak API anahtarınızı ayarlardan ekleyerek tam yapay zeka deneyimi elde edebilirsiniz.

Sorularınız için buradayım! 💬`
  };

  let response = responses.default;

  for (const [key, value] of Object.entries(responses)) {
    if (lastMessage.includes(key)) {
      response = value;
      break;
    }
  }

  // Simulate streaming
  const words = response.split(' ');
  let accumulated = '';

  for (const word of words) {
    await new Promise(resolve => setTimeout(resolve, 30 + Math.random() * 50));
    accumulated += (accumulated ? ' ' : '') + word;
    callbacks.onChunk(accumulated);
  }

  callbacks.onComplete(accumulated);
}

// Export chat to PDF
export async function exportToPDF(
  conversationTitle: string,
  messages: ChatMessage[]
): Promise<void> {
  const { jsPDF } = await import('jspdf');

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;
  let y = 20;

  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Bilge - Sohbet Gecmisi', margin, y);
  y += 10;

  // Subtitle
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(conversationTitle, margin, y);
  y += 5;

  doc.setFontSize(10);
  doc.text(`Tarih: ${new Date().toLocaleDateString('tr-TR')}`, margin, y);
  y += 15;

  // Separator
  doc.setDrawColor(200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  // Messages
  doc.setFontSize(11);

  for (const message of messages) {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    const role = message.role === 'user' ? 'Siz:' : 'Bilge:';
    doc.setFont('helvetica', 'bold');
    doc.text(role, margin, y);
    y += 6;

    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(message.content, maxWidth);

    for (const line of lines) {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, margin, y);
      y += 5;
    }
    y += 8;
  }

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(128);
  doc.text('Bilge - Turkiye\'nin ilk yerli yapay zeka asistani', margin, 290);

  doc.save(`bilge-sohbet-${new Date().toISOString().split('T')[0]}.pdf`);
}
