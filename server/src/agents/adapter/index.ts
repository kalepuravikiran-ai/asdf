// ============================================================================
// AURA — Adaptation Agent
// Dynamic Re-planning, Anomaly Recovery, and Autonomous Workflow Rebalancing
// ============================================================================
import { GeminiService } from '../../services/gemini.js';
import { db } from '../../db/supabase.js';
import { Goal, Task } from '../../types/index.js';

export class AdaptationAgent {
  static readonly name = 'Adaptation Agent';

  static async adapt(goal: Goal, failedTask: Task, allTasks: Task[]): Promise<any> {
    await db.addActivity({
      goal_id: goal.id,
      agent_name: this.name,
      action: 'Initiating Autonomous Re-plan',
      status: 'REPLANNING',
      message: `Environmental shift detected during [${failedTask.title}]. Recalculating remaining workflow graph.`,
    });

    const adaptation = await GeminiService.adaptPlan(goal, failedTask, allTasks);

    // Apply adaptation changes to tasks
    for (const change of adaptation.changes) {
      const task = allTasks.find(t => t.id === change.task_id);
      if (task) {
        await db.updateTask(task.id, {
          description: `${task.description} [ADAPTED: ${change.change}]`,
          status: 'PENDING',
        });
      }
    }

    // Increment replan count on goal
    await db.updateGoal(goal.id, {
      replan_count: (goal.replan_count || 0) + 1,
      current_stage: 'ADAPT',
      active_agent: this.name,
      summary: `Adapted plan after anomaly: ${adaptation.reason}`,
    });

    await db.addActivity({
      goal_id: goal.id,
      agent_name: this.name,
      action: 'Plan Successfully Rebalanced',
      status: 'SUCCESS',
      message: `Generated revised plan with ${adaptation.new_plan.length} recovery steps. Resuming execution loop.`,
      metadata: { adaptation },
    });

    return adaptation;
  }
}
