import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: 'cyan' | 'violet' | 'emerald' | 'amber';
  trend?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'cyan',
  trend,
}) => {
  const iconColors = {
    cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    violet: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  };

  return (
    <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-mono tracking-wider text-slate-400 uppercase">{title}</p>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-2xl font-bold font-mono tracking-tight text-white">{value}</h3>
            {trend && <span className="text-xs text-emerald-400 font-mono font-medium">{trend}</span>}
          </div>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl border ${iconColors[color]} transition-transform duration-300 group-hover:scale-110`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};
