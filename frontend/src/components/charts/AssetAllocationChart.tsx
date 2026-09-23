import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Holding } from '../../types';

interface AssetAllocationChartProps {
  holdings: Holding[];
}

const COLORS = ['#6366F1', '#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#06B6D4', '#EC4899'];

export const AssetAllocationChart: React.FC<AssetAllocationChartProps> = ({ holdings }) => {
  const chartData = holdings.map((h) => ({
    name: h.ticker,
    value: h.current_value
  }));

  const totalValue = holdings.reduce((sum, h) => sum + h.current_value, 0);

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 space-y-4">
      <div>
        <h3 className="text-base font-bold text-white">Asset Allocation</h3>
        <p className="text-xs text-slate-400">Distribution of holdings by valuation</p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="h-56 w-full md:w-1/2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.95)',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontFamily: 'JetBrains Mono'
                }}
                formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Valuation']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="w-full md:w-1/2 space-y-2">
          {holdings.map((h, i) => {
            const pct = totalValue > 0 ? (h.current_value / totalValue * 100) : 0;
            return (
              <div key={h.id || h.ticker} className="flex items-center justify-between p-2 rounded-lg bg-slate-900/50 border border-slate-800/50 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="font-bold text-white">{h.ticker}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-200 font-semibold">${h.current_value.toLocaleString()}</span>
                  <span className="text-slate-400 ml-2">({pct.toFixed(1)}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
