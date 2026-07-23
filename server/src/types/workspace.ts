export interface FileEntry {
  path: string;
  name: string;
  type: 'file' | 'folder';
  size: number;
  modifiedAt: string;
  children?: FileEntry[];
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
