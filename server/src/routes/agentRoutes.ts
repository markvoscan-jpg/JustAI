import express from 'express';
import { LocalAPIProvider, WebAdapterProvider } from '../providers/aiProvider.ts';
import type { ChatMessage } from '../types/workspace.ts';

const router = express.Router();
const providers = {
  local: new LocalAPIProvider(),
  web: new WebAdapterProvider()
};

router.post('/agent/chat', async (req, res) => {
  const { text, mode = 'local' } = req.body;
  if (!text) {
    return res.status(400).json({ message: 'Missing text' });
  }

  const provider = providers[mode] ?? providers.local;
  const message = await provider.sendMessage(text);
  res.json(message);
});

export default router;
