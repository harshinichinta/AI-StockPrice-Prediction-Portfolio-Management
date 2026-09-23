import React, { useEffect, useState } from 'react';
import { Briefcase, Plus, Trash2, Edit2, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { StatCard } from '../components/common/StatCard';
import { MetricSkeleton } from '../components/common/MetricSkeleton';
import { AssetAllocationChart } from '../components/charts/AssetAllocationChart';
import { PortfolioService } from '../services/api';
import { PortfolioPerformance, Holding } from '../types';

export const PortfolioPage: React.FC = () => {
  const [performance, setPerformance] = useState<PortfolioPerformance | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingHoldingId, setEditingHoldingId] = useState<number | null>(null);

  // Form State
  const [ticker, setTicker] = useState('');
  const [quantity, setQuantity] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);

  const loadPortfolio = async () => {
    setLoading(true);
    try {
      const data = await PortfolioService.getPerformance();
      setPerformance(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortfolio();
  }, []);

  const handleSaveHolding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticker || !quantity || !purchasePrice) return;

    try {
      if (editingHoldingId) {
        await PortfolioService.updateHolding(editingHoldingId, {
          quantity: parseFloat(quantity),
          purchase_price: parseFloat(purchasePrice)
        });
      } else {
        await PortfolioService.addHolding({
          ticker: ticker.toUpperCase(),
          quantity: parseFloat(quantity),
          purchase_price: parseFloat(purchasePrice),
          purchase_date: purchaseDate
        });
      }

      setShowModal(false);
      resetForm();
      loadPortfolio();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteHolding = async (id: number) => {
    if (confirm("Are you sure you want to remove this stock holding?")) {
      try {
        await PortfolioService.deleteHolding(id);
        loadPortfolio();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleEditClick = (h: Holding) => {
    setEditingHoldingId(h.id);
    setTicker(h.ticker);
    setQuantity(h.quantity.toString());
    setPurchasePrice(h.purchase_price.toString());
    setPurchaseDate(h.purchase_date);
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingHoldingId(null);
    setTicker('');
    setQuantity('');
    setPurchasePrice('');
    setPurchaseDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-indigo-400" />
            <span>Portfolio Management</span>
          </h1>
          <p className="text-slate-400 text-sm">Real-time valuation, net profit/loss, and asset allocation</p>
        </div>

        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 border border-indigo-500/30 transition-all flex items-center gap-2 self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add Stock Holding</span>
        </button>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <>
            <MetricSkeleton />
            <MetricSkeleton />
            <MetricSkeleton />
            <MetricSkeleton />
          </>
        ) : (
          <>
            <StatCard
              title="Portfolio Valuation"
              value={`$${(performance?.total_current_value || 0).toLocaleString()}`}
              subtitle="Live Market Valuation"
              icon={DollarSign}
              accentColor="indigo"
            />
            <StatCard
              title="Total Invested"
              value={`$${(performance?.total_invested || 0).toLocaleString()}`}
              subtitle="Capital Purchase Basis"
              icon={Briefcase}
              accentColor="cyan"
            />
            <StatCard
              title="Net Profit / Loss"
              value={`$${(performance?.total_profit_loss || 0).toLocaleString()}`}
              change={performance?.total_return_percent}
              changeText="Overall Profit / Loss"
              icon={TrendingUp}
              accentColor={performance && performance.total_profit_loss >= 0 ? 'emerald' : 'red'}
            />
            <StatCard
              title="Total Return %"
              value={`${(performance?.total_return_percent || 0).toFixed(2)}%`}
              change={performance?.total_return_percent}
              changeText="ROI Performance"
              icon={TrendingUp}
              accentColor={performance && performance.total_return_percent >= 0 ? 'emerald' : 'red'}
            />
          </>
        )}
      </div>

      {/* Asset Allocation Chart */}
      {performance && performance.holdings.length > 0 && (
        <AssetAllocationChart holdings={performance.holdings} />
      )}

      {/* Holdings Table */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 space-y-4">
        <h3 className="text-base font-bold text-white font-mono">Current Stock Holdings</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-mono text-slate-400 uppercase">
                <th className="py-3 px-4">Ticker</th>
                <th className="py-3 px-4">Quantity</th>
                <th className="py-3 px-4">Buy Price</th>
                <th className="py-3 px-4">Current Price</th>
                <th className="py-3 px-4">Invested</th>
                <th className="py-3 px-4">Current Value</th>
                <th className="py-3 px-4">P/L ($)</th>
                <th className="py-3 px-4">Return %</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs font-mono">
              {performance?.holdings.map((h) => {
                const isGain = h.profit_loss >= 0;
                return (
                  <tr key={h.id} className="hover:bg-slate-900/50">
                    <td className="py-3 px-4 font-bold text-white">{h.ticker}</td>
                    <td className="py-3 px-4 text-slate-300">{h.quantity}</td>
                    <td className="py-3 px-4 text-slate-300">${h.purchase_price.toFixed(2)}</td>
                    <td className="py-3 px-4 font-bold text-white">${h.current_price.toFixed(2)}</td>
                    <td className="py-3 px-4 text-slate-300">${h.invested_value.toLocaleString()}</td>
                    <td className="py-3 px-4 font-bold text-white">${h.current_value.toLocaleString()}</td>
                    <td className={`py-3 px-4 font-semibold ${isGain ? 'text-emerald-400' : 'text-red-400'}`}>
                      {isGain ? '+' : ''}${h.profit_loss.toFixed(2)}
                    </td>
                    <td className={`py-3 px-4 font-semibold ${isGain ? 'text-emerald-400' : 'text-red-400'}`}>
                      {isGain ? '+' : ''}{h.return_percent.toFixed(2)}%
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleEditClick(h)}
                        className="p-1.5 text-slate-400 hover:text-indigo-400 rounded-lg hover:bg-slate-800"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteHolding(h.id)}
                        className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Holding Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold text-white">
              {editingHoldingId ? 'Edit Holding' : 'Add Stock Holding'}
            </h3>

            <form onSubmit={handleSaveHolding} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-slate-400 mb-1">Ticker Symbol</label>
                <input
                  type="text"
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value)}
                  placeholder="e.g. AAPL"
                  disabled={!!editingHoldingId}
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Quantity (Shares)</label>
                <input
                  type="number"
                  step="0.01"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="e.g. 10"
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Purchase Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                  placeholder="e.g. 175.50"
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Purchase Date</label>
                <input
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                >
                  Save Holding
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
