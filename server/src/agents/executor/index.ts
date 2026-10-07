// ============================================================================
// AURA — Execution Agent
// Deterministic Operational Execution & Tool Interaction Layer
// ============================================================================
import { GeminiService } from '../../services/gemini.js';
import { db } from '../../db/supabase.js';
import { Task } from '../../types/index.js';

export class ExecutionAgent {
  static readonly name = 'Execution Agent';

  static async executeTask(task: Task, cycle: number = 1): Promise<{ status: 'COMPLETED' | 'FAILED' | 'BLOCKED'; result: string }> {
    await db.updateTask(task.id, {
      status: 'IN_PROGRESS',
    });

    await db.addActivity({
      goal_id: task.goal_id,
      task_id: task.id,
      agent_name: this.name,
      action: 'Executing Task Operations',
      status: 'IN_PROGRESS',
      message: `Executing [${task.title}]. Applying parameters and tool integrations.`,
    });

    const execution = await GeminiService.executeTask(task, cycle);

    if (execution.status === 'FAILED') {
      await db.updateTask(task.id, {
        status: 'FAILED',
        metadata: {
          ...task.metadata,
          error: execution.result,
        },
      });

      await db.addActivity({
        goal_id: task.goal_id,
        task_id: task.id,
        agent_name: this.name,
        action: 'Execution Anomaly Detected',
        status: 'FAILED',
        message: `Task execution failed: ${execution.result}. Escalating to Adaptation Agent for re-planning.`,
      });

      return { status: 'FAILED', result: execution.result };
    }

    await db.updateTask(task.id, {
      status: 'COMPLETED',
      completed_at: new Date().toISOString(),
      actual_minutes: task.estimated_minutes || 30,
      metadata: {
        ...task.metadata,
        executionResult: execution.result,
      },
    });

    await db.addActivity({
      goal_id: task.goal_id,
      task_id: task.id,
      agent_name: this.name,
      action: 'Task Completed',
      status: 'SUCCESS',
      message: `Completed [${task.title}]: ${execution.result.slice(0, 120)}...`,
    });

    return { status: 'COMPLETED', result: execution.result };
  }
}
