// ============================================================================
// AURA — Backend API Service Client
// ============================================================================
import { Goal, Task, AgentActivity, AgentInfo, DashboardMetrics } from '../types/index.js';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || `Request failed: ${res.statusText}`);
    }

    const data = await res.json();
    return data.data !== undefined ? data.data : data;
  } catch (err: any) {
    console.error(`[API Error: ${endpoint}]`, err);
    throw err;
  }
}

export const api = {
  // Goals
  getGoals: () => request<Goal[]>('/api/goals'),
  getGoalById: (id: string) => request<Goal>(`/api/goals/${id}`),
  createGoal: (goal: Partial<Goal>) => 
    request<Goal>('/api/goals', { method: 'POST', body: JSON.stringify(goal) }),
  updateGoal: (id: string, updates: Partial<Goal>) => 
    request<Goal>(`/api/goals/${id}`, { method: 'PATCH', body: JSON.stringify(updates) }),
  deleteGoal: (id: string) => 
    request<{ success: boolean }>(`/api/goals/${id}`, { method: 'DELETE' }),

  // Tasks
  getTasks: (goalId?: string) => 
    request<Task[]>(goalId ? `/api/tasks?goalId=${goalId}` : '/api/tasks'),
  createTask: (task: Partial<Task>) => 
    request<Task>('/api/tasks', { method: 'POST', body: JSON.stringify(task) }),
  updateTask: (id: string, updates: Partial<Task>) => 
    request<Task>(`/api/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(updates) }),
  deleteTask: (id: string) => 
    request<{ success: boolean }>(`/api/tasks/${id}`, { method: 'DELETE' }),

  // Agents
  getAgents: () => request<AgentInfo[]>('/api/agents/list'),
  runWorkflow: (goalId: string, speedMs: number = 800) =>
    request<{ success: boolean; message: string }>('/api/agents/run', {
      method: 'POST',
      body: JSON.stringify({ goalId, speedMs }),
    }),
  pauseWorkflow: (goalId: string) =>
    request<{ success: boolean }>('/api/agents/pause', {
      method: 'POST',
      body: JSON.stringify({ goalId }),
    }),
  resumeWorkflow: (goalId: string) =>
    request<{ success: boolean }>('/api/agents/resume', {
      method: 'POST',
      body: JSON.stringify({ goalId }),
    }),
  cancelWorkflow: (goalId: string) =>
    request<{ success: boolean }>('/api/agents/cancel', {
      method: 'POST',
      body: JSON.stringify({ goalId }),
    }),
  getWorkflowStatus: (goalId: string) =>
    request<any>(`/api/agents/status/${goalId}`),

  // Planner
  getPlannerData: (goalId: string) => request<any>(`/api/planner/${goalId}`),
  triggerPlan: (goalId: string) =>
    request<any>('/api/planner/create', { method: 'POST', body: JSON.stringify({ goalId }) }),
  triggerReplan: (goalId: string, taskId?: string) =>
    request<any>('/api/planner/replan', { method: 'POST', body: JSON.stringify({ goalId, taskId }) }),

  // Activity
  getActivities: (goalId?: string, limit: number = 50) =>
    request<AgentActivity[]>(goalId ? `/api/activity/${goalId}?limit=${limit}` : `/api/activity?limit=${limit}`),

  // Dashboard
  getDashboardData: () => request<{
    metrics: DashboardMetrics;
    currentGoal: Goal | null;
    goals: Goal[];
    recentActivities: AgentActivity[];
  }>('/api/dashboard'),

  // Health
  getHealth: () => request<any>('/api/health'),
};
