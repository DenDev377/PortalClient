"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { BillingModel, ProjectStatus } from "@/types/project";

// TODO: Ganti dengan fetch API/Database
const DUMMY_CLIENTS = [
  { id: "1", companyName: "PT Maju Jaya" },
  { id: "2", companyName: "CV Kreatif Abadi" },
  { id: "3", companyName: "PT Teknologi Nusantara" },
  { id: "4", companyName: "Toko Modern Sentosa" },
  { id: "5", companyName: "Startup Inovasi Tech" },
];

export default function AddModalProject({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  // 1. Group State: Informasi Proyek
  const [projectName, setProjectName] = useState("");
  const [clientId, setClientId] = useState("");
  
  // 2. Group State: Informasi Klien/Billing
  const [billingModel, setBillingModel] = useState<BillingModel>("HOURLY");
  const [hourlyRate, setHourlyRate] = useState("");
  const [totalBudget, setTotalBudget] = useState("");

  // 3. Group State: Tanggal & Waktu
  const [startDate, setStartDate] = useState("");
  const [deadline, setDeadline] = useState("");

  // Loading State
  const [isLoading, setIsLoading] = useState(false);

  // Fungsi Reset Form
  const handleResetForm = () => {
    setProjectName("");
    setClientId("");
    setBillingModel("HOURLY");
    setHourlyRate("");
    setTotalBudget("");
    setStartDate("");
    setDeadline("");
  };

  // Fungsi Submit Data
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      projectName,
      clientId,
      billingModel,
      hourlyRate: billingModel === "HOURLY" ? Number(hourlyRate) : null,
      totalBudget: billingModel === "FIXED" ? Number(totalBudget) : null,
      startDate,
      deadline,
      status: "ACTIVE" as ProjectStatus,
    };

    // TODO: Panggil API / Server Action di sini
    console.log("Submit Payload Project:", payload);
    
    // Simulasi jeda loading selama 1 detik
    setTimeout(() => {
      setIsLoading(false);
      handleResetForm();
      onClose();
    }, 1000);
  };

  // Fungsi untuk close modal dan reset form
  const handleClose = () => {
    if(!isLoading){
        handleResetForm();
        onClose();
    }
  };

  // Fungsi untuk handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Close modal hanya jika klik di backdrop, bukan di konten modal
    if (e.target === e.currentTarget && !isLoading) {
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
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          type="button"
          disabled={isLoading}
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-slate-900 mb-6">Tambah Project Baru</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Section 1: Informasi Dasar Proyek */}
          <div className="border-b border-slate-200 pb-4">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Informasi Dasar</h3>
            
            <div className="mb-4">
              <label
                htmlFor="projectName"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Nama Project <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="projectName"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                required
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-[#E15A3E] focus:border-transparent transition-all"
                placeholder="Misal: Redesign E-Commerce App"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="client"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Pilih Klien <span className="text-red-500">*</span>
              </label>
              <select
                id="client"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                required
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-[#E15A3E] focus:border-transparent transition-all bg-white"
              >
                <option value="" disabled>-- Pilih Klien --</option>
                {DUMMY_CLIENTS.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.companyName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Section 2: Skema Penagihan (Billing) */}
          <div className="border-b border-slate-200 pb-4">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Skema Penagihan (Billing)</h3>
            
            <div className="mb-4">
               <label className="block text-sm font-medium text-slate-700 mb-2">
                 Tipe Billing <span className="text-red-500">*</span>
               </label>
               <div className="flex gap-6 mb-3">
                   <label className="flex items-center gap-2 cursor-pointer">
                     <input
                       type="radio"
                       name="billingModel"
                       value="HOURLY"
                       checked={billingModel === "HOURLY"}
                       onChange={(e) =>
                         setBillingModel(e.target.value as BillingModel)
                       }
                       className="h-4 w-4 text-[#E15A3E] focus:ring-[#E15A3E] border-slate-300"
                     />
                     <span className="text-sm text-slate-700">Hourly (Tarif Per Jam)</span>
                   </label>

                   <label className="flex items-center gap-2 cursor-pointer">
                     <input
                       type="radio"
                       name="billingModel"
                       value="FIXED"
                       checked={billingModel === "FIXED"}
                       onChange={(e) =>
                         setBillingModel(e.target.value as BillingModel)
                       }
                       className="h-4 w-4 text-[#E15A3E] focus:ring-[#E15A3E] border-slate-300"
                     />
                     <span className="text-sm text-slate-700">Fixed Price (Harga Tetap)</span>
                   </label>
               </div>
            </div>

            <div className="mb-4">
              {billingModel === "HOURLY" ? (
                <div>
                  <label htmlFor="hourlyRate" className="block text-sm font-medium text-slate-700 mb-1">
                    Tarif Per Jam (Rp) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="hourlyRate"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    required
                    placeholder="Contoh: 200000"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-[#E15A3E] focus:border-transparent transition-all"
                  />
                </div>
              ) : (
                <div>
                  <label htmlFor="totalBudget" className="block text-sm font-medium text-slate-700 mb-1">
                    Total Budget (Rp) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="totalBudget"
                    value={totalBudget}
                    onChange={(e) => setTotalBudget(e.target.value)}
                    required
                    placeholder="Contoh: 15000000"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-[#E15A3E] focus:border-transparent transition-all"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Jadwal */}
          <div className="pb-4">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Jadwal Proyek</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Tanggal Mulai <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-[#E15A3E] focus:border-transparent transition-all text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="deadline"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Deadline <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="deadline"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  required
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-[#E15A3E] focus:border-transparent transition-all text-sm"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 bg-white border border-slate-300 text-slate-700 rounded-lg py-2.5 font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-[#E15A3E] text-white rounded-lg py-2.5 font-medium hover:bg-[#C14A2F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Menyimpan..." : "Simpan Project"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
