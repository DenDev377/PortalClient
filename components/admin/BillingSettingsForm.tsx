"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, CheckCircle2, Building, Receipt, Bell } from "lucide-react";

export default function BillingSettingsForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Form State
  const [companyName, setCompanyName] = useState("");
  const [taxRate, setTaxRate] = useState("11");
  const [currency, setCurrency] = useState("IDR");
  const [invoicePrefix, setInvoicePrefix] = useState("INV");
  const [dueDays, setDueDays] = useState("14");
  const [autoReminder, setAutoReminder] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    setIsClient(true);
    const savedSettings = localStorage.getItem("billing_settings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        if (parsed.companyName) setCompanyName(parsed.companyName);
        if (parsed.taxRate) setTaxRate(parsed.taxRate);
        if (parsed.currency) setCurrency(parsed.currency);
        if (parsed.invoicePrefix) setInvoicePrefix(parsed.invoicePrefix);
        if (parsed.dueDays) setDueDays(parsed.dueDays);
        if (parsed.autoReminder !== undefined) setAutoReminder(parsed.autoReminder);
      } catch (e) {
        // Abaikan jika format error
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    // Simulasi request ke server
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Save to localStorage
    const settings = {
      companyName,
      taxRate,
      currency,
      invoicePrefix,
      dueDays,
      autoReminder,
    };
    
    localStorage.setItem("billing_settings", JSON.stringify(settings));

    setLoading(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 5000);
  };

  // Prevent hydration mismatch
  if (!isClient) return <div className="h-40 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-slate-300" /></div>;

  return (
    <div className="space-y-6">
      {success && (
        <div className="flex items-center gap-2 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-sm">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <p>Pengaturan penagihan berhasil disimpan di browser (Local Storage).</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Info Perusahaan */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4 flex items-center gap-2">
            <Building className="w-5 h-5 text-slate-400" />
            <h2 className="text-base font-semibold text-slate-800">Identitas Penagihan</h2>
          </div>
          <div className="p-6">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama Perusahaan / Agensi</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Contoh: PT Koding Hebat"
              className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E15A3E]/40 focus:border-[#E15A3E] transition-all max-w-md"
            />
            <p className="mt-1.5 text-xs text-slate-500">
              Nama ini akan muncul sebagai pengirim di setiap invoice (Jika didukung oleh PDF Generator nantinya).
            </p>
          </div>
        </div>

        {/* Preferensi Invoice */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-slate-400" />
            <h2 className="text-base font-semibold text-slate-800">Preferensi Invoice</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Prefix Nomor Invoice</label>
              <input
                type="text"
                value={invoicePrefix}
                onChange={(e) => setInvoicePrefix(e.target.value)}
                placeholder="Contoh: INV"
                className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E15A3E]/40 focus:border-[#E15A3E] transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Mata Uang Default</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E15A3E]/40 focus:border-[#E15A3E] transition-all"
              >
                <option value="IDR">IDR - Rupiah Indonesia</option>
                <option value="USD">USD - US Dollar</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Rate Pajak Default (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E15A3E]/40 focus:border-[#E15A3E] transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Termin Pembayaran (Hari)</label>
              <input
                type="number"
                min="1"
                value={dueDays}
                onChange={(e) => setDueDays(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E15A3E]/40 focus:border-[#E15A3E] transition-all"
              />
            </div>
          </div>
        </div>

        {/* Notifikasi */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-slate-400" />
            <h2 className="text-base font-semibold text-slate-800">Notifikasi Klien</h2>
          </div>
          <div className="p-6">
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center mt-0.5">
                <input
                  type="checkbox"
                  checked={autoReminder}
                  onChange={(e) => setAutoReminder(e.target.checked)}
                  className="peer sr-only"
                />
                <div className="w-5 h-5 border-2 border-slate-300 rounded bg-white peer-checked:bg-[#E15A3E] peer-checked:border-[#E15A3E] transition-colors"></div>
                <CheckCircle2 className="w-3.5 h-3.5 text-white absolute opacity-0 peer-checked:opacity-100 transition-opacity" />
              </div>
              <div>
                <span className="text-sm font-medium text-slate-800 group-hover:text-slate-900 transition-colors">
                  Kirim Pengingat Otomatis
                </span>
                <p className="text-xs text-slate-500 mt-0.5 max-w-lg">
                  Klien akan otomatis dikirimkan email pengingat 3 hari sebelum, di hari H, dan setelah tagihan jatuh tempo. (Fitur ini membutuhkan integrasi Worker/Cron Job di masa depan).
                </p>
              </div>
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-[#E15A3E] hover:bg-[#C14A2F] text-white px-8 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-60 shadow-sm"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {loading ? "Menyimpan..." : "Simpan Pengaturan"}
          </button>
        </div>

      </form>
    </div>
  );
}
