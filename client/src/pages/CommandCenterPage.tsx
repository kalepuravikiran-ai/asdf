import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { Goal, WorkflowStage } from '../types/index.js';
import { ProgressBar } from '../components/common/ProgressBar.js';
import { 
  Terminal, 
  Send, 
  Sparkles, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Bot, 
  Layers, 
  ShieldCheck, 
  RefreshCw,
  Cpu,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CommandCenterPage: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('HIGH');
  const [category, setCategory] = useState<string>('STUDY');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [activeGoal, setActiveGoal] = useState<Goal | null>(null);
  const [streamLogs, setStreamLogs] = useState<Array<{ text: string; time: string; type: string }>>([]);
  const [workflowStage, setWorkflowStage] = useState<WorkflowStage>('UNDERSTAND');

  const presetGoals = [
    {
      title: 'Exam Preparation & Assignment Management (Hackathon Showcase)',
      prompt: 'I have exams next week. Help me prepare while managing my assignments and daily schedule.',
      category: 'STUDY',
      priority: 'HIGH' as const,
      badge: 'Official Demo Scenario'
    },
    {
      title: 'SaaS MVP Launch & Cloud Infrastructure',
      prompt: 'Deploy my multi-tenant SaaS application to production with zero-downtime database migrations, CI/CD smoke tests, and analytics tracking.',
      category: 'PROJECT',
      priority: 'CRITICAL' as const,
      badge: 'DevOps & Engineering'
    },
    {
      title: 'Multi-Agent Autonomous Systems Research',
      prompt: 'Synthesize current empirical literature on autonomous multi-agent reasoning loops, feedback adaptation, and safety boundaries.',
      category: 'RESEARCH',
      priority: 'MEDIUM' as const,
      badge: 'Academic Synthesis'
    }
  ];

  const handleApplyPreset = (p: typeof presetGoals[0]) => {
    setPrompt(p.prompt);
    setCategory(p.category);
    setPriority(p.priority);
  };

  const handleLaunchGoal = async () => {
    if (!prompt.trim() || isSubmitting) return;
    setIsSubmitting(true);
    setStreamLogs([]);

    try {
      // 1. Create Goal
      addLog(`[SYSTEM] Ingesting goal input: "${prompt}"`, 'system');
      const goal = await api.createGoal({
        title: prompt,
        description: `Autonomously generated workflow for: ${prompt}`,
        category,
        priority,
      });

      setActiveGoal(goal);
      addLog(`[ORCHESTRATOR] Goal created (ID: ${goal.id.slice(0, 8)}...). Initiating multi-agent reasoning matrix.`, 'orchestrator');

      // 2. Launch workflow execution
      await api.runWorkflow(goal.id, 900);

      // Poll status and stream logs
      const pollInterval = setInterval(async () => {
        try {
          const status = await api.getWorkflowStatus(goal.id);
          const updatedGoal = await api.getGoalById(goal.id);
          setActiveGoal(updatedGoal);
          setWorkflowStage(updatedGoal.current_stage);

          if (updatedGoal.current_stage === 'COMPLETE' || !status.isRunning) {
            clearInterval(pollInterval);
            setIsSubmitting(false);
            if (updatedGoal.status === 'COMPLETED') {
              addLog(`[ORCHESTRATOR] Goal completed with 100% verification success!`, 'success');
              confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
              });
            }
          }
        } catch (e) {
          clearInterval(pollInterval);
          setIsSubmitting(false);
        }
      }, 1000);

    } catch (err: any) {
      addLog(`[ERROR] Failed to start workflow: ${err.message}`, 'error');
      setIsSubmitting(false);
    }
  };

  const addLog = (text: string, type: string) => {
    setStreamLogs(prev => [...prev, { text, time: new Date().toLocaleTimeString(), type }]);
  };

  // Listen to SSE if active goal exists
  useEffect(() => {
    if (!activeGoal) return;
    const eventSource = new EventSource(`/api/agents/stream/${activeGoal.id}`);
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        addLog(`[TELEMETRY] ${data.message}`, 'info');
      } catch (e) {}
    };
    return () => eventSource.close();
  }, [activeGoal?.id]);

  const stages: Array<{ stage: WorkflowStage; label: string; icon: any }> = [
    { stage: 'UNDERSTAND', label: 'Understand', icon: Cpu },
    { stage: 'PLAN', label: 'Plan', icon: Layers },
    { stage: 'DELEGATE', label: 'Delegate', icon: Bot },
    { stage: 'EXECUTE', label: 'Execute', icon: Terminal },
    { stage: 'OBSERVE', label: 'Observe', icon: Clock },
    { stage: 'VERIFY', label: 'Verify', icon: ShieldCheck },
    { stage: 'ADAPT', label: 'Adapt', icon: RefreshCw },
    { stage: 'COMPLETE', label: 'Complete', icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-cyan-400" />
          <h1 className="text-2xl font-bold font-mono tracking-tight text-white">AI COMMAND CENTER</h1>
        </div>
        <p className="text-xs text-slate-400 mt-1 font-mono">
          State your natural-language objective. AURA autonomously plans, delegates, executes, and verifies.
        </p>
      </div>

      {/* Main Command Input Box */}
      <div className="glass-panel p-6 rounded-2xl space-y-4 border-cyan-500/30">
        <label className="block text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider">
          What do you want me to accomplish?
        </label>
        
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., I have exams next week. Help me prepare while managing my assignments and daily schedule..."
            rows={3}
            className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl p-4 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-sans resize-none"
          />
        </div>

        {/* Advisory Configuration Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-800">
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <div>
              <span className="text-slate-400 mr-2">Category:</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="STUDY">Education / Study</option>
                <option value="PROJECT">Project / Engineering</option>
                <option value="RESEARCH">Research</option>
                <option value="PRODUCTIVITY">Productivity</option>
                <option value="SCHEDULING">Scheduling</option>
              </select>
            </div>

            <div>
              <span className="text-slate-400 mr-2">Priority:</span>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleLaunchGoal}
            disabled={!prompt.trim() || isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Agents Orchestrating...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Execute Autonomous Workflow</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preset Demonstration Goals */}
      <div className="space-y-3">
        <p className="text-xs font-mono tracking-wider text-slate-400 uppercase">Preset Benchmark Goals</p>
        <div className="grid md:grid-cols-3 gap-4">
          {presetGoals.map((p, idx) => (
            <div
              key={idx}
              onClick={() => handleApplyPreset(p)}
              className="glass-panel p-4 rounded-xl cursor-pointer hover:border-cyan-500/40 hover:bg-slate-800/40 transition-all group space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">{p.badge}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
              </div>
              <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">{p.title}</h4>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{p.prompt}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Autonomous Workflow Stepper (Active during/after run) */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-mono font-bold tracking-wider text-white uppercase">Autonomous Feedback Loop Stepper</h3>
          </div>
          {activeGoal && (
            <span className="text-xs font-mono text-cyan-400">Progress: {activeGoal.progress}%</span>
          )}
        </div>

        {/* Stepper Stages Bar */}
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2 pt-2">
          {stages.map((st, i) => {
            const Icon = st.icon;
            const currentIdx = stages.findIndex(s => s.stage === workflowStage);
            const isCompleted = i < currentIdx;
            const isCurrent = i === currentIdx;

            return (
              <div
                key={st.stage}
                className={`p-3 rounded-xl border flex flex-col items-center text-center transition-all ${
                  isCurrent
                    ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-lg shadow-cyan-500/20 scale-105'
                    : isCompleted
                    ? 'bg-emerald-950/30 border-emerald-800 text-emerald-300'
                    : 'bg-slate-900/40 border-slate-800 text-slate-400'
                }`}
              >
                <Icon className={`w-4 h-4 mb-1.5 ${isCurrent ? 'text-cyan-300 animate-bounce' : isCompleted ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span className="text-[11px] font-bold font-mono">{st.label}</span>
                <span className="text-[9px] text-slate-400 mt-0.5">
                  {isCurrent ? 'ACTIVE' : isCompleted ? 'DONE' : 'QUEUED'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Agent Terminal Stream */}
      <div className="glass-panel p-5 rounded-2xl space-y-3 font-mono">
        <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-slate-300 font-bold uppercase tracking-wider">AURA Real-Time Telemetry Stream</span>
          </div>
          <span className="text-slate-400 text-[10px]">Auto-scroll enabled</span>
        </div>

        <div className="bg-[#05070b] border border-slate-800/80 rounded-xl p-4 h-64 overflow-y-auto space-y-2 text-xs">
          {streamLogs.length === 0 ? (
            <p className="text-slate-400 italic">Awaiting goal dispatch. Select a preset or input your prompt above to engage the agents.</p>
          ) : (
            streamLogs.map((log, index) => (
              <div key={index} className="flex items-start gap-2 leading-relaxed">
                <span className="text-slate-400 text-[10px]">[{log.time}]</span>
                <span className={
                  log.type === 'orchestrator' ? 'text-cyan-400 font-semibold' :
                  log.type === 'success' ? 'text-emerald-400 font-bold' :
                  log.type === 'error' ? 'text-rose-400' :
                  'text-slate-300'
                }>
                  {log.text}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
