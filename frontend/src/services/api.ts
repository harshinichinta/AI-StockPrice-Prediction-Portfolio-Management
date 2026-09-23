import axios from 'axios';
import {
  StockQuote,
  TechnicalIndicators,
  ForecastResponse,
  RecommendationResponse,
  PortfolioPerformance,
  RiskSummary,
  BacktestResult,
  WatchlistItem,
  PredictionHistoryItem
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically inject JWT token into authorization header if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('stockmind_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const StockService = {
  getQuote: async (ticker: string): Promise<StockQuote> => {
    const res = await api.get(`/stocks/${ticker}`);
    return res.data;
  },

  getHistory: async (ticker: string, period: string = '1y'): Promise<{ ticker: string; count: number; history: any[] }> => {
    const res = await api.get(`/stocks/${ticker}/history`, { params: { period } });
    return res.data;
  },

  getIndicators: async (ticker: string): Promise<TechnicalIndicators> => {
    const res = await api.get(`/stocks/${ticker}/indicators`);
    return res.data;
  },

  getForecast: async (ticker: string, horizon: number = 5): Promise<ForecastResponse> => {
    const res = await api.get(`/predictions/forecast/${ticker}`, { params: { horizon } });
    return res.data;
  },

  getRecommendation: async (ticker: string, horizon: number = 5): Promise<RecommendationResponse> => {
    const res = await api.get(`/predictions/recommendation/${ticker}`, { params: { horizon } });
    return res.data;
  },

  getPredictionHistory: async (): Promise<{ history: PredictionHistoryItem[] }> => {
    const res = await api.get('/predictions/history');
    return res.data;
  }
};

export const PortfolioService = {
  getPerformance: async (): Promise<PortfolioPerformance> => {
    const res = await api.get('/portfolio');
    return res.data;
  },

  addHolding: async (data: { ticker: string; quantity: number; purchase_price: number; purchase_date: string }) => {
    const res = await api.post('/portfolio/holdings', data);
    return res.data;
  },

  updateHolding: async (id: number, data: { quantity?: number; purchase_price?: number }) => {
    const res = await api.put(`/portfolio/holdings/${id}`, data);
    return res.data;
  },

  deleteHolding: async (id: number) => {
    const res = await api.delete(`/portfolio/holdings/${id}`);
    return res.data;
  },

  getRiskAnalysis: async (): Promise<RiskSummary> => {
    const res = await api.get('/risk');
    return res.data;
  }
};

export const BacktestService = {
  runSimulation: async (data: { ticker: string; start_date: string; end_date: string; initial_capital: number }): Promise<BacktestResult> => {
    const res = await api.post('/backtest', data);
    return res.data;
  }
};

export const WatchlistService = {
  getWatchlist: async (): Promise<{ watchlist: WatchlistItem[] }> => {
    const res = await api.get('/watchlist');
    return res.data;
  },

  addTicker: async (ticker: string) => {
    const res = await api.post(`/watchlist/${ticker}`);
    return res.data;
  },

  removeTicker: async (ticker: string) => {
    const res = await api.delete(`/watchlist/${ticker}`);
    return res.data;
  }
};

export default api;
