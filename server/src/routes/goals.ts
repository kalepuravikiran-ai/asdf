// ============================================================================
// AURA — Goals API Routes
// ============================================================================
import { Router, Request, Response } from 'express';
import { db } from '../db/supabase.js';
import { CreateGoalInputSchema, UpdateGoalInputSchema } from '../schemas/index.js';

export const goalsRouter = Router();

// GET /api/goals
goalsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const goals = await db.getGoals();
    res.json({ success: true, data: goals });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/goals/:id
goalsRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const goal = await db.getGoalById(req.params.id);
    if (!goal) {
      return res.status(404).json({ success: false, error: 'Goal not found' });
    }
    res.json({ success: true, data: goal });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/goals
goalsRouter.post('/', async (req: Request, res: Response) => {
  try {
    const parsed = CreateGoalInputSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, errors: parsed.error.errors });
    }

    const newGoal = await db.createGoal(parsed.data);
    await db.addActivity({
      goal_id: newGoal.id,
      agent_name: 'Orchestrator Agent',
      action: 'Goal Registered',
      status: 'SUCCESS',
      message: `New goal "${newGoal.title}" accepted by AURA command queue.`,
    });

    res.status(201).json({ success: true, data: newGoal });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/goals/:id
goalsRouter.patch('/:id', async (req: Request, res: Response) => {
  try {
    const parsed = UpdateGoalInputSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, errors: parsed.error.errors });
    }

    const updated = await db.updateGoal(req.params.id, parsed.data);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Goal not found' });
    }

    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/goals/:id
goalsRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const success = await db.deleteGoal(req.params.id);
    res.json({ success });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
