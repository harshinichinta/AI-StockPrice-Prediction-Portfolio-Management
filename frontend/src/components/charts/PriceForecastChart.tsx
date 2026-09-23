import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import { ForecastPoint } from '../../types';

interface PriceForecastChartProps {
  historicalData: ForecastPoint[];
  forecastData: ForecastPoint[];
  forecastBeginsDate: string;
}

export const PriceForecastChart: React.FC<PriceForecastChartProps> = ({
  historicalData,
  forecastData,
  forecastBeginsDate
}) => {
  // Combine historical and forecast data cleanly for Recharts
  const combinedData = [
    ...historicalData.map(d => ({
      date: d.date,
      historical: d.actual_price,
      forecast: null,
    })),
    // Bridge point at transition
    ...(historicalData.length > 0 ? [{
      date: historicalData[historicalData.length - 1].date,
      historical: historicalData[historicalData.length - 1].actual_price,
      forecast: historicalData[historicalData.length - 1].actual_price
    }] : []),
    ...forecastData.map(d => ({
      date: d.date,
      historical: null,
      forecast: d.predicted_price,
    }))
  ];

  const isForecastUp = forecastData.length > 0 && historicalData.length > 0
    ? (forecastData[forecastData.length - 1].predicted_price || 0) >= (historicalData[historicalData.length - 1].actual_price || 0)
    : true;

  const forecastColor = isForecastUp ? '#10B981' : '#EF4444';

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            Historical Price vs. LSTM Price Forecast
          </h3>
          <p className="text-xs text-slate-400">
            Solid blue = Actual historical price • Dashed line = Autoregressive LSTM prediction
          </p>
        </div>

        {/* Legend Badges */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-indigo-500 rounded" />
            <span className="text-slate-300">Historical</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`w-3 h-0.5 border-b-2 border-dashed ${isForecastUp ? 'border-emerald-400' : 'border-red-400'}`} />
            <span className={isForecastUp ? 'text-emerald-400' : 'text-red-400'}>
              LSTM Forecast ({isForecastUp ? 'Bullish ↑' : 'Bearish ↓'})
            </span>
          </div>
        </div>
      </div>

      <div className="h-80 w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={combinedData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickMargin={10}
            />
            <YAxis
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              domain={['auto', 'auto']}
              tickFormatter={(val) => `$${val}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                fontSize: '12px',
                fontFamily: 'JetBrains Mono'
              }}
              formatter={(value: any, name: any) => [
                `$${Number(value).toFixed(2)}`,
                name === 'historical' ? 'Historical Price' : 'LSTM Predicted Price'
              ]}
            />
            
            {/* Vertical Marker for Forecast Begins */}
            {forecastBeginsDate && (
              <ReferenceLine
                x={forecastBeginsDate}
                stroke="#6366F1"
                strokeDasharray="4 4"
                label={{
                  value: 'Forecast Begins →',
                  fill: '#818CF8',
                  fontSize: 10,
                  position: 'top',
                  fontFamily: 'JetBrains Mono'
                }}
              />
            )}

            {/* Historical Price Line */}
            <Line
              type="monotone"
              dataKey="historical"
              stroke="#6366F1"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 6, fill: '#6366F1', stroke: '#FFFFFF', strokeWidth: 2 }}
              name="historical"
            />

            {/* Forecast Price Line (Dashed) */}
            <Line
              type="monotone"
              dataKey="forecast"
              stroke={forecastColor}
              strokeWidth={2.5}
              strokeDasharray="6 6"
              dot={{ r: 4, fill: forecastColor }}
              activeDot={{ r: 6, fill: forecastColor }}
              name="forecast"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
