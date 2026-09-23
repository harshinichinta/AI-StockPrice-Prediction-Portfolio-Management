export interface User {
  id: number;
  name: string;
  email: string;
}

export interface StockQuote {
  ticker: string;
  current_price: number;
  prev_close: number;
  change: number;
  change_percent: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  date: string;
}

export interface TechnicalIndicators {
  sma_20: number;
  sma_50: number;
  ema_20: number;
  rsi_14: number;
  macd: number;
  macd_signal: number;
  macd_hist: number;
  bb_upper: number;
  bb_lower: number;
  daily_return_percent: number;
  annualized_volatility: number;
}

export interface LSTMMetrics {
  mae: number;
  rmse: number;
  mape: number;
  r2: number;
}

export interface ForecastPoint {
  day?: number;
  date: string;
  actual_price?: number;
  predicted_price?: number;
  is_forecast: boolean;
}

export interface ForecastResponse {
  ticker: string;
  current_price: number;
  predicted_price: number;
  price_change: number;
  price_change_percent: number;
  horizon_days: number;
  metrics: LSTMMetrics;
  forecast_begins_date: string;
  historical_data: ForecastPoint[];
  forecast_data: ForecastPoint[];
}

export interface RecommendationResponse {
  ticker: string;
  signal: 'BUY' | 'HOLD' | 'SELL';
  confidence_score: number;
  reasons: string[];
  current_price: number;
  predicted_price: number;
  predicted_change_pct: number;
}

export interface Holding {
  id: number;
  portfolio_id: number;
  ticker: string;
  quantity: number;
  purchase_price: number;
  purchase_date: string;
  current_price: number;
  invested_value: number;
  current_value: number;
  profit_loss: number;
  return_percent: number;
}

export interface PortfolioPerformance {
  portfolio_id: number;
  portfolio_name: string;
  total_invested: number;
  total_current_value: number;
  total_profit_loss: number;
  total_return_percent: number;
  daily_change_dollars: number;
  daily_change_percent: number;
  holdings: Holding[];
}

export interface RiskSummary {
  annualized_volatility: number;
  sharpe_ratio: number;
  max_drawdown_percent: number;
  concentration_hhi: number;
  risk_level: string;
  asset_allocations: { ticker: string; value: number; weight_percent: number }[];
  explanations: Record<string, string>;
}

export interface BacktestTrade {
  date: string;
  type: 'BUY' | 'SELL' | 'HOLD';
  price: number;
  shares: number;
  cash: number;
  portfolio_value: number;
  reason: string;
}

export interface BacktestResult {
  ticker: string;
  initial_capital: number;
  final_value: number;
  total_return_percent: number;
  max_drawdown_percent: number;
  benchmark_return_percent: number;
  win_rate_percent: number;
  trade_count: number;
  trades: BacktestTrade[];
  equity_curve: { date: string; portfolio_value: number; benchmark_price: number; cash: number; holdings_value: number }[];
  disclaimer: string;
}

export interface WatchlistItem {
  id: number;
  ticker: string;
  current_price: number;
  change: number;
  change_percent: number;
  added_at: string;
}

export interface PredictionHistoryItem {
  id: number;
  ticker: string;
  prediction_date: string;
  current_price: number;
  predicted_price: number;
  forecast_horizon_days: number;
  model_name: string;
  recommendation_signal: string;
  metrics: LSTMMetrics;
}
