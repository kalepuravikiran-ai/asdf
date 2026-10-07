import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Terminal, 
  Bot, 
  CheckSquare, 
  CalendarRange, 
  Activity, 
  Settings, 
  ExternalLink,
  Cpu
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/command-center', label: 'Command Center', icon: Terminal, highlight: true },
    { to: '/agents', label: 'Specialized Agents', icon: Bot },
    { to: '/tasks', label: 'Task Management', icon: CheckSquare },
    { to: '/planner', label: 'Execution Planner', icon: CalendarRange },
    { to: '/activity', label: 'Activity Feed', icon: Activity },
    { to: '/settings', label: 'Settings & Status', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0a0e1a]/95 border-r border-slate-800/80 flex flex-col h-screen fixed left-0 top-0 z-40 backdrop-blur-xl">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-violet-600 flex items-center justify-center p-0.5 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
            <div className="w-full h-full bg-[#07090e] rounded-[10px] flex items-center justify-center">
              <Cpu className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-wider font-mono bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-400 bg-clip-text text-transparent">
                AURA
              </span>
              <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.2 rounded border border-cyan-500/30 font-mono">v1.0</span>
            </div>
            <p className="text-[10px] text-slate-400 tracking-wider uppercase font-mono">Autonomous AI</p>
          </div>
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 py-2 text-[10px] font-mono tracking-widest text-slate-400 uppercase">Core Platform</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/15 to-violet-500/15 text-white border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                } ${item.highlight ? 'font-semibold text-cyan-300' : ''}`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-300'}`} />
                  <span className="flex-1">{item.label}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400 animate-pulse" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Banner */}
      <div className="p-4 border-t border-slate-800/80">
        <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-950/40 to-slate-900 border border-cyan-900/40 text-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-mono text-cyan-400 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              Agent Core Live
            </span>
            <NavLink to="/" className="text-slate-400 hover:text-white" title="Landing Page">
              <ExternalLink className="w-3.5 h-3.5" />
            </NavLink>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Autonomous Multi-Agent Loop: Understand → Plan → Adapt.
          </p>
        </div>
      </div>
    </aside>
  );
};
