import React from 'react';

interface ProgressBarProps {
  progress: number;
  height?: string;
  showText?: boolean;
  color?: 'cyan' | 'violet' | 'emerald' | 'amber';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 'h-2',
  showText = false,
  color = 'cyan',
}) => {
  const clamped = Math.max(0, Math.min(100, Math.round(progress)));

  const colorStyles = {
    cyan: 'from-cyan-500 to-blue-500 shadow-cyan-500/20',
    violet: 'from-violet-500 to-purple-500 shadow-violet-500/20',
    emerald: 'from-emerald-500 to-teal-500 shadow-emerald-500/20',
    amber: 'from-amber-500 to-orange-500 shadow-amber-500/20',
  };

  return (
    <div className="w-full">
      {showText && (
        <div className="flex justify-between items-center text-xs mb-1 font-mono text-slate-400">
          <span>PROGRESS</span>
          <span className="text-white font-semibold">{clamped}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-800/80 rounded-full overflow-hidden ${height} border border-slate-700/50 p-0.5`}>
        <div
          className={`h-full rounded-full bg-gradient-to-r ${colorStyles[color]} shadow-lg transition-all duration-500 ease-out`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
