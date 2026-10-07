import React from 'react';
import { clsx } from 'clsx';
import { Priority, TaskStatus, GoalStatus, WorkflowStage } from '../../types/index.js';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'violet' | 'emerald' | 'amber' | 'rose' | 'slate';
  className?: string;
  pulse?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'slate',
  className,
  pulse = false,
}) => {
  const variantStyles = {
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    violet: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    slate: 'bg-slate-800/60 text-slate-300 border-slate-700/50',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border tracking-wide uppercase',
        variantStyles[variant],
        className
      )}
    >
      {pulse && (
        <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
      )}
      {children}
    </span>
  );
};

export const StatusBadge: React.FC<{ status: TaskStatus | GoalStatus }> = ({ status }) => {
  switch (status) {
    case 'COMPLETED':
      return <Badge variant="emerald">Completed</Badge>;
    case 'IN_PROGRESS':
    case 'ACTIVE':
      return <Badge variant="cyan" pulse>Active</Badge>;
    case 'REPLANNING':
      return <Badge variant="amber" pulse>Re-Planning</Badge>;
    case 'PENDING':
      return <Badge variant="slate">Pending</Badge>;
    case 'BLOCKED':
      return <Badge variant="amber">Blocked</Badge>;
    case 'FAILED':
      return <Badge variant="rose">Failed</Badge>;
    default:
      return <Badge variant="slate">{status}</Badge>;
  }
};

export const PriorityBadge: React.FC<{ priority: Priority }> = ({ priority }) => {
  switch (priority) {
    case 'CRITICAL':
      return <Badge variant="rose">Critical</Badge>;
    case 'HIGH':
      return <Badge variant="amber">High</Badge>;
    case 'MEDIUM':
      return <Badge variant="cyan">Medium</Badge>;
    case 'LOW':
      return <Badge variant="slate">Low</Badge>;
  }
};

export const StageBadge: React.FC<{ stage: WorkflowStage }> = ({ stage }) => {
  const stageMap: Record<WorkflowStage, { label: string; variant: 'cyan' | 'violet' | 'emerald' | 'amber' | 'rose' | 'slate' }> = {
    UNDERSTAND: { label: '1. Understand', variant: 'cyan' },
    PLAN: { label: '2. Plan', variant: 'violet' },
    DELEGATE: { label: '3. Delegate', variant: 'cyan' },
    EXECUTE: { label: '4. Execute', variant: 'amber' },
    OBSERVE: { label: '5. Observe', variant: 'violet' },
    VERIFY: { label: '6. Verify', variant: 'cyan' },
    ADAPT: { label: '7. Adapt', variant: 'rose' },
    COMPLETE: { label: '8. Complete', variant: 'emerald' },
  };

  const item = stageMap[stage] || { label: stage, variant: 'slate' };
  return <Badge variant={item.variant} pulse={stage !== 'COMPLETE'}>{item.label}</Badge>;
};
