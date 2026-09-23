import React, { useState } from 'react';
import { BrainCircuit, Search, Calendar, Sliders } from 'lucide-react';
import { PriceForecastChart } from '../components/charts/PriceForecastChart';
import { StockService } from '../services/api';
import { ForecastResponse } from '../types';

export const PredictionPage: React.FC = () => {
  const [ticker, setTicker] = useState('AAPL');
  const [horizon, setHorizon] = useState(5);
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateForecast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticker) return;
    setLoading(true);
    try {
      const data = await StockService.getForecast(ticker.toUpperCase(), horizon);
      setForecast(data);
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
          <BrainCircuit className="w-8 h-8 text-indigo-400" />
          <span>LSTM Prediction Studio</span>
        </h1>
        <p className="text-slate-400 text-sm">Generate multi-horizon time-series forecasts using deep learning</p>
      </div>

      {/* Configuration Controls Form */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800/80">
        <form onSubmit={handleGenerateForecast} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase mb-2">Select Stock Ticker</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={ticker}
                onChange={(e) => setTicker(e.target.value.toUpperCase())}
                placeholder="e.g. AAPL, MSFT, GOOGL..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-800/80 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase mb-2">Forecast Horizon (Days)</label>
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                value={horizon}
                onChange={(e) => setHorizon(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-800/80 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              >
                <option value={3}>3 Trading Days</option>
                <option value={5}>5 Trading Days (1 Week)</option>
                <option value={10}>10 Trading Days (2 Weeks)</option>
                <option value={15}>15 Trading Days</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 border border-indigo-500/30 transition-all"
          >
            {loading ? 'Computing LSTM Window...' : 'Generate Prediction'}
          </button>
        </form>
      </div>

      {forecast && (
        <>
          <PriceForecastChart
            historicalData={forecast.historical_data}
            forecastData={forecast.forecast_data}
            forecastBeginsDate={forecast.forecast_begins_date}
          />

          {/* Forecast Days Sequence Table */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 space-y-4">
            <h3 className="text-base font-bold text-white font-mono">Predicted Price Schedule</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-xs font-mono text-slate-400 uppercase">
                    <th className="py-3 px-4">Day</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Predicted Price</th>
                    <th className="py-3 px-4">Estimated Change</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs font-mono">
                  {forecast.forecast_data.map((pt, idx) => {
                    const change = pt.predicted_price! - forecast.current_price;
                    const changePct = (change / forecast.current_price) * 100;
                    return (
                      <tr key={idx} className="hover:bg-slate-900/50">
                        <td className="py-3 px-4 font-bold text-indigo-400">Day +{pt.day}</td>
                        <td className="py-3 px-4 text-slate-300">{pt.date}</td>
                        <td className="py-3 px-4 font-bold text-white">${pt.predicted_price?.toFixed(2)}</td>
                        <td className={`py-3 px-4 font-semibold ${change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {change >= 0 ? '+' : ''}${change.toFixed(2)} ({changePct.toFixed(2)}%)
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
