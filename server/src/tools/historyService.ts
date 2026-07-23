import type { ChatMessage } from '../types/workspace.ts';

interface HistoryEntry {
  id: string;
  action: string;
  path?: string;
  payload?: unknown;
  timestamp: string;
}

const history: HistoryEntry[] = [];

export function addHistory(action: string, payload?: unknown) {
  history.push({
    id: crypto.randomUUID(),
    action,
    payload,
    timestamp: new Date().toISOString()
  });
}

export function getHistory() {
  return history.slice().reverse();
}

export function getCheckpoint() {
  return {
    createdAt: new Date().toISOString(),
    notes: 'Checkpoint snapshot placeholder',
  };
}
