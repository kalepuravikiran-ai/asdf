// ============================================================================
// AURA — Autonomous Unified Reasoning Agent
// Server-Side Gemini Service with Zod Validation & Fail-Safe Fallback
// ============================================================================
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { 
  GoalAnalysis, GoalAnalysisSchema,
  PlanningResult, PlanningSchema,
  ResearchResult, ResearchResultSchema,
  ScheduleResult, ScheduleSchema,
  ExecutionResult, ExecutionResultSchema,
  VerificationResult, VerificationSchema,
  AdaptationResult, AdaptationSchema,
  FinalResult, FinalResultSchema 
} from '../schemas/index.js';
import { DemoEngine } from './demoEngine.js';
import { Goal, Task } from '../types/index.js';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || '';
let genAI: GoogleGenerativeAI | null = null;

if (apiKey && apiKey !== 'your_gemini_api_key_here') {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
  } catch (e) {
    console.warn('⚠️ Warning: Failed to initialize GoogleGenerativeAI client with provided key.');
  }
}

const SYSTEM_PROMPT = `
You are AURA, an autonomous multi-agent reasoning system.

Your responsibility is to transform user goals into structured,
safe, executable, verifiable workflows.

You must:
1. Understand the user's actual objective.
2. Identify constraints and requirements.
3. Break complex objectives into appropriate subtasks.
4. Select the appropriate specialized agents.
5. Generate structured execution plans.
6. Monitor progress.
7. Detect failures and inconsistencies.
8. Verify results.
9. Adapt plans when circumstances change.
10. Produce a clear final result.

Never fabricate facts, sources, tool results, or completed actions.
Never claim an external action was performed unless the application
actually performed or simulated that action.

Clearly distinguish:
- planned actions
- simulated actions
- completed actions
- failed actions

Use structured JSON whenever a schema is requested.
Respond ONLY with a valid raw JSON object. Do not wrap in markdown quotes if possible, or use standard JSON.
`;

function cleanJsonString(raw: string): string {
  let cleaned = raw.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return cleaned.trim();
}

export class GeminiService {
  /**
   * Check if Gemini API is configured and reachable
   */
  static isAvailable(): boolean {
    return Boolean(genAI && apiKey && apiKey.length > 5);
  }

  /**
   * Helper to execute model query with clean JSON parsing
   */
  private static async queryModel(prompt: string, fallbackFn: () => any): Promise<any> {
    if (!this.isAvailable()) {
      return fallbackFn();
    }

    try {
      // Use gemini-2.5-flash as verified available on Google AI Studio
      const model = genAI!.getGenerativeModel({ 
        model: 'gemini-2.5-flash',
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        }
      });

      const fullPrompt = `${SYSTEM_PROMPT}\n\n${prompt}`;
      const result = await model.generateContent(fullPrompt);
      const text = result.response.text();
      const parsed = JSON.parse(cleanJsonString(text));
      return parsed;
    } catch (err: any) {
      console.warn(`[GeminiService] AI generation error: ${err.message}. Seamlessly engaging DemoEngine fallback.`);
      return fallbackFn();
    }
  }

  /**
   * 1. Orchestrator Analysis
   */
  static async analyzeGoal(userGoal: string): Promise<GoalAnalysis> {
    const prompt = `
Task: Analyze the following user goal for autonomous orchestration.
User Goal: "${userGoal}"

Return JSON matching this schema:
{
  "goal": string,
  "summary": string,
  "category": "STUDY" | "PROJECT" | "RESEARCH" | "PRODUCTIVITY" | "PLANNING" | "SCHEDULING" | "DECISION" | "OTHER",
  "priority": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "constraints": string[],
  "required_agents": string[],
  "success_criteria": string[]
}
`;
    const data = await this.queryModel(prompt, () => DemoEngine.analyzeGoal(userGoal));
    const validated = GoalAnalysisSchema.safeParse(data);
    return validated.success ? validated.data : DemoEngine.analyzeGoal(userGoal);
  }

  /**
   * 2. Planning Agent Decomposition
   */
  static async generatePlan(goal: Goal): Promise<PlanningResult> {
    const prompt = `
Task: Decompose the following goal into a sequence of concrete subtasks assigned to specialized agents.
Goal: "${goal.title}"
Description: "${goal.description || ''}"
Category: ${goal.category}

Available Agents:
- "Planning Agent" (decomposition, prioritization)
- "Research Agent" (gathering facts, literature, verified sources)
- "Schedule Agent" (calendar slots, deadlines, conflict resolution)
- "Execution Agent" (running operations, generating artifacts)
- "Verification Agent" (testing, quality checks, criterion validation)
- "Adaptation Agent" (re-planning when snags or delays occur)

Return JSON matching this schema:
{
  "goal_id": "${goal.id}",
  "plan_summary": string,
  "tasks": [
    {
      "title": string,
      "description": string,
      "priority": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
      "assigned_agent": string,
      "dependencies": string[],
      "estimated_minutes": number
    }
  ],
  "execution_order": string[]
}
`;
    const data = await this.queryModel(prompt, () => DemoEngine.generatePlan(goal));
    const validated = PlanningSchema.safeParse(data);
    return validated.success ? validated.data : DemoEngine.generatePlan(goal);
  }

  /**
   * 3. Research Agent
   */
  static async performResearch(query: string): Promise<ResearchResult> {
    const prompt = `
Task: Conduct structured empirical research.
Query: "${query}"

Return JSON matching:
{
  "query": "${query}",
  "summary": string,
  "findings": [
    {
      "title": string,
      "content": string,
      "source": string
    }
  ],
  "confidence": number (between 0.0 and 1.0)
}
`;
    const data = await this.queryModel(prompt, () => DemoEngine.performResearch(query));
    const validated = ResearchResultSchema.safeParse(data);
    return validated.success ? validated.data : DemoEngine.performResearch(query);
  }

  /**
   * 4. Schedule Agent
   */
  static async generateSchedule(goal: Goal, tasks: Task[]): Promise<ScheduleResult> {
    const prompt = `
Task: Create a time allocation schedule and detect potential conflicts for the tasks of goal: "${goal.title}".
Tasks: ${JSON.stringify(tasks.map(t => ({ id: t.id, title: t.title, duration: t.estimated_minutes })))}

Return JSON matching:
{
  "schedule": [
    {
      "task_id": string,
      "start_time": string (ISO 8601),
      "end_time": string (ISO 8601),
      "reason": string
    }
  ],
  "conflicts": [
    {
      "task_id": string,
      "conflict": string,
      "resolution": string
    }
  ]
}
`;
    const data = await this.queryModel(prompt, () => DemoEngine.generateSchedule(goal, tasks));
    const validated = ScheduleSchema.safeParse(data);
    return validated.success ? validated.data : DemoEngine.generateSchedule(goal, tasks);
  }

  /**
   * 5. Execution Agent
   */
  static async executeTask(task: Task, cycle: number): Promise<ExecutionResult> {
    const prompt = `
Task: Execute or simulate execution of this task:
Title: "${task.title}"
Description: "${task.description}"
Assigned Agent: "${task.assigned_agent}"

Return JSON:
{
  "task_id": "${task.id}",
  "status": "COMPLETED" | "FAILED" | "BLOCKED" | "SIMULATED",
  "action": string,
  "result": string,
  "errors": string[]
}
`;
    const data = await this.queryModel(prompt, () => DemoEngine.executeTask(task, cycle));
    const validated = ExecutionResultSchema.safeParse(data);
    return validated.success ? validated.data : DemoEngine.executeTask(task, cycle);
  }

  /**
   * 6. Verification Agent
   */
  static async verifyProgress(goal: Goal, tasks: Task[]): Promise<VerificationResult> {
    const prompt = `
Task: Audit and verify the completion state of the goal: "${goal.title}".
Completed Tasks: ${JSON.stringify(tasks.filter(t => t.status === 'COMPLETED').map(t => t.title))}
Pending Tasks: ${JSON.stringify(tasks.filter(t => t.status !== 'COMPLETED').map(t => t.title))}

Return JSON:
{
  "verified": boolean,
  "score": number (0 to 100),
  "checks": [
    {
      "criterion": string,
      "passed": boolean,
      "reason": string
    }
  ],
  "issues": string[],
  "recommendation": string
}
`;
    const data = await this.queryModel(prompt, () => DemoEngine.verifyProgress(goal, tasks));
    const validated = VerificationSchema.safeParse(data);
    return validated.success ? validated.data : DemoEngine.verifyProgress(goal, tasks);
  }

  /**
   * 7. Adaptation Agent
   */
  static async adaptPlan(goal: Goal, failedTask: Task, allTasks: Task[]): Promise<AdaptationResult> {
    const prompt = `
Task: An issue or environmental conflict occurred during task: "${failedTask.title}".
Goal: "${goal.title}"
Generate an adaptive re-plan to recover progress and preserve the deadline.

Return JSON:
{
  "adaptation_required": true,
  "reason": string,
  "affected_tasks": string[],
  "changes": [
    {
      "task_id": string,
      "change": string
    }
  ],
  "new_plan": string[]
}
`;
    const data = await this.queryModel(prompt, () => DemoEngine.adaptPlan(goal, failedTask, allTasks));
    const validated = AdaptationSchema.safeParse(data);
    return validated.success ? validated.data : DemoEngine.adaptPlan(goal, failedTask, allTasks);
  }

  /**
   * 8. Final Result
   */
  static async generateFinalResult(goal: Goal, tasks: Task[]): Promise<FinalResult> {
    const prompt = `
Task: Synthesize the final outcome and execution summary for goal: "${goal.title}".
Tasks: ${JSON.stringify(tasks.map(t => ({ title: t.title, status: t.status })))}

Return JSON:
{
  "status": "COMPLETED" | "PARTIAL" | "FAILED",
  "summary": string,
  "completed_tasks": string[],
  "remaining_tasks": string[],
  "progress": 100,
  "replans": ${goal.replan_count || 1},
  "success_rate": number,
  "next_steps": string[]
}
`;
    const data = await this.queryModel(prompt, () => DemoEngine.generateFinalResult(goal, tasks));
    const validated = FinalResultSchema.safeParse(data);
    return validated.success ? validated.data : DemoEngine.generateFinalResult(goal, tasks);
  }
}
