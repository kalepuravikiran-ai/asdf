// ============================================================================
// AURA — Planner API Routes
// ============================================================================
import { Router, Request, Response } from 'express';
import { db } from '../db/supabase.js';
import { PlanningAgent } from '../agents/planner/index.js';
import { AdaptationAgent } from '../agents/adapter/index.js';

export const plannerRouter = Router();

// GET /api/planner/:goalId
plannerRouter.get('/:goalId', async (req: Request, res: Response) => {
  try {
    const goal = await db.getGoalById(req.params.goalId);
    if (!goal) {
      return res.status(404).json({ success: false, error: 'Goal not found' });
    }

    const tasks = await db.getTasks(req.params.goalId);
    const schedules = await db.getSchedules(req.params.goalId);

    res.json({
      success: true,
      data: {
        goal,
        tasks,
        schedules,
        replanHistory: goal.replan_count,
        summary: goal.summary,
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/planner/create
plannerRouter.post('/create', async (req: Request, res: Response) => {
  try {
    const { goalId } = req.body;
    const goal = await db.getGoalById(goalId);
    if (!goal) {
      return res.status(404).json({ success: false, error: 'Goal not found' });
    }

    const tasks = await PlanningAgent.createPlan(goal);
    res.json({ success: true, data: { goal, tasks } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/planner/replan
plannerRouter.post('/replan', async (req: Request, res: Response) => {
  try {
    const { goalId, taskId } = req.body;
    const goal = await db.getGoalById(goalId);
    if (!goal) {
      return res.status(404).json({ success: false, error: 'Goal not found' });
    }

    const allTasks = await db.getTasks(goalId);
    const targetTask = allTasks.find(t => t.id === taskId) || allTasks[0];
    if (!targetTask) {
      return res.status(404).json({ success: false, error: 'No tasks found to adapt' });
    }

    const adaptation = await AdaptationAgent.adapt(goal, targetTask, allTasks);
    const updatedTasks = await db.getTasks(goalId);

    res.json({
      success: true,
      data: {
        adaptation,
        tasks: updatedTasks,
        goal: await db.getGoalById(goalId),
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
