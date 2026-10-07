import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import { api } from '../../services/api.js';
import { ShieldCheck, Sparkles, Database, Terminal, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Topbar: React.FC = () => {
  const { user, isDemoUser } = useAuth();
  const navigate = useNavigate();
  const [health, setHealth] = useState<any>(null);

  useEffect(() => {
    api.getHealth()
      .then(setHealth)
      .catch(() => {});
  }, []);

  return (
    <header className="h-16 border-b border-slate-800/80 bg-[#07090e]/80 backdrop-blur-xl sticky top-0 z-30 flex items-center justify-between px-8">
      {/* Left: Quick Breadcrumb / Motto */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="text-cyan-400 font-semibold tracking-wider">AURA ENGINE</span>
          <span>/</span>
          <span className="text-slate-300">Autonomous Reasoning Matrix</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-mono text-slate-300 text-[11px]">TRADITIONAL AI ANSWERS. AURA ACTS.</span>
        </div>
      </div>

      {/* Right: Status Indicators & Quick Actions */}
      <div className="flex items-center gap-3">
        {/* Supabase Status Pill */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-300">
          <Database className="w-3.5 h-3.5 text-emerald-400" />
          <span>Supabase Cloud</span>
        </div>

        {/* Gemini / AI Engine Pill */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          <span>{health?.ai?.geminiConnected ? 'Gemini 2.5 Flash' : 'Demo Engine Active'}</span>
        </div>

        {/* Quick Launch Button */}
        <button
          onClick={() => navigate('/command-center')}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white text-xs font-semibold shadow-md shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Launch Goal</span>
        </button>

        {/* User Badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-mono text-xs font-bold">
            <UserIcon className="w-4 h-4" />
          </div>
          <div className="hidden lg:block text-left text-xs">
            <p className="font-semibold text-slate-200 leading-tight">
              {user?.user_metadata?.full_name || 'Architect'}
            </p>
            <p className="text-[10px] text-slate-400 font-mono">
              {isDemoUser ? 'Judge Mode' : 'Authenticated'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
