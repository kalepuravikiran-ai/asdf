// ============================================================================
// AURA — Agents API Routes & Live Execution Streaming
// ============================================================================
import { Router, Request, Response } from 'express';
import { db } from '../db/supabase.js';
import { AgentEngine, agentEvents } from '../services/agentEngine.js';
import { AgentInfo } from '../types/index.js';

export const agentsRouter = Router();

// GET /api/agents/list
agentsRouter.get('/list', async (req: Request, res: Response) => {
  const agents: AgentInfo[] = [
    {
      id: 'agent-orchestrator',
      name: 'Orchestrator Agent',
      role: 'Master Coordination & Strategy',
      description: 'Ingests objectives, builds high-level execution graph, oversees delegation, and conducts final synthesis.',
      status: 'IDLE',
      progress: 100,
      lastAction: 'Goal Ingestion & Boundary Analysis',
      metrics: { tasksCompleted: 142, successRate: 98.4, avgResponseMs: 320 }
    },
    {
      id: 'agent-planner',
      name: 'Planning Agent',
      role: 'Decomposition & Dependency Topology',
      description: 'Breaks complex multi-faceted goals into atomic executable subtasks and identifies critical path constraints.',
      status: 'IDLE',
      progress: 95,
      lastAction: 'Subtask Graph Formulated',
      metrics: { tasksCompleted: 388, successRate: 96.2, avgResponseMs: 410 }
    },
    {
      id: 'agent-researcher',
      name: 'Research Agent',
      role: 'Empirical Synthesis & Retrieval',
      description: 'Gathers verified precedent benchmarks, formulas, and domain citations without fabricating sources.',
      status: 'IDLE',
      progress: 92,
      lastAction: 'Synthesized Verified Findings',
      metrics: { tasksCompleted: 210, successRate: 97.1, avgResponseMs: 650 }
    },
    {
      id: 'agent-scheduler',
      name: 'Schedule Agent',
      role: 'Time Allocation & Conflict Mitigation',
      description: 'Maps tasks to calendars, calculates cognitive buffers, detects deadline collisions, and reallocates slots.',
      status: 'IDLE',
      progress: 90,
      lastAction: 'Calendar Window Optimization',
      metrics: { tasksCompleted: 195, successRate: 95.8, avgResponseMs: 290 }
    },
    {
      id: 'agent-executor',
      name: 'Execution Agent',
      role: 'Deterministic Operation & Tool Interface',
      description: 'Executes permitted operations, generates intermediate deliverables, and produces verifiable artifacts.',
      status: 'IDLE',
      progress: 88,
      lastAction: 'Operational Sprint Finalized',
      metrics: { tasksCompleted: 520, successRate: 94.6, avgResponseMs: 510 }
    },
    {
      id: 'agent-verifier',
      name: 'Verification Agent',
      role: 'Audit, Criteria Testing & Quality Scoring',
      description: 'Evaluates completed deliverables against predefined success criteria and computes overall readiness metrics.',
      status: 'IDLE',
      progress: 96,
      lastAction: 'Criteria Audit Passed',
      metrics: { tasksCompleted: 164, successRate: 99.1, avgResponseMs: 380 }
    },
    {
      id: 'agent-adapter',
      name: 'Adaptation Agent',
      role: 'Dynamic Re-planning & Conflict Recovery',
      description: 'Detects unexpected environmental shifts or missed milestones, recalculates remaining paths, and keeps workflows on target.',
      status: 'IDLE',
      progress: 94,
      lastAction: 'Dynamic Re-plan Triggered',
      metrics: { tasksCompleted: 88, successRate: 93.5, avgResponseMs: 450 }
    }
  ];

  res.json({ success: true, data: agents });
});

// POST /api/agents/run
agentsRouter.post('/run', async (req: Request, res: Response) => {
  try {
    const { goalId, speedMs } = req.body;
    if (!goalId) {
      return res.status(400).json({ success: false, error: 'goalId is required' });
    }

    if (AgentEngine.isRunning(goalId)) {
      return res.status(409).json({ success: false, message: 'Workflow is already executing for this goal' });
    }

    // Launch asynchronously in background
    AgentEngine.runWorkflow(goalId, speedMs || 900);

    res.json({
      success: true,
      message: 'Autonomous multi-agent workflow started successfully',
      goalId,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/agents/pause
agentsRouter.post('/pause', (req: Request, res: Response) => {
  const { goalId } = req.body;
  const success = AgentEngine.pauseWorkflow(goalId);
  res.json({ success, message: success ? 'Workflow paused' : 'No active workflow to pause' });
});

// POST /api/agents/resume
agentsRouter.post('/resume', (req: Request, res: Response) => {
  const { goalId } = req.body;
  const success = AgentEngine.resumeWorkflow(goalId);
  res.json({ success, message: success ? 'Workflow resumed' : 'No paused workflow to resume' });
});

// POST /api/agents/cancel
agentsRouter.post('/cancel', (req: Request, res: Response) => {
  const { goalId } = req.body;
  const success = AgentEngine.cancelWorkflow(goalId);
  res.json({ success, message: success ? 'Workflow cancelled' : 'No active workflow to cancel' });
});

// GET /api/agents/status/:goalId
agentsRouter.get('/status/:goalId', async (req: Request, res: Response) => {
  try {
    const goal = await db.getGoalById(req.params.goalId);
    if (!goal) {
      return res.status(404).json({ success: false, error: 'Goal not found' });
    }

    const tasks = await db.getTasks(req.params.goalId);
    const isRunning = AgentEngine.isRunning(req.params.goalId);

    res.json({
      success: true,
      data: {
        goalId: goal.id,
        stage: goal.current_stage,
        activeAgent: goal.active_agent,
        status: goal.status,
        progress: goal.progress,
        replanCount: goal.replan_count,
        isRunning,
        totalTasks: tasks.length,
        completedTasks: tasks.filter(t => t.status === 'COMPLETED').length,
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/agents/stream/:goalId (Server-Sent Events)
agentsRouter.get('/stream/:goalId', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const goalId = req.params.goalId;

  const onProgress = (event: any) => {
    if (event.goalId === goalId) {
      res.write(`data: ${JSON.stringify(event)}\n\n`);
    }
  };

  agentEvents.on('progress', onProgress);

  // Heartbeat to keep connection alive
  const timer = setInterval(() => {
    res.write(': heartbeat\n\n');
  }, 15000);

  req.on('close', () => {
    clearInterval(timer);
    agentEvents.off('progress', onProgress);
  });
});
