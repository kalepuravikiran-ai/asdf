// ============================================================================
// AURA — Autonomous Unified Reasoning Agent
// Supabase Client and Resilient Multi-Tier Database Layer
// ============================================================================
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import ws from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { Goal, Task, AgentActivity, Decision, Schedule, WorkflowStage } from '../types/index.js';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://fosdkjhsfoowiphsuwti.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  realtime: {
    transport: ws as any,
  },
});

export const DEFAULT_USER_ID = '00000000-0000-0000-0000-000000000001';

// In-memory resilient state for zero-downtime demo and fallback
class MemoryStore {
  goals: Map<string, Goal> = new Map();
  tasks: Map<string, Task> = new Map();
  activities: AgentActivity[] = [];
  decisions: Decision[] = [];
  schedules: Schedule[] = [];
  tablesReadyInSupabase = false;

  constructor() {
    this.seedInitialDemoData();
  }

  seedInitialDemoData() {
    const goalId = '11111111-1111-1111-1111-111111111111';
    const now = new Date().toISOString();
    
    const demoGoal: Goal = {
      id: goalId,
      user_id: DEFAULT_USER_ID,
      title: 'Prepare for College Exams while Balancing Project Deadlines',
      description: 'Comprehensive study and assignment management plan with adaptive scheduling for finals week.',
      category: 'STUDY',
      priority: 'HIGH',
      status: 'ACTIVE',
      deadline: new Date(Date.now() + 7 * 86400000).toISOString(),
      progress: 68,
      success_rate: 94,
      replan_count: 1,
      current_stage: 'EXECUTE',
      active_agent: 'Execution Agent',
      summary: 'Orchestrator planned 6 key study modules and synchronized with submission deadlines.',
      created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
      updated_at: now,
    };
    this.goals.set(goalId, demoGoal);

    const demoTasks: Task[] = [
      {
        id: '22222222-0001-0000-0000-000000000001',
        goal_id: goalId,
        user_id: DEFAULT_USER_ID,
        title: 'Decompose Syllabus & Map Exam Weightages',
        description: 'Analyze course modules, past exam patterns, and high-yield topics.',
        priority: 'HIGH',
        status: 'COMPLETED',
        assigned_agent: 'Planning Agent',
        dependencies: [],
        estimated_minutes: 45,
        actual_minutes: 40,
        created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
        updated_at: new Date(Date.now() - 3600000 * 3.5).toISOString(),
        completed_at: new Date(Date.now() - 3600000 * 3.5).toISOString(),
      },
      {
        id: '22222222-0002-0000-0000-000000000002',
        goal_id: goalId,
        user_id: DEFAULT_USER_ID,
        title: 'Synthesize Core Formulas & Cheat Sheet',
        description: 'Research high-frequency questions and build active-recall flashcard summaries.',
        priority: 'MEDIUM',
        status: 'COMPLETED',
        assigned_agent: 'Research Agent',
        dependencies: ['22222222-0001-0000-0000-000000000001'],
        estimated_minutes: 60,
        actual_minutes: 55,
        created_at: new Date(Date.now() - 3600000 * 3.5).toISOString(),
        updated_at: new Date(Date.now() - 3600000 * 2.5).toISOString(),
        completed_at: new Date(Date.now() - 3600000 * 2.5).toISOString(),
      },
      {
        id: '22222222-0003-0000-0000-000000000003',
        goal_id: goalId,
        user_id: DEFAULT_USER_ID,
        title: 'Re-align Schedule After Assignment Deadline Shift',
        description: 'Conflict detected: CS Project shifted to Thursday. Recalculate study blocks.',
        priority: 'CRITICAL',
        status: 'COMPLETED',
        assigned_agent: 'Adaptation Agent',
        dependencies: ['22222222-0002-0000-0000-000000000002'],
        estimated_minutes: 30,
        actual_minutes: 25,
        created_at: new Date(Date.now() - 3600000 * 2.5).toISOString(),
        updated_at: new Date(Date.now() - 3600000 * 1.5).toISOString(),
        completed_at: new Date(Date.now() - 3600000 * 1.5).toISOString(),
      },
      {
        id: '22222222-0004-0000-0000-000000000004',
        goal_id: goalId,
        user_id: DEFAULT_USER_ID,
        title: 'Execute Mock Exam Sprint 1 (Operating Systems)',
        description: 'Simulate 90-minute timed exam session and verify conceptual grasp.',
        priority: 'HIGH',
        status: 'IN_PROGRESS',
        assigned_agent: 'Execution Agent',
        dependencies: ['22222222-0003-0000-0000-000000000003'],
        estimated_minutes: 90,
        actual_minutes: 45,
        created_at: new Date(Date.now() - 3600000 * 1.5).toISOString(),
        updated_at: now,
      },
      {
        id: '22222222-0005-0000-0000-000000000005',
        goal_id: goalId,
        user_id: DEFAULT_USER_ID,
        title: 'Verify Retention & Score Readiness Matrix',
        description: 'Run verification agent checks across all completed topic checkpoints.',
        priority: 'HIGH',
        status: 'PENDING',
        assigned_agent: 'Verification Agent',
        dependencies: ['22222222-0004-0000-0000-000000000004'],
        estimated_minutes: 30,
        created_at: new Date(Date.now() - 3600000 * 1.5).toISOString(),
        updated_at: now,
      }
    ];
    demoTasks.forEach(t => this.tasks.set(t.id, t));

    this.activities = [
      {
        id: uuidv4(),
        user_id: DEFAULT_USER_ID,
        goal_id: goalId,
        agent_name: 'Orchestrator Agent',
        action: 'Goal Ingestion & Decomposition',
        status: 'SUCCESS',
        message: 'Understood user objective. Dispatched Planning Agent with high-priority context.',
        created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
      },
      {
        id: uuidv4(),
        user_id: DEFAULT_USER_ID,
        goal_id: goalId,
        agent_name: 'Planning Agent',
        action: 'Created 5 Adaptive Subtasks',
        status: 'SUCCESS',
        message: 'Decomposed syllabus into active recall blocks and dependency chains.',
        created_at: new Date(Date.now() - 3600000 * 3.5).toISOString(),
      },
      {
        id: uuidv4(),
        user_id: DEFAULT_USER_ID,
        goal_id: goalId,
        agent_name: 'Schedule Agent',
        action: 'Identified Schedule Conflict',
        status: 'WARNING',
        message: 'Detected overlap between Assignment submission and 2-hour Study Block.',
        created_at: new Date(Date.now() - 3600000 * 2.5).toISOString(),
      },
      {
        id: uuidv4(),
        user_id: DEFAULT_USER_ID,
        goal_id: goalId,
        agent_name: 'Adaptation Agent',
        action: 'Triggered Dynamic Re-plan',
        status: 'REPLANNING',
        message: 'Shifted Study Block 4 hours forward; resolved conflict without sacrificing sleep budget.',
        created_at: new Date(Date.now() - 3600000 * 1.5).toISOString(),
      },
      {
        id: uuidv4(),
        user_id: DEFAULT_USER_ID,
        goal_id: goalId,
        agent_name: 'Execution Agent',
        action: 'Running Mock Exam Sprint 1',
        status: 'IN_PROGRESS',
        message: 'Operating Systems topic simulation currently 50% completed.',
        created_at: now,
      }
    ];
  }
}

export const memoryStore = new MemoryStore();

// Check if Supabase tables exist
export async function checkSupabaseStatus(): Promise<{ connected: boolean; tablesExist: boolean; error?: string }> {
  try {
    const { data, error } = await supabase.from('goals').select('id').limit(1);
    if (error) {
      // If table doesn't exist yet in Supabase
      return { connected: true, tablesExist: false, error: error.message };
    }
    memoryStore.tablesReadyInSupabase = true;
    return { connected: true, tablesExist: true };
  } catch (err: any) {
    return { connected: false, tablesExist: false, error: err.message };
  }
}

// Unified Database Repository Layer
export const db = {
  async getGoals(userId: string = DEFAULT_USER_ID): Promise<Goal[]> {
    try {
      if (memoryStore.tablesReadyInSupabase) {
        const { data, error } = await supabase
          .from('goals')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data && data.length > 0) return data as Goal[];
      }
    } catch (e) {
      // fallback
    }
    return Array.from(memoryStore.goals.values()).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  },

  async getGoalById(id: string): Promise<Goal | null> {
    try {
      if (memoryStore.tablesReadyInSupabase) {
        const { data, error } = await supabase
          .from('goals')
          .select('*')
          .eq('id', id)
          .single();
        if (!error && data) return data as Goal;
      }
    } catch (e) {}
    return memoryStore.goals.get(id) || null;
  },

  async createGoal(goalData: Partial<Goal>): Promise<Goal> {
    const newGoal: Goal = {
      id: goalData.id || uuidv4(),
      user_id: goalData.user_id || DEFAULT_USER_ID,
      title: goalData.title || 'Untitled Goal',
      description: goalData.description || '',
      category: goalData.category || 'PLANNING',
      priority: goalData.priority || 'MEDIUM',
      status: goalData.status || 'ACTIVE',
      deadline: goalData.deadline,
      progress: goalData.progress || 0,
      success_rate: goalData.success_rate || 0,
      replan_count: goalData.replan_count || 0,
      current_stage: goalData.current_stage || 'UNDERSTAND',
      active_agent: goalData.active_agent || 'Orchestrator Agent',
      summary: goalData.summary || '',
      metadata: goalData.metadata || {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    memoryStore.goals.set(newGoal.id, newGoal);

    try {
      if (memoryStore.tablesReadyInSupabase) {
        await supabase.from('goals').insert(newGoal);
      }
    } catch (e) {}

    return newGoal;
  },

  async updateGoal(id: string, updates: Partial<Goal>): Promise<Goal | null> {
    const existing = memoryStore.goals.get(id);
    if (!existing) return null;

    const updated: Goal = {
      ...existing,
      ...updates,
      updated_at: new Date().toISOString(),
    };
    memoryStore.goals.set(id, updated);

    try {
      if (memoryStore.tablesReadyInSupabase) {
        await supabase.from('goals').update(updates).eq('id', id);
      }
    } catch (e) {}

    return updated;
  },

  async deleteGoal(id: string): Promise<boolean> {
    memoryStore.goals.delete(id);
    try {
      if (memoryStore.tablesReadyInSupabase) {
        await supabase.from('goals').delete().eq('id', id);
      }
    } catch (e) {}
    return true;
  },

  // Task queries
  async getTasks(goalId?: string): Promise<Task[]> {
    try {
      if (memoryStore.tablesReadyInSupabase) {
        let query = supabase.from('tasks').select('*').order('created_at', { ascending: true });
        if (goalId) query = query.eq('goal_id', goalId);
        const { data, error } = await query;
        if (!error && data && data.length > 0) return data as Task[];
      }
    } catch (e) {}

    let tasks = Array.from(memoryStore.tasks.values());
    if (goalId) {
      tasks = tasks.filter(t => t.goal_id === goalId);
    }
    return tasks.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  },

  async createTask(taskData: Partial<Task>): Promise<Task> {
    const newTask: Task = {
      id: taskData.id || uuidv4(),
      goal_id: taskData.goal_id!,
      user_id: taskData.user_id || DEFAULT_USER_ID,
      title: taskData.title || 'Untitled Task',
      description: taskData.description || '',
      priority: taskData.priority || 'MEDIUM',
      status: taskData.status || 'PENDING',
      assigned_agent: taskData.assigned_agent || 'Execution Agent',
      deadline: taskData.deadline,
      dependencies: taskData.dependencies || [],
      metadata: taskData.metadata || {},
      estimated_minutes: taskData.estimated_minutes || 30,
      actual_minutes: taskData.actual_minutes || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    memoryStore.tasks.set(newTask.id, newTask);

    try {
      if (memoryStore.tablesReadyInSupabase) {
        await supabase.from('tasks').insert(newTask);
      }
    } catch (e) {}

    return newTask;
  },

  async updateTask(id: string, updates: Partial<Task>): Promise<Task | null> {
    const existing = memoryStore.tasks.get(id);
    if (!existing) return null;

    const updated: Task = {
      ...existing,
      ...updates,
      updated_at: new Date().toISOString(),
    };
    if (updates.status === 'COMPLETED' && !existing.completed_at) {
      updated.completed_at = new Date().toISOString();
    }
    memoryStore.tasks.set(id, updated);

    try {
      if (memoryStore.tablesReadyInSupabase) {
        await supabase.from('tasks').update(updates).eq('id', id);
      }
    } catch (e) {}

    return updated;
  },

  async deleteTask(id: string): Promise<boolean> {
    memoryStore.tasks.delete(id);
    try {
      if (memoryStore.tablesReadyInSupabase) {
        await supabase.from('tasks').delete().eq('id', id);
      }
    } catch (e) {}
    return true;
  },

  // Activities
  async getActivities(goalId?: string, limit: number = 50): Promise<AgentActivity[]> {
    try {
      if (memoryStore.tablesReadyInSupabase) {
        let query = supabase.from('agent_activities').select('*').order('created_at', { ascending: false }).limit(limit);
        if (goalId) query = query.eq('goal_id', goalId);
        const { data, error } = await query;
        if (!error && data && data.length > 0) return data as AgentActivity[];
      }
    } catch (e) {}

    let acts = memoryStore.activities;
    if (goalId) acts = acts.filter(a => a.goal_id === goalId);
    return acts.slice(0, limit);
  },

  async addActivity(act: Partial<AgentActivity>): Promise<AgentActivity> {
    const newAct: AgentActivity = {
      id: act.id || uuidv4(),
      user_id: act.user_id || DEFAULT_USER_ID,
      goal_id: act.goal_id,
      task_id: act.task_id,
      agent_name: act.agent_name || 'Orchestrator Agent',
      action: act.action || 'Workflow Event',
      status: act.status || 'IN_PROGRESS',
      message: act.message || '',
      metadata: act.metadata || {},
      created_at: new Date().toISOString(),
    };

    memoryStore.activities.unshift(newAct);
    if (memoryStore.activities.length > 200) {
      memoryStore.activities.pop();
    }

    try {
      if (memoryStore.tablesReadyInSupabase) {
        await supabase.from('agent_activities').insert(newAct);
      }
    } catch (e) {}

    return newAct;
  },

  // Schedules
  async getSchedules(goalId?: string): Promise<Schedule[]> {
    try {
      if (memoryStore.tablesReadyInSupabase) {
        let query = supabase.from('schedules').select('*');
        if (goalId) query = query.eq('goal_id', goalId);
        const { data, error } = await query;
        if (!error && data) return data as Schedule[];
      }
    } catch (e) {}

    let scheds = memoryStore.schedules;
    if (goalId) scheds = scheds.filter(s => s.goal_id === goalId);
    return scheds;
  },

  async addSchedule(sched: Partial<Schedule>): Promise<Schedule> {
    const newSched: Schedule = {
      id: sched.id || uuidv4(),
      user_id: sched.user_id || DEFAULT_USER_ID,
      goal_id: sched.goal_id,
      task_id: sched.task_id,
      start_time: sched.start_time || new Date().toISOString(),
      end_time: sched.end_time || new Date(Date.now() + 3600000).toISOString(),
      status: sched.status || 'SCHEDULED',
      reason: sched.reason,
      created_at: new Date().toISOString(),
    };
    memoryStore.schedules.push(newSched);
    return newSched;
  }
};
