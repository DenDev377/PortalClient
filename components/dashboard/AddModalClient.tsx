"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function AddModalClient({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  // 1. Group State: Profil Perusahaan
  const [companyName, setCompanyName] = useState("");
  const [billingEmail, setBillingEmail] = useState("");
  const [taxId, setTaxId] = useState("");
  const [billingAddress, setBillingAddress] = useState("");

  // 2. Group State: Penanggung Jawab (PIC)
  const [picName, setPicName] = useState("");
  const [phone, setPhone] = useState("");

  // 3. Group State: Opsi Akses Portal & Loading Status
  const [sendInviteEmail, setSendInviteEmail] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Fungsi Reset Form saat Modal Ditutup
  const handleResetForm = () => {
    setCompanyName("");
    setBillingEmail("");
    setTaxId("");
    setBillingAddress("");
    setPicName("");
    setPhone("");
    setSendInviteEmail(true);
  };

  // Fungsi Submit Data
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Kumpulkan payload data untuk dikirim ke API / Server Action
    const payload = {
      companyName,
      billingEmail,
      taxId,
      billingAddress,
      picName,
      phone,
      sendInviteEmail,
    };

    // TODO: Panggil API / Server Action di sini
    console.log("Submit Payload:", payload);

    setIsLoading(false);

    handleResetForm();
    onClose();
  };

  // Fungsi untuk close modal dan reset form
  const handleClose = () => {
    handleResetForm();
    onClose();
  };

  // Fungsi untuk handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Close modal hanya jika klik di backdrop, bukan di konten modal
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          type="button"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-slate-900 mb-6">Tambah Client Baru</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Section 1: Profil Perusahaan */}
          <div className="border-b border-slate-200 pb-4">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Profil Perusahaan</h3>
            
            <div className="mb-4">
              <label
                htmlFor="companyName"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Nama Perusahaan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-[#E15A3E] focus:border-transparent transition-all"
                placeholder="PT. Contoh Perusahaan"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="billingEmail"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Email Penagihan <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="billingEmail"
                value={billingEmail}
                onChange={(e) => setBillingEmail(e.target.value)}
                required
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-[#E15A3E] focus:border-transparent transition-all"
                placeholder="billing@company.com"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="taxId"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                NPWP
              </label>
              <input
                type="text"
                id="taxId"
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-[#E15A3E] focus:border-transparent transition-all"
                placeholder="00.000.000.0-000.000"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="billingAddress"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Alamat Penagihan
              </label>
              <textarea
                id="billingAddress"
                value={billingAddress}
                onChange={(e) => setBillingAddress(e.target.value)}
                rows={3}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-[#E15A3E] focus:border-transparent transition-all resize-none"
                placeholder="Jl. Contoh No. 123, Jakarta"
              />
            </div>
          </div>

          {/* Section 2: Penanggung Jawab */}
          <div className="border-b border-slate-200 pb-4">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Penanggung Jawab (PIC)</h3>
            
            <div className="mb-4">
              <label
                htmlFor="picName"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="picName"
                value={picName}
                onChange={(e) => setPicName(e.target.value)}
                required
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-[#E15A3E] focus:border-transparent transition-all"
                placeholder="John Doe"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Nomor Telepon <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-[#E15A3E] focus:border-transparent transition-all"
                placeholder="08123456789"
              />
            </div>
          </div>

          {/* Section 3: Opsi Portal */}
          <div className="pb-4">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Opsi Akses Portal</h3>
            
            <div className="flex items-start">
              <input
                type="checkbox"
                id="sendInviteEmail"
                checked={sendInviteEmail}
                onChange={(e) => setSendInviteEmail(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-[#E15A3E] focus:ring-[#E15A3E]"
              />
              <label
                htmlFor="sendInviteEmail"
                className="ml-2 text-sm text-slate-700"
              >
                Kirim email undangan akses portal ke client
                <p className="text-xs text-slate-500 mt-1">
                  Email akan dikirim ke alamat penagihan yang telah diisi di atas
                </p>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 bg-white border border-slate-300 text-slate-700 rounded-lg py-2.5 font-medium hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-[#E15A3E] text-white rounded-lg py-2.5 font-medium hover:bg-[#C14A2F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Menyimpan..." : "Simpan Client"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
