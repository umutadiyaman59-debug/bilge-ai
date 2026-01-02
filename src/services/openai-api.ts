/**
 * Groq API Service for Bilge AI
 * Handles communication with Groq API - Ultra fast & FREE
 * Uses OpenAI-compatible API format
 */

// API key should be provided by user in settings
const BUILTIN_API_KEY = '';

// Text-only message content
export interface OpenAITextContent {
  type: 'text';
  text: string;
}

// Image content for vision models
export interface OpenAIImageContent {
  type: 'image_url';
  image_url: {
    url: string; // base64 data URL or http URL
  };
}

// Message content can be string or array of content parts
export type OpenAIMessageContent = string | (OpenAITextContent | OpenAIImageContent)[];

export interface OpenAIMessage {
  role: 'user' | 'assistant' | 'system';
  content: OpenAIMessageContent;
}

export interface OpenAIAPIConfig {
  apiKey?: string;
  model?: string;
  maxTokens?: number;
  systemPrompt?: string;
}

// Available Groq models (FREE & FAST)
export const OPENAI_MODELS = {
  'meta-llama/llama-4-scout-17b-16e-instruct': {
    id: 'meta-llama/llama-4-scout-17b-16e-instruct',
    name: 'Llama 4 Scout',
    description: '👁️ Görüntü anlama (Vision)',
    supportsVision: true,
  },
  'meta-llama/llama-4-maverick-17b-128e-instruct': {
    id: 'meta-llama/llama-4-maverick-17b-128e-instruct',
    name: 'Llama 4 Maverick',
    description: '👁️ Gelişmiş görüntü (Vision)',
    supportsVision: true,
  },
  'llama-3.3-70b-versatile': {
    id: 'llama-3.3-70b-versatile',
    name: 'Llama 3.3 70B',
    description: 'En güçlü metin',
    supportsVision: false,
  },
  'llama-3.1-8b-instant': {
    id: 'llama-3.1-8b-instant',
    name: 'Llama 3.1 8B',
    description: 'Ultra hızlı',
    supportsVision: false,
  },
  'mixtral-8x7b-32768': {
    id: 'mixtral-8x7b-32768',
    name: 'Mixtral 8x7B',
    description: 'Dengeli',
    supportsVision: false,
  },
} as const;

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

export class OpenAIAPIService {
  private apiKey: string;
  private model: string;
  private maxTokens: number;
  private systemPrompt: string;
  private baseUrl: string;

  constructor(config: OpenAIAPIConfig = {}) {
    this.apiKey = config.apiKey || BUILTIN_API_KEY;
    this.model = config.model || 'meta-llama/llama-4-scout-17b-16e-instruct';
    this.maxTokens = config.maxTokens || 4096;
    this.systemPrompt = config.systemPrompt || DEFAULT_SYSTEM_PROMPT;
    // Use local Vite proxy to avoid CORS issues
    this.baseUrl = '/api/groq';
  }

  /**
   * Send a message and get a streamed response (uses non-streaming for CORS compatibility)
   */
  async *streamMessage(
    messages: OpenAIMessage[],
    onChunk?: (chunk: string) => void
  ): AsyncGenerator<string, void, unknown> {
    // Use non-streaming for CORS proxy compatibility
    const response = await this.sendMessage(messages);

    // Simulate streaming for UI
    const words = response.split(' ');
    let accumulated = '';

    for (const word of words) {
      accumulated += (accumulated ? ' ' : '') + word;
      if (onChunk) onChunk(accumulated);
      yield word + ' ';
      // Small delay for typing effect
      await new Promise(resolve => setTimeout(resolve, 20));
    }
  }

  /**
   * Send a message and get a complete response (non-streaming)
   */
  async sendMessage(messages: OpenAIMessage[]): Promise<string> {
    const allMessages: OpenAIMessage[] = [
      { role: 'system', content: this.systemPrompt },
      ...messages,
    ];

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: this.maxTokens,
        messages: allMessages,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'Bilinmeyen hata' } }));
      throw new Error(error.error?.message || `API hatası: ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<OpenAIAPIConfig>) {
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

  /**
   * Get current model
   */
  getModel(): string {
    return this.model;
  }
}

// Singleton instance
let openaiInstance: OpenAIAPIService | null = null;

export const getOpenAIAPI = (model?: string): OpenAIAPIService => {
  const storedModel = localStorage.getItem('bilge-model') || 'meta-llama/llama-4-scout-17b-16e-instruct';
  const selectedModel = model || storedModel;

  if (!openaiInstance || model) {
    openaiInstance = new OpenAIAPIService({ model: selectedModel });
  }

  return openaiInstance;
};

export const setOpenAIModel = (model: string) => {
  localStorage.setItem('bilge-model', model);
  if (openaiInstance) {
    openaiInstance.updateConfig({ model });
  }
};

// Always return true since we have built-in API key
export const hasOpenAIAPIKey = (): boolean => {
  return true;
};

export const getSelectedOpenAIModel = (): string => {
  return localStorage.getItem('bilge-model') || 'meta-llama/llama-4-scout-17b-16e-instruct';
};

// Check if current model supports vision
export const currentModelSupportsVision = (): boolean => {
  const model = getSelectedOpenAIModel();
  return OPENAI_MODELS[model as keyof typeof OPENAI_MODELS]?.supportsVision || false;
};
