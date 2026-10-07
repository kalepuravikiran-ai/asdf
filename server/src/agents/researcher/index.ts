// ============================================================================
// AURA — Research Agent
// Empirical Synthesis, Evidence Retrieval, and Factual Summaries
// ============================================================================
import { GeminiService } from '../../services/gemini.js';
import { db } from '../../db/supabase.js';
import { Task } from '../../types/index.js';

export class ResearchAgent {
  static readonly name = 'Research Agent';

  static async researchTask(task: Task): Promise<any> {
    await db.addActivity({
      goal_id: task.goal_id,
      task_id: task.id,
      agent_name: this.name,
      action: 'Synthesizing Verified Data',
      status: 'IN_PROGRESS',
      message: `Executing deep research query for: "${task.title}". Extracting validated precedents.`,
    });

    const result = await GeminiService.performResearch(task.title);

    await db.updateTask(task.id, {
      metadata: {
        ...task.metadata,
        research: result,
      },
    });

    await db.addActivity({
      goal_id: task.goal_id,
      task_id: task.id,
      agent_name: this.name,
      action: 'Research Complete',
      status: 'SUCCESS',
      message: `Gathered ${result.findings.length} findings with ${(result.confidence * 100).toFixed(0)}% confidence score.`,
    });

    return result;
  }
}
