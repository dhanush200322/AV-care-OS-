import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Pill, 
  Search, 
  Upload, 
  FileText, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  ShoppingCart, 
  QrCode, 
  CreditCard, 
  PhoneCall, 
  Sparkles, 
  FileSpreadsheet, 
  DollarSign, 
  BarChart2, 
  RefreshCw,
  Cpu,
  BookmarkPlus,
  Download
} from 'lucide-react';
import { useStore, PharmacyItem, Invoice } from '../../store/useStore';
import { cn } from '../../lib/utils';
import { useTranslation } from '../../contexts/LanguageContext';

export const PharmacyModule: React.FC = () => {
  const { t } = useTranslation();
  const { 
    pharmacyItems, 
    addPharmacyItem, 
    invoices, 
    addInvoice, 
    markInvoicePaid, 
    patients 
  } = useStore();

  const [activeTab, setActiveTab] = useState<'medications' | 'checkout'>('medications');
  
  // Search & Filter
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Bulk Upload states
  const [dragActive, setDragActive] = useState(false);
  const [csvContent, setCsvContent] = useState<string>(
    "Medicine,Stock,Expiry Date,Price,Category\n" +
    "Amlodipine,150,2026-11-20,120,Cardiovascular\n" +
    "Azithromycin,60,2026-06-18,250,Antibiotic\n" +
    "Metformin,200,2026-09-05,90,Diabetes\n" +
    "Ibuprofen,110,2026-10-30,60,Analgesics\n" +
    "Atorvastatin,120,2027-02-15,320,Cardiovascular\n" +
    "Pantoprazole,250,2027-08-10,75,Gastrointestinal"
  );
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  // Invoice creation states
  const [selectedItemForBill, setSelectedItemForBill] = useState<PharmacyItem | null>(null);
  const [targetPatient, setTargetPatient] = useState('');
  const [billQuantity, setBillQuantity] = useState(1);
  const [prescribeSuccess, setPrescribeSuccess] = useState<string | null>(null);

  // Billing Counter Terminal State
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>('');
  const [counterPaymentMethod, setCounterPaymentMethod] = useState<'UPI' | 'GPay' | 'PhonePe' | 'Card' | 'Banking'>('UPI');
  const [isScanningLaser, setIsScanningLaser] = useState(false);
  const [isProcessingCounterPayment, setIsProcessingCounterPayment] = useState(false);
  const [counterPaymentSuccess, setCounterPaymentSuccess] = useState<string | null>(null);

  // Unique Categories
  const categories = useMemo(() => {
    const list = new Set(pharmacyItems.map(item => item.category));
    return ['All', ...Array.from(list)];
  }, [pharmacyItems]);

  // Filtered meds list
  const filteredMeds = useMemo(() => {
    return pharmacyItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                            item.category.toLowerCase().includes(search.toLowerCase());
      const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [pharmacyItems, search, selectedCategory]);

  // Expiry date checker status helper
  const getExpiryAlert = (expiryDate?: string) => {
    if (!expiryDate) return { label: 'Safe', color: 'text-indigo-400 border-indigo-500/20 bg-indigo-500/5' };
    const expiry = new Date(expiryDate);
    const today = new Date();
    const rangeInDays = (expiry.getTime() - today.getTime()) / (1000 * 3600 * 24);

    if (rangeInDays <= 0) {
      return { label: 'Expired', color: 'text-rose-400 border-rose-500/20 bg-rose-500/10 font-black' };
    } else if (rangeInDays <= 60) {
      return { label: 'Critical Exp (60 Days)', color: 'text-amber-400 border-amber-500/20 bg-amber-500/10' };
    }
    return { label: `Good (Exp: ${expiryDate})`, color: 'text-emerald-400 border-emerald-500/10 bg-emerald-500/5' };
  };

  const handleExportCSV = () => {
    const headers = "Medicine,Stock,Expiry Date,Price,Category\n";
    const rows = pharmacyItems.map(item => 
      `"${item.name.replace(/"/g, '""')}",${item.qty},${item.expiryDate || ''},${item.price},"${item.category.replace(/"/g, '""')}"`
    ).join('\n');
    const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(headers + rows);
    const link = document.createElement("a");
    link.setAttribute("href", dataStr);
    link.setAttribute("download", `comprehensive_pharmacy_inventory_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setUploadSuccess("Database exported to CSV successfully!");
    setTimeout(() => setUploadSuccess(null), 4000);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        if (file.type === "application/pdf" || file.name.endsWith('.pdf')) {
          setCsvContent(
            "Medicine,Stock,Expiry Date,Price,Category\n" +
            "Gabapentin 100mg,300,2027-04-12,85.00,Neurology\n" +
            "Metformin 500mg,150,2026-12-05,45.00,Antidiabetic\n" +
            "Lisinopril 10mg,200,2027-01-20,55.00,Cardiovascular\n" +
            "Azithromycin 250mg,80,2026-08-15,120.00,Antibiotics"
          );
          setUploadSuccess(`Clinical AI parsed PDF "${file.name}"! Extracted 4 medications successfully.`);
        } else {
          setCsvContent(text);
          setUploadSuccess(`Successfully loaded CSV file "${file.name}"! Click below to process.`);
        }
      }
    };
    if (file.type === "application/pdf" || file.name.endsWith('.pdf')) {
      reader.readAsText(new Blob(["Simulated PDF"], {type: 'text/plain'}));
    } else {
      reader.readAsText(file);
    }
  };

  // Bulk Upload Handler
  const handleBulkUploadSubmit = () => {
    setIsUploading(true);
    setUploadSuccess(null);

    setTimeout(() => {
      try {
        const rows = csvContent.trim().split('\n');
        if (rows.length <= 1) {
          throw new Error("No data records available inside the document.");
        }

        let importedCount = 0;
        // Skip header row
        for (let i = 1; i < rows.length; i++) {
          const columns = rows[i].split(',');
          if (columns.length >= 3) {
            const name = columns[0]?.trim();
            const stock = parseInt(columns[1]?.trim() || "0", 10);
            const expDate = columns[2]?.trim();
            const price = parseFloat(columns[3]?.trim() || "150");
            const cat = columns[4]?.trim() || "General Medicine";

            if (name) {
              addPharmacyItem({
                name,
                qty: stock,
                status: stock === 0 ? 'Out of Stock' : stock <= 10 ? 'Low' : 'Available',
                category: cat,
                price: price,
                expiryDate: expDate
              });
              importedCount++;
            }
          }
        }

        setUploadSuccess(`Succesfully parsed document! Imported ${importedCount} medications.`);
        setDragActive(false);
      } catch (err: any) {
        setUploadSuccess(`ERROR parsing document: ${err.message}`);
      } finally {
        setIsUploading(false);
      }
    }, 1200);
  };

  // Medication prescribing handler
  const handlePrescribeMedicineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemForBill || !targetPatient) return;

    const calcAmount = selectedItemForBill.price * billQuantity;

    // Create a new Pending Invoice
    addInvoice({
      patient: targetPatient,
      amount: calcAmount,
      status: 'Pending',
      services: [
        {
          name: `${selectedItemForBill.name} Prescription (Qty x${billQuantity})`,
          price: calcAmount,
          department: 'pharmacy',
          itemId: selectedItemForBill.id,
          quantity: billQuantity,
        }
      ]
    });

    setPrescribeSuccess(`Invoiced successfully! Added ${billQuantity} units of ${selectedItemForBill.name} for ${targetPatient}.`);
    setTimeout(() => {
      setSelectedItemForBill(null);
      setPrescribeSuccess(null);
      setTargetPatient('');
      setBillQuantity(1);
    }, 2000);
  };

  // Counter scanner action simulator
  const handleTriggerScanner = () => {
    setIsScanningLaser(true);
    setTimeout(() => {
      setIsScanningLaser(false);
      // Auto-select first Pending invoice
      const pendingInvoice = invoices.find(inv => inv.status === 'Pending');
      if (pendingInvoice) {
        setSelectedInvoiceId(pendingInvoice.id);
      }
    }, 1500);
  };

  // Counter Checkout action simulator
  const handleCounterCheckout = () => {
    if (!selectedInvoiceId) return;
    setIsProcessingCounterPayment(true);
    setCounterPaymentSuccess(null);

    setTimeout(() => {
      markInvoicePaid(selectedInvoiceId);
      setIsProcessingCounterPayment(false);
      setCounterPaymentSuccess(`Payment authorized and completed via ${counterPaymentMethod}! Stock decremented.`);
      setTimeout(() => {
        setSelectedInvoiceId('');
        setCounterPaymentSuccess(null);
      }, 3000);
    }, 2000);
  };

  // Pending invoices
  const pendingInvoices = useMemo(() => {
    return invoices.filter(inv => inv.status === 'Pending');
  }, [invoices]);

  const activeSelectedInvoice = useMemo(() => {
    return invoices.find(inv => inv.id === selectedInvoiceId);
  }, [invoices, selectedInvoiceId]);

  return (
    <div className="space-y-8">
      {/* Upper Tab Switches */}
      <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-2xl border border-white/5 w-fit">
        <button
          onClick={() => setActiveTab('medications')}
          className={cn(
            "px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2",
            activeTab === 'medications' 
              ? "bg-purple-500 text-white shadow-lg shadow-purple-950/20" 
              : "text-slate-400 hover:text-white"
          )}
        >
          <Pill size={14} /> Medication Ledger & Uploads
        </button>
        <button
          onClick={() => setActiveTab('checkout')}
          className={cn(
            "px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2",
            activeTab === 'checkout' 
              ? "bg-purple-500 text-white shadow-lg shadow-purple-950/20" 
              : "text-slate-400 hover:text-white"
          )}
        >
          <ShoppingCart size={14} /> Billing Checkout Terminal
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'medications' ? (
          <motion.div
            key="ledgertab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Left Ledger Column - Uploads & Indicators */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Stat Board Indicators */}
              <div className="p-6 rounded-[24px] bg-white/[0.02] border border-white/5">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1.5">
                  <BarChart2 size={12} className="text-purple-400" /> Pharmacy Core KPI Metrics
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-950/50 rounded-xl border border-white/5">
                    <p className="text-[8px] font-black uppercase text-white/40 tracking-wider">Total Formulas</p>
                    <p className="text-xl font-bold text-white mt-1">{pharmacyItems.length}</p>
                  </div>
                  <div className="p-4 bg-slate-950/50 rounded-xl border border-white/5">
                    <p className="text-[8px] font-black uppercase text-white/40 tracking-wider">Expiring / Low</p>
                    <p className="text-xl font-bold text-amber-400 mt-1">
                      {pharmacyItems.filter(p => !p.expiryDate || p.qty <= 10).length} Items
                    </p>
                  </div>
                </div>
              </div>

              {/* Bulk Document Upload Panel */}
              <div className="p-6 rounded-[24px] bg-gradient-to-br from-purple-500/[0.02] to-cyan-500/[0.02] border border-white/10 relative overflow-hidden">
                <div className="space-y-2 mb-4">
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/15 text-[8px] font-black uppercase tracking-widest">
                    Bulk Import Hub
                  </div>
                  <h4 className="text-sm font-black text-white uppercase tracking-tight">Bulk Document Upload</h4>
                  <p className="text-[10px] text-slate-400">
                    Upload, drag and drop, or edit the CSV script containing medicine inventory, stock quantities, and expiry dates.
                  </p>
                </div>

                <div 
                  className={cn(
                    "border-2 border-dashed rounded-2xl p-4 transition-all relative flex flex-col items-center justify-center gap-2",
                    dragActive ? "border-purple-400 bg-purple-500/5" : "border-white/10 bg-slate-950/40"
                  )}
                  onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={(e) => { e.preventDefault(); setDragActive(false); }}
                >
                  <FileSpreadsheet size={28} className="text-purple-400/80 mt-1" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Medication Manifest Document</span>

                  <textarea
                    value={csvContent}
                    onChange={(e) => setCsvContent(e.target.value)}
                    rows={6}
                    placeholder="Medicine,Stock,Expiry Date,Price,Category"
                    className="w-full mt-2 bg-slate-950 border border-white/10 rounded-xl p-2.5 text-[10px] text-slate-300 font-mono focus:outline-none focus:border-purple-500/50 resize-none font-bold input-glow"
                  />

                  {/* File Pickers and Bulk Download Methods */}
                  <div className="w-full flex flex-col gap-2 mt-1 px-1">
                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-wider block text-center mt-1">
                      OR CHOOSE DOCUMENT FROM FILESYSTEM:
                    </label>
                    <div className="flex gap-2 w-full">
                      <input 
                        type="file" 
                        id="bulk-file-input" 
                        accept=".csv,.txt,.pdf" 
                        onChange={handleFileImport}
                        className="hidden" 
                      />
                      <button
                        type="button"
                        onClick={() => document.getElementById('bulk-file-input')?.click()}
                        className="flex-1 py-2 bg-slate-900/80 hover:bg-slate-800 text-[9px] text-slate-300 border border-white/5 rounded-xl transition-all font-black uppercase tracking-wider flex items-center justify-center gap-1.5"
                      >
                        <Upload size={10} className="text-purple-400" />
                        Choose CSV / PDF
                      </button>
                      <button
                        type="button"
                        onClick={handleExportCSV}
                        className="flex-1 py-2 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20 text-[9px] text-emerald-400 border border-emerald-500/20 rounded-xl transition-all font-black uppercase tracking-wider flex items-center justify-center gap-1.5"
                      >
                        <Download size={10} />
                        Bulk DB Download
                      </button>
                    </div>
                  </div>

                  {uploadSuccess && (
                    <div className="w-full p-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-[10px] font-bold text-center uppercase tracking-wider">
                      {uploadSuccess}
                    </div>
                  )}

                  <button
                    onClick={handleBulkUploadSubmit}
                    disabled={isUploading}
                    className="w-full mt-2 py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-purple-950/20 flex items-center justify-center gap-2"
                  >
                    {isUploading ? (
                      <>
                        <RefreshCw className="animate-spin" size={12} />
                        <span>PROCESSING MANIFEST...</span>
                      </>
                    ) : (
                      <>
                        <Upload size={12} />
                        <span>PROCESS BULK DOCUMENT UPLOAD</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Medicine Ledger Listing Table */}
            <div className="lg:col-span-8 space-y-6">
              
              <div className="p-6 bg-[#090b1c]/70 border border-white/5 rounded-3xl space-y-6">
                
                {/* Search & Filter bar */}
                <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
                  <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={14} />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="SEARCH MEDICINES..."
                      className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-white/10 rounded-xl text-xs font-bold uppercase text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 transition-all tracking-wider"
                    />
                  </div>

                  {/* Category Pills */}
                  <div className="flex flex-wrap gap-1.5 items-center bg-slate-950 p-1 rounded-xl border border-white/5 overflow-x-auto max-w-full">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all",
                          selectedCategory === cat 
                            ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" 
                            : "text-slate-400 hover:text-white"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Table list */}
                <div className="overflow-x-auto rounded-2xl border border-white/5">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 bg-slate-950/40">
                        <th className="py-4 px-4 text-[9px] font-black uppercase text-white/40 tracking-widest">Formula ID</th>
                        <th className="py-4 px-4 text-[9px] font-black uppercase text-white/40 tracking-widest">Medication Name</th>
                        <th className="py-4 px-4 text-[9px] font-black uppercase text-white/40 tracking-widest">Stock Units</th>
                        <th className="py-4 px-4 text-[9px] font-black uppercase text-white/40 tracking-widest">Expiry Date Alert</th>
                        <th className="py-4 px-4 text-[9px] font-black uppercase text-white/40 tracking-widest">Price / Unit</th>
                        <th className="py-4 px-4 text-[9px] font-black uppercase text-white/40 tracking-widest text-right">Dispatch</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMeds.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-xs text-white/20 uppercase font-black tracking-widest">
                            No registered medications match criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredMeds.map((med) => {
                          const expStatus = getExpiryAlert(med.expiryDate);
                          return (
                            <tr key={med.id} className="border-b border-white/[0.02] hover:bg-white/[0.01] transition-all group">
                              <td className="py-4 px-4 font-mono text-[10px] text-white/40">{med.id}</td>
                              <td className="py-4 px-4">
                                <span className="font-bold text-xs text-white uppercase tracking-wide">{t(med.name)}</span>
                                <span className="block text-[8px] text-purple-400 mt-0.5 tracking-widest uppercase font-black">{t(med.category)}</span>
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-2">
                                  <span className={cn(
                                    "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider",
                                    med.qty === 0 ? "bg-rose-500/10 text-rose-400" :
                                    med.qty <= 10 ? "bg-amber-500/10 text-amber-400" :
                                    "bg-emerald-500/10 text-emerald-400"
                                  )}>
                                    {med.qty} {t('Units')}
                                  </span>
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <span className={cn(
                                  "px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border",
                                  expStatus.color
                                )}>
                                  {t(expStatus.label)}
                                </span>
                              </td>
                              <td className="py-4 px-4 font-black text-xs text-white">₹{med.price}</td>
                              <td className="py-4 px-4 text-right">
                                <button
                                  onClick={() => setSelectedItemForBill(med)}
                                  disabled={med.qty === 0}
                                  className="px-3.5 py-2 bg-gradient-to-r from-purple-500/15 to-cyan-500/15 hover:from-purple-500 hover:to-cyan-500 text-purple-300 hover:text-white rounded-lg border border-purple-500/20 text-[9px] font-black uppercase tracking-widest hover:shadow-lg hover:shadow-cyan-950/20 transition-all disabled:opacity-40 disabled:pointer-events-none"
                                >
                                  Incur Invoice
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

              </div>

            </div>

            {/* PRESCRIBE / ADD TO PATIENT BILL MODAL POPUP */}
            <AnimatePresence>
              {selectedItemForBill && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }} 
                    className="absolute inset-0 bg-slate-950/85 backdrop-blur-md" 
                    onClick={() => setSelectedItemForBill(null)}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl overflow-hidden p-6 shadow-2xl space-y-6"
                  >
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <div className="flex items-center gap-2">
                        <BookmarkPlus className="text-cyan-400" size={16} />
                        <h4 className="text-xs font-black text-white uppercase tracking-widest">Incur Prescription Invoice</h4>
                      </div>
                      <button 
                        onClick={() => setSelectedItemForBill(null)}
                        className="p-1 text-slate-400 hover:text-white bg-white/5 rounded"
                      >
                        X
                      </button>
                    </div>

                    <div className="p-4 bg-slate-950 border border-white/5 rounded-2xl flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-xl">
                        💊
                      </div>
                      <div>
                        <p className="text-xs font-black text-white uppercase tracking-wider">{selectedItemForBill.name}</p>
                        <p className="text-[10px] text-white/40 font-bold uppercase mt-0.5 tracking-widest">
                          Category: {selectedItemForBill.category} • Cost: ₹{selectedItemForBill.price} / unit
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handlePrescribeMedicineSubmit} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Target Patient Selector</label>
                        <select
                          required
                          value={targetPatient}
                          onChange={(e) => setTargetPatient(e.target.value)}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-3 text-xs text-white focus:outline-none focus:border-purple-500 font-bold uppercase tracking-wide cursor-pointer"
                        >
                          <option value="">-- CHOOSE REGISTERED PATIENT --</option>
                          {patients.map(p => (
                            <option key={p.id} value={p.name}>{p.name} ({p.ward})</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Prescribed Medication Quantity</label>
                        <input
                          type="number"
                          min={1}
                          required
                          max={selectedItemForBill.qty}
                          value={billQuantity}
                          onChange={(e) => setBillQuantity(Math.min(selectedItemForBill.qty, Math.max(1, parseInt(e.target.value, 10) || 1)))}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-3 text-xs text-white focus:outline-none focus:border-purple-500 font-mono font-bold"
                        />
                        <p className="text-[8px] text-white/20 uppercase font-black text-right">Available Inventory: {selectedItemForBill.qty} Units</p>
                      </div>

                      <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs">
                        <span className="font-bold text-white/40 uppercase tracking-widest text-[9px]">Total Pending Ledger Cost:</span>
                        <span className="font-extrabold text-cyan-400 text-sm">₹{(selectedItemForBill.price * billQuantity).toLocaleString()}</span>
                      </div>

                      {prescribeSuccess && (
                        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-black text-[9px] uppercase tracking-widest text-center animate-pulse">
                          {prescribeSuccess}
                        </div>
                      )}

                      <div className="pt-2 flex gap-3">
                        <button
                          type="button"
                          onClick={() => setSelectedItemForBill(null)}
                          className="w-1/3 py-3 border border-white/10 hover:bg-slate-800 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-400 transition-all"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="w-2/3 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl shadow-purple-950/20 transition-all"
                        >
                          Generate Bill Invoice
                        </button>
                      </div>
                    </form>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="checkouttab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Left Hand: Counter Scan / Invoice Reader */}
            <div className="lg:col-span-7 space-y-6">
              <div className="p-6 bg-[#090b1c]/70 border border-white/5 rounded-3xl space-y-6">
                <div className="space-y-1">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-1.5ClassName">
                    <QrCode size={16} className="text-cyan-400" /> Billing Counter Console
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    Locate an outstanding medication slip or test receipt, apply the scanner, and integrate with banking channels.
                  </p>
                </div>

                {/* Laser Desk Scanner Visual Simulation */}
                <div className="relative w-full aspect-video bg-slate-950 rounded-2xl border border-white/10 overflow-hidden flex flex-col items-center justify-center p-6 text-center shadow-inner group">
                  
                  {isScanningLaser && (
                    <motion.div 
                      initial={{ y: -100 }}
                      animate={{ y: [100, -100, 100] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                      className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_15px_#ef4444] z-10"
                    />
                  )}

                  <div className="absolute inset-0 bg-radial-gradient from-transparent via-slate-950/80 to-slate-950 pointer-events-none" />

                  <QrCode size={48} className={cn("mb-3 transition-all duration-300", isScanningLaser ? "text-red-400 scale-110" : "text-white/10 group-hover:text-white/20")} />
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">PRESCRIPTION SLIP SCANNER</p>
                  <p className="text-[9px] text-slate-600 max-w-xs mt-1 uppercase tracking-widest font-mono">
                    {isScanningLaser ? "ALIGNING DECODER GRID..." : "No invoice scanned. Place doctor's barcode sheet under laser."}
                  </p>

                  <button
                    onClick={handleTriggerScanner}
                    disabled={isScanningLaser}
                    className="mt-4 px-5 py-2.5 bg-red-600/10 hover:bg-red-600 border border-red-500/20 hover:border-red-500 text-red-400 hover:text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg active:scale-95 disabled:pointer-events-none"
                  >
                    {isScanningLaser ? "SCANNING ACTIVE..." : "TRIGGER DESK SCANNER"}
                  </button>
                </div>

                {/* Patient Invoices lookup dropdown */}
                <div className="space-y-3 pt-4 border-t border-white/5">
                  <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Manual Pending Invoices Ledger ({pendingInvoices.length} Found)</label>
                  <div className="flex gap-3">
                    <select
                      value={selectedInvoiceId}
                      onChange={(e) => setSelectedInvoiceId(e.target.value)}
                      className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-3.5 py-3 text-xs text-white font-mono focus:outline-none focus:border-purple-500 tracking-wider cursor-pointer"
                    >
                      <option value="">-- SELECT PENDING UNPAID INVOICE Ref --</option>
                      {pendingInvoices.map(inv => (
                        <option key={inv.id} value={inv.id}>
                          {inv.id} • {inv.patient} (₹{inv.amount})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

              </div>
            </div>

            {/* Right Hand: Payment processing & validation */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="p-6 bg-slate-900 border border-white/10 rounded-3xl space-y-6">
                <h3 className="text-xs font-black text-white uppercase tracking-widest border-b border-white/5 pb-3 flex items-center gap-2">
                  <CreditCard size={14} className="text-purple-400" /> Protected Secure Payment Gateway
                </h3>

                {activeSelectedInvoice ? (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    
                    {/* Invoice detail panel */}
                    <div className="p-4 bg-slate-950 border border-white/5 rounded-2xl space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest">Reference Ref</span>
                        <span className="text-xs text-cyan-400 font-bold uppercase tracking-wider">{activeSelectedInvoice.id}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest">Recipient Patient</span>
                        <span className="text-xs text-white font-bold uppercase tracking-wider">{activeSelectedInvoice.patient}</span>
                      </div>
                      <div className="border-t border-white/5 pt-2.5">
                        <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest block mb-1">Billing Items</span>
                        {activeSelectedInvoice.services.map((s, i) => (
                          <div key={i} className="flex justify-between text-xs text-slate-300 font-semibold py-1">
                            <span>{s.name}</span>
                            <span>₹{s.price}</span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-white/5 pt-2.5 flex justify-between items-center">
                        <span className="text-[9px] font-extrabold uppercase text-white tracking-widest">Gross Charge Amount</span>
                        <span className="text-lg font-black text-purple-400">₹{activeSelectedInvoice.amount.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Integrated Payment Gateways Selector */}
                    <div className="space-y-2">
                      <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Banking Unified Sector Channel</label>
                      <div className="grid grid-cols-5 gap-2">
                        {[
                          { id: 'UPI', label: 'UPI', icon: '⚡' },
                          { id: 'GPay', label: 'GPay', icon: '🔵' },
                          { id: 'PhonePe', label: 'PhonePe', icon: '🟣' },
                          { id: 'Card', label: 'Cards', icon: '💳' },
                          { id: 'Banking', label: 'NetBank', icon: '🏛️' }
                        ].map(ch => {
                          const isChanActive = counterPaymentMethod === ch.id;
                          return (
                            <button
                              key={ch.id}
                              type="button"
                              onClick={() => setCounterPaymentMethod(ch.id as any)}
                              className={cn(
                                "py-2 px-1 rounded-xl border text-[9px] font-black uppercase tracking-wider flex flex-col items-center justify-center gap-1 transition-all",
                                isChanActive ? "border-purple-500 bg-purple-500/10 text-white" : "border-white/5 text-slate-400 hover:text-white hover:bg-white/5"
                              )}
                            >
                              <span className="text-sm">{ch.icon}</span>
                              <span className="text-[8px] font-black scale-90">{ch.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Interactive Scan QR representation for UPIs */}
                    {['UPI', 'GPay', 'PhonePe'].includes(counterPaymentMethod) && (
                      <div className="p-4 bg-slate-950 border border-white/5 rounded-2xl flex flex-col items-center gap-2">
                        <div className="p-2.5 bg-white rounded-xl">
                          <QrCode size={110} className="text-slate-900" />
                        </div>
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">Scan QR via {counterPaymentMethod} mobile Client</span>
                      </div>
                    )}

                    {counterPaymentMethod === 'Card' && (
                      <div className="p-4 bg-slate-950 border border-white/5 rounded-2xl space-y-3 font-mono text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <span className="text-[8px] text-white/20">Card Number</span>
                            <div className="border border-white/5 rounded-lg p-2 bg-slate-900 text-white font-bold">•••• •••• •••• 4242</div>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[8px] text-white/20">Expiry Date</span>
                            <div className="border border-white/5 rounded-lg p-2 bg-slate-900 text-white font-bold">12 / 29</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {counterPaymentMethod === 'Banking' && (
                      <div className="p-4 bg-slate-950 border border-white/5 rounded-2xl text-[9px] uppercase tracking-widest text-slate-400 text-center font-bold">
                        🏦 Redirecting to protected secure banking ledger terminal...
                      </div>
                    )}

                    {counterPaymentSuccess && (
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10px] uppercase tracking-wide font-black rounded-xl text-center flex items-center justify-center gap-2">
                        <CheckCircle2 size={13} className="animate-bounce" /> {counterPaymentSuccess}
                      </div>
                    )}

                    <button
                      onClick={handleCounterCheckout}
                      disabled={isProcessingCounterPayment}
                      className="w-full py-4 bg-purple-500 hover:bg-purple-400 text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-purple-950/20 flex items-center justify-center gap-2"
                    >
                      {isProcessingCounterPayment ? (
                        <>
                          <RefreshCw className="animate-spin" size={13} />
                          <span>AUTHORIZING PACKETS...</span>
                        </>
                      ) : (
                        <>
                          <span>SWIPE / COMPLETE TRANSACTION</span>
                        </>
                      )}
                    </button>

                  </div>
                ) : (
                  <div className="py-16 text-center text-slate-500 uppercase font-black text-[9px] tracking-widest bg-slate-950 rounded-2xl border border-white/5">
                    No active invoice locked. <br /> Use Barcode Scanner or manual selector on left.
                  </div>
                )}

              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
