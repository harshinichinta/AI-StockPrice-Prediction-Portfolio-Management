import React, { useEffect, useState } from 'react';
import { ShieldAlert, Activity, PieChart, Info, AlertTriangle } from 'lucide-react';
import { StatCard } from '../components/common/StatCard';
import { PortfolioService } from '../services/api';
import { RiskSummary } from '../types';

export const RiskPage: React.FC = () => {
  const [risk, setRisk] = useState<RiskSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRisk = async () => {
      try {
        const data = await PortfolioService.getRiskAnalysis();
        setRisk(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRisk();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-amber-400" />
            <span>Portfolio Risk Analytics</span>
          </h1>
          <p className="text-slate-400 text-sm">Statistical volatility, risk-adjusted returns, and max drawdown evaluation</p>
        </div>

        {risk && (
          <div className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono font-bold self-start">
            Assessment: {risk.risk_level}
          </div>
        )}
      </div>

      {/* Risk Metrics Cards */}
      {risk && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Annualized Volatility"
            value={`${risk.annualized_volatility}%`}
            subtitle="Price standard deviation"
            icon={Activity}
            accentColor="amber"
          />
          <StatCard
            title="Sharpe Ratio"
            value={risk.sharpe_ratio}
            subtitle="Risk-adjusted return benchmark"
            icon={ShieldAlert}
            accentColor="indigo"
          />
          <StatCard
            title="Maximum Drawdown"
            value={`${risk.max_drawdown_percent}%`}
            subtitle="Peak-to-trough historical drop"
            icon={AlertTriangle}
            accentColor="red"
          />
          <StatCard
            title="Concentration HHI"
            value={risk.concentration_hhi}
            subtitle="Asset concentration score"
            icon={PieChart}
            accentColor="cyan"
          />
        </div>
      )}

      {/* Metric Explanations */}
      {risk && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2 font-mono">
            <Info className="w-4 h-4 text-indigo-400" />
            <span>Quantitative Metric Explanations</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1">
              <span className="text-xs font-bold text-white font-mono">Annualized Volatility ({risk.annualized_volatility}%)</span>
              <p className="text-xs text-slate-400 leading-relaxed">{risk.explanations.volatility}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1">
              <span className="text-xs font-bold text-white font-mono">Sharpe Ratio ({risk.sharpe_ratio})</span>
              <p className="text-xs text-slate-400 leading-relaxed">{risk.explanations.sharpe_ratio}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1">
              <span className="text-xs font-bold text-white font-mono">Maximum Drawdown ({risk.max_drawdown_percent}%)</span>
              <p className="text-xs text-slate-400 leading-relaxed">{risk.explanations.max_drawdown}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1">
              <span className="text-xs font-bold text-white font-mono">Concentration HHI ({risk.concentration_hhi})</span>
              <p className="text-xs text-slate-400 leading-relaxed">{risk.explanations.concentration}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
