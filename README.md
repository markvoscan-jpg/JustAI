# JustAI

JustAI is a modular IDE-style editor with an AI assistant panel. This MVP includes a file tree, code editor, AI chat panel, diff preview, and backend tools for safe file operations.

## Structure
- `apps/web` — frontend UI built with React + Vite
- `server` — backend API server in TypeScript + Express

## Getting Started
1. `cd C:\Users\Acer\JustAI`
2. `npm install`
3. `npm run dev`

## Features
- Workspace file tree
- Code editor with Monaco integration
- Chat-based AI panel
- File read/write/create/rename/delete operations
- Diff preview and history
- Local and web provider abstractions for AI

## Notes
The backend is configured to operate inside the workspace root and prevents file operations outside this directory.
