import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, BrainCircuit, ShieldAlert, ArrowRight, Activity, LineChart, Lock } from 'lucide-react';
import { BackgroundGlow } from '../components/common/BackgroundGlow';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col relative overflow-hidden font-sans">
      <BackgroundGlow />

      {/* Top Header Navbar */}
      <header className="h-20 border-b border-slate-800/80 bg-slate-950/40 backdrop-blur-xl px-8 flex items-center justify-between relative z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            StockMind AI
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/dashboard"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 border border-indigo-500/30 transition-all flex items-center gap-2"
          >
            <span>Explore Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center px-6 pt-16 pb-20 text-center max-w-5xl mx-auto relative z-10 space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span>B.Tech Major Project • Pure LSTM Deep Learning Architecture</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent leading-tight max-w-4xl">
          Intelligent Stock Analytics & Portfolio Management
        </h1>

        <p className="text-slate-400 text-base md:text-lg max-w-2xl leading-relaxed">
          Forecast stock prices using <span className="text-indigo-400 font-semibold">LSTM deep learning</span>, analyze market trends, monitor portfolio performance, and understand investment risk through one intelligent analytics platform.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to="/dashboard"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 border border-indigo-500/30 transition-all flex items-center justify-center gap-2"
          >
            <span>Explore Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/stock/AAPL"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-sm border border-slate-800/80 transition-all flex items-center justify-center gap-2"
          >
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Analyze AAPL Stock</span>
          </Link>
        </div>

        {/* Hero Visual Mockup Glass Card */}
        <div className="w-full pt-10">
          <div className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-800/80 shadow-2xl space-y-6 relative overflow-hidden text-left">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs font-mono text-slate-400 ml-2">StockMind Analytics Engine v1.0</span>
              </div>
              <span className="text-xs font-mono text-indigo-400">AAPL • Live Forecast Preview</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <span className="text-[11px] font-mono text-slate-400 uppercase">Current Quote</span>
                <p className="text-2xl font-extrabold text-white font-mono">$189.45</p>
                <span className="text-xs font-semibold text-emerald-400 font-mono">+1.85 (+0.99%)</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <span className="text-[11px] font-mono text-slate-400 uppercase">LSTM 5-Day Forecast</span>
                <p className="text-2xl font-extrabold text-emerald-400 font-mono">$196.20</p>
                <span className="text-xs font-semibold text-emerald-400 font-mono">+3.56% Predicted Gain</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <span className="text-[11px] font-mono text-slate-400 uppercase">Analytical Signal</span>
                <p className="text-2xl font-extrabold text-emerald-400 font-mono">BUY</p>
                <span className="text-xs text-slate-400">Confidence: 85% • MACD Bullish</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="py-16 px-6 max-w-6xl mx-auto w-full relative z-10 border-t border-slate-800/80">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Pure LSTM Forecasting</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Trained on multi-year historical stock sequences to learn temporal dynamics and compute short-term price predictions.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <LineChart className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Portfolio Tracking & P/L</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dynamically monitors total invested capital, market valuation, net profit/loss, and holding performance.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Statistical Risk Analysis</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Computes annualized volatility, Sharpe ratio, maximum drawdown, and concentration metrics in plain language.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-slate-800/80 text-center text-xs text-slate-400 font-mono">
        <p>StockMind AI © 2026 • B.Tech Major Data Science Project</p>
      </footer>
    </div>
  );
};
