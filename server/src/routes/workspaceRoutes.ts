import express from 'express';
import { getProjectTree, readFile, writeFile, getDiff, createFile, deleteFile, renameFile } from '../tools/workspaceService.ts';

const router = express.Router();

router.get('/project/tree', async (req, res) => {
  const tree = await getProjectTree();
  res.json(tree);
});

router.get('/files/read', async (req, res) => {
  const path = String(req.query.path || '');
  if (!path) {
    return res.status(400).json({ message: 'Missing path' });
  }
  const file = await readFile(path);
  res.json(file);
});

router.post('/files/write', async (req, res) => {
  const { path, content } = req.body;
  if (!path || typeof content !== 'string') {
    return res.status(400).json({ message: 'Missing path or content' });
  }
  await writeFile(path, content);
  res.status(204).send();
});

router.post('/files/create', async (req, res) => {
  const { path, content } = req.body;
  if (!path) {
    return res.status(400).json({ message: 'Missing path' });
  }
  await createFile(path, content ?? '');
  res.status(201).send();
});

router.delete('/files/delete', async (req, res) => {
  const path = String(req.query.path || '');
  if (!path) {
    return res.status(400).json({ message: 'Missing path' });
  }
  await deleteFile(path);
  res.status(204).send();
});

router.post('/files/rename', async (req, res) => {
  const { oldPath, newPath } = req.body;
  if (!oldPath || !newPath) {
    return res.status(400).json({ message: 'Missing oldPath or newPath' });
  }
  await renameFile(oldPath, newPath);
  res.status(204).send();
});

router.get('/diff', async (req, res) => {
  const path = String(req.query.path || '');
  const updated = String(req.query.updated || '');
  if (!path) {
    return res.status(400).json({ message: 'Missing path' });
  }
  const diff = updated ? await getDiff(path, updated) : await getDiff(path);
  res.json(diff);
});

export default router;
