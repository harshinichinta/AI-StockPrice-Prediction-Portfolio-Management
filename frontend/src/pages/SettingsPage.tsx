import React, { useState } from 'react';
import { Settings, User as UserIcon, Shield, Database, Moon, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const SettingsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
          <Settings className="w-8 h-8 text-indigo-400" />
          <span>Application Settings</span>
        </h1>
        <p className="text-slate-400 text-sm">Manage profile, risk preferences, theme, and model parameters</p>
      </div>

      {/* User Profile Settings */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2 font-mono">
          <UserIcon className="w-4 h-4 text-indigo-400" />
          <span>User Profile & Account</span>
        </h3>

        <form onSubmit={handleSave} className="space-y-4 text-xs font-mono">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                defaultValue={user?.name || "Demo Investor"}
                className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Email Address</label>
              <input
                type="email"
                defaultValue={user?.email || "demo@stockmind.ai"}
                disabled
                className="w-full p-2.5 bg-slate-900/50 border border-slate-800/50 rounded-xl text-slate-400 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Risk Tolerance Level</label>
            <select className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500">
              <option value="Conservative">Conservative (Low Volatility)</option>
              <option value="Moderate" selected>Moderate (Growth Portfolio)</option>
              <option value="Aggressive">Aggressive (High Momentum)</option>
            </select>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all flex items-center gap-2"
            >
              {saved ? <Check className="w-4 h-4" /> : null}
              <span>{saved ? 'Saved Successfully!' : 'Save Preferences'}</span>
            </button>

            <button
              type="button"
              onClick={logout}
              className="px-4 py-2 rounded-xl text-red-400 hover:bg-red-500/10 border border-red-500/20"
            >
              Sign Out
            </button>
          </div>
        </form>
      </div>

      {/* Model & Architecture Status */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2 font-mono">
          <Database className="w-4 h-4 text-emerald-400" />
          <span>LSTM Architecture & Database Status</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <span className="text-slate-400">Prediction Engine:</span>
            <p className="font-bold text-emerald-400 mt-1">Keras Stacked LSTM</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <span className="text-slate-400">Database Engine:</span>
            <p className="font-bold text-white mt-1">PostgreSQL / SQLite</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <span className="text-slate-400">Theme:</span>
            <p className="font-bold text-indigo-400 mt-1">Dark Fintech Glass</p>
          </div>
        </div>
      </div>
    </div>
  );
};
