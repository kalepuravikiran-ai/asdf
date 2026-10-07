// ============================================================================
// AURA — Autonomous Unified Reasoning Agent
// Data Type Definitions
// ============================================================================

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type TaskStatus = 
  | 'PENDING' 
  | 'IN_PROGRESS' 
  | 'BLOCKED' 
  | 'COMPLETED' 
  | 'FAILED' 
  | 'CANCELLED'
  | 'SIMULATED';

export type GoalStatus = 
  | 'ACTIVE' 
  | 'PAUSED' 
  | 'IN_PROGRESS' 
  | 'COMPLETED' 
  | 'FAILED' 
  | 'REPLANNING';

export type WorkflowStage = 
  | 'UNDERSTAND' 
  | 'PLAN' 
  | 'DELEGATE' 
  | 'EXECUTE' 
  | 'OBSERVE' 
  | 'VERIFY' 
  | 'ADAPT' 
  | 'COMPLETE';

export type AgentName = 
  | 'Orchestrator Agent' 
  | 'Planning Agent' 
  | 'Research Agent' 
  | 'Schedule Agent' 
  | 'Execution Agent' 
  | 'Verification Agent' 
  | 'Adaptation Agent'
  | 'System';

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  category: string;
  priority: Priority;
  status: GoalStatus;
  deadline?: string;
  progress: number;
  success_rate: number;
  replan_count: number;
  current_stage: WorkflowStage;
  active_agent: AgentName;
  summary?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  goal_id: string;
  user_id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: TaskStatus;
  assigned_agent: AgentName;
  deadline?: string;
  dependencies: string[];
  metadata?: Record<string, any>;
  estimated_minutes?: number;
  actual_minutes?: number;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface AgentActivity {
  id: string;
  user_id: string;
  goal_id?: string;
  task_id?: string;
  agent_name: AgentName;
  action: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'SUCCESS' | 'WARNING' | 'FAILED' | 'REPLANNING';
  message?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface Decision {
  id: string;
  user_id: string;
  goal_id?: string;
  agent_name: AgentName;
  decision_type: string;
  reasoning?: string;
  decision: Record<string, any>;
  created_at: string;
}

export interface Schedule {
  id: string;
  user_id: string;
  goal_id?: string;
  task_id?: string;
  start_time: string;
  end_time: string;
  status: string;
  reason?: string;
  created_at: string;
}

export interface AgentInfo {
  id: string;
  name: AgentName;
  role: string;
  description: string;
  status: 'IDLE' | 'THINKING' | 'EXECUTING' | 'VERIFYING' | 'ADAPTING';
  currentTask?: string;
  progress: number;
  lastAction: string;
  metrics: {
    tasksCompleted: number;
    successRate: number;
    avgResponseMs: number;
  };
}
