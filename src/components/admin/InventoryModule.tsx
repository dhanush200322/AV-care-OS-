import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, 
  Search, 
  AlertTriangle, 
  RotateCw, 
  Plus, 
  Edit, 
  Trash2, 
  X,
  TrendingDown,
  Activity,
  Boxes
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface StockItem {
  id: string;
  name: string;
  category: 'Pharmaceuticals' | 'Surgical' | 'Disposables' | 'Diagnostics' | 'Emergency Eq';
  quantity: number;
  minLimit: number;
  unit: string;
  location: string;
  supplier: string;
}

const INITIAL_STOCKS: StockItem[] = [
  { id: 'INV-01', name: 'Paracetamol 500mg Tabs', category: 'Pharmaceuticals', quantity: 4500, minLimit: 1000, unit: 'Tablets', location: 'Rack B3-4', supplier: 'Astra Supplies' },
  { id: 'INV-02', name: 'Premium Surgical Gloves (Large)', category: 'Surgical', quantity: 320, minLimit: 500, unit: 'Pairs', location: 'Sterile Room A', supplier: 'MediCorp Gloving' },
  { id: 'INV-03', name: 'Sterile Gauze Pads 4x4', category: 'Disposables', quantity: 2400, minLimit: 500, unit: 'Packs', location: 'Aisle 2 - Box 7', supplier: 'LifeTech Ltd' },
  { id: 'INV-04', name: 'Rapid COVID-19 Antigen Kits', category: 'Diagnostics', quantity: 80, minLimit: 200, unit: 'Kits', location: 'Lab Fridge C', supplier: 'Genomics Diagnostic' },
  { id: 'INV-05', name: 'Portable Oxygen Concentrator Gen3', category: 'Emergency Eq', quantity: 12, minLimit: 5, unit: 'Units', location: 'Ward Emergency Bay', supplier: 'Aegis Breathing Co' },
  { id: 'INV-06', name: 'Insulin Glargine Pen-injectors', category: 'Pharmaceuticals', quantity: 18, minLimit: 50, unit: 'Pens', location: 'Cold Store 12A', supplier: 'Astra Supplies' },
  { id: 'INV-07', name: 'Cardiac Defibrillator Pads', category: 'Emergency Eq', quantity: 44, minLimit: 15, unit: 'Sets', location: 'Cardiac Hub Rack', supplier: 'Aegis Breathing Co' },
];

export const InventoryModule: React.FC = () => {
  const [stocks, setStocks] = useState<StockItem[]>(INITIAL_STOCKS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<Partial<StockItem> | null>(null);

  const filteredStocks = stocks.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (item: StockItem) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to drop this supply resource record?")) {
      setStocks(prev => prev.filter(i => i.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentItem?.name || !currentItem?.category || currentItem.quantity === undefined) return;

    if (currentItem.id) {
      setStocks(prev => prev.map(i => i.id === currentItem.id ? (currentItem as StockItem) : i));
    } else {
      const newId = `INV-${String(stocks.length + 1).padStart(2, '0')}`;
      const newItem: StockItem = {
        id: newId,
        name: currentItem.name,
        category: currentItem.category as any,
        quantity: Number(currentItem.quantity) || 0,
        minLimit: Number(currentItem.minLimit) || 10,
        unit: currentItem.unit || 'Units',
        location: currentItem.location || 'Central Stock',
        supplier: currentItem.supplier || 'Aegis Logistics'
      };
      setStocks(prev => [...prev, newItem]);
    }

    setIsModalOpen(false);
    setCurrentItem(null);
  };

  const getAlertCount = () => stocks.filter(i => i.quantity < i.minLimit).length;

  return (
    <div className="space-y-6">
      {/* Alert Banner / HUD Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/40 border border-white/5 backdrop-blur-3xl rounded-2xl p-5 flex items-center justify-between col-span-1 md:col-span-2">
          <div>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#a855f7]">LOGISTICS ADVISORY</span>
            <h3 className="text-lg font-black text-white mt-1 uppercase tracking-wider">
              {getAlertCount() > 0 ? `${getAlertCount()} critical replenishment limits reached` : 'Clinical logistics network stable'}
            </h3>
            <p className="text-[10px] text-white/40 mt-1 uppercase tracking-wide">
              {getAlertCount() > 0 ? 'Critical pharmaceuticals/disposables require signature approvals.' : 'All system stock registers within normal SLA telemetry.'}
            </p>
          </div>
          {getAlertCount() > 0 && (
            <div className="p-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl animate-pulse">
               <AlertTriangle size={24} />
            </div>
          )}
        </div>

        {[
          { label: 'Total line items', value: stocks.length, icon: Boxes, color: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/10' },
          { label: 'Supplier alliances', value: '5 active', icon: RotateCw, color: 'text-purple-400 border-purple-500/20 bg-purple-500/10' }
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900/40 border border-white/5 backdrop-blur-2xl rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase text-white/40 tracking-widest">{stat.label}</p>
              <h4 className="text-xl font-black text-white mt-1 leading-none">{stat.value}</h4>
            </div>
            <div className={cn("p-2.5 rounded-xl border", stat.color)}>
              <stat.icon size={18} />
            </div>
          </div>
        ))}
      </div>

      {/* Main Table */}
      <div className="bg-slate-900/40 border border-white/10 backdrop-blur-3xl rounded-[32px] p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-sm font-black text-white uppercase tracking-[0.2em]">Clinical Resources & Inventory Matrix</h2>
            <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Regulate surgical, pharmaceutical, and disposable supplies across all modules.</p>
          </div>
          <button 
            onClick={() => {
              setCurrentItem({ category: 'Pharmaceuticals', quantity: 0, minLimit: 10, unit: 'Units' });
              setIsModalOpen(true);
            }}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 rounded-xl text-[10px] font-black uppercase tracking-widest text-white flex items-center gap-2 self-start transition-all"
          >
            <Plus size={14} /> New Stock Register
          </button>
        </div>

        {/* Filter Input */}
        <div className="flex items-center gap-3 bg-white/[0.02] border border-white/5 rounded-2xl p-3 mb-6">
          <Search size={16} className="text-white/20 ml-2" />
          <input 
            type="text" 
            placeholder="Search resources by chemical descriptor, category, storage rack ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent text-xs text-white focus:outline-none placeholder:text-white/20 font-mono uppercase"
          />
        </div>

        {/* Inventory list */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-[10px] uppercase font-black tracking-widest text-white/30">
                <th className="py-4 px-4">Supply Ref</th>
                <th className="py-4 px-4">Medical Asset Descriptor</th>
                <th className="py-4 px-4">Logistical Grouping</th>
                <th className="py-4 px-4">Quantities Available</th>
                <th className="py-4 px-4">Trigger Limits</th>
                <th className="py-4 px-4">Depot Coordinates</th>
                <th className="py-4 px-4">Supplier Alliance</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {filteredStocks.map((item) => {
                const isUnderStocked = item.quantity < item.minLimit;
                return (
                  <tr key={item.id} className="hover:bg-white/[0.01] transition-colors text-xs font-semibold">
                    <td className="py-4 px-4 text-purple-400 text-[10px] uppercase font-bold tracking-wider">{item.id}</td>
                    <td className="py-4 px-4 text-white uppercase tracking-wide">
                      <div className="flex items-center gap-2">
                        {isUnderStocked && <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />}
                        <span>{item.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-white/60">{item.category}</td>
                    <td className="py-4 px-4">
                      <span className={cn(
                        "font-bold text-xs uppercase tracking-wider",
                        isUnderStocked ? "text-red-400" : "text-emerald-400"
                      )}>
                        {item.quantity.toLocaleString()} {item.unit}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-white/40 text-[10px] uppercase font-bold tracking-wider">Under {item.minLimit} {item.unit}</td>
                    <td className="py-4 px-4 text-white/50">{item.location}</td>
                    <td className="py-4 px-4 text-white/60">{item.supplier}</td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2 text-white/30">
                        <button onClick={() => handleEdit(item)} className="p-1.5 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors">
                          <Edit size={14} />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-1.5 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredStocks.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-white/20 uppercase tracking-widest text-xs font-mono">
                    No active resource profiles match query filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adding/Editing Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-[#050816] border border-white/10 rounded-[32px] w-full max-w-lg p-6 relative overflow-hidden z-10"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-widest">
                    {currentItem?.id ? `Re-align Supply: ${currentItem.id}` : 'Create Asset Allocation Code'}
                  </h3>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">Configure logistical quotas, storage zones, and fallback suppliers.</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-white/20 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4 font-mono text-[11px]">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2 col-span-2">
                    <label className="text-white/40 uppercase tracking-wider">Asset / Item Descriptor</label>
                    <input 
                      type="text" 
                      required
                      value={currentItem?.name || ''} 
                      onChange={(e) => setCurrentItem(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500 text-xs text-upper uppercase"
                      placeholder="E.G. ADRENALINE 1MG INTRAVENOUS AMPOULES"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-white/40 uppercase tracking-wider">Category</label>
                    <select 
                      value={currentItem?.category || 'Pharmaceuticals'} 
                      onChange={(e) => setCurrentItem(prev => ({ ...prev, category: e.target.value as any }))}
                      className="w-full bg-[#050816] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500 text-xs"
                    >
                      <option value="Pharmaceuticals">Pharmaceuticals</option>
                      <option value="Surgical">Surgical</option>
                      <option value="Disposables">Disposables</option>
                      <option value="Diagnostics">Diagnostics</option>
                      <option value="Emergency Eq">Emergency Eq</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-white/40 uppercase tracking-wider">Measurement Unit</label>
                    <input 
                      type="text" 
                      required
                      value={currentItem?.unit || ''} 
                      onChange={(e) => setCurrentItem(prev => ({ ...prev, unit: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500 text-xs"
                      placeholder="Vials, Ampoules, Boxes"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-white/40 uppercase tracking-wider">In-Stock Quantity</label>
                    <input 
                      type="number" 
                      required
                      value={currentItem?.quantity !== undefined ? currentItem.quantity : ''} 
                      onChange={(e) => setCurrentItem(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500 text-xs"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-white/40 uppercase tracking-wider">Replenishment Trigger Limit</label>
                    <input 
                      type="number" 
                      required
                      value={currentItem?.minLimit !== undefined ? currentItem.minLimit : ''} 
                      onChange={(e) => setCurrentItem(prev => ({ ...prev, minLimit: Number(e.target.value) }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500 text-xs"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-white/40 uppercase tracking-wider">Storage Zones / location</label>
                    <input 
                      type="text" 
                      required
                      value={currentItem?.location || ''} 
                      onChange={(e) => setCurrentItem(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500 text-xs"
                      placeholder="Rack C-12, Lab Refrigerator"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-white/40 uppercase tracking-wider">Supplier Alliance</label>
                    <input 
                      type="text" 
                      required
                      value={currentItem?.supplier || ''} 
                      onChange={(e) => setCurrentItem(prev => ({ ...prev, supplier: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500 text-xs"
                      placeholder="Astra Suppliers Corp"
                    />
                  </div>
                </div>

                <div className="border-t border-white/5 pt-6 mt-8 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 border border-white/10 rounded-xl text-[10px] uppercase font-black tracking-widest text-white/55 hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 bg-[linear-gradient(135deg,#A855F7,#6a11cb)] rounded-xl text-[10px] uppercase font-black tracking-widest text-white hover:opacity-90 shadow-lg shadow-purple-950/40"
                  >
                    Commit Stock
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
