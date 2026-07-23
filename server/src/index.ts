import express from 'express';
import type { Request, Response, NextFunction } from "express";
import cors from 'cors';
import 'express-async-errors';

const app = express();
const PORT = process.env.PORT || 4302;  // меняем порт, чтобы избежать EADDRINUSE

app.use(cors());
app.use(express.json());

// Пример эндпоинта
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Обработчик ошибок (все параметры типизированы)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});

app.listen(PORT, () => {
  console.log(`JustAI server running on http://localhost:${PORT}`);
});