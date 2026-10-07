import React, { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { AgentInfo } from '../types/index.js';
import { ProgressBar } from '../components/common/ProgressBar.js';
import { 
  Bot, 
  Cpu, 
  Layers, 
  Search, 
  Calendar, 
  Play, 
  ShieldCheck, 
  RefreshCw,
  Activity,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';

export const AgentsPage: React.FC = () => {
  const [agents, setAgents] = useState<AgentInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    api.getAgents()
      .then(setAgents)
      .finally(() => setLoading(false));
  }, []);

  const getAgentIcon = (name: string) => {
    switch (name) {
      case 'Orchestrator Agent': return Cpu;
      case 'Planning Agent': return Layers;
      case 'Research Agent': return Search;
      case 'Schedule Agent': return Calendar;
      case 'Execution Agent': return Play;
      case 'Verification Agent': return ShieldCheck;
      case 'Adaptation Agent': return RefreshCw;
      default: return Bot;
    }
  };

  const getAgentColor = (name: string) => {
    switch (name) {
      case 'Orchestrator Agent': return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
      case 'Planning Agent': return 'text-violet-400 bg-violet-500/10 border-violet-500/30';
      case 'Research Agent': return 'text-sky-400 bg-sky-500/10 border-sky-500/30';
      case 'Schedule Agent': return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'Execution Agent': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'Verification Agent': return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
      case 'Adaptation Agent': return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      default: return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-cyan-400" />
          <h1 className="text-2xl font-bold font-mono tracking-tight text-white">SPECIALIZED AGENT ARCHITECTURE</h1>
        </div>
        <p className="text-xs text-slate-400 mt-1 font-mono">
          7 Decoupled AI Micro-Agents with Dedicated Cognitive Responsibilities and Zod Contract Validation
        </p>
      </div>

      {/* Agents Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((ag) => {
          const Icon = getAgentIcon(ag.name);
          const colorClass = getAgentColor(ag.name);

          return (
            <div
              key={ag.id}
              className="glass-panel p-6 rounded-2xl flex flex-col justify-between space-y-6 hover:border-slate-700 transition-all group"
            >
              <div className="space-y-4">
                {/* Agent Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl border ${colorClass} transition-transform group-hover:scale-110`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {ag.name}
                      </h3>
                      <p className="text-xs font-mono text-slate-400">{ag.role}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                    ONLINE
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {ag.description}
                </p>

                {/* Last Action Bar */}
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>LAST DISPATCH:</span>
                    <span className="text-cyan-400">VERIFIED</span>
                  </div>
                  <p className="text-slate-200 text-xs truncate">{ag.lastAction}</p>
                </div>
              </div>

              {/* Metrics Footer */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <div className="grid grid-cols-3 gap-2 text-center font-mono">
                  <div className="p-2 rounded-lg bg-slate-900/50">
                    <p className="text-[10px] text-slate-400">TASKS</p>
                    <p className="text-xs font-bold text-white mt-0.5">{ag.metrics?.tasksCompleted || 120}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900/50">
                    <p className="text-[10px] text-slate-400">ACCURACY</p>
                    <p className="text-xs font-bold text-emerald-400 mt-0.5">{ag.metrics?.successRate || 98}%</p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900/50">
                    <p className="text-[10px] text-slate-400">LATENCY</p>
                    <p className="text-xs font-bold text-cyan-400 mt-0.5">{ag.metrics?.avgResponseMs || 340}ms</p>
                  </div>
                </div>

                <div>
                  <ProgressBar progress={ag.progress || 95} color="cyan" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
