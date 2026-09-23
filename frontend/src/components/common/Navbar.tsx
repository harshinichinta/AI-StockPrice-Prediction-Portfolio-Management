import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Activity, Menu } from 'lucide-react';
import { TickerTape } from './TickerTape';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const [searchTicker, setSearchTicker] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTicker.trim()) {
      navigate(`/stock/${searchTicker.trim().toUpperCase()}`);
      setSearchTicker('');
    }
  };

  return (
    <div className="sticky top-0 z-30 flex flex-col">
      <TickerTape />
      
      <header className="h-16 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-xl px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Global Stock Ticker Search */}
          <form onSubmit={handleSearchSubmit} className="relative w-64 md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTicker}
              onChange={(e) => setSearchTicker(e.target.value)}
              placeholder="Search stock ticker (e.g. AAPL, MSFT, TSLA)..."
              className="w-full pl-10 pr-4 py-2 bg-slate-900/80 border border-slate-800/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
            />
          </form>
        </div>

        {/* Right Navbar Utility Badges */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>LSTM Engine Online</span>
          </div>

          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono">
            <span>60-Day Lookback Window</span>
          </div>

          <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="w-2 h-2 rounded-full bg-indigo-500 absolute top-2 right-2" />
          </button>
        </div>
      </header>
    </div>
  );
};
