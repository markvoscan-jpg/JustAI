# JustAI 0.2

JustAI is a local AI IDE with an agent runtime, tool calling, multiple AI providers, local workspace editing, and external service integrations.

## What is included

### Agent system

- General Agent
- Code Agent
- Office Agent
- Multi-step agent loop with a configurable step limit
- Tool registry and tool executor
- Provider selection per request

### Local workspace tools

- `read_file`
- `list_files`
- `edit_file`

The local tools are restricted to the JustAI workspace and cannot escape it.

### AI providers

- Mock provider for offline development and tests
- OpenAI Responses API
- Anthropic Messages API

Provider API keys stay on the server and are never sent to the browser.

### Microsoft Word / OneDrive

JustAI includes a Microsoft OAuth connection and OneDrive integration.

The Office Agent can:

- read text from `.docx` files stored in OneDrive;
- replace exact text in a `.docx` document;
- upload the modified document back to OneDrive;
- return the Word/OneDrive URL when available;
- request an edit sharing link when Microsoft Graph allows it.

Microsoft Graph manages the OneDrive file and permissions; the actual Word document content is edited locally as OOXML and then uploaded back. Microsoft Graph itself does not expose a general Word editing API, so this architecture follows the supported download/edit/upload pattern.

## Requirements

- Node.js 22+
- npm 10+

## Install

From the project root:

```bash
npm run install:all
```

Or install manually:

```bash
npm install
npm install --prefix server
npm install --prefix apps/web
```

## Configure the server

Copy:

```text
server/.env.example
```

to:

```text
server/.env
```

### Offline development

The default provider is:

```env
JUSTAI_PROVIDER=mock
```

This requires no API key.

### OpenAI

```env
JUSTAI_PROVIDER=openai
OPENAI_API_KEY=...
OPENAI_MODEL=gpt-5.6
```

### Anthropic

```env
JUSTAI_PROVIDER=anthropic
ANTHROPIC_API_KEY=...
ANTHROPIC_MODEL=claude-sonnet-4-6
```

The provider can also be selected directly in the web UI.

## Microsoft Word / OneDrive setup

Create an app registration in Microsoft Entra ID.

Set the redirect URI to:

```text
http://localhost:4302/api/integrations/microsoft/callback
```

Use delegated permissions for:

- `openid`
- `profile`
- `offline_access`
- `User.Read`
- `Files.ReadWrite`

Then configure:

```env
MICROSOFT_CLIENT_ID=...
MICROSOFT_CLIENT_SECRET=...
MICROSOFT_TENANT=common
MICROSOFT_REDIRECT_URI=http://localhost:4302/api/integrations/microsoft/callback
JUSTAI_ENCRYPTION_KEY=<long-random-secret>
```

`JUSTAI_ENCRYPTION_KEY` is used to encrypt the local Microsoft refresh-token file.

After starting JustAI, open the Agent panel and press:

```text
Connect
```

The connection is stored locally on the server.

## Run

Backend:

```bash
npm run dev
```

Frontend:

```bash
npm run dev:web
```

Backend:

```text
http://localhost:4302
```

Frontend:

```text
http://localhost:3000
```

Health check:

```text
http://localhost:4302/api/health
```

## Agent examples

Local project:

```text
прочитай README.md и объясни проект
```

```text
покажи файлы в папке server/src/modules/ai
```

```text
измени файл server/src/modules/ai/README.md: замени "old" на "new"
```

Microsoft Word:

```text
Прочитай Word документ Documents/Contract.docx
```

```text
В Word документе Documents/Contract.docx замени "старый текст" на "новый текст"
```

For production use, prefer exact quoted text for Word edits. The built-in document editor intentionally refuses ambiguous or cross-run replacements instead of silently modifying the wrong text.

## Build

Backend type-check/build:

```bash
npm run build:server
```

Frontend:

```bash
npm run build:web
```

Both:

```bash
npm run build
```

## Architecture

```text
Browser
  |
  +-- IDE
  |    +-- File tree
  |    +-- Text editor
  |    +-- Agent chat
  |    +-- Provider selector
  |    +-- Microsoft connection
  |
  v
Express API
  |
  +-- AIService
  |    +-- Agent profiles
  |    +-- ProviderFactory
  |    +-- Agent loop
  |    +-- ToolRegistry
  |
  +-- Workspace API
  |
  +-- Integrations API
       +-- Microsoft OAuth
       +-- Microsoft Graph
       +-- Word tools
```

## Security model

- API keys remain on the backend.
- Microsoft refresh tokens are encrypted at rest.
- Local file tools are constrained to the workspace.
- AI tools are filtered by agent profile.
- Ambiguous local edits are rejected.
- Ambiguous Word replacements are rejected.
- External integrations are opt-in.

## Current scope

This release establishes the agent platform and integration foundation rather than pretending that every external service is already implemented.

The next integrations can follow the same adapter pattern:

```text
Integration
  +-- OAuth / connection
  +-- API client
  +-- tools
  +-- routes
  +-- UI connection card
```

This makes Google Docs, GitHub, Slack, Notion, and other services additive instead of requiring changes to the core agent runtime.

## AI Council — browser accounts, no API keys

JustAI includes an experimental browser-based AI Council. It can use your existing web accounts in persistent local browser profiles for:

- ChatGPT
- Claude
- DeepSeek

No provider API key is required for this mode. JustAI opens a visible Edge/Chromium window, you sign in yourself, and the local browser profile keeps the session for later runs.

The council assigns roles such as:

- Architect
- Critic
- Implementer
- Researcher
- Chair

The selected advisors receive the same task and local project context. The chair receives the advisors' answers and produces one implementation plan. The browser council is deliberately advisory in this first version: it does not directly write project files from a website response. Local JustAI tools remain the only mechanism that changes the workspace, and an explicit execution step should be used before applying a council plan.

### First council run on Windows

1. Run `start-justai.cmd`.
2. Open the **AI Council** section in the right panel.
3. Click **Подключить** for ChatGPT, Claude and/or DeepSeek.
4. A visible browser opens for each provider. Sign in manually in each window.
5. Return to JustAI and click **Созвать AI Council**.

Sessions are stored under:

```text
.justai/browser-profiles/
```

Do not copy this directory to another machine and do not commit it to Git. It contains browser session data.

### Browser engine

The Windows launcher uses Microsoft Edge when available. To use Playwright Chromium instead, set:

```env
JUSTAI_BROWSER_CHANNEL=
```

and run:

```bash
npx playwright install chromium
```

The browser council is a compatibility layer over normal web pages. A provider can change its UI or block automation; if that happens, JustAI reports the provider error instead of pretending the council completed successfully.
