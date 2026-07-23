import fs from 'fs/promises';
import path from 'path';
import type { FileEntry, DiffResult } from '../types/workspace.ts';
import { generateUnifiedDiff } from './diffService.ts';

const workspaceRoot = path.resolve('..');

function ensureInProject(filePath: string) {
  const resolved = path.resolve(filePath);
  if (!resolved.startsWith(workspaceRoot)) {
    throw new Error('Outside of workspace root');
  }
  return resolved;
}

async function readDirectory(directory: string): Promise<FileEntry[]> {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  return Promise.all(entries.map(async (entry) => {
    const entryPath = path.join(directory, entry.name);
    const stats = await fs.stat(entryPath);
    const fileEntry: FileEntry = {
      path: entryPath.replace(`${workspaceRoot}${path.sep}`, ''),
      name: entry.name,
      type: entry.isDirectory() ? 'folder' : 'file',
      size: stats.size,
      modifiedAt: stats.mtime.toISOString()
    };
    if (entry.isDirectory()) {
      fileEntry.children = await readDirectory(entryPath);
    }
    return fileEntry;
  }));
}

export async function getProjectTree(): Promise<FileEntry[]> {
  return readDirectory(workspaceRoot);
}

export async function readFile(filePath: string): Promise<{ content: string }> {
  const resolved = ensureInProject(path.join(workspaceRoot, filePath));
  const content = await fs.readFile(resolved, 'utf-8');
  return { content };
}

export async function writeFile(filePath: string, content: string): Promise<void> {
  const resolved = ensureInProject(path.join(workspaceRoot, filePath));
  await fs.writeFile(resolved, content, 'utf-8');
}

export async function createFile(filePath: string, content = ''): Promise<void> {
  const resolved = ensureInProject(path.join(workspaceRoot, filePath));
  await fs.mkdir(path.dirname(resolved), { recursive: true });
  await fs.writeFile(resolved, content, 'utf-8');
}

export async function deleteFile(filePath: string): Promise<void> {
  const resolved = ensureInProject(path.join(workspaceRoot, filePath));
  await fs.rm(resolved, { force: true, recursive: true });
}

export async function renameFile(oldPath: string, newPath: string): Promise<void> {
  const resolvedOld = ensureInProject(path.join(workspaceRoot, oldPath));
  const resolvedNew = ensureInProject(path.join(workspaceRoot, newPath));
  await fs.mkdir(path.dirname(resolvedNew), { recursive: true });
  await fs.rename(resolvedOld, resolvedNew);
}

export async function getDiff(filePath: string, updatedContent?: string): Promise<DiffResult> {
  const resolved = ensureInProject(path.join(workspaceRoot, filePath));
  const originalContent = await fs.readFile(resolved, 'utf-8');
  const diff = updatedContent
    ? generateUnifiedDiff(originalContent, updatedContent, filePath)
    : generateUnifiedDiff(originalContent, originalContent, filePath);
  return { path: filePath, diff };
}
