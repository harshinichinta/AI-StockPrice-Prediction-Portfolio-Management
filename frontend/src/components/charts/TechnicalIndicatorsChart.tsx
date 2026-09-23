import React from 'react';
import { TechnicalIndicators } from '../../types';

interface TechnicalIndicatorsChartProps {
  indicators: TechnicalIndicators;
}

export const TechnicalIndicatorsChart: React.FC<TechnicalIndicatorsChartProps> = ({ indicators }) => {
  const getRSIColor = (rsi: number) => {
    if (rsi > 70) return 'text-red-400 bg-red-500/10 border-red-500/20';
    if (rsi < 30) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
  };

  const getRSILabel = (rsi: number) => {
    if (rsi > 70) return 'Overbought (> 70)';
    if (rsi < 30) return 'Oversold (< 30)';
    return 'Neutral (30-70)';
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 space-y-6">
      <div>
        <h3 className="text-base font-bold text-white">Technical Indicator Analytics</h3>
        <p className="text-xs text-slate-400">Quantitative features derived from OHLCV market data</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* RSI 14 Card */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
          <span className="text-[11px] font-mono text-slate-400 uppercase">RSI (14) Index</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-white font-mono">{indicators.rsi_14}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${getRSIColor(indicators.rsi_14)}`}>
              {getRSILabel(indicators.rsi_14)}
            </span>
          </div>
          {/* RSI Bar Gauge */}
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${indicators.rsi_14 > 70 ? 'bg-red-500' : (indicators.rsi_14 < 30 ? 'bg-emerald-500' : 'bg-indigo-500')}`}
              style={{ width: `${Math.min(100, Math.max(0, indicators.rsi_14))}%` }}
            />
          </div>
        </div>

        {/* MACD Line & Histogram */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
          <span className="text-[11px] font-mono text-slate-400 uppercase">MACD (12, 26, 9)</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-white font-mono">{indicators.macd}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${indicators.macd_hist >= 0 ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-red-400 bg-red-500/10 border-red-500/20'}`}>
              Hist: {indicators.macd_hist > 0 ? '+' : ''}{indicators.macd_hist}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-mono">Signal Line: {indicators.macd_signal}</p>
        </div>

        {/* SMA 20 vs SMA 50 */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Moving Averages</span>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">SMA 20:</span>
              <span className="text-white font-semibold">${indicators.sma_20}</span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">SMA 50:</span>
              <span className="text-white font-semibold">${indicators.sma_50}</span>
            </div>
          </div>
        </div>

        {/* Bollinger Bands & Volatility */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Bollinger Bands & Volatility</span>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Upper:</span>
              <span className="text-slate-300">${indicators.bb_upper}</span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Lower:</span>
              <span className="text-slate-300">${indicators.bb_lower}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
