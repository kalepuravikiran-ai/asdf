// ============================================================================
// AURA — Planning Agent
// Subtask Decomposition, Dependency Ordering, and Effort Estimation
// ============================================================================
import { GeminiService } from '../../services/gemini.js';
import { db } from '../../db/supabase.js';
import { Goal, Task } from '../../types/index.js';

export class PlanningAgent {
  static readonly name = 'Planning Agent';

  static async createPlan(goal: Goal): Promise<Task[]> {
    await db.addActivity({
      goal_id: goal.id,
      agent_name: this.name,
      action: 'Decomposing Goal into Subtasks',
      status: 'IN_PROGRESS',
      message: 'Generating topological subtask graph and estimating cognitive workload.',
    });

    const plan = await GeminiService.generatePlan(goal);
    const createdTasks: Task[] = [];

    for (const t of plan.tasks) {
      const task = await db.createTask({
        goal_id: goal.id,
        user_id: goal.user_id,
        title: t.title,
        description: t.description,
        priority: t.priority,
        status: 'PENDING',
        assigned_agent: t.assigned_agent as any,
        dependencies: t.dependencies,
        estimated_minutes: t.estimated_minutes,
      });
      createdTasks.push(task);
    }

    await db.updateGoal(goal.id, {
      current_stage: 'DELEGATE',
      active_agent: 'Schedule Agent',
      summary: plan.plan_summary,
    });

    await db.addActivity({
      goal_id: goal.id,
      agent_name: this.name,
      action: 'Plan Formulated',
      status: 'SUCCESS',
      message: `Constructed ${createdTasks.length} subtasks. Delegation order established: ${plan.execution_order.join(' → ')}.`,
    });

    return createdTasks;
  }
}
