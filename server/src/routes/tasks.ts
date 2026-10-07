// ============================================================================
// AURA — Tasks API Routes
// ============================================================================
import { Router, Request, Response } from 'express';
import { db } from '../db/supabase.js';
import { CreateTaskInputSchema } from '../schemas/index.js';

export const tasksRouter = Router();

// GET /api/tasks
tasksRouter.get('/', async (req: Request, res: Response) => {
  try {
    const goalId = req.query.goalId as string | undefined;
    const tasks = await db.getTasks(goalId);
    res.json({ success: true, data: tasks });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/tasks
tasksRouter.post('/', async (req: Request, res: Response) => {
  try {
    const parsed = CreateTaskInputSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, errors: parsed.error.errors });
    }

    const newTask = await db.createTask(parsed.data as any);
    res.status(201).json({ success: true, data: newTask });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/tasks/:id
tasksRouter.patch('/:id', async (req: Request, res: Response) => {
  try {
    const updated = await db.updateTask(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/tasks/:id
tasksRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const success = await db.deleteTask(req.params.id);
    res.json({ success });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
