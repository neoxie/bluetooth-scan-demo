import React from 'react';

interface StatusBadgeProps {
  connected: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ connected }) => {
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
      connected 
        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
        : 'bg-slate-700 text-slate-400 border border-slate-600'
    }`}>
      <span className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
      {connected ? 'Connected' : 'Disconnected'}
    </span>
  );
};
