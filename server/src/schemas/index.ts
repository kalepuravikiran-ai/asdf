// ============================================================================
// AURA — Autonomous Unified Reasoning Agent
// Zod Schemas for Validation of AI Outputs and API Payloads
// ============================================================================
import { z } from 'zod';

// 1. Goal Analysis Schema (Section 15.1)
export const GoalAnalysisSchema = z.object({
  goal: z.string(),
  summary: z.string(),
  category: z.string().default('PLANNING'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('MEDIUM'),
  constraints: z.array(z.string()).default([]),
  required_agents: z.array(z.string()).default([]),
  success_criteria: z.array(z.string()).default([]),
});

export type GoalAnalysis = z.infer<typeof GoalAnalysisSchema>;

// 2. Planning Agent Schema (Section 15.2)
export const PlannedTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().default(''),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('MEDIUM'),
  assigned_agent: z.string().default('Execution Agent'),
  dependencies: z.array(z.string()).default([]),
  estimated_minutes: z.number().nonnegative().default(30),
});

export const PlanningSchema = z.object({
  goal_id: z.string().optional(),
  plan_summary: z.string(),
  tasks: z.array(PlannedTaskSchema).min(1),
  execution_order: z.array(z.string()).default([]),
});

export type PlanningResult = z.infer<typeof PlanningSchema>;

// 3. Research Agent Schema (Section 15.3)
export const ResearchFindingSchema = z.object({
  title: z.string(),
  content: z.string(),
  source: z.string(),
});

export const ResearchResultSchema = z.object({
  query: z.string(),
  summary: z.string(),
  findings: z.array(ResearchFindingSchema).default([]),
  confidence: z.number().min(0).max(1).default(0.95),
});

export type ResearchResult = z.infer<typeof ResearchResultSchema>;

// 4. Schedule Agent Schema (Section 15.4)
export const ScheduleItemSchema = z.object({
  task_id: z.string(),
  start_time: z.string(),
  end_time: z.string(),
  reason: z.string().default(''),
});

export const ScheduleConflictSchema = z.object({
  task_id: z.string(),
  conflict: z.string(),
  resolution: z.string(),
});

export const ScheduleSchema = z.object({
  schedule: z.array(ScheduleItemSchema).default([]),
  conflicts: z.array(ScheduleConflictSchema).default([]),
});

export type ScheduleResult = z.infer<typeof ScheduleSchema>;

// 5. Execution Agent Schema (Section 15.5)
export const ExecutionResultSchema = z.object({
  task_id: z.string(),
  status: z.enum(['COMPLETED', 'FAILED', 'BLOCKED', 'SIMULATED']),
  action: z.string(),
  result: z.string(),
  errors: z.array(z.string()).default([]),
});

export type ExecutionResult = z.infer<typeof ExecutionResultSchema>;

// 6. Verification Agent Schema (Section 15.6)
export const VerificationCheckSchema = z.object({
  criterion: z.string(),
  passed: z.boolean(),
  reason: z.string(),
});

export const VerificationSchema = z.object({
  verified: z.boolean(),
  score: z.number().min(0).max(100),
  checks: z.array(VerificationCheckSchema).default([]),
  issues: z.array(z.string()).default([]),
  recommendation: z.string(),
});

export type VerificationResult = z.infer<typeof VerificationSchema>;

// 7. Adaptation Agent Schema (Section 15.7)
export const TaskChangeSchema = z.object({
  task_id: z.string(),
  change: z.string(),
});

export const AdaptationSchema = z.object({
  adaptation_required: z.boolean(),
  reason: z.string(),
  affected_tasks: z.array(z.string()).default([]),
  changes: z.array(TaskChangeSchema).default([]),
  new_plan: z.array(z.string()).default([]),
});

export type AdaptationResult = z.infer<typeof AdaptationSchema>;

// 8. Final Result Schema (Section 15.8)
export const FinalResultSchema = z.object({
  status: z.enum(['COMPLETED', 'PARTIAL', 'FAILED']),
  summary: z.string(),
  completed_tasks: z.array(z.string()).default([]),
  remaining_tasks: z.array(z.string()).default([]),
  progress: z.number().min(0).max(100),
  replans: z.number().nonnegative().default(0),
  success_rate: z.number().min(0).max(100).default(100),
  next_steps: z.array(z.string()).default([]),
});

export type FinalResult = z.infer<typeof FinalResultSchema>;

// Request Validation Schemas
export const CreateGoalInputSchema = z.object({
  title: z.string().min(3, "Goal title or prompt must be at least 3 characters"),
  description: z.string().optional(),
  category: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  deadline: z.string().optional(),
});

export const UpdateGoalInputSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(['ACTIVE', 'PAUSED', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'REPLANNING']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  progress: z.number().min(0).max(100).optional(),
});

export const CreateTaskInputSchema = z.object({
  goal_id: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('MEDIUM'),
  assigned_agent: z.string().default('Execution Agent'),
  deadline: z.string().optional(),
  dependencies: z.array(z.string()).default([]),
  estimated_minutes: z.number().optional(),
});
