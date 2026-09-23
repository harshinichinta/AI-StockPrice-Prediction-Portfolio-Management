import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeText?: string;
  icon?: LucideIcon;
  subtitle?: string;
  accentColor?: 'indigo' | 'emerald' | 'red' | 'amber' | 'cyan';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeText,
  icon: Icon,
  subtitle,
  accentColor = 'indigo'
}) => {
  const isPositive = change !== undefined ? change >= 0 : true;

  const colorMap = {
    indigo: 'from-indigo-500/10 to-indigo-500/5 text-indigo-400 border-indigo-500/20',
    emerald: 'from-emerald-500/10 to-emerald-500/5 text-emerald-400 border-emerald-500/20',
    red: 'from-red-500/10 to-red-500/5 text-red-400 border-red-500/20',
    amber: 'from-amber-500/10 to-amber-500/5 text-amber-400 border-amber-500/20',
    cyan: 'from-cyan-500/10 to-cyan-500/5 text-cyan-400 border-cyan-500/20',
  };

  return (
    <div className="glass-panel glass-panel-hover p-5 rounded-2xl border border-slate-800/80 space-y-3 relative overflow-hidden">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</span>
        {Icon && (
          <div className={`p-2 rounded-xl bg-gradient-to-br ${colorMap[accentColor]} border`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <span className="text-2xl font-extrabold tracking-tight text-white font-mono">{value}</span>
        
        {change !== undefined && (
          <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold font-mono ${
            isPositive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
          }`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{isPositive ? '+' : ''}{change.toFixed(2)}%</span>
          </div>
        )}
      </div>

      {(subtitle || changeText) && (
        <p className="text-[11px] text-slate-400">{changeText || subtitle}</p>
      )}
    </div>
  );
};
