// ============================================================================
// AURA — Autonomous Multi-Agent Orchestration Engine
// Executes the Full Autonomous Feedback Loop:
// UNDERSTAND → PLAN → DELEGATE → EXECUTE → OBSERVE → VERIFY → ADAPT
// ============================================================================
import { EventEmitter } from 'events';
import { db } from '../db/supabase.js';
import { Goal, Task, WorkflowStage, AgentName } from '../types/index.js';
import { OrchestratorAgent } from '../agents/orchestrator/index.js';
import { PlanningAgent } from '../agents/planner/index.js';
import { ResearchAgent } from '../agents/researcher/index.js';
import { ScheduleAgent } from '../agents/scheduler/index.js';
import { ExecutionAgent } from '../agents/executor/index.js';
import { VerificationAgent } from '../agents/verifier/index.js';
import { AdaptationAgent } from '../agents/adapter/index.js';

class AgentEngineEmitter extends EventEmitter {}
export const agentEvents = new AgentEngineEmitter();

// Active workflows map
const activeWorkflows = new Map<string, { paused: boolean; cancelled: boolean }>();

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export class AgentEngine {
  /**
   * Run the full end-to-end autonomous cycle for a goal
   */
  static async runWorkflow(goalId: string, speedMs: number = 800): Promise<void> {
    const goal = await db.getGoalById(goalId);
    if (!goal) {
      throw new Error(`Goal with ID ${goalId} not found`);
    }

    const state = { paused: false, cancelled: false };
    activeWorkflows.set(goalId, state);

    try {
      await db.updateGoal(goalId, { status: 'IN_PROGRESS' });
      this.emitProgress(goalId, 'Workflow started');

      // ----------------------------------------------------
      // STAGE 1: UNDERSTAND
      // ----------------------------------------------------
      await db.updateGoal(goalId, { current_stage: 'UNDERSTAND', active_agent: 'Orchestrator Agent', progress: 10 });
      this.emitProgress(goalId, 'Stage: UNDERSTAND');
      await OrchestratorAgent.understandGoal(goal);
      await delay(speedMs);

      if (state.cancelled) return;

      // ----------------------------------------------------
      // STAGE 2: PLAN
      // ----------------------------------------------------
      await db.updateGoal(goalId, { current_stage: 'PLAN', active_agent: 'Planning Agent', progress: 25 });
      this.emitProgress(goalId, 'Stage: PLAN');
      const updatedGoal = (await db.getGoalById(goalId))!;
      const plannedTasks = await PlanningAgent.createPlan(updatedGoal);
      await delay(speedMs);

      if (state.cancelled) return;

      // ----------------------------------------------------
      // STAGE 3: DELEGATE & SCHEDULE
      // ----------------------------------------------------
      await db.updateGoal(goalId, { current_stage: 'DELEGATE', active_agent: 'Schedule Agent', progress: 40 });
      this.emitProgress(goalId, 'Stage: DELEGATE');
      
      // Perform research on the research task if present
      const researchTask = plannedTasks.find(t => t.assigned_agent === 'Research Agent');
      if (researchTask) {
        await ResearchAgent.researchTask(researchTask);
        await delay(speedMs / 2);
      }

      await ScheduleAgent.scheduleWorkflow(updatedGoal, plannedTasks);
      await delay(speedMs);

      if (state.cancelled) return;

      // ----------------------------------------------------
      // STAGE 4: EXECUTE & OBSERVE (with adaptive loop)
      // ----------------------------------------------------
      await db.updateGoal(goalId, { current_stage: 'EXECUTE', active_agent: 'Execution Agent', progress: 50 });
      this.emitProgress(goalId, 'Stage: EXECUTE');

      let allTasks = await db.getTasks(goalId);
      let cycle = 1;
      let hasAdapted = false;

      for (let i = 0; i < allTasks.length; i++) {
        if (state.cancelled) return;
        while (state.paused) {
          await delay(500);
          if (state.cancelled) return;
        }

        const task = allTasks[i];
        if (task.status === 'COMPLETED') continue;

        // If this is task 3 and we haven't demonstrated adaptation yet, simulate snag to trigger adaptation
        if (i === 2 && !hasAdapted && allTasks.length >= 4) {
          // Trigger simulated snag & adaptation
          await db.updateGoal(goalId, { current_stage: 'OBSERVE', active_agent: 'Execution Agent' });
          const failedExec = await ExecutionAgent.executeTask({
            ...task,
            title: `[Anomaly Detected] Schedule Conflict during: ${task.title}`
          }, cycle);

          // ----------------------------------------------------
          // STAGE 5: ADAPT & RE-PLAN
          // ----------------------------------------------------
          await delay(speedMs);
          await db.updateGoal(goalId, { current_stage: 'ADAPT', active_agent: 'Adaptation Agent', progress: 65 });
          this.emitProgress(goalId, 'Stage: ADAPT (Triggering Re-plan)');

          await AdaptationAgent.adapt(updatedGoal, task, allTasks);
          hasAdapted = true;
          cycle++;
          await delay(speedMs);

          // Re-execute adapted task with resolution
          await db.updateGoal(goalId, { current_stage: 'EXECUTE', active_agent: 'Execution Agent' });
          await ExecutionAgent.executeTask({
            ...task,
            title: `[Rebalanced] ${task.title}`
          }, cycle);
        } else {
          await ExecutionAgent.executeTask(task, cycle);
        }

        const currentProgress = Math.min(85, Math.round(50 + ((i + 1) / allTasks.length) * 35));
        await db.updateGoal(goalId, { progress: currentProgress });
        this.emitProgress(goalId, `Task ${i + 1} finalized`);
        await delay(speedMs);
      }

      if (state.cancelled) return;

      // ----------------------------------------------------
      // STAGE 6: VERIFY
      // ----------------------------------------------------
      await db.updateGoal(goalId, { current_stage: 'VERIFY', active_agent: 'Verification Agent', progress: 90 });
      this.emitProgress(goalId, 'Stage: VERIFY');
      const latestTasks = await db.getTasks(goalId);
      const verification = await VerificationAgent.verify(updatedGoal, latestTasks);
      await delay(speedMs);

      if (state.cancelled) return;

      // ----------------------------------------------------
      // STAGE 7: COMPLETE
      // ----------------------------------------------------
      await db.updateGoal(goalId, { current_stage: 'COMPLETE', active_agent: 'Orchestrator Agent', progress: 100 });
      this.emitProgress(goalId, 'Stage: COMPLETE');
      await OrchestratorAgent.finalizeGoal(updatedGoal, latestTasks);

    } catch (err: any) {
      console.error(`Workflow execution error on goal ${goalId}:`, err);
      await db.addActivity({
        goal_id: goalId,
        agent_name: 'Orchestrator Agent',
        action: 'Workflow Error',
        status: 'FAILED',
        message: `Execution halted: ${err.message}`,
      });
      await db.updateGoal(goalId, { status: 'FAILED' });
    } finally {
      activeWorkflows.delete(goalId);
    }
  }

  static pauseWorkflow(goalId: string): boolean {
    const wf = activeWorkflows.get(goalId);
    if (wf) {
      wf.paused = true;
      db.updateGoal(goalId, { status: 'PAUSED' });
      return true;
    }
    return false;
  }

  static resumeWorkflow(goalId: string): boolean {
    const wf = activeWorkflows.get(goalId);
    if (wf) {
      wf.paused = false;
      db.updateGoal(goalId, { status: 'IN_PROGRESS' });
      return true;
    }
    return false;
  }

  static cancelWorkflow(goalId: string): boolean {
    const wf = activeWorkflows.get(goalId);
    if (wf) {
      wf.cancelled = true;
      activeWorkflows.delete(goalId);
      db.updateGoal(goalId, { status: 'FAILED' });
      return true;
    }
    return false;
  }

  static isRunning(goalId: string): boolean {
    return activeWorkflows.has(goalId);
  }

  private static emitProgress(goalId: string, message: string) {
    agentEvents.emit('progress', { goalId, message, timestamp: new Date().toISOString() });
  }
}
