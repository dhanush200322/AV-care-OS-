import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Download, Printer } from 'lucide-react';
import { useStore, Invoice } from '../../store/useStore';
import { useTranslation } from '../../contexts/LanguageContext';

export const InvoiceModal = ({ invoice, onClose }: { invoice: Invoice; onClose: () => void }) => {
  const { t } = useTranslation();
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" 
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-[32px] overflow-hidden shadow-2xl"
      >
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-purple-500/10 to-transparent">
          <div>
            <h2 className="text-xl font-black text-white tracking-tight uppercase">{t('Invoice Details')}</h2>
            <p className="text-xs text-white/40 font-bold uppercase tracking-widest mt-1">{t('Ref')}: {invoice.id}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto no-scrollbar">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <label className="text-[10px] font-black text-white/20 uppercase tracking-widest block mb-1">{t('Patient')}</label>
              <p className="text-sm font-bold text-white">{t(invoice.patient)}</p>
            </div>
            <div className="text-right">
              <label className="text-[10px] font-black text-white/20 uppercase tracking-widest block mb-1">{t('Date')}</label>
              <p className="text-sm font-bold text-white">{invoice.date}</p>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-white/20 uppercase tracking-widest block mb-4">{t('Services Rendered')}</label>
            <div className="space-y-3">
              {invoice.services.map((s, i) => (
                <div key={i} className="flex justify-between items-center p-4 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-xs font-bold text-white/80">{t(s.name)}</span>
                  <span className="text-xs font-black text-white">₹{s.price.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 space-y-2">
            <div className="flex justify-between items-center text-white/40">
              <span className="text-[10px] font-black uppercase tracking-widest">{t('Subtotal')}</span>
              <span className="text-xs font-bold">₹{invoice.amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-white/40">
              <span className="text-[10px] font-black uppercase tracking-widest">{t('Tax (GST 18%)')}</span>
              <span className="text-xs font-bold">₹{(invoice.amount * 0.18).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pt-4">
              <span className="text-xs font-black text-white uppercase tracking-[0.2em]">{t('Total Amount')}</span>
              <span className="text-2xl font-black text-purple-400">₹{(invoice.amount * 1.18).toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div className="p-8 bg-white/[0.02] border-t border-white/5 flex gap-4">
           <button className="flex-1 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-purple-900/20 transition-all flex items-center justify-center gap-2">
             <Download size={14} /> {t('Download PDF')}
           </button>
           <button className="p-4 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-xl transition-all border border-white/5">
             <Printer size={18} />
           </button>
        </div>
      </motion.div>
    </div>
  );
};

export const GenerateInvoiceModal = ({ onClose }: { onClose: () => void }) => {
  const { addInvoice, prefilledInvoice, setPrefilledInvoice, markReportAsBilled } = useStore();
  const { t } = useTranslation();
  const [patient, setPatient] = useState('');
  const [service, setService] = useState('General Consultation');
  const [amount, setAmount] = useState('1500');

  useEffect(() => {
    if (prefilledInvoice) {
      setPatient(prefilledInvoice.patient || '');
      if (prefilledInvoice.services?.[0]) {
        setService(prefilledInvoice.services[0].name);
        setAmount(prefilledInvoice.services[0].price.toString());
      }
    }
  }, [prefilledInvoice]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patient || !amount) return;
    
    const invoiceId = addInvoice({
      patient,
      amount: Number(amount),
      status: 'Pending',
      services: [{ name: service, price: Number(amount) }]
    });

    if (prefilledInvoice?.id) {
       markReportAsBilled(prefilledInvoice.id, invoiceId);
    }
    
    handleClose();
  };

  const handleClose = () => {
    setPrefilledInvoice(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        onClick={handleClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" 
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-[32px] overflow-hidden shadow-2xl"
      >
        <form onSubmit={handleSubmit}>
          <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-purple-500/10 to-transparent">
            <h2 className="text-xl font-black text-white tracking-tight uppercase">{t('New Invoice')}</h2>
            <button type="button" onClick={handleClose} className="p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>
          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/20 uppercase tracking-widest">{t('Patient Name')}</label>
              <input 
                value={patient}
                onChange={e => setPatient(e.target.value)}
                placeholder={t('Search or enter patient name')}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/10 focus:outline-none focus:border-purple-500/50 transition-all font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/20 uppercase tracking-widest">{t('Primary Service')}</label>
              <div className="relative">
                <select 
                  value={service}
                  onChange={e => setService(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-all font-bold appearance-none pr-10"
                >
                  <option className="bg-slate-900 text-white" value="General Consultation">{t('General Consultation')}</option>
                  <option className="bg-slate-900 text-white" value="Pathology Lab">{t('Pathology Lab')}</option>
                  <option className="bg-slate-900 text-white" value="Lab Test">{t('Lab Test')}</option>
                  <option className="bg-slate-900 text-white" value="Radiology (X-Ray/Scan)">{t('Radiology (X-Ray/Scan)')}</option>
                  <option className="bg-slate-900 text-white" value="Emergency Care">{t('Emergency Care')}</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
                  <X size={12} className="rotate-45" />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/20 uppercase tracking-widest">{t('Base Amount (₹)')}</label>
              <input 
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-all font-bold"
              />
            </div>

            <div className="p-4 rounded-2xl bg-purple-500/5 border border-purple-500/10 space-y-2">
               <div className="flex justify-between text-[10px] font-bold text-white/30 uppercase tracking-widest">
                  <span>{t('Subtotal')}</span>
                  <span>₹{Number(amount).toLocaleString()}</span>
               </div>
               <div className="flex justify-between text-[10px] font-bold text-white/30 uppercase tracking-widest">
                  <span>{t('Tax (GST 18%)')}</span>
                  <span>₹{(Number(amount) * 0.18).toLocaleString()}</span>
               </div>
               <div className="flex justify-between items-center pt-2 border-t border-white/5">
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">{t('Estimated Total')}</span>
                  <span className="text-lg font-black text-purple-400">₹{(Number(amount) * 1.18).toLocaleString()}</span>
               </div>
            </div>
          </div>
          <div className="p-8 bg-white/[0.02] border-t border-white/5">
            <button type="submit" className="w-full py-4 bg-purple-500 hover:bg-purple-400 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-purple-900/20 transition-all">
              {t('Save Invoice')}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
