// ============================================================================
// AURA — Activity API Routes
// ============================================================================
import { Router, Request, Response } from 'express';
import { db } from '../db/supabase.js';

export const activityRouter = Router();

// GET /api/activity
activityRouter.get('/', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const activities = await db.getActivities(undefined, limit);
    res.json({ success: true, data: activities });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/activity/:goalId
activityRouter.get('/:goalId', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const activities = await db.getActivities(req.params.goalId, limit);
    res.json({ success: true, data: activities });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
