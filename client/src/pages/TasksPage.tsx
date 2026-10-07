import React, { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { Task, TaskStatus, Priority } from '../types/index.js';
import { StatusBadge, PriorityBadge } from '../components/common/Badge.js';
import { 
  CheckSquare, 
  Search, 
  Filter, 
  Clock, 
  Bot, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  Trash2
} from 'lucide-react';

export const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');

  const loadTasks = async () => {
    try {
      const data = await api.getTasks();
      setTasks(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleToggleStatus = async (task: Task) => {
    const nextStatus: TaskStatus = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    await api.updateTask(task.id, { status: nextStatus });
    loadTasks();
  };

  const filteredTasks = tasks.filter((t) => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;
    return matchSearch && matchStatus && matchPriority;
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-cyan-400" />
            <h1 className="text-2xl font-bold font-mono tracking-tight text-white">TASK MANAGEMENT REPOSITORY</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Granular Subtask Tracking, Dependency Enforcement, and Execution States
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
            {filteredTasks.length} tasks matched
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        {/* Search Input */}
        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-xl px-3.5 py-2 w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search subtasks..."
            className="bg-transparent text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none w-full"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">ALL STATUSES</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="IN_PROGRESS">IN PROGRESS</option>
              <option value="PENDING">PENDING</option>
              <option value="FAILED">FAILED</option>
              <option value="BLOCKED">BLOCKED</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">ALL PRIORITIES</option>
              <option value="CRITICAL">CRITICAL</option>
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="LOW">LOW</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="glass-panel p-12 rounded-2xl text-center space-y-3">
            <CheckSquare className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">No subtasks matching your criteria</p>
            <p className="text-xs text-slate-500">Launch a new goal from the Command Center to generate a task roadmap.</p>
          </div>
        ) : (
          filteredTasks.map((t) => (
            <div
              key={t.id}
              className="glass-panel p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-700 transition-all group"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <StatusBadge status={t.status} />
                  <PriorityBadge priority={t.priority} />
                  <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/80 px-2 py-0.5 rounded">
                    {t.assigned_agent}
                  </span>
                  {t.estimated_minutes && (
                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {t.estimated_minutes}m est
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {t.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
                  {t.description}
                </p>

                {t.dependencies && t.dependencies.length > 0 && (
                  <div className="flex items-center gap-2 pt-1 text-[11px] font-mono text-slate-500">
                    <span>Dependencies:</span>
                    <span className="text-slate-400 truncate max-w-md">{t.dependencies.join(', ')}</span>
                  </div>
                )}
              </div>

              {/* Action */}
              <div className="flex items-center gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-slate-800">
                <button
                  onClick={() => handleToggleStatus(t)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-mono border transition-all ${
                    t.status === 'COMPLETED'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-cyan-500 hover:text-white'
                  }`}
                >
                  {t.status === 'COMPLETED' ? 'Mark Pending' : 'Mark Completed'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
