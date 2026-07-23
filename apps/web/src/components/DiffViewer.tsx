import React from 'react';

interface Props {
  diff: string;
}

export function DiffViewer({ diff }: Props) {
  return (
    <div className="diff-viewer">
      <h3>Diff Preview</h3>
      <pre>{diff || 'No diff available'}</pre>
    </div>
  );
}
