import type { ChatMessage } from '../types/workspace.ts';

export interface AIProvider {
  id: string;
  name: string;
  type: 'local' | 'web';
  sendMessage(text: string, context?: string): Promise<ChatMessage>;
}

export class LocalAPIProvider implements AIProvider {
  id = 'local-api';
  name = 'Local API';
  type: 'local' | 'web' = 'local';

  async sendMessage(text: string): Promise<ChatMessage> {
    return {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: `Echo from local provider: ${text}`,
      timestamp: new Date().toISOString(),
    };
  }
}

export class WebAdapterProvider implements AIProvider {
  id = 'web-adapter';
  name = 'Web Adapter';
  type: 'local' | 'web' = 'web';

  async sendMessage(text: string): Promise<ChatMessage> {
    return {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: `Echo from web provider: ${text}`,
      timestamp: new Date().toISOString(),
    };
  }
}
