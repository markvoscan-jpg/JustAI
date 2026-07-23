export function generateUnifiedDiff(original: string, updated: string, filePath: string) {
  const originalLines = original.split(/\r?\n/);
  const updatedLines = updated.split(/\r?\n/);
  const result: string[] = [];
  const maxLength = Math.max(originalLines.length, updatedLines.length);

  result.push(`--- ${filePath}`);
  result.push(`+++ ${filePath}`);

  for (let i = 0; i < maxLength; i += 1) {
    const originalLine = originalLines[i];
    const updatedLine = updatedLines[i];

    if (originalLine === updatedLine) {
      result.push(` ${originalLine ?? ''}`);
    } else {
      if (typeof originalLine !== 'undefined') {
        result.push(`-${originalLine}`);
      }
      if (typeof updatedLine !== 'undefined') {
        result.push(`+${updatedLine}`);
      }
    }
  }

  return result.join('\n');
}
