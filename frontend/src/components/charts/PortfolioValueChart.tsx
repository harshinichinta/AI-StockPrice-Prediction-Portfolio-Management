import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface PortfolioValueChartProps {
  currentValue: number;
  investedValue: number;
}

export const PortfolioValueChart: React.FC<PortfolioValueChartProps> = ({
  currentValue,
  investedValue
}) => {
  // Generate historical equity trajectory curve
  const generateMockHistory = () => {
    const points = 30;
    const data = [];
    const step = (currentValue - investedValue) / points;
    let val = investedValue;

    for (let i = 0; i < points; i++) {
      val += step + (Math.random() * 150 - 70);
      data.push({
        day: `Day ${i + 1}`,
        value: Math.max(investedValue * 0.8, Math.round(val)),
        invested: investedValue
      });
    }
    // Set exact final value
    data[data.length - 1].value = currentValue;
    return data;
  };

  const chartData = generateMockHistory();
  const isProfit = currentValue >= investedValue;

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white">Portfolio Value Trajectory</h3>
          <p className="text-xs text-slate-400">Historical equity curve vs. initial capital invested</p>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400 font-mono">Current Valuation</span>
          <p className="text-xl font-extrabold text-white font-mono">${currentValue.toLocaleString()}</p>
        </div>
      </div>

      <div className="h-72 w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isProfit ? '#10B981' : '#EF4444'} stopOpacity={0.4} />
                <stop offset="95%" stopColor={isProfit ? '#10B981' : '#EF4444'} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
            <XAxis dataKey="day" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                fontSize: '12px',
                fontFamily: 'JetBrains Mono'
              }}
              formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Portfolio Value']}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={isProfit ? '#10B981' : '#EF4444'}
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#portfolioGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
