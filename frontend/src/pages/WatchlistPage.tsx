import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Plus, Trash2, ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';
import { WatchlistService } from '../services/api';
import { WatchlistItem } from '../types';

export const WatchlistPage: React.FC = () => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [newTicker, setNewTicker] = useState('');
  const [loading, setLoading] = useState(true);

  const loadWatchlist = async () => {
    setLoading(true);
    try {
      const data = await WatchlistService.getWatchlist();
      setWatchlist(data.watchlist || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWatchlist();
  }, []);

  const handleAddTicker = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicker.trim()) return;
    try {
      await WatchlistService.addTicker(newTicker.trim());
      setNewTicker('');
      loadWatchlist();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveTicker = async (ticker: string) => {
    try {
      await WatchlistService.removeTicker(ticker);
      loadWatchlist();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <Bookmark className="w-8 h-8 text-indigo-400" />
            <span>Watchlist Hub</span>
          </h1>
          <p className="text-slate-400 text-sm">Monitor favorite stock tickers with live quotes and analytical signals</p>
        </div>

        <form onSubmit={handleAddTicker} className="flex gap-2">
          <input
            type="text"
            value={newTicker}
            onChange={(e) => setNewTicker(e.target.value.toUpperCase())}
            placeholder="Add ticker (e.g. NVDA)..."
            className="px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 font-mono w-44"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {watchlist.map((item) => {
          const isUp = item.change >= 0;
          return (
            <div key={item.ticker} className="glass-panel p-5 rounded-2xl border border-slate-800/80 space-y-4 relative group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center font-bold font-mono text-white">
                    {item.ticker}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white font-mono">{item.ticker}</h3>
                    <span className="text-[10px] text-slate-400 font-mono">Added {item.added_at}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleRemoveTicker(item.ticker)}
                  className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
                  title="Remove Ticker"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-baseline justify-between pt-2 border-t border-slate-800/60 font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase">Live Price</span>
                  <p className="text-xl font-extrabold text-white">${item.current_price.toFixed(2)}</p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase">Change</span>
                  <div className={`flex items-center justify-end text-sm font-bold ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                    {isUp ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    <span>{isUp ? '+' : ''}{item.change_percent.toFixed(2)}%</span>
                  </div>
                </div>
              </div>

              <Link
                to={`/stock/${item.ticker}`}
                className="w-full py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white text-xs font-semibold font-mono flex items-center justify-center gap-2 border border-slate-800/80 transition-all"
              >
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>View Full Forecast</span>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};
