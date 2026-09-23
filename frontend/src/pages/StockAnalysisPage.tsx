import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, BrainCircuit, TrendingUp, ShieldAlert, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { PriceForecastChart } from '../components/charts/PriceForecastChart';
import { TechnicalIndicatorsChart } from '../components/charts/TechnicalIndicatorsChart';
import { MetricSkeleton } from '../components/common/MetricSkeleton';
import { StockService } from '../services/api';
import { ForecastResponse, RecommendationResponse, TechnicalIndicators } from '../types';

export const StockAnalysisPage: React.FC = () => {
  const { ticker: paramTicker } = useParams<{ ticker: string }>();
  const navigate = useNavigate();
  const ticker = (paramTicker || 'AAPL').toUpperCase();

  const [inputTicker, setInputTicker] = useState(ticker);
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [recommendation, setRecommendation] = useState<RecommendationResponse | null>(null);
  const [indicators, setIndicators] = useState<TechnicalIndicators | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStockAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const [forecastData, recData, indData] = await Promise.all([
        StockService.getForecast(ticker, 5),
        StockService.getRecommendation(ticker, 5),
        StockService.getIndicators(ticker)
      ]);

      setForecast(forecastData);
      setRecommendation(recData);
      setIndicators(indData);
    } catch (err: any) {
      if (err.message === 'Network Error' || err.code === 'ERR_NETWORK' || !err.response) {
        setError("FastAPI Backend Server is offline. Please start uvicorn in your terminal: `python -m uvicorn backend.app.main:app --reload --port 8000`");
      } else {
        setError(err.response?.data?.detail || `Failed to load market data for ticker ${ticker}. Please check connection.`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockAnalysis();
  }, [ticker]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputTicker.trim()) {
      navigate(`/stock/${inputTicker.trim().toUpperCase()}`);
    }
  };

  const getSignalBadge = (sig: string) => {
    if (sig === 'BUY') return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    if (sig === 'SELL') return 'bg-red-500/10 text-red-400 border-red-500/20';
    return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  };

  return (
    <div className="space-y-8">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <span>{ticker} Analytics Hub</span>
            <span className="text-xs px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono">
              LSTM Model Active
            </span>
          </h1>
          <p className="text-slate-400 text-sm">Real-time stock price forecasting, technical indicators, and signal evaluation</p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={inputTicker}
              onChange={(e) => setInputTicker(e.target.value)}
              placeholder="Search ticker..."
              className="pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-800/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono w-48"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors"
          >
            Analyze
          </button>
        </form>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center justify-between gap-3 font-mono">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchStockAnalysis}
            className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-xs font-semibold flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricSkeleton />
          <MetricSkeleton />
          <MetricSkeleton />
          <MetricSkeleton />
        </div>
      ) : forecast ? (
        <>
          {/* Top Key Metrics Header Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 space-y-1">
              <span className="text-xs text-slate-400 uppercase font-mono">Current Market Price</span>
              <p className="text-2xl font-extrabold text-white font-mono">${forecast.current_price.toFixed(2)}</p>
              <span className="text-xs text-slate-400">Live Quote</span>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 space-y-1">
              <span className="text-xs text-slate-400 uppercase font-mono">LSTM Predicted Price</span>
              <p className="text-2xl font-extrabold text-indigo-400 font-mono">${forecast.predicted_price.toFixed(2)}</p>
              <span className={`text-xs font-semibold font-mono ${forecast.price_change_percent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {forecast.price_change_percent >= 0 ? '+' : ''}{forecast.price_change_percent.toFixed(2)}% (5-Day Horizon)
              </span>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 space-y-1">
              <span className="text-xs text-slate-400 uppercase font-mono">Analytical Signal</span>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-lg text-lg font-extrabold border font-mono ${getSignalBadge(recommendation?.signal || 'HOLD')}`}>
                  {recommendation?.signal || 'HOLD'}
                </span>
              </div>
              <span className="text-xs text-slate-400">Rule-Based Signal</span>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 space-y-1">
              <span className="text-xs text-slate-400 uppercase font-mono">Model Test R² Score</span>
              <p className="text-2xl font-extrabold text-cyan-400 font-mono">{forecast.metrics.r2.toFixed(3)}</p>
              <span className="text-xs text-slate-400 font-mono">MAE: ${forecast.metrics.mae.toFixed(2)}</span>
            </div>
          </div>

          {/* Main Price & LSTM Forecast Chart */}
          <PriceForecastChart
            historicalData={forecast.historical_data}
            forecastData={forecast.forecast_data}
            forecastBeginsDate={forecast.forecast_begins_date}
          />

          {/* Technical Indicators Panel */}
          {indicators && <TechnicalIndicatorsChart indicators={indicators} />}

          {/* Recommendation & Model Metrics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Analytical Recommendation Card */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  <span>Analytical Recommendation & Reasons</span>
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border font-mono ${getSignalBadge(recommendation?.signal || 'HOLD')}`}>
                  {recommendation?.signal}
                </span>
              </div>

              <div className="space-y-3 pt-2">
                {recommendation?.reasons.map((reason, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800/60 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-slate-300 leading-relaxed">{reason}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* LSTM Model Evaluation Metrics */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <BrainCircuit className="w-5 h-5 text-indigo-400" />
                  <span>LSTM Deep Learning Performance</span>
                </h3>
                <span className="text-xs font-mono text-slate-400">Keras Architecture</span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <span className="text-[11px] font-mono text-slate-400 uppercase">MAE (Mean Abs Error)</span>
                  <p className="text-2xl font-extrabold text-white font-mono">${forecast.metrics.mae.toFixed(2)}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <span className="text-[11px] font-mono text-slate-400 uppercase">RMSE (Root Mean Sq)</span>
                  <p className="text-2xl font-extrabold text-white font-mono">${forecast.metrics.rmse.toFixed(2)}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <span className="text-[11px] font-mono text-slate-400 uppercase">MAPE (Mean % Error)</span>
                  <p className="text-2xl font-extrabold text-white font-mono">{forecast.metrics.mape.toFixed(2)}%</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <span className="text-[11px] font-mono text-slate-400 uppercase">R² Score (Goodness)</span>
                  <p className="text-2xl font-extrabold text-indigo-400 font-mono">{forecast.metrics.r2.toFixed(3)}</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 font-mono">
                Training Split: 70% Chronological • Test Split: 15% Unseen Data • Lookback: 60 Days
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};
