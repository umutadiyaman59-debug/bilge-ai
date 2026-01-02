/**
 * Unified AI Service for Bilge
 * Uses Groq API with built-in key for seamless experience
 * Supports vision/image understanding with Llama 3.2 Vision
 */

import {
  getOpenAIAPI,
  OpenAIMessage,
  OpenAIMessageContent,
  OpenAITextContent,
  OpenAIImageContent,
  OPENAI_MODELS,
  getSelectedOpenAIModel,
  currentModelSupportsVision
} from './openai-api';
import { Attachment } from '@/types/chat';

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
  attachments?: Attachment[];
}

/**
 * Check if API is available (always true with built-in key)
 */
export const hasCurrentProviderAPIKey = (): boolean => {
  return true;
};

/**
 * Check if current model supports vision
 */
export const supportsVision = (): boolean => {
  return currentModelSupportsVision();
};

/**
 * Convert AIMessage to OpenAI format with vision support
 */
const convertToOpenAIMessage = (message: AIMessage): OpenAIMessage => {
  const hasImages = message.attachments?.some(a => a.type === 'image') || false;
  const supportsImages = currentModelSupportsVision();

  // If no images or model doesn't support vision, return simple text message
  if (!hasImages || !supportsImages) {
    return {
      role: message.role,
      content: message.content,
    };
  }

  // Build content array with text and images
  const contentParts: (OpenAITextContent | OpenAIImageContent)[] = [];

  // Add text content first
  if (message.content) {
    contentParts.push({
      type: 'text',
      text: message.content,
    });
  }

  // Add image attachments
  if (message.attachments) {
    for (const attachment of message.attachments) {
      if (attachment.type === 'image' && attachment.url) {
        contentParts.push({
          type: 'image_url',
          image_url: {
            url: attachment.url, // base64 data URL
          },
        });
      }
    }
  }

  return {
    role: message.role,
    content: contentParts,
  };
};

/**
 * Stream a message with optional image attachments
 */
export async function* streamAIMessage(
  messages: AIMessage[],
  onChunk?: (chunk: string) => void
): AsyncGenerator<string, void, unknown> {
  const api = getOpenAIAPI();

  // Convert messages to OpenAI format with vision support
  const apiMessages: OpenAIMessage[] = messages.map(convertToOpenAIMessage);

  yield* api.streamMessage(apiMessages, onChunk);
}

/**
 * Send a message and get a response (non-streaming)
 */
export const sendAIMessage = async (messages: AIMessage[]): Promise<string> => {
  const api = getOpenAIAPI();

  // Convert messages to OpenAI format with vision support
  const apiMessages: OpenAIMessage[] = messages.map(convertToOpenAIMessage);

  return api.sendMessage(apiMessages);
};

/**
 * Get current model info
 */
export const getCurrentProviderInfo = (): {
  providerName: string;
  model: string;
  modelName: string;
  supportsVision: boolean;
} => {
  const model = getSelectedOpenAIModel();
  const modelInfo = OPENAI_MODELS[model as keyof typeof OPENAI_MODELS];
  return {
    providerName: 'Bilge AI',
    model,
    modelName: modelInfo?.name || 'Llama 4 Scout',
    supportsVision: modelInfo?.supportsVision || false,
  };
};
