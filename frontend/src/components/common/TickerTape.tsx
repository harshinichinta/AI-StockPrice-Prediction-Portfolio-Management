import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const TickerTape: React.FC = () => {
  const tickers = [
    { symbol: 'AAPL', price: 189.45, change: 1.85, changePct: 0.99 },
    { symbol: 'MSFT', price: 420.10, change: 3.50, changePct: 0.84 },
    { symbol: 'GOOGL', price: 175.30, change: -0.90, changePct: -0.51 },
    { symbol: 'AMZN', price: 182.50, change: 2.10, changePct: 1.16 },
    { symbol: 'TSLA', price: 245.80, change: -4.20, changePct: -1.68 },
    { symbol: 'NVDA', price: 130.20, change: 4.80, changePct: 3.83 },
    { symbol: 'META', price: 505.60, change: 6.30, changePct: 1.26 },
  ];

  return (
    <div className="w-full bg-slate-950/90 border-b border-slate-800/80 py-2 px-4 overflow-hidden flex items-center font-mono text-xs select-none">
      <div className="flex items-center gap-2 pr-4 border-r border-slate-800 text-indigo-400 font-bold shrink-0">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        <span>LIVE TICKER</span>
      </div>

      <div className="flex items-center gap-8 overflow-x-auto no-scrollbar pl-4 text-slate-300">
        {tickers.map((t) => {
          const isUp = t.change >= 0;
          return (
            <div key={t.symbol} className="flex items-center gap-2 shrink-0">
              <span className="font-bold text-white">{t.symbol}</span>
              <span>${t.price.toFixed(2)}</span>
              <span className={`flex items-center text-[11px] font-semibold ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {isUp ? '+' : ''}{t.changePct.toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
