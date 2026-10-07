// ============================================================================
// AURA — Verification Agent
// Output Audit, Consistency Verification, and Readiness Scoring
// ============================================================================
import { GeminiService } from '../../services/gemini.js';
import { db } from '../../db/supabase.js';
import { Goal, Task } from '../../types/index.js';

export class VerificationAgent {
  static readonly name = 'Verification Agent';

  static async verify(goal: Goal, tasks: Task[]): Promise<any> {
    await db.addActivity({
      goal_id: goal.id,
      agent_name: this.name,
      action: 'Auditing Artifacts & Verifying Criteria',
      status: 'IN_PROGRESS',
      message: `Running verification audit across ${tasks.length} tasks and criteria checklists.`,
    });

    const verification = await GeminiService.verifyProgress(goal, tasks);

    await db.addActivity({
      goal_id: goal.id,
      agent_name: this.name,
      action: verification.verified ? 'Verification Passed' : 'Verification Flagged Items',
      status: verification.verified ? 'SUCCESS' : 'WARNING',
      message: `Readiness Score: ${verification.score}/100. ${verification.recommendation}`,
      metadata: { verification },
    });

    return verification;
  }
}
