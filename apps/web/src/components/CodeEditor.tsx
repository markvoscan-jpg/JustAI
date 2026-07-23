import React from 'react';
import Editor from '@monaco-editor/react';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function CodeEditor({ value, onChange }: Props) {
  return (
    <Editor
      height="100%"
      defaultLanguage="typescript"
      value={value}
      theme="vs-light"
      onChange={(val) => onChange(val || '')}
      options={{ minimap: { enabled: false }, fontSize: 14 }}
    />
  );
}
