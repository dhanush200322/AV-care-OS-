import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CreditCard, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Bell, 
  Plus, 
  ChevronRight,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  ShieldCheck,
  RotateCcw,
  BarChart3,
  TrendingUp,
  X,
  Printer
} from 'lucide-react';
import { useStore, Invoice, Payment, InsuranceClaim, Refund } from '../../store/useStore';
import { cn } from '../../lib/utils';
import { GenerateInvoiceModal, InvoiceModal } from './BillingModals';
import { EmptyState } from './EmptyState';

// --- Components ---

const StatCard = ({ title, value, subValue, icon: Icon, trend, color }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="p-6 rounded-[24px] bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all group"
  >
    <div className="flex justify-between items-start mb-4">
      <div className={cn("p-3 rounded-xl bg-white/5 border border-white/5", color)}>
        <Icon size={20} />
      </div>
      {trend && (
        <span className={cn("text-[10px] font-black px-2 py-1 rounded-full bg-white/5 uppercase tracking-widest", trend > 0 ? "text-emerald-400" : "text-rose-400")}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-1">{title}</p>
    <h3 className="text-2xl font-black text-white">{value}</h3>
    {subValue && <p className="text-[10px] font-bold text-white/20 mt-1 uppercase tracking-widest">{subValue}</p>}
  </motion.div>
);

// --- Main Module ---

export const BillingModule: React.FC<{ subTab?: string }> = ({ subTab = 'invoices' }) => {
  const { 
    invoices, 
    payments, 
    claims, 
    refunds, 
    markInvoicePaid, 
    isBillingModalOpen, 
    setIsBillingModalOpen,
    selectedInvoice,
    setSelectedInvoice
  } = useStore();
  const [search, setSearch] = useState('');

  // KPIs
  const stats = useMemo(() => {
    const totalRev = invoices.filter(i => i.status === 'Paid').reduce((acc, curr) => acc + curr.amount, 0);
    const pending = invoices.filter(i => i.status === 'Pending').reduce((acc, curr) => acc + curr.amount, 0);
    const today = invoices.filter(i => i.date === new Date().toISOString().split('T')[0]).reduce((acc, curr) => acc + curr.amount, 0);
    return { totalRev, pending, today };
  }, [invoices]);

  const filteredInvoices = invoices.filter(i => 
    i.id.toLowerCase().includes(search.toLowerCase()) || 
    i.patient.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header Stat Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Revenue" value={`₹${stats.totalRev.toLocaleString()}`} icon={TrendingUp} color="text-purple-400" />
        <StatCard title="Pending Outstanding" value={`₹${stats.pending.toLocaleString()}`} icon={Clock} color="text-amber-400" />
        <StatCard title="Collection (24h)" value={`₹${stats.today.toLocaleString()}`} icon={ArrowUpRight} color="text-emerald-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-12 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
              <input
                type="text"
                placeholder={`Search ${subTab}...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-white focus:outline-none focus:border-purple-500/50 transition-all"
              />
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-3.5 rounded-2xl bg-white/[0.03] border border-white/10 text-white/40 hover:text-white transition-all text-xs font-black uppercase tracking-widest">
                <Filter size={16} /> Filters
              </button>
              {subTab === 'invoices' && (
                <button 
                  onClick={() => setIsBillingModalOpen(true)}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-purple-500 hover:bg-purple-400 text-white transition-all text-xs font-black uppercase tracking-widest shadow-xl shadow-purple-900/40"
                >
                  <Plus size={16} /> New Invoice
                </button>
              )}
            </div>
          </div>

          <div className="p-8 rounded-[32px] bg-white/[0.03] border border-white/10 backdrop-blur-3xl overflow-hidden shadow-2xl">
            {subTab === 'invoices' && (
              <>
                {filteredInvoices.length === 0 ? (
                  <div className="py-12 text-center text-white/40 uppercase tracking-widest text-xs font-black">
                     No invoices found.
                  </div>
                ) : (
                  <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-white/20 px-4">Invoice ID</th>
                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-white/20 px-4">Patient</th>
                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-white/20 px-4">Amount</th>
                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-white/20 px-4 text-center">Status</th>
                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-white/20 px-4">Date</th>
                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-white/20 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((inv) => (
                    <motion.tr 
                      key={inv.id} 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }}
                      className="border-b border-white/[0.02] hover:bg-white/[0.01] transition-colors group"
                    >
                      <td className="py-5 px-4 font-mono text-[11px] text-white/60">{inv.id}</td>
                      <td className="py-5 px-4">
                        <div className="font-bold text-sm text-white">{inv.patient}</div>
                        <div className="text-[10px] text-white/20 uppercase font-black tracking-widest">Self Pay</div>
                      </td>
                      <td className="py-5 px-4 font-black text-white">₹{inv.amount.toLocaleString()}</td>
                      <td className="py-5 px-4">
                        <div className={cn(
                          "mx-auto w-fit px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5",
                          inv.status === 'Paid' ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-500"
                        )}>
                          {inv.status === 'Paid' ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                          {inv.status}
                        </div>
                      </td>
                      <td className="py-5 px-4 text-[10px] font-bold text-white/40">{inv.date}</td>
                      <td className="py-5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                           <button 
                             onClick={() => setSelectedInvoice(inv)}
                             className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-white/40 hover:text-white transition-all"
                           >
                             <Eye size={16} />
                           </button>
                           {inv.status === 'Pending' && (
                             <button 
                               onClick={() => markInvoicePaid(inv.id)}
                               className="px-4 py-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500 hover:text-white text-[9px] font-black uppercase tracking-widest transition-all"
                             >
                               Mark Paid
                             </button>
                           )}
                           <button className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-white/40 hover:text-white transition-all">
                             <Download size={16} />
                           </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
                )}
              </>
            )}

            {subTab === 'payments' && (
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-white/20 px-4 text-center">ID</th>
                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-white/20 px-4">Method</th>
                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-white/20 px-4">Inv Ref</th>
                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-white/20 px-4">Amount</th>
                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-white/20 px-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.id} className="border-b border-white/[0.02] hover:bg-white/[0.01]">
                      <td className="py-5 px-4 text-center font-mono text-[10px] text-white/60">{p.id}</td>
                      <td className="py-5 px-4">
                         <div className="flex items-center gap-2">
                            <CreditCard size={14} className="text-white/20" />
                            <span className="text-sm font-bold text-white">{p.method}</span>
                         </div>
                      </td>
                      <td className="py-5 px-4 text-[10px] font-black text-purple-400/60 uppercase racking-widest">{p.invoiceId}</td>
                      <td className="py-5 px-4 font-black text-white">₹{p.amount.toLocaleString()}</td>
                      <td className="py-5 px-4 text-[10px] font-bold text-white/40">{p.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {subTab === 'insurance' && (
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-white/20 px-4">Claim ID</th>
                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-white/20 px-4">Patient</th>
                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-white/20 px-4">Provider</th>
                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-white/20 px-4 text-center">Status</th>
                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-white/20 px-4">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {claims.map((c) => (
                    <tr key={c.id} className="border-b border-white/[0.02]">
                      <td className="py-5 px-4 font-mono text-[10px] text-white/60">{c.id}</td>
                      <td className="py-5 px-4 font-bold text-white">{c.patient}</td>
                      <td className="py-5 px-4 text-[10px] font-black text-blue-400 uppercase tracking-widest">{c.provider}</td>
                      <td className="py-5 px-4">
                        <div className={cn(
                          "mx-auto w-fit px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                          c.status === 'Approved' ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-white/20"
                        )}>
                          {c.status}
                        </div>
                      </td>
                      <td className="py-5 px-4 font-black text-white">₹{c.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {subTab === 'refunds' && (
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-white/20 px-4">ID</th>
                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-white/20 px-4">Patient</th>
                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-white/20 px-4">Reason</th>
                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-white/20 px-4 text-center">Status</th>
                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-white/20 px-4">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {refunds.map((r) => (
                    <tr key={r.id} className="border-b border-white/[0.02]">
                      <td className="py-5 px-4 font-mono text-[10px] text-white/60">{r.id}</td>
                      <td className="py-5 px-4 font-bold text-white">{r.patient}</td>
                      <td className="py-5 px-4 text-xs text-white/40">{r.reason}</td>
                      <td className="py-5 px-4 text-center">
                        <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-[9px] font-black uppercase tracking-widest">
                          {r.status}
                        </span>
                      </td>
                      <td className="py-5 px-4 font-black text-rose-400">₹{r.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {subTab === 'reports' && (
              <EmptyState title="No Financial Analytics" description="There is currently not enough data to generate financial reports and forecasts." icon={BarChart3} />
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
      </AnimatePresence>
    </div>
  );
};
