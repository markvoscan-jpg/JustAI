import { useEffect, useState } from 'react';
import { FileTree } from './components/FileTree';
import { CodeEditor } from './components/CodeEditor';
import { ChatPanel } from './components/ChatPanel';
import { DiffViewer } from './components/DiffViewer';
import { WorkspaceService, FileEntry, ChatMessage } from './services/workspaceService';

const workspace = new WorkspaceService();

function App() {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [activePath, setActivePath] = useState<string | null>(null);
  const [content, setContent] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [diff, setDiff] = useState<string>('');
  const [aiMode, setAiMode] = useState<'local' | 'web'>('local');
  const [status, setStatus] = useState<string>('Ready');
  const [newFilePath, setNewFilePath] = useState<string>('');

  const reloadTree = async () => {
    try {
      const tree = await workspace.getProjectTree();
      setFiles(tree);
    } catch (error: any) {
      setStatus(`Error loading tree: ${error.message}`);
    }
  };

  useEffect(() => {
    reloadTree();
  }, []);

  const openFile = async (path: string) => {
    setStatus('Loading file...');
    const result = await workspace.readFile(path);
    setActivePath(path);
    setContent(result.content);
    setDiff('');
    setStatus('File loaded');
  };

  const saveFile = async () => {
    if (!activePath) {
      setStatus('Select a file first');
      return;
    }
    setStatus('Saving file...');
    await workspace.writeFile(activePath, content);
    const diffPreview = await workspace.fetchDiff(activePath, content);
    setDiff(diffPreview.diff);
    setStatus('Saved successfully');
  };

  const createFile = async () => {
    if (!newFilePath.trim()) {
      setStatus('Enter a relative path for the new file');
      return;
    }
    setStatus('Creating file...');
    await workspace.createFile(newFilePath.trim(), '');
    setNewFilePath('');
    await reloadTree();
    setStatus('File created');
  };

  const deleteActiveFile = async () => {
    if (!activePath) {
      setStatus('Select a file first');
      return;
    }
    setStatus('Deleting file...');
    await workspace.deleteFile(activePath);
    setActivePath(null);
    setContent('');
    setDiff('');
    await reloadTree();
    setStatus('File deleted');
  };

  const handleSendMessage = async (text: string) => {
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await workspace.sendMessage(text, aiMode);
      setMessages((prev) => [...prev, response]);
      setStatus('AI response received');
    } catch (error: any) {
      setStatus(`AI error: ${error.message}`);
    }
  };

  return (
    <div className="app-shell">
      <div className="sidebar">
        <div className="sidebar-header">
          <span>Project</span>
        </div>
        <div className="sidebar-toolbar">
          <input
            type="text"
            value={newFilePath}
            placeholder="new-file.ts"
            onChange={(event) => setNewFilePath(event.target.value)}
          />
          <button onClick={createFile}>Create</button>
        </div>
        <FileTree files={files} onOpen={openFile} />
      </div>
      <div className="editor-pane">
        <div className="editor-header">
          <div>Editor</div>
          <div className="editor-actions">
            <button onClick={saveFile} disabled={!activePath}>Save</button>
            <button onClick={deleteActiveFile} disabled={!activePath}>Delete</button>
          </div>
        </div>
        <div className="editor-status">{activePath ? activePath : 'No file selected'}</div>
        <CodeEditor value={content} onChange={setContent} />
      </div>
      <div className="assistant-pane">
        <div className="assistant-header">
          <div>AI Assistant</div>
          <div className="assistant-controls">
            <select value={aiMode} onChange={(event) => setAiMode(event.target.value as 'local' | 'web')}>
              <option value="local">Local API</option>
              <option value="web">Web Agent</option>
            </select>
          </div>
        </div>
        <ChatPanel messages={messages} onSend={handleSendMessage} />
        <DiffViewer diff={diff} />
        <div className="app-footer">{status}</div>
      </div>
    </div>
  );
}

export default App;
