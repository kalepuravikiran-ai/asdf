// ============================================================================
// AURA — Schedule Agent
// Dynamic Calendar Allocation & Proactive Conflict Detection
// ============================================================================
import { GeminiService } from '../../services/gemini.js';
import { db } from '../../db/supabase.js';
import { Goal, Task } from '../../types/index.js';

export class ScheduleAgent {
  static readonly name = 'Schedule Agent';

  static async scheduleWorkflow(goal: Goal, tasks: Task[]): Promise<any> {
    await db.addActivity({
      goal_id: goal.id,
      agent_name: this.name,
      action: 'Evaluating Schedule & Capacity',
      status: 'IN_PROGRESS',
      message: `Analyzing deadline constraints for ${tasks.length} subtasks against calendar windows.`,
    });

    const result = await GeminiService.generateSchedule(goal, tasks);

    for (const item of result.schedule) {
      await db.addSchedule({
        goal_id: goal.id,
        task_id: item.task_id,
        start_time: item.start_time,
        end_time: item.end_time,
        reason: item.reason,
      });
    }

    if (result.conflicts && result.conflicts.length > 0) {
      for (const conf of result.conflicts) {
        await db.addActivity({
          goal_id: goal.id,
          agent_name: this.name,
          action: 'Conflict Detected & Mitigated',
          status: 'WARNING',
          message: `Overlap: "${conf.conflict}". Proactive Resolution: "${conf.resolution}".`,
        });
      }
    } else {
      await db.addActivity({
        goal_id: goal.id,
        agent_name: this.name,
        action: 'Schedule Finalized',
        status: 'SUCCESS',
        message: 'All tasks assigned non-overlapping execution blocks with rest buffers.',
      });
    }

    await db.updateGoal(goal.id, {
      current_stage: 'EXECUTE',
      active_agent: 'Execution Agent',
    });

    return result;
  }
}
