import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AppLayout } from './layouts/AppLayout';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { StockAnalysisPage } from './pages/StockAnalysisPage';
import { PredictionPage } from './pages/PredictionPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { RiskPage } from './pages/RiskPage';
import { BacktestPage } from './pages/BacktestPage';
import { WatchlistPage } from './pages/WatchlistPage';
import { PredictionHistoryPage } from './pages/PredictionHistoryPage';
import { SettingsPage } from './pages/SettingsPage';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Landing & Auth Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Application Dashboard Routes */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/stock/:ticker" element={<StockAnalysisPage />} />
            <Route path="/predictions" element={<PredictionPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/risk" element={<RiskPage />} />
            <Route path="/backtest" element={<BacktestPage />} />
            <Route path="/watchlist" element={<WatchlistPage />} />
            <Route path="/history" element={<PredictionHistoryPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Catch-all fallback redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
