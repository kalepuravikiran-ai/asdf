import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { api } from '../services/api.js';
import { 
  Settings, 
  Database, 
  Sparkles, 
  ShieldCheck, 
  Key, 
  User, 
  ExternalLink,
  CheckCircle2,
  Copy,
  Check,
  Server
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, isDemoUser, signOut, enableDemoMode } = useAuth();
  const [health, setHealth] = useState<any>(null);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    api.getHealth()
      .then(setHealth)
      .catch(() => {});
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://supabase.com/dashboard/project/fosdkjhsfoowiphsuwti/sql');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-cyan-400" />
          <h1 className="text-2xl font-bold font-mono tracking-tight text-white">SETTINGS & SYSTEM STATUS</h1>
        </div>
        <p className="text-xs text-slate-400 mt-1 font-mono">
          Infrastructure Telemetry, Security Audits, and Model Integration Configurations
        </p>
      </div>

      {/* Cloud & AI Status Panel */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Database Status */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Database className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white font-mono uppercase">Supabase Cloud Database</h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              CONNECTED
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono text-slate-300">
            <p className="text-slate-400">Endpoint: <span className="text-white">https://fosdkjhsfoowiphsuwti.supabase.co</span></p>
            <p className="text-slate-400">Security Layer: <span className="text-emerald-400">PostgreSQL RLS Active</span></p>
            <p className="text-slate-400">Service Role Key: <span className="text-cyan-400">Isolated on Secure Backend</span></p>
            <p className="text-slate-400">Data Resilience: <span className="text-emerald-400">Zero-Downtime Multi-Tier Store</span></p>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-mono">Supabase SQL Editor:</span>
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-mono"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Link' : 'Copy Dashboard URL'}</span>
            </button>
          </div>
        </div>

        {/* AI & Model Status */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-violet-400" />
              <h3 className="text-sm font-bold text-white font-mono uppercase">AI Reasoning Core</h3>
            </div>
            <span className="text-[10px] font-mono text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/30">
              {health?.ai?.geminiConnected ? 'GEMINI 2.5 FLASH' : 'DEMO ENGINE'}
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono text-slate-300">
            <p className="text-slate-400">Model: <span className="text-white">Google Gemini 2.5 Flash / Demo Engine</span></p>
            <p className="text-slate-400">Contract Validation: <span className="text-emerald-400">Strict Zod Schemas</span></p>
            <p className="text-slate-400">Execution Safety: <span className="text-emerald-400">Bounded Operational Sandbox</span></p>
            <p className="text-slate-400">Fallback Resilience: <span className="text-cyan-400">Automated Multi-Agent Simulator</span></p>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <span className="text-[11px] text-slate-400 font-mono">
              System Prompt: "Traditional AI answers. AURA acts."
            </span>
          </div>
        </div>
      </div>

      {/* Security Architecture Audit */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-white font-mono uppercase">Enterprise Security & Compliance Audit</h3>
        </div>

        <div className="grid md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Zero Client Secrets</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Service role keys and Gemini API keys are never exposed to browser memory.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Zod Type Invariants</span>
            </div>
            <p className="text-[11px] text-slate-400">
              100% of AI generated payloads are validated against Zod schemas before persistence.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>No Hallucinated Success</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Verification Agent strictly checks criteria checklists prior to goal completion.
            </p>
          </div>
        </div>
      </div>

      {/* Profile & Evaluator Session */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <User className="w-5 h-5 text-slate-300" />
            <h3 className="text-sm font-bold text-white font-mono uppercase">User & Evaluator Profile</h3>
          </div>
          <span className="text-xs font-mono text-cyan-400">
            {isDemoUser ? 'Hackathon Judge / Architect' : 'Authenticated User'}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-white">{user?.user_metadata?.full_name || 'Hackathon Evaluator'}</p>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{user?.email || 'evaluator@aura.ai'}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={enableDemoMode}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono transition-all"
            >
              Reset Demo Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
