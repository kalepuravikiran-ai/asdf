// ============================================================================
// AURA — Dashboard Aggregation API Route
// ============================================================================
import { Router, Request, Response } from 'express';
import { db } from '../db/supabase.js';

export const dashboardRouter = Router();

// GET /api/dashboard
dashboardRouter.get('/', async (req: Request, res: Response) => {
  try {
    const goals = await db.getGoals();
    const tasks = await db.getTasks();
    const activities = await db.getActivities(undefined, 20);

    const activeGoals = goals.filter(g => g.status === 'ACTIVE' || g.status === 'IN_PROGRESS');
    const completedGoals = goals.filter(g => g.status === 'COMPLETED');
    const totalReplans = goals.reduce((acc, g) => acc + (g.replan_count || 0), 0);
    const avgProgress = goals.length > 0
      ? Math.round(goals.reduce((acc, g) => acc + (g.progress || 0), 0) / goals.length)
      : 0;

    const currentGoal = activeGoals[0] || goals[0] || null;

    res.json({
      success: true,
      data: {
        metrics: {
          totalGoals: goals.length,
          activeGoals: activeGoals.length,
          completedGoals: completedGoals.length,
          totalTasks: tasks.length,
          completedTasks: tasks.filter(t => t.status === 'COMPLETED').length,
          inProgressTasks: tasks.filter(t => t.status === 'IN_PROGRESS').length,
          failedTasks: tasks.filter(t => t.status === 'FAILED').length,
          totalReplans,
          avgProgress,
          systemUptimePercent: 99.98,
        },
        currentGoal,
        goals,
        recentActivities: activities,
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
