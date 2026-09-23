import React, { useState } from 'react';
import { History, Play, AlertCircle } from 'lucide-react';
import { StatCard } from '../components/common/StatCard';
import { BacktestService } from '../services/api';
import { BacktestResult } from '../types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const BacktestPage: React.FC = () => {
  const [ticker, setTicker] = useState('AAPL');
  const [startDate, setStartDate] = useState('2023-01-01');
  const [endDate, setEndDate] = useState('2024-01-01');
  const [capital, setCapital] = useState(10000);
  const [result, setResult] = useState<BacktestResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRunBacktest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await BacktestService.runSimulation({
        ticker,
        start_date: startDate,
        end_date: endDate,
        initial_capital: capital
      });
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
          <History className="w-8 h-8 text-cyan-400" />
          <span>Historical Strategy Simulation</span>
        </h1>
        <p className="text-slate-400 text-sm">Simulate quantitative technical strategy performance without look-ahead bias</p>
      </div>

      {/* Prominent Historical Disclaimer Banner */}
      <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono flex items-center gap-3">
        <AlertCircle className="w-5 h-5 shrink-0 text-indigo-400" />
        <span>Historical Simulation — Past simulation results do not guarantee future stock market performance.</span>
      </div>

      {/* Controls Form */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800/80">
        <form onSubmit={handleRunBacktest} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end text-xs font-mono">
          <div>
            <label className="block text-slate-400 uppercase mb-2">Ticker</label>
            <input
              type="text"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-400 uppercase mb-2">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-400 uppercase mb-2">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-400 uppercase mb-2">Initial Capital ($)</label>
            <input
              type="number"
              value={capital}
              onChange={(e) => setCapital(Number(e.target.value))}
              className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 border border-indigo-500/30 transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{loading ? 'Running Simulation...' : 'Run Backtest'}</span>
          </button>
        </form>
      </div>

      {result && (
        <>
          {/* Results Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Final Portfolio Value"
              value={`$${result.final_value.toLocaleString()}`}
              change={result.total_return_percent}
              changeText="Strategy Return vs Initial Capital"
              accentColor="indigo"
            />
            <StatCard
              title="Strategy Return"
              value={`${result.total_return_percent.toFixed(2)}%`}
              change={result.total_return_percent}
              accentColor={result.total_return_percent >= 0 ? 'emerald' : 'red'}
            />
            <StatCard
              title="Benchmark Buy & Hold"
              value={`${result.benchmark_return_percent.toFixed(2)}%`}
              subtitle="Buy-and-Hold return over window"
              accentColor="cyan"
            />
            <StatCard
              title="Max Drawdown"
              value={`${result.max_drawdown_percent.toFixed(2)}%`}
              subtitle="Largest historical decline"
              accentColor="red"
            />
          </div>

          {/* Equity Curve Chart */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 space-y-4">
            <h3 className="text-base font-bold text-white font-mono">Simulation Equity Curve</h3>
            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={result.equity_curve} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="backtestGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                  <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontFamily: 'JetBrains Mono'
                    }}
                    formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Portfolio Valuation']}
                  />
                  <Area type="monotone" dataKey="portfolio_value" stroke="#6366F1" strokeWidth={2.5} fill="url(#backtestGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Trade History Log Table */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 space-y-4">
            <h3 className="text-base font-bold text-white font-mono">Simulated Trade History</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-xs font-mono text-slate-400 uppercase">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Shares</th>
                    <th className="py-3 px-4">Portfolio Valuation</th>
                    <th className="py-3 px-4">Rule Explanation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs font-mono">
                  {result.trades.map((t, i) => (
                    <tr key={i} className="hover:bg-slate-900/50">
                      <td className="py-3 px-4 text-slate-300">{t.date}</td>
                      <td className="py-3 px-4 font-bold">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${t.type === 'BUY' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                          {t.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-white font-bold">${t.price.toFixed(2)}</td>
                      <td className="py-3 px-4 text-slate-300">{t.shares.toFixed(2)}</td>
                      <td className="py-3 px-4 text-white font-bold">${t.portfolio_value.toLocaleString()}</td>
                      <td className="py-3 px-4 text-slate-400 text-[11px]">{t.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
