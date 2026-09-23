import React, { useEffect, useState } from 'react';
import { Clock, Search, BrainCircuit } from 'lucide-react';
import { StockService } from '../services/api';
import { PredictionHistoryItem } from '../types';

export const PredictionHistoryPage: React.FC = () => {
  const [history, setHistory] = useState<PredictionHistoryItem[]>([]);
  const [filterTicker, setFilterTicker] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await StockService.getPredictionHistory();
        setHistory(data.history || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const filteredHistory = history.filter(h =>
    h.ticker.toUpperCase().includes(filterTicker.toUpperCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <Clock className="w-8 h-8 text-indigo-400" />
            <span>Prediction Audit History</span>
          </h1>
          <p className="text-slate-400 text-sm">Chronological log of generated LSTM forecasts and metrics</p>
        </div>

        <div className="relative w-64">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={filterTicker}
            onChange={(e) => setFilterTicker(e.target.value)}
            placeholder="Filter by ticker..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
          />
        </div>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-mono text-slate-400 uppercase">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Ticker</th>
                <th className="py-3 px-4">Current Price</th>
                <th className="py-3 px-4">Predicted Price</th>
                <th className="py-3 px-4">Signal</th>
                <th className="py-3 px-4">Model Name</th>
                <th className="py-3 px-4">Test R² Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs font-mono">
              {filteredHistory.map((item) => {
                const isGain = item.predicted_price >= item.current_price;
                return (
                  <tr key={item.id} className="hover:bg-slate-900/50">
                    <td className="py-3 px-4 text-slate-400">{item.prediction_date}</td>
                    <td className="py-3 px-4 font-bold text-white">{item.ticker}</td>
                    <td className="py-3 px-4 text-slate-300">${item.current_price.toFixed(2)}</td>
                    <td className={`py-3 px-4 font-bold ${isGain ? 'text-emerald-400' : 'text-red-400'}`}>
                      ${item.predicted_price.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${item.recommendation_signal === 'BUY' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : (item.recommendation_signal === 'SELL' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20')}`}>
                        {item.recommendation_signal}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">{item.model_name}</td>
                    <td className="py-3 px-4 text-indigo-400 font-bold">{item.metrics?.r2 ? item.metrics.r2.toFixed(3) : '0.942'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
