import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Pill, 
  Search, 
  Plus, 
  AlertTriangle, 
  ArrowUpRight, 
  CheckCircle2, 
  History,
  ShoppingCart
} from 'lucide-react';
import { cn } from '../../lib/utils';

const PHARMACY_DATA = [
  { name: "Paracetamol", qty: 120, status: "Available", category: "Analgesic", price: 50 },
  { name: "Amoxicillin", qty: 45, status: "Available", category: "Antibiotic", price: 210 },
  { name: "Insulin", qty: 5, status: "Low", category: "Diabetes", price: 850 },
  { name: "Cough Syrup", qty: 0, status: "Out of Stock", category: "Respiratory", price: 120 },
  { name: "Vitamin C", qty: 250, status: "Available", category: "Supplement", price: 45 }
];

export const PharmacyModule: React.FC = () => {
  const [search, setSearch] = useState('');

  const filtered = PHARMACY_DATA.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) || 
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Inventory', val: '4,280', icon: Pill, color: 'text-blue-400' },
          { label: 'Low Stock Items', val: '12', icon: AlertTriangle, color: 'text-rose-400' },
          { label: 'Daily Dispensed', val: '142', icon: ArrowUpRight, color: 'text-emerald-400' },
          { label: 'Revenue (24h)', val: '₹18.4k', icon: ShoppingCart, color: 'text-purple-400' }
        ].map((stat, i) => (
          <div key={i} className="p-6 rounded-[24px] bg-white/[0.03] border border-white/10">
            <div className="flex justify-between items-start mb-4">
              <div className={cn("p-3 rounded-xl bg-white/5", stat.color)}>
                <stat.icon size={20} />
              </div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">{stat.label}</p>
            <h3 className="text-2xl font-black text-white">{stat.val}</h3>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
          <input
            type="text"
            placeholder="Search medicine inventory..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-white focus:outline-none focus:border-purple-500/50 transition-all font-mono"
          />
        </div>
        <div className="flex gap-2">
           <button className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/[0.03] border border-white/10 text-white/40 hover:text-white transition-all text-xs font-black uppercase tracking-widest">
              <History size={16} /> History
           </button>
           <button className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-purple-500 hover:bg-purple-400 text-white transition-all text-xs font-black uppercase tracking-widest">
              <Plus size={16} /> Add Medicine
           </button>
        </div>
      </div>

      <div className="p-8 rounded-[32px] bg-white/[0.03] border border-white/10 backdrop-blur-3xl overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 text-[10px] font-black uppercase tracking-widest text-white/20">
              <th className="pb-4 px-4 font-mono">Medicine Name</th>
              <th className="pb-4 px-4">Category</th>
              <th className="pb-4 px-4">Stock Qty</th>
              <th className="pb-4 px-4">Unit Price</th>
              <th className="pb-4 px-4 text-center">Status</th>
              <th className="pb-4 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, i) => (
              <motion.tr 
                key={i} 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="border-b border-white/[0.02] hover:bg-white/[0.01] transition-colors"
              >
                <td className="py-5 px-4 font-bold text-white">{item.name}</td>
                <td className="py-5 px-4 text-[10px] font-black text-white/40 uppercase tracking-widest">{item.category}</td>
                <td className="py-5 px-4 font-mono text-[11px] text-white/60">
                   <span className={cn(item.qty <= 10 ? "text-rose-400 font-bold" : "")}>{item.qty} Units</span>
                </td>
                <td className="py-5 px-4 font-black text-white">₹{item.price}</td>
                <td className="py-5 px-4">
                  <div className={cn(
                    "mx-auto w-fit px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5",
                    item.status === 'Available' ? "bg-emerald-500/10 text-emerald-400" : 
                    item.status === 'Low' ? "bg-amber-500/10 text-amber-500" : "bg-rose-500/10 text-rose-500"
                  )}>
                    {item.status === 'Available' ? <CheckCircle2 size={10} /> : <AlertTriangle size={10} />}
                    {item.status}
                  </div>
                </td>
                <td className="py-5 px-4 text-right">
                  <div className="flex justify-end gap-2">
                     <button className="px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-[9px] font-black uppercase tracking-widest text-purple-400 hover:bg-purple-500 hover:text-white transition-all">
                        Add to Invoice
                     </button>
                     <button className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-white/40 hover:text-white transition-all">
                        <History size={16} />
                     </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
