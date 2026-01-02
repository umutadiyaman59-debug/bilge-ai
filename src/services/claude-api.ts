/**
 * Claude API Service for Bilge AI
 * Handles communication with Claude API including streaming responses
 */

export interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ClaudeAPIConfig {
  apiKey: string;
  model?: string;
  maxTokens?: number;
  systemPrompt?: string;
}

// Default system prompt for Bilge - Turkish AI Assistant
const DEFAULT_SYSTEM_PROMPT = `Sen Bilge'sin - Türkiye'nin ilk yerli yapay zeka asistanı.

Görevin:
- Kullanıcılara Türkçe olarak yardımcı olmak
- Sorulara açık, anlaşılır ve kapsamlı cevaplar vermek
- Profesyonel ama samimi bir dil kullanmak
- Türk kültürüne ve diline uygun yanıtlar vermek

Önemli kurallar:
- Her zaman nazik ve yardımsever ol
- Bilmediğin konularda dürüst ol
- Zararlı, yasadışı veya etik olmayan içerik üretme
- Kullanıcının dilini takip et (Türkçe veya İngilizce)

Merhaba de ve yardımcı olmaya hazır olduğunu belirt.`;

export class ClaudeAPIService {
  private apiKey: string;
  private model: string;
  private maxTokens: number;
  private systemPrompt: string;
  private baseUrl: string;

  constructor(config: ClaudeAPIConfig) {
    this.apiKey = config.apiKey;
    this.model = config.model || 'claude-sonnet-4-20250514';
    this.maxTokens = config.maxTokens || 4096;
    this.systemPrompt = config.systemPrompt || DEFAULT_SYSTEM_PROMPT;
    // Use local Vite proxy to avoid CORS issues
    this.baseUrl = '/api/claude';
  }

  /**
   * Send a message and get a streamed response
   */
  async *streamMessage(
    messages: ClaudeMessage[],
    onChunk?: (chunk: string) => void
  ): AsyncGenerator<string, void, unknown> {
    const response = await fetch(`${this.baseUrl}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: this.maxTokens,
        system: this.systemPrompt,
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        stream: true,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'Bilinmeyen hata' } }));
      throw new Error(error.error?.message || `API hatası: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Response body okunamadı');
    }

    const decoder = new TextDecoder();
    let buffer = '';
    let fullContent = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const event = JSON.parse(data);

              if (event.type === 'content_block_delta' && event.delta?.text) {
                const text = event.delta.text;
                fullContent += text;
                if (onChunk) onChunk(fullContent);
                yield text;
              }
            } catch {
              // Skip malformed JSON
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  /**
   * Send a message and get a complete response (non-streaming)
   */
  async sendMessage(messages: ClaudeMessage[]): Promise<string> {
    const response = await fetch(`${this.baseUrl}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: this.maxTokens,
        system: this.systemPrompt,
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'Bilinmeyen hata' } }));
      throw new Error(error.error?.message || `API hatası: ${response.status}`);
    }

    const data = await response.json();
    return data.content[0]?.text || '';
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<ClaudeAPIConfig>) {
    if (config.apiKey) this.apiKey = config.apiKey;
    if (config.model) this.model = config.model;
    if (config.maxTokens) this.maxTokens = config.maxTokens;
    if (config.systemPrompt) this.systemPrompt = config.systemPrompt;
  }

  /**
   * Test API connection
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.sendMessage([{ role: 'user', content: 'Merhaba' }]);
      return true;
    } catch {
      return false;
    }
  }
}

// Singleton instance
let apiInstance: ClaudeAPIService | null = null;

export const getClaudeAPI = (apiKey?: string): ClaudeAPIService => {
  const storedKey = localStorage.getItem('bilge-api-key') || '';
  const key = apiKey || storedKey;

  if (!apiInstance || apiKey) {
    apiInstance = new ClaudeAPIService({ apiKey: key });
  }

  return apiInstance;
};

export const setAPIKey = (apiKey: string) => {
  localStorage.setItem('bilge-api-key', apiKey);
  apiInstance = new ClaudeAPIService({ apiKey });
};

export const hasAPIKey = (): boolean => {
  return !!localStorage.getItem('bilge-api-key');
};
