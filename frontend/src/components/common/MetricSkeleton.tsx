import React from 'react';

export const MetricSkeleton: React.FC = () => {
  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 space-y-3 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-3 bg-slate-800 rounded w-24" />
        <div className="w-8 h-8 rounded-xl bg-slate-800" />
      </div>
      <div className="h-7 bg-slate-800 rounded w-36" />
      <div className="h-3 bg-slate-800/60 rounded w-28" />
    </div>
  );
};
