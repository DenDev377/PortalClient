"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { ClientPayload } from "@/types/client";

interface AddModalClientProps {
  isOpen: boolean;
  onClose: () => void;
  // Callback setelah berhasil: kembalikan data client baru ke parent
  onSuccess: () => void;
  // Jika diisi, modal berfungsi sebagai Edit; jika kosong, berfungsi sebagai Add
  editData?: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    address: string | null;
  } | null;
}

export default function AddModalClient({
  isOpen,
  onClose,
  onSuccess,
  editData = null,
}: AddModalClientProps) {
  const isEditMode = !!editData;

  const [form, setForm] = useState<ClientPayload>({
    name: editData?.name || "",
    email: editData?.email || "",
    phone: editData?.phone || "",
    address: editData?.address || "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleResetForm = () => {
    setForm({ name: "", email: "", phone: "", address: "" });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Tentukan URL dan HTTP Method sesuai mode (Add vs Edit)
      const url = isEditMode
        ? `/api/clients/${editData!.id}`
        : "/api/clients";
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

      // Beritahu parent untuk refresh data
      onSuccess();
      handleResetForm();
      onClose();
    } catch {
      setError("Tidak dapat terhubung ke server.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    handleResetForm();
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) handleClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
        {/* Close */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          type="button"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-slate-900 mb-1">
          {isEditMode ? "Edit Data Client" : "Tambah Client Baru"}
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          {isEditMode
            ? "Perbarui informasi perusahaan klien."
            : "Isi informasi perusahaan klien baru."}
        </p>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nama Perusahaan */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nama Perusahaan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="PT. Contoh Perusahaan"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[#E15A3E] focus:border-transparent transition-all"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email Penagihan
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="billing@company.com"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[#E15A3E] focus:border-transparent transition-all"
            />
          </div>

          {/* Nomor Telepon */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nomor Telepon
            </label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="08123456789"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[#E15A3E] focus:border-transparent transition-all"
            />
          </div>

          {/* Alamat */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Alamat
            </label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              rows={3}
              placeholder="Jl. Contoh No. 123, Jakarta"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[#E15A3E] focus:border-transparent transition-all resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 bg-white border border-slate-300 text-slate-700 rounded-lg py-2.5 text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-[#E15A3E] text-white rounded-lg py-2.5 text-sm font-medium hover:bg-[#C14A2F] transition-colors disabled:opacity-50"
            >
              {isLoading
                ? "Menyimpan..."
                : isEditMode
                ? "Simpan Perubahan"
                : "Tambah Client"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
