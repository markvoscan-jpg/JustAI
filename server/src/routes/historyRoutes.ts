import express from 'express';
import { getHistory, getCheckpoint, addHistory } from '../tools/historyService.ts';

const router = express.Router();

router.get('/history', async (req, res) => {
  res.json({ history: getHistory() });
});

router.post('/history/checkpoint', async (req, res) => {
  const checkpoint = getCheckpoint();
  addHistory('checkpoint-created', checkpoint);
  res.json(checkpoint);
});

export default router;
