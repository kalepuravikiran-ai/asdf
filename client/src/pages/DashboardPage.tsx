import React, { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { Goal, Task, AgentActivity, DashboardMetrics, AgentInfo } from '../types/index.js';
import { MetricCard } from '../components/common/MetricCard.js';
import { ProgressBar } from '../components/common/ProgressBar.js';
import { StatusBadge, PriorityBadge, StageBadge } from '../components/common/Badge.js';
import { 
  Bot, 
  CheckSquare, 
  RefreshCw, 
  TrendingUp, 
  Play, 
  Pause, 
  RotateCcw, 
  AlertTriangle, 
  ArrowRight,
  Terminal,
  Activity,
  Calendar,
  Layers
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [currentGoal, setCurrentGoal] = useState<Goal | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activities, setActivities] = useState<AgentActivity[]>([]);
  const [agents, setAgents] = useState<AgentInfo[]>([]);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);

  const loadData = async () => {
    try {
      const dash = await api.getDashboardData();
      setMetrics(dash.metrics);
      setCurrentGoal(dash.currentGoal);
      setGoals(dash.goals);
      setActivities(dash.recentActivities);

      if (dash.currentGoal) {
        const goalTasks = await api.getTasks(dash.currentGoal.id);
        setTasks(goalTasks);
        const status = await api.getWorkflowStatus(dash.currentGoal.id);
        setIsExecuting(status.isRunning);
      }

      const agentList = await api.getAgents();
      setAgents(agentList);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleStartWorkflow = async () => {
    if (!currentGoal) return;
    setIsExecuting(true);
    await api.runWorkflow(currentGoal.id, 700);
    loadData();
  };

  const handlePauseWorkflow = async () => {
    if (!currentGoal) return;
    await api.pauseWorkflow(currentGoal.id);
    setIsExecuting(false);
    loadData();
  };

  const handleResumeWorkflow = async () => {
    if (!currentGoal) return;
    await api.resumeWorkflow(currentGoal.id);
    setIsExecuting(true);
    loadData();
  };

  const handleTriggerReplan = async () => {
    if (!currentGoal) return;
    await api.triggerReplan(currentGoal.id);
    loadData();
  };

  if (loading && !currentGoal) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3 font-mono text-xs text-cyan-400">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <span>INITIALIZING AURA NEURAL MATRIX...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header & Quick Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-mono tracking-tight text-white">MISSION COMMAND DASHBOARD</h1>
            <span className="text-xs font-mono bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded">LIVE</span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Autonomous Multi-Agent Telemetry, Active Goals, and Re-planning Status
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/command-center')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white text-xs font-semibold shadow-md shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>New Natural Goal</span>
          </button>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title="Active Goals"
          value={metrics?.activeGoals ?? 1}
          subtitle={`Total tracked: ${metrics?.totalGoals ?? 1}`}
          icon={Bot}
          color="cyan"
        />
        <MetricCard
          title="Tasks Completed"
          value={`${metrics?.completedTasks ?? 0}/${metrics?.totalTasks ?? 0}`}
          subtitle={`${metrics?.inProgressTasks ?? 0} In Progress`}
          icon={CheckSquare}
          color="emerald"
        />
        <MetricCard
          title="Autonomous Re-plans"
          value={metrics?.totalReplans ?? 1}
          subtitle="Dynamic conflict mitigations"
          icon={RefreshCw}
          color="amber"
        />
        <MetricCard
          title="Success Rate"
          value={`${currentGoal?.success_rate ?? 96}%`}
          subtitle="Verified confidence score"
          icon={TrendingUp}
          color="violet"
        />
      </div>

      {/* Current Focused Goal Banner with Live Controls */}
      {currentGoal ? (
        <div className="glass-panel-glow p-6 rounded-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <StageBadge stage={currentGoal.current_stage} />
                <StatusBadge status={currentGoal.status} />
                <PriorityBadge priority={currentGoal.priority} />
                <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                  Active: {currentGoal.active_agent}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">{currentGoal.title}</h2>
              <p className="text-xs text-slate-300 leading-relaxed">{currentGoal.summary || currentGoal.description}</p>
              
              <div className="pt-2 max-w-md">
                <ProgressBar progress={currentGoal.progress} showText color="cyan" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap lg:flex-col gap-2.5">
              {!isExecuting ? (
                <button
                  onClick={handleStartWorkflow}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs transition-all shadow-md shadow-cyan-500/20 active:scale-95"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Run Autonomous Loop</span>
                </button>
              ) : (
                <button
                  onClick={handlePauseWorkflow}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs transition-all shadow-md shadow-amber-500/20 active:scale-95"
                >
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Pause Execution</span>
                </button>
              )}

              <button
                onClick={handleTriggerReplan}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span>Simulate Re-Plan</span>
              </button>

              <button
                onClick={() => navigate('/planner')}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold transition-all"
              >
                <span>View Full Roadmap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Main Grid: Tasks & Live Agent Activity Feed */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Subtasks Pipeline */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-mono font-bold tracking-wider text-white uppercase">Active Subtasks Pipeline</h3>
            </div>
            <span className="text-xs font-mono text-slate-400">{tasks.length} total tasks</span>
          </div>

          <div className="space-y-3">
            {tasks.map((task) => (
              <div 
                key={task.id} 
                className="glass-panel p-4 rounded-xl flex items-start justify-between gap-4 hover:border-slate-700 transition-all group"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <StatusBadge status={task.status} />
                    <span className="text-[11px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                      {task.assigned_agent}
                    </span>
                    <PriorityBadge priority={task.priority} />
                  </div>
                  <h4 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                    {task.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {task.description}
                  </p>
                </div>
                <div className="text-right text-[11px] font-mono text-slate-400 whitespace-nowrap">
                  <span>{task.estimated_minutes || 30}m est</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Live Agent Activity Stream */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-violet-400" />
              <h3 className="text-sm font-mono font-bold tracking-wider text-white uppercase">Real-Time Agent Activity</h3>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <div className="glass-panel p-4 rounded-2xl space-y-3 max-h-[500px] overflow-y-auto">
            {activities.slice(0, 8).map((act) => (
              <div key={act.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-mono font-semibold text-cyan-400">{act.agent_name}</span>
                  <span className="font-mono text-slate-400">
                    {new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-200">{act.action}</p>
                <p className="text-xs text-slate-400 leading-snug">{act.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
