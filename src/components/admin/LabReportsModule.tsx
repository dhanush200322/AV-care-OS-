import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  FlaskConical, 
  Search, 
  Download, 
  Eye, 
  CheckCircle2, 
  Clock, 
  FileText,
  Filter,
  CreditCard,
  AlertCircle
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useStore } from '../../store/useStore';
import { EmptyState } from './EmptyState';
import { useTranslation } from '../../contexts/LanguageContext';
import { printLabReport } from '../../lib/printHelper';

const labTests = [
  { name: "CBC", price: 300 },
  { name: "Lipid Profile", price: 800 },
  { name: "HbA1c", price: 450 },
  { name: "Liver Function Test", price: 1200 },
  { name: "MRI Scan", price: 15000 }
];

export const LabReportsModule: React.FC = () => {
  const { t } = useTranslation();
  const { 
    labReports, 
    invoices,
    setPrefilledInvoice, 
    setIsBillingModalOpen, 
    setSelectedInvoice,
    addNotification 
  } = useStore();
  const [search, setSearch] = useState('');

  if (labReports.length === 0) {
    return <EmptyState title="No Lab Reports" description="Laboratory queue is empty. Pending diagnostic tests will appear here." icon={FlaskConical} />;
  }

  const getTestPrice = (testName: string) => {
    const test = labTests.find(t => testName.includes(t.name));
    return test ? test.price : 500;
  };

  const handleGenerateBill = (report: any) => {
    if (report.status !== 'Completed') {
       addNotification({
          message: "Complete the test before billing",
          type: 'system'
       });
       return;
    }
    
    if (report.billed) return;

    setPrefilledInvoice({
       id: report.id,
       patient: report.patient,
       amount: getTestPrice(report.test),
       services: [{
         name: `Lab Test: ${report.test}`,
         price: getTestPrice(report.test),
         department: 'lab',
         labReportId: report.id,
       }]
    });
    
    setIsBillingModalOpen(true);
  };

  const handleViewInvoice = (invoiceId: string) => {
    const invoice = invoices.find(i => i.id === invoiceId);
    if (invoice) {
       setSelectedInvoice(invoice);
    }
  };

  const filtered = labReports.filter(item => 
    item.patient.toLowerCase().includes(search.toLowerCase()) || 
    item.test.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Samples Collected', val: '84', icon: FlaskConical, color: 'text-purple-400' },
          { label: 'Pending Reports', val: '18', icon: Clock, color: 'text-amber-400' },
          { label: 'Reports Completed', val: '66', icon: CheckCircle2, color: 'text-emerald-400' },
          { label: 'Urgent Processing', val: '4', icon: FileText, color: 'text-rose-400' }
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
            placeholder="Search lab records..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-white focus:outline-none focus:border-purple-500/50 transition-all font-mono"
          />
        </div>
        <div className="flex gap-2">
           <button className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/[0.03] border border-white/10 text-white/40 hover:text-white transition-all text-xs font-black uppercase tracking-widest">
              <Filter size={16} /> Filters
           </button>
        </div>
      </div>

      <div className="p-8 rounded-[32px] bg-white/[0.03] border border-white/10 backdrop-blur-3xl overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 text-[10px] font-black uppercase tracking-widest text-white/20">
              <th className="pb-4 px-4 font-mono">Test Ref</th>
              <th className="pb-4 px-4">Patient</th>
              <th className="pb-4 px-4">Test Profile</th>
              <th className="pb-4 px-4 text-center">Status</th>
              <th className="pb-4 px-4 text-center">Billing</th>
              <th className="pb-4 px-4">Date</th>
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
                <td className="py-5 px-4 text-[10px] font-semibold tracking-wider text-white/50">{item.id}</td>
                <td className="py-5 px-4">
                   <div className="font-bold text-sm text-white">{t(item.patient)}</div>
                   <div className="text-[9px] text-white/20 uppercase tracking-widest font-black">{t(item.technician)}</div>
                </td>
                <td className="py-5 px-4 font-bold text-white/80">{t(item.test)}</td>
                <td className="py-5 px-4">
                  <div className={cn(
                    "mx-auto w-fit px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5",
                    item.status === 'Completed' ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-500"
                  )}>
                    {item.status === 'Completed' ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                    {t(item.status)}
                  </div>
                </td>
                <td className="py-5 px-4">
                  <div className={cn(
                    "mx-auto w-fit px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5",
                    item.billed ? "bg-purple-500/20 text-purple-400 border border-purple-500/30" : "bg-white/5 text-white/20 border border-white/5"
                  )}>
                    {item.billed ? (
                       <button 
                         onClick={() => item.invoiceId && handleViewInvoice(item.invoiceId)}
                         className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer group"
                         title="Click to view invoice"
                       >
                         <CreditCard size={10} />
                         <span className="underline decoration-purple-500/50 group-hover:decoration-white">{item.invoiceId}</span>
                       </button>
                    ) : (
                       <span>{t('Not Billed')}</span>
                    )}
                  </div>
                </td>
                <td className="py-5 px-4 text-[10px] font-bold text-white/40">{item.date}</td>
                <td className="py-5 px-4 text-right">
                  <div className="flex justify-end gap-2 text-white">
                     {item.billed ? (
                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-white/20 text-[9px] font-black uppercase tracking-widest cursor-not-allowed">
                           {t('Invoice Created')}
                        </div>
                     ) : (
                        <button 
                          onClick={() => handleGenerateBill(item)}
                          className={cn(
                            "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                            item.status === 'Completed' 
                              ? "bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500 hover:text-white"
                              : "bg-white/5 border border-white/5 text-white/20 opacity-50 cursor-not-allowed"
                          )}
                        >
                           {item.status === 'Completed' ? t('Generate Bill') : t('Pending Result')}
                        </button>
                     )}
                     <button 
                       onClick={() => printLabReport(item, t)}
                       className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-white/40 hover:text-white transition-all"
                       title="View Lab Report"
                     >
                        <Eye size={16} />
                     </button>
                     <button 
                       onClick={() => printLabReport(item, t)}
                       className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-white/40 hover:text-white transition-all"
                       title="Download Lab Report PDF"
                     >
                        <Download size={16} />
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
