"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { BillingType, ProjectPayload, ProjectStatusDB } from "@/types/project";

interface ClientOption {
  id: string;
  name: string;
}

interface AddModalProjectProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editData?: {
    id: string;
    name: string;
    description: string | null;
    clientId: string;
    billingType: BillingType;
    rate: number | null;
    status: ProjectStatusDB;
  } | null;
}

export default function AddModalProject({
  isOpen,
  onClose,
  onSuccess,
  editData = null,
}: AddModalProjectProps) {
  const isEditMode = !!editData;

  const [form, setForm] = useState<ProjectPayload>({
    name: editData?.name || "",
    description: editData?.description || "",
    clientId: editData?.clientId || "",
    billingType: editData?.billingType || "HOURLY_RATE",
    rate: editData?.rate ?? null,
    status: editData?.status || "IN_PROGRESS",
  });

  const [clients, setClients] = useState<ClientOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch daftar client dari API (bukan dummy data)
  useEffect(() => {
    if (!isOpen) return;
    fetch("/api/clients")
      .then((r) => r.json())
      .then((data) =>
        setClients(data.map((c: { id: string; name: string }) => ({ id: c.id, name: c.name })))
      )
      .catch(() => setClients([]));
  }, [isOpen]);

  // Sinkronkan form saat editData berubah
  useEffect(() => {
    if (editData) {
      setForm({
        name: editData.name,
        description: editData.description || "",
        clientId: editData.clientId,
        billingType: editData.billingType,
        rate: editData.rate,
        status: editData.status,
      });
    } else {
      setForm({ name: "", description: "", clientId: "", billingType: "HOURLY_RATE", rate: null, status: "IN_PROGRESS" });
    }
  }, [editData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "rate" ? (value ? Number(value) : null) : value,
    }));
  };

  const handleClose = () => {
    if (!isLoading) {
      setError("");
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const url = isEditMode ? `/api/projects/${editData!.id}` : "/api/projects";
      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Terjadi kesalahan.");
        return;
      }

      onSuccess();
      onClose();
    } catch {
      setError("Tidak dapat terhubung ke server.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget && !isLoading) handleClose(); }}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={handleClose}
          disabled={isLoading}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          type="button"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-slate-900 mb-1">
          {isEditMode ? "Edit Project" : "Tambah Project Baru"}
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          {isEditMode ? "Perbarui informasi project." : "Isi detail project baru untuk klien."}
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nama Project */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nama Project <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="Misal: Redesign Website E-Commerce"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[#E15A3E] focus:border-transparent transition-all"
            />
          </div>

          {/* Pilih Client */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Client <span className="text-red-500">*</span>
            </label>
            <select
              name="clientId"
              required
              value={form.clientId}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[#E15A3E] focus:border-transparent bg-white"
            >
              <option value="" disabled>-- Pilih Client --</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Tipe Billing */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tipe Billing <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-6">
              {(["HOURLY_RATE", "FIXED_PRICE"] as BillingType[]).map((type) => (
                <label key={type} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="billingType"
                    value={type}
                    checked={form.billingType === type}
                    onChange={handleChange}
                    className="h-4 w-4 text-[#E15A3E] focus:ring-[#E15A3E]"
                  />
                  <span className="text-sm text-slate-700">
                    {type === "HOURLY_RATE" ? "Hourly (Per Jam)" : "Fixed Price"}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Rate / Budget */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {form.billingType === "HOURLY_RATE" ? "Tarif Per Jam (Rp)" : "Total Budget (Rp)"}
              <span className="text-red-500"> *</span>
            </label>
            <input
              type="number"
              name="rate"
              required
              min={0}
              value={form.rate ?? ""}
              onChange={handleChange}
              placeholder={form.billingType === "HOURLY_RATE" ? "Contoh: 200000" : "Contoh: 15000000"}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[#E15A3E] focus:border-transparent transition-all"
            />
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Deskripsi (opsional)
            </label>
            <textarea
              name="description"
              value={form.description || ""}
              onChange={handleChange}
              rows={3}
              placeholder="Deskripsi singkat mengenai project ini..."
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[#E15A3E] focus:border-transparent transition-all resize-none"
            />
          </div>

          {/* Status (hanya untuk Edit) */}
          {isEditMode && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[#E15A3E] focus:border-transparent bg-white"
              >
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 bg-white border border-slate-300 text-slate-700 rounded-lg py-2.5 text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-[#E15A3E] text-white rounded-lg py-2.5 text-sm font-medium hover:bg-[#C14A2F] transition-colors disabled:opacity-50"
            >
              {isLoading ? "Menyimpan..." : isEditMode ? "Simpan Perubahan" : "Tambah Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
