import React, { useState } from 'react';
import { ChatMessage } from '../services/workspaceService';

interface Props {
  messages: ChatMessage[];
  onSend: (text: string) => Promise<void>;
}

export function ChatPanel({ messages, onSend }: Props) {
  const [draft, setDraft] = useState('');
  return (
    <div className="chat-panel">
      <div className="chat-history">
        {messages.map((message) => (
          <div key={message.id} className={`chat-message ${message.role}`}>
            <div className="chat-role">{message.role}</div>
            <div>{message.content}</div>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <textarea value={draft} onChange={(event) => setDraft(event.target.value)} rows={4} />
        <button onClick={async () => {
          if (!draft.trim()) return;
          await onSend(draft.trim());
          setDraft('');
        }}>Send</button>
      </div>
    </div>
  );
}
