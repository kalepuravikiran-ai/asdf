import React, { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { AgentActivity } from '../types/index.js';
import { 
  Activity, 
  Filter, 
  Clock, 
  Bot, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  XCircle,
  Cpu
} from 'lucide-react';

export const ActivityPage: React.FC = () => {
  const [activities, setActivities] = useState<AgentActivity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [agentFilter, setAgentFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const loadActivities = async () => {
    try {
      const data = await api.getActivities(undefined, 100);
      setActivities(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
    const interval = setInterval(loadActivities, 3000);
    return () => clearInterval(interval);
  }, []);

  const filtered = activities.filter((act) => {
    const matchAgent = agentFilter === 'ALL' || act.agent_name === agentFilter;
    const matchStatus = statusFilter === 'ALL' || act.status === statusFilter;
    return matchAgent && matchStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">SUCCESS</span>;
      case 'IN_PROGRESS':
        return <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 animate-pulse">RUNNING</span>;
      case 'WARNING':
        return <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">WARNING</span>;
      case 'REPLANNING':
        return <span className="text-[10px] font-mono text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20">RE-PLAN</span>;
      case 'FAILED':
        return <span className="text-[10px] font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">FAILED</span>;
      default:
        return <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">{status}</span>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-violet-400" />
            <h1 className="text-2xl font-bold font-mono tracking-tight text-white">AGENT ACTIVITY LOG STREAM</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Chronological Audit Trail of Every Agent Thought, Decision, Action, and Re-plan
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
          <span>Live Polling (3s)</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">Filter Agent:</span>
            <select
              value={agentFilter}
              onChange={(e) => setAgentFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">ALL AGENTS</option>
              <option value="Orchestrator Agent">Orchestrator Agent</option>
              <option value="Planning Agent">Planning Agent</option>
              <option value="Research Agent">Research Agent</option>
              <option value="Schedule Agent">Schedule Agent</option>
              <option value="Execution Agent">Execution Agent</option>
              <option value="Verification Agent">Verification Agent</option>
              <option value="Adaptation Agent">Adaptation Agent</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Filter Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">ALL STATUSES</option>
              <option value="SUCCESS">SUCCESS</option>
              <option value="IN_PROGRESS">IN PROGRESS</option>
              <option value="WARNING">WARNING</option>
              <option value="REPLANNING">RE-PLANNING</option>
              <option value="FAILED">FAILED</option>
            </select>
          </div>
        </div>

        <span className="text-xs font-mono text-slate-400">{filtered.length} entries</span>
      </div>

      {/* Activity Timeline List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="glass-panel p-12 rounded-2xl text-center space-y-2">
            <Activity className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">No activity logs found</p>
          </div>
        ) : (
          filtered.map((act) => (
            <div
              key={act.id}
              className="glass-panel p-4 rounded-xl flex items-start justify-between gap-4 hover:border-slate-700 transition-all"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  {getStatusBadge(act.status)}
                  <span className="text-xs font-mono font-bold text-cyan-400">{act.agent_name}</span>
                  <span className="text-xs font-semibold text-white">• {act.action}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
                  {act.message}
                </p>
              </div>

              <div className="text-right text-[11px] font-mono text-slate-400 whitespace-nowrap">
                {new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
