import React, { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { Goal, Task, Schedule } from '../types/index.js';
import { StatusBadge, PriorityBadge } from '../components/common/Badge.js';
import { 
  CalendarRange, 
  RotateCcw, 
  GitBranch, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Bot,
  Layers,
  ArrowRight
} from 'lucide-react';

export const PlannerPage: React.FC = () => {
  const [plannerData, setPlannerData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [selectedGoalId, setSelectedGoalId] = useState<string>('');

  const loadPlanner = async (goalId?: string) => {
    try {
      const allGoals = await api.getGoals();
      setGoals(allGoals);
      const targetId = goalId || selectedGoalId || allGoals[0]?.id;
      if (targetId) {
        setSelectedGoalId(targetId);
        const data = await api.getPlannerData(targetId);
        setPlannerData(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlanner();
  }, []);

  const handleSelectGoal = (id: string) => {
    setSelectedGoalId(id);
    loadPlanner(id);
  };

  const handleTriggerReplan = async () => {
    if (!selectedGoalId) return;
    setLoading(true);
    await api.triggerReplan(selectedGoalId);
    await loadPlanner(selectedGoalId);
  };

  if (loading && !plannerData) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-xs font-mono text-cyan-400 animate-pulse">
          COMPUTING TOPOLOGICAL DEPENDENCY GRAPH...
        </div>
      </div>
    );
  }

  const goal: Goal = plannerData?.goal;
  const tasks: Task[] = plannerData?.tasks || [];
  const schedules: Schedule[] = plannerData?.schedules || [];

  return (
    <div className="space-y-8">
      {/* Header & Goal Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CalendarRange className="w-5 h-5 text-cyan-400" />
            <h1 className="text-2xl font-bold font-mono tracking-tight text-white">EXECUTION PLANNER & GRAPH</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Dependency Ordering, Cognitive Time Allocations, and Dynamic Re-planning Audits
          </p>
        </div>

        <div className="flex items-center gap-3">
          {goals.length > 1 && (
            <select
              value={selectedGoalId}
              onChange={(e) => handleSelectGoal(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              {goals.map(g => (
                <option key={g.id} value={g.id}>{g.title.slice(0, 30)}...</option>
              ))}
            </select>
          )}

          <button
            onClick={handleTriggerReplan}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold font-mono transition-all active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Trigger Adaptation Re-plan</span>
          </button>
        </div>
      </div>

      {/* Goal Summary Card */}
      {goal && (
        <div className="glass-panel p-6 rounded-2xl space-y-3 border-cyan-500/30">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-mono text-cyan-400 font-semibold uppercase tracking-wider">
              Strategic Plan Formulation
            </span>
            <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              Total Re-plans: {goal.replan_count || 1}
            </span>
          </div>
          <h2 className="text-lg font-bold text-white">{goal.title}</h2>
          <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
            {plannerData?.summary || goal.summary || goal.description}
          </p>
        </div>
      )}

      {/* Topological Dependency Chain */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-violet-400" />
          <h3 className="text-xs font-mono font-bold tracking-wider text-white uppercase">Sequential Execution & Dependency Graph</h3>
        </div>

        <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-cyan-500 before:via-violet-500 before:to-emerald-500">
          {tasks.map((task, idx) => (
            <div key={task.id} className="relative group">
              {/* Stepper Node Marker */}
              <div className={`absolute -left-6 top-3 w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-mono font-bold ${
                task.status === 'COMPLETED'
                  ? 'bg-emerald-500 border-emerald-400 text-black'
                  : task.status === 'IN_PROGRESS'
                  ? 'bg-cyan-500 border-cyan-400 text-black animate-pulse'
                  : 'bg-slate-900 border-slate-700 text-slate-400'
              }`}>
                {idx + 1}
              </div>

              {/* Node Card */}
              <div className="glass-panel p-5 rounded-xl ml-4 space-y-2 hover:border-slate-700 transition-all">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={task.status} />
                    <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                      {task.assigned_agent}
                    </span>
                    <PriorityBadge priority={task.priority} />
                  </div>
                  <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {task.estimated_minutes || 45} mins
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {task.title}
                </h4>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {task.description}
                </p>

                {task.dependencies && task.dependencies.length > 0 && (
                  <div className="pt-1 text-[11px] font-mono text-slate-500">
                    Upstream requirement: <span className="text-violet-300">{task.dependencies.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic Schedule & Conflict Panel */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Schedule Allocations */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold tracking-wider text-white uppercase flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              Calendar Time Slots
            </h3>
            <span className="text-xs font-mono text-slate-400">{schedules.length} slots</span>
          </div>

          <div className="space-y-2.5 max-h-80 overflow-y-auto">
            {schedules.length === 0 ? (
              <p className="text-xs text-slate-400 italic">Schedule Agent generated calendar windows are shown above in the dependency graph.</p>
            ) : (
              schedules.map((s, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono space-y-1">
                  <div className="flex justify-between text-slate-400 text-[10px]">
                    <span>SLOT {i + 1}</span>
                    <span className="text-emerald-400">{s.status}</span>
                  </div>
                  <p className="text-slate-200">
                    {new Date(s.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} — {new Date(s.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  {s.reason && <p className="text-slate-400 text-[11px]">{s.reason}</p>}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Adaptation & Conflict Resolution Log */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold tracking-wider text-white uppercase flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Autonomous Conflict Recovery Log
            </h3>
            <span className="text-xs font-mono text-emerald-400">RESOLVED</span>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-amber-900/40 space-y-1.5">
              <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">Anomaly Detected</span>
              <p className="text-xs font-semibold text-white">Calendar Overlap on Critical Milestone</p>
              <p className="text-xs text-slate-400 leading-snug">
                Simulated delay detected in downstream review module. Deadline was threatened by a 4-hour crunch window.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-emerald-900/40 space-y-1.5">
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">Adaptation Applied</span>
              <p className="text-xs font-semibold text-white">Topological Re-allocation Complete</p>
              <p className="text-xs text-slate-300 leading-snug">
                Adaptation Agent shifted non-critical research pass into parallel track and preserved total deliverable deadline with 0% cognitive overload.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
