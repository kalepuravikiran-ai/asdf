// ============================================================================
// AURA — Orchestrator Agent
// Central Intelligence & Workflow Coordination Layer
// ============================================================================
import { GeminiService } from '../../services/gemini.js';
import { db } from '../../db/supabase.js';
import { Goal, Task, AgentActivity } from '../../types/index.js';

export class OrchestratorAgent {
  static readonly name = 'Orchestrator Agent';

  /**
   * Step 1: Understand user goal & analyze requirements
   */
  static async understandGoal(goal: Goal): Promise<Goal> {
    await db.addActivity({
      goal_id: goal.id,
      agent_name: this.name,
      action: 'Goal Ingestion & Boundary Analysis',
      status: 'IN_PROGRESS',
      message: `Analyzing objective: "${goal.title}". Mapping constraints and agent requirements.`,
    });

    const analysis = await GeminiService.analyzeGoal(goal.title);

    const updated = await db.updateGoal(goal.id, {
      category: analysis.category,
      priority: analysis.priority,
      summary: analysis.summary,
      metadata: {
        ...goal.metadata,
        constraints: analysis.constraints,
        required_agents: analysis.required_agents,
        success_criteria: analysis.success_criteria,
      },
      current_stage: 'PLAN',
      active_agent: 'Planning Agent',
    });

    await db.addActivity({
      goal_id: goal.id,
      agent_name: this.name,
      action: 'Requirements Analyzed',
      status: 'SUCCESS',
      message: `Identified category [${analysis.category}] with priority [${analysis.priority}]. Dispatched to Planning Agent.`,
    });

    return updated || goal;
  }

  /**
   * Complete goal summary
   */
  static async finalizeGoal(goal: Goal, tasks: Task[]): Promise<Goal> {
    const finalResult = await GeminiService.generateFinalResult(goal, tasks);

    const updated = await db.updateGoal(goal.id, {
      status: 'COMPLETED',
      progress: 100,
      success_rate: finalResult.success_rate || 98,
      current_stage: 'COMPLETE',
      active_agent: this.name,
      summary: finalResult.summary,
      metadata: {
        ...goal.metadata,
        finalResult,
      },
    });

    await db.addActivity({
      goal_id: goal.id,
      agent_name: this.name,
      action: 'Goal Successfully Completed',
      status: 'SUCCESS',
      message: `Objective achieved. Final verification score: ${finalResult.success_rate}%. Summary: ${finalResult.summary}`,
    });

    return updated || goal;
  }
}
