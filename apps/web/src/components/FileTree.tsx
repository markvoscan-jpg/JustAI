import React from 'react';
import { FileEntry } from '../services/workspaceService';

interface Props {
  files: FileEntry[];
  onOpen: (path: string) => void;
}

function renderTree(files: FileEntry[], onOpen: (path: string) => void, depth = 0) {
  return files.map((file) => (
    <div key={file.path} style={{ paddingLeft: `${depth * 14}px` }}>
      <button
        className={`file-item ${file.type}`}
        onClick={() => file.type === 'file' && onOpen(file.path)}
      >
        {file.type === 'folder' ? '📁 ' : '📄 '}
        {file.name}
      </button>
      {file.children?.length ? renderTree(file.children, onOpen, depth + 1) : null}
    </div>
  ));
}

export function FileTree({ files, onOpen }: Props) {
  return <div className="file-tree">{renderTree(files, onOpen)}</div>;
}
