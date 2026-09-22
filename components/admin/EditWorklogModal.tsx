"use client";

import { useState, useEffect } from "react";
import { X, Lock, AlertCircle } from "lucide-react";
import type { BillingStatus, ProjectOption, WorklogData } from "@/types/worklog";

interface EditWorklogModalProps {
  isOpen: boolean;
  onClose: () => void;
  worklog: WorklogData | null;
  isAdmin: boolean;
  projects: ProjectOption[];
  onSuccess?: () => void;
}

export default function EditWorklogModal({
  isOpen,
  onClose,
  worklog,
  isAdmin,
  projects,
  onSuccess,
}: EditWorklogModalProps) {
  const [logDate, setLogDate] = useState("");
  const [durationHours, setDurationHours] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [billingStatus, setBillingStatus] = useState<BillingStatus>("UNBILLED");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const isProjectLocked = worklog?.billingStatus === "BILLED";

  useEffect(() => {
    if (worklog) {
      setLogDate(worklog.logDate);
      setDurationHours(String(worklog.durationHours));
      setTaskDescription(worklog.taskDescription);
      setBillingStatus(worklog.billingStatus);
      setError("");
    }
  }, [worklog]);

  const handleReset = () => {
    setLogDate("");
    setDurationHours("");
    setTaskDescription("");
    setBillingStatus("UNBILLED");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!worklog) return;
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/worklogs/${worklog.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: logDate,
          hours: Number(durationHours),
          description: taskDescription,
          isBilled: billingStatus === "BILLED",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Gagal menyimpan perubahan");
        return;
      }
      handleReset();
      onSuccess?.();
      onClose();
    } catch (err) {
      setError("Terjadi kesalahan jaringan");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      handleReset();
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isLoading) {
      handleClose();
    }
  };

  if (!isOpen || !worklog) return null;

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

        <h2 className="text-xl font-bold text-slate-900 mb-1">Edit Catatan Jam</h2>
        <p className="text-sm text-slate-500 mb-6">
          ID: {worklog.id} — {worklog.teamMember}
        </p>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="border-b border-slate-200 pb-4">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Detail Pekerjaan</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Proyek
              </label>
              <div className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-slate-50 text-slate-500">
                {worklog.projectName} — {worklog.clientName}
              </div>
              {isProjectLocked && (
                <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-600">
                  <Lock className="h-3.5 w-3.5" />
                  <span>Proyek terkunci karena log sudah ditagih (Billed)</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="editDate" className="block text-sm font-medium text-slate-700 mb-1">
                  Tanggal Pengerjaan <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="editDate"
                  value={logDate}
                  onChange={(e) => setLogDate(e.target.value)}
                  required
                  disabled={isProjectLocked}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-[#E15A3E] focus:border-transparent transition-all text-sm disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label htmlFor="editDuration" className="block text-sm font-medium text-slate-700 mb-1">
                  Durasi (Jam) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="editDuration"
                  value={durationHours}
                  onChange={(e) => setDurationHours(e.target.value)}
                  required
                  step="0.25"
                  min="0.25"
                  placeholder="1.5"
                  disabled={isProjectLocked}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-[#E15A3E] focus:border-transparent transition-all disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label htmlFor="editDescription" className="block text-sm font-medium text-slate-700 mb-1">
                Deskripsi Pekerjaan <span className="text-red-500">*</span>
              </label>
              <textarea
                id="editDescription"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                required
                rows={4}
                disabled={isProjectLocked}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-[#E15A3E] focus:border-transparent transition-all resize-none disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
                placeholder="Rincian aktivitas/tugas yang dikerjakan"
              />
            </div>
          </div>

          {isAdmin && (
            <div className="pb-4">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Status Tagihan</h3>

              <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg p-4">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-900">
                    {billingStatus === "BILLED" ? "Sudah Ditagih" : "Belum Ditagih"}
                  </span>
                  <span className="text-xs text-slate-500 mt-0.5">
                    {billingStatus === "BILLED"
                      ? worklog.invoiceNumber
                        ? `Invoice: ${worklog.invoiceNumber}`
                        : "Tandai sebagai sudah masuk invoice"
                      : "Jam kerja belum dimasukkan ke invoice"}
                  </span>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={billingStatus === "BILLED"}
                  onClick={() =>
                    setBillingStatus(billingStatus === "BILLED" ? "UNBILLED" : "BILLED")
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    billingStatus === "BILLED" ? "bg-emerald-500" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      billingStatus === "BILLED" ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {billingStatus === "BILLED" && (
                <div className="flex items-start gap-1.5 mt-2 text-xs text-slate-500">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  <span>
                    Mengubah status ke &quot;Belum Ditagih&quot; akan melepaskan kaitan log dari invoice. Proyek akan kembali bisa diubah.
                  </span>
                </div>
              )}
            </div>
          )}

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
              {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}