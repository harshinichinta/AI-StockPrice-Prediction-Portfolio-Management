import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, TrendingUp, Briefcase, Bookmark, BrainCircuit, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { StatCard } from '../components/common/StatCard';
import { MetricSkeleton } from '../components/common/MetricSkeleton';
import { PortfolioValueChart } from '../components/charts/PortfolioValueChart';
import { PortfolioService, WatchlistService, StockService } from '../services/api';
import { PortfolioPerformance, WatchlistItem, PredictionHistoryItem } from '../types';
import { useAuth } from '../contexts/AuthContext';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [performance, setPerformance] = useState<PortfolioPerformance | null>(null);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [recentPredictions, setRecentPredictions] = useState<PredictionHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const perfData = await PortfolioService.getPerformance();
        setPerformance(perfData);

        const watchData = await WatchlistService.getWatchlist();
        setWatchlist(watchData.watchlist || []);

        const predData = await StockService.getPredictionHistory();
        setRecentPredictions(predData.history?.slice(0, 5) || []);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header Greeting */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Welcome back, <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">{user?.name || 'Investor'}</span>
        </h1>
        <p className="text-slate-400 text-sm">Your intelligent market overview and portfolio analytics</p>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <>
            <MetricSkeleton />
            <MetricSkeleton />
            <MetricSkeleton />
            <MetricSkeleton />
          </>
        ) : (
          <>
            <StatCard
              title="Portfolio Valuation"
              value={`$${(performance?.total_current_value || 0).toLocaleString()}`}
              change={performance?.total_return_percent}
              changeText="Total net performance return"
              icon={DollarSign}
              accentColor="indigo"
            />
            <StatCard
              title="Today's Return"
              value={`$${(performance?.daily_change_dollars || 0).toLocaleString()}`}
              change={performance?.daily_change_percent}
              changeText="24-hour portfolio change"
              icon={TrendingUp}
              accentColor={performance && performance.daily_change_dollars >= 0 ? 'emerald' : 'red'}
            />
            <StatCard
              title="Net Profit / Loss"
              value={`$${(performance?.total_profit_loss || 0).toLocaleString()}`}
              change={performance?.total_return_percent}
              changeText="Invested vs current valuation"
              icon={Briefcase}
              accentColor={performance && performance.total_profit_loss >= 0 ? 'emerald' : 'red'}
            />
            <StatCard
              title="Active Holdings"
              value={performance?.holdings.length || 0}
              subtitle="Monitored stock positions"
              icon={Bookmark}
              accentColor="cyan"
            />
          </>
        )}
      </div>

      {/* Portfolio Performance Chart */}
      {performance && (
        <PortfolioValueChart
          currentValue={performance.total_current_value}
          investedValue={performance.total_invested}
        />
      )}

      {/* Watchlist & Predictions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Watchlist Summary Card */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-indigo-400" />
              <span>Monitored Watchlist</span>
            </h3>
            <Link to="/watchlist" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold font-mono">
              View All →
            </Link>
          </div>

          <div className="space-y-2">
            {watchlist.slice(0, 4).map((item) => {
              const isUp = item.change >= 0;
              return (
                <Link
                  key={item.ticker}
                  to={`/stock/${item.ticker}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 hover:bg-slate-900/90 border border-slate-800/60 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center font-bold font-mono text-white text-xs group-hover:border-indigo-500/50">
                      {item.ticker}
                    </div>
                    <div>
                      <span className="font-bold text-sm text-white group-hover:text-indigo-300">{item.ticker}</span>
                      <p className="text-[10px] text-slate-400 font-mono">Added {item.added_at}</p>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <span className="font-bold text-sm text-white">${item.current_price.toFixed(2)}</span>
                    <div className={`flex items-center justify-end text-xs font-semibold ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                      {isUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                      <span>{isUp ? '+' : ''}{item.change_percent.toFixed(2)}%</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent LSTM Predictions Summary */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-emerald-400" />
              <span>Recent LSTM Forecasts</span>
            </h3>
            <Link to="/history" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold font-mono">
              View History →
            </Link>
          </div>

          <div className="space-y-2">
            {recentPredictions.slice(0, 4).map((p) => {
              const signalColor = p.recommendation_signal === 'BUY' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : (p.recommendation_signal === 'SELL' ? 'text-red-400 bg-red-500/10 border-red-500/20' : 'text-amber-400 bg-amber-500/10 border-amber-500/20');
              return (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800/60 font-mono text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm text-white">{p.ticker}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${signalColor}`}>
                      {p.recommendation_signal}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-slate-400">Curr: ${p.current_price.toFixed(2)} → </span>
                    <span className="font-bold text-white">Pred: ${p.predicted_price.toFixed(2)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
