import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  TrendingUp,
  BrainCircuit,
  Briefcase,
  ShieldAlert,
  History,
  Bookmark,
  Clock,
  Settings,
  LogOut,
  Brain
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed }) => {
  const { logout, user } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Stock Analysis', path: '/stock/AAPL', icon: TrendingUp },
    { label: 'Predictions', path: '/predictions', icon: BrainCircuit },
    { label: 'Portfolio', path: '/portfolio', icon: Briefcase },
    { label: 'Risk Analysis', path: '/risk', icon: ShieldAlert },
    { label: 'Backtesting', path: '/backtest', icon: History },
    { label: 'Watchlist', path: '/watchlist', icon: Bookmark },
    { label: 'Prediction History', path: '/history', icon: Clock },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className={`fixed left-0 top-0 bottom-0 z-40 bg-slate-950/80 backdrop-blur-xl border-r border-slate-800/80 transition-all duration-300 flex flex-col ${isCollapsed ? 'w-20' : 'w-64'}`}>
      {/* Brand Header */}
      <div className="h-20 flex items-center px-5 border-b border-slate-800/80 gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 shrink-0">
          <Brain className="w-6 h-6" />
        </div>
        {!isCollapsed && (
          <div className="flex flex-col overflow-hidden">
            <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent truncate">
              StockMind AI
            </span>
            <span className="text-[10px] font-mono text-indigo-400 tracking-wider uppercase truncate">
              LSTM Analytics
            </span>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600/90 to-indigo-700/80 text-white shadow-lg shadow-indigo-600/20 border border-indigo-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          );
        })}
      </div>

      {/* User Footer Profile & Logout */}
      <div className="p-3 border-t border-slate-800/80">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-900/50 border border-slate-800/60">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-xs shrink-0">
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-200 truncate">{user?.name || 'Investor'}</p>
              <p className="text-[10px] text-slate-400 font-mono truncate">{user?.email || 'demo@stockmind.ai'}</p>
            </div>
          )}
          {!isCollapsed && (
            <button
              onClick={logout}
              title="Logout"
              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
