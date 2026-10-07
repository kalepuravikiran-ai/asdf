import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Cpu, 
  Bot, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  RefreshCw, 
  Layers, 
  GitBranch, 
  Clock, 
  Database,
  Terminal,
  Play
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const agents = [
    { name: 'Orchestrator Agent', role: 'Strategic Intelligence', desc: 'Ingests high-level objectives, builds top-level roadmaps, and conducts final verification.', color: 'from-cyan-500 to-blue-500' },
    { name: 'Planning Agent', role: 'Topology Decomposition', desc: 'Breaks complex goals into subtasks, identifies dependencies, and orders execution.', color: 'from-violet-500 to-indigo-500' },
    { name: 'Research Agent', role: 'Empirical Synthesis', desc: 'Retrieves verified benchmark citations and synthesizes empirical knowledge.', color: 'from-sky-500 to-cyan-500' },
    { name: 'Schedule Agent', role: 'Calendar & Capacity', desc: 'Maps deadlines, allocates cognitive slots, and proactively resolves calendar conflicts.', color: 'from-amber-500 to-yellow-500' },
    { name: 'Execution Agent', role: 'Deterministic Action', desc: 'Runs permitted operations, simulates tool interfaces, and creates verifiable deliverables.', color: 'from-emerald-500 to-teal-500' },
    { name: 'Verification Agent', role: 'Rigorous Quality Audit', desc: 'Validates criteria checklists, audits artifacts, and computes readiness confidence scores.', color: 'from-purple-500 to-pink-500' },
    { name: 'Adaptation Agent', role: 'Dynamic Re-planning', desc: 'Detects snags and delays, recalculates paths, and recovers the target schedule autonomously.', color: 'from-rose-500 to-red-500' },
  ];

  const workflowSteps = [
    { title: 'Understand', desc: 'Decomposes intent & constraints', icon: Cpu, stage: '01' },
    { title: 'Plan', desc: 'Structures subtask dependencies', icon: Layers, stage: '02' },
    { title: 'Delegate', desc: 'Assigns specialized agents', icon: Bot, stage: '03' },
    { title: 'Execute', desc: 'Operates tools & creates artifacts', icon: Terminal, stage: '04' },
    { title: 'Observe', desc: 'Monitors timeline & bottlenecks', icon: Clock, stage: '05' },
    { title: 'Verify', desc: 'Audits deliverables against criteria', icon: ShieldCheck, stage: '06' },
    { title: 'Adapt', desc: 'Re-plans dynamically upon anomalies', icon: RefreshCw, stage: '07' },
  ];

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 selection:bg-cyan-500 selection:text-black">
      {/* Navigation */}
      <nav className="border-b border-slate-800/80 bg-[#07090e]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-violet-600 flex items-center justify-center p-0.5 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-[#07090e] rounded-[10px] flex items-center justify-center">
                <Cpu className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-2xl tracking-wider font-mono bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-400 bg-clip-text text-transparent">
                  AURA
                </span>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30 font-mono">AUTONOMOUS</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-sm font-medium text-slate-300 hover:text-white px-4 py-2 transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate('/command-center')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white text-sm font-semibold shadow-lg shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95"
            >
              <span>Launch Command Center</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-6 overflow-hidden">
        {/* Neon Glow Accents */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-cyan-500/15 via-violet-500/15 to-transparent blur-3xl pointer-events-none rounded-full" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 shadow-inner text-xs font-mono text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            AGENTIC AI & INTELLIGENT SYSTEMS PLATFORM
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
            Traditional AI answers.{' '}
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-400 bg-clip-text text-transparent">
              AURA acts.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            AURA is an autonomous multi-agent AI system that transforms high-level natural language goals into adaptive, verifiable, and executable workflows.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <button
              onClick={() => navigate('/command-center')}
              className="flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-bold text-base shadow-xl shadow-cyan-500/30 transition-all hover:scale-105 active:scale-95"
            >
              <Terminal className="w-5 h-5" />
              <span>Enter Command Center</span>
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-3 px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-semibold text-base transition-all hover:scale-105 active:scale-95"
            >
              <Play className="w-4 h-4 text-cyan-400" />
              <span>Explore Live Dashboard</span>
            </button>
          </div>

          {/* Quick Pillars */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <p className="text-xs font-mono text-cyan-400 font-semibold">01 / ARCHITECTURE</p>
              <p className="text-sm font-semibold text-white mt-1">7 Specialized Agents</p>
              <p className="text-xs text-slate-400 mt-0.5">Orchestrator to Adaptation</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <p className="text-xs font-mono text-violet-400 font-semibold">02 / RESILIENCE</p>
              <p className="text-sm font-semibold text-white mt-1">Autonomous Feedback Loop</p>
              <p className="text-xs text-slate-400 mt-0.5">Understands, Verifies & Re-plans</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <p className="text-xs font-mono text-emerald-400 font-semibold">03 / VERIFICATION</p>
              <p className="text-sm font-semibold text-white mt-1">Zero Blind Completion</p>
              <p className="text-xs text-slate-400 mt-0.5">Audits Criteria & Artifacts</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <p className="text-xs font-mono text-amber-400 font-semibold">04 / FAIL-SAFE</p>
              <p className="text-sm font-semibold text-white mt-1">Gemini & Demo Engine</p>
              <p className="text-xs text-slate-400 mt-0.5">100% Hackathon Ready</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Core Paradigm Shift: Traditional AI vs AURA */}
      <section className="py-20 px-6 border-t border-slate-800/80 bg-[#0a0e1a]/60">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase">The Paradigm Shift</span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Why Traditional AI Is Not An Agentic System
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm">
              Standard chatbots answer isolated prompts without taking responsibility for outcome execution or adapting when real-world conditions shift.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Traditional AI Box */}
            <div className="p-8 rounded-2xl bg-slate-950/80 border border-rose-900/30 space-y-6 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-rose-400 font-semibold uppercase tracking-wider">Traditional AI Paradigm</span>
                <span className="text-xs bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded border border-rose-500/30">Passive Chatbot</span>
              </div>
              <h3 className="text-xl font-bold text-slate-200">User Prompt → Static Answer</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                You ask a question, the model responds with text, and leaves you to coordinate everything manually. If a deadline shifts or a step fails, you have to start over.
              </p>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-slate-400 space-y-2">
                <p className="text-slate-500">USER: "I have exams next week and project deadlines."</p>
                <p className="text-rose-300">AI: "Here are 5 tips for time management: 1. Make a timetable..."</p>
                <p className="text-slate-500 italic">Result: 0 tasks created, 0 execution, 0 adaptability.</p>
              </div>
            </div>

            {/* AURA Box */}
            <div className="p-8 rounded-2xl bg-slate-950/80 border border-cyan-500/40 shadow-xl shadow-cyan-500/10 space-y-6 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-cyan-400 font-semibold uppercase tracking-wider">AURA Agentic System</span>
                <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/40">Autonomous Matrix</span>
              </div>
              <h3 className="text-xl font-bold text-white">User Goal → Autonomous Multi-Agent Loop</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                AURA ingests your goal, decomposes dependencies, coordinates 7 specialized agents, executes subtasks, verifies outcomes, and automatically re-plans when anomalies occur.
              </p>
              <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-800/40 font-mono text-xs text-cyan-300 space-y-2">
                <p className="text-slate-400">USER: "I have exams next week and project deadlines."</p>
                <p className="text-cyan-300">AURA: "Ingested goal. 5 subtasks scheduled. Overlap detected on Thursday. Adaptation Agent auto-rescheduled study sprint. Verification passed (98%)."</p>
                <p className="text-emerald-400 font-semibold">Result: 100% completed, monitored, verified, and adaptive.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Autonomous Feedback Loop Diagram */}
      <section className="py-20 px-6 border-t border-slate-800/80">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono tracking-widest text-violet-400 uppercase">Closed-Loop Autonomous Engine</span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              The Autonomous Feedback Loop
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm">
              Every execution cycle is fully represented in application state and persists through all 8 stages.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {workflowSteps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.stage} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">{step.stage}</span>
                      <Icon className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1">{step.title}</h4>
                    <p className="text-xs text-slate-400 leading-snug">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Multi-Agent Architecture Grid */}
      <section className="py-20 px-6 border-t border-slate-800/80 bg-[#0a0e1a]/60">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase">Coordinated Specialization</span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              7 Specialized Intelligent Agents
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm">
              Rather than relying on an amorphous single prompt, AURA distributes cognitive roles across purpose-built agent personas with strict Zod contracts.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((ag) => (
              <div key={ag.name} className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${ag.color}`} />
                  <span className="text-xs font-mono text-slate-400">{ag.role}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{ag.name}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{ag.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA Banner */}
          <div className="p-8 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-violet-950/60 border border-cyan-500/30 text-center space-y-6">
            <h3 className="text-2xl font-bold text-white">Experience AURA in Action</h3>
            <p className="text-sm text-slate-300 max-w-xl mx-auto">
              Test with our pre-configured Hackathon scenario or enter your own real-world goal.
            </p>
            <button
              onClick={() => navigate('/command-center')}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all hover:scale-105"
            >
              Launch Hackathon Command Center
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-slate-800 text-center text-xs font-mono text-slate-400">
        <p>AURA — Autonomous Unified Reasoning Agent | Powered by Gemini & Supabase Cloud</p>
      </footer>
    </div>
  );
};
