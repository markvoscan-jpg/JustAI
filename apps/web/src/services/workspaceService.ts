import axios from 'axios';

export interface FileEntry {
  path: string;
  name: string;
  type: 'file' | 'folder';
  size: number;
  modifiedAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'tool';
  content: string;
  timestamp: string;
}

export interface DiffResult {
  path: string;
  diff: string;
}

export class WorkspaceService {
  private api = axios.create({ baseURL: '/api' });

  async getProjectTree(): Promise<FileEntry[]> {
    const response = await this.api.get<FileEntry[]>('/project/tree');
    return response.data;
  }

  async readFile(path: string): Promise<{ content: string }> {
    const response = await this.api.get<{ content: string }>('/files/read', { params: { path } });
    return response.data;
  }

  async writeFile(path: string, content: string): Promise<void> {
    await this.api.post('/files/write', { path, content });
  }

  async createFile(path: string, content?: string): Promise<void> {
    await this.api.post('/files/create', { path, content });
  }

  async deleteFile(path: string): Promise<void> {
    await this.api.delete('/files/delete', { params: { path } });
  }

  async renameFile(oldPath: string, newPath: string): Promise<void> {
    await this.api.post('/files/rename', { oldPath, newPath });
  }

  async fetchDiff(path: string, updatedContent?: string): Promise<DiffResult> {
    const response = await this.api.get<DiffResult>('/diff', {
      params: { path, updated: updatedContent }
    });
    return response.data;
  }

  async sendMessage(text: string, mode: 'local' | 'web' = 'local'): Promise<ChatMessage> {
    const response = await this.api.post<ChatMessage>('/agent/chat', { text, mode });
    return response.data;
  }
}
