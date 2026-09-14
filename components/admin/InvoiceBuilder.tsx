"use client";

import { useState, useMemo } from "react";
import {
  X,
  Briefcase,
  Clock,
  Tag,
  CheckCircle2,
  Send,
  FileText,
  Calculator,
  Lock,
} from "lucide-react";
import type {
  ClientOption,
  DiscountType,
  InvoiceBuilderPayload,
  InvoiceLineItem,
} from "@/types/invoices";
import type { WorklogData } from "@/types/worklog";

const DUMMY_CLIENTS: ClientOption[] = [
  { id: "c1", companyName: "PT Maju Jaya", email: "billing@majujaya.com" },
  {
    id: "c2",
    companyName: "CV Kreatif Abadi",
    email: "finance@kreatifabadi.com",
  },
  {
    id: "c3",
    companyName: "PT Teknologi Nusantara",
    email: "ap@teknusantara.com",
  },
  {
    id: "c4",
    companyName: "Toko Modern Sentosa",
    email: "admin@modernsentosa.com",
  },
];

const DUMMY_WORKLOGS: WorklogData[] = [
  {
    id: "wl-001",
    projectId: "1",
    projectName: "Website Redesign",
    clientName: "PT Maju Jaya",
    taskDescription: "Fixing Bug Auth & Slices UI untuk halaman dashboard",
    durationHours: 3.5,
    hourlyRate: 200000,
    logDate: "2026-09-10",
    teamMember: "Andi Pratama",
    billingStatus: "UNBILLED",
  },
  {
    id: "wl-004",
    projectId: "1",
    projectName: "Website Redesign",
    clientName: "PT Maju Jaya",
    taskDescription: "Slicing ulang komponen Navbar dan Sidebar responsif",
    durationHours: 4,
    hourlyRate: 200000,
    logDate: "2026-09-12",
    teamMember: "Andi Pratama",
    billingStatus: "UNBILLED",
  },
  {
    id: "wl-003",
    projectId: "3",
    projectName: "E-commerce Platform",
    clientName: "PT Teknologi Nusantara",
    taskDescription:
      "Optimasi query database untuk halaman produk, indexing, dan caching Redis",
    durationHours: 2.5,
    hourlyRate: 300000,
    logDate: "2026-09-11",
    teamMember: "Budi Santoso",
    billingStatus: "UNBILLED",
  },
  {
    id: "wl-006",
    projectId: "3",
    projectName: "E-commerce Platform",
    clientName: "PT Teknologi Nusantara",
    taskDescription:
      "Review PR tim frontend, diskusi arsitektur state management Zustand",
    durationHours: 2,
    hourlyRate: 300000,
    logDate: "2026-09-13",
    teamMember: "Budi Santoso",
    billingStatus: "UNBILLED",
  },
];

interface InvoiceBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveDraft: (payload: InvoiceBuilderPayload) => void;
  onPublishAndSend: (payload: InvoiceBuilderPayload) => void;
}

export default function InvoiceBuilder({
  isOpen,
  onClose,
  onSaveDraft,
  onPublishAndSend,
}: InvoiceBuilderProps) {
  const [clientId, setClientId] = useState("");
  const [selectedWorklogIds, setSelectedWorklogIds] = useState<string[]>([]);
  const [discountType, setDiscountType] = useState<DiscountType>("PERCENT");
  const [discountValue, setDiscountValue] = useState("");
  const [taxPercent, setTaxPercent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const selectedClient = DUMMY_CLIENTS.find((c) => c.id === clientId);

  const unbilledWorklogs = useMemo(() => {
    if (!selectedClient) return [];
    return DUMMY_WORKLOGS.filter(
      (w) =>
        w.clientName === selectedClient.companyName &&
        w.billingStatus === "UNBILLED",
    );
  }, [selectedClient]);

  const lineItems: InvoiceLineItem[] = useMemo(() => {
    return unbilledWorklogs
      .filter((w) => selectedWorklogIds.includes(w.id))
      .map((w) => ({
        worklogId: w.id,
        description: `${w.projectName} — ${w.taskDescription}`,
        hours: w.durationHours,
        rate: w.hourlyRate,
        subtotal: w.durationHours * w.hourlyRate,
      }));
  }, [unbilledWorklogs, selectedWorklogIds]);

  const calculations = useMemo(() => {
    const subtotal = lineItems.reduce((sum, item) => sum + item.subtotal, 0);
    const dValue = Number(discountValue) || 0;
    const discountAmount =
      discountType === "PERCENT" ? (subtotal * dValue) / 100 : dValue;
    const afterDiscount = Math.max(0, subtotal - discountAmount);
    const tPercent = Number(taxPercent) || 0;
    const taxAmount = (afterDiscount * tPercent) / 100;
    const grandTotal = afterDiscount + taxAmount;
    return { subtotal, discountAmount, taxAmount, grandTotal };
  }, [lineItems, discountType, discountValue, taxPercent]);

  const formatIDR = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const handleToggleWorklog = (worklogId: string) => {
    setSelectedWorklogIds((prev) =>
      prev.includes(worklogId)
        ? prev.filter((id) => id !== worklogId)
        : [...prev, worklogId],
    );
  };

  const handleSelectAllWorklogs = () => {
    if (selectedWorklogIds.length === unbilledWorklogs.length) {
      setSelectedWorklogIds([]);
    } else {
      setSelectedWorklogIds(unbilledWorklogs.map((w) => w.id));
    }
  };

  const handleReset = () => {
    setClientId("");
    setSelectedWorklogIds([]);
    setDiscountType("PERCENT");
    setDiscountValue("");
    setTaxPercent("");
  };

  const buildPayload = (
    action: "DRAFT" | "PUBLISH",
  ): InvoiceBuilderPayload => ({
    clientId,
    clientName: selectedClient?.companyName || "",
    lineItems,
    discountType,
    discountValue: Number(discountValue) || 0,
    taxPercent: Number(taxPercent) || 0,
    subtotal: calculations.subtotal,
    discountAmount: calculations.discountAmount,
    taxAmount: calculations.taxAmount,
    grandTotal: calculations.grandTotal,
    action,
  });

  const handleSaveDraft = () => {
    setIsLoading(true);
    const payload = buildPayload("DRAFT");
    console.log("Save Draft Payload:", payload);
    onSaveDraft(payload);
    setTimeout(() => {
      setIsLoading(false);
      handleReset();
      onClose();
    }, 800);
  };

  const handlePublishAndSend = () => {
    setIsLoading(true);
    const payload = buildPayload("PUBLISH");
    console.log("Publish & Send Payload:", payload);
    onPublishAndSend(payload);
    setTimeout(() => {
      setIsLoading(false);
      handleReset();
      onClose();
    }, 800);
  };

  const handleClose = () => {
    if (!isLoading) {
      handleReset();
      onClose();
    }
  };

  const canSubmit = clientId !== "" && lineItems.length > 0 && !isLoading;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center bg-slate-900/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) handleClose();
      }}
    >
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-hidden shadow-2xl flex flex-col ring-1 ring-slate-200/60">
        {/* Header */}
        <div className="bg-gradient-to-br from-slate-50 to-white border-b border-slate-200 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E15A3E] text-white shadow-sm">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">
                Invoice Builder
              </h2>
              <p className="text-xs text-slate-500">
                Buat invoice dari worklog belum ditagih
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Section 1: Pilih Klien */}
          <div className="border-b border-slate-100 pb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                1
              </span>
              <h3 className="text-sm font-semibold text-slate-900">
                Pilih Klien
              </h3>
            </div>
            <select
              value={clientId}
              onChange={(e) => {
                setClientId(e.target.value);
                setSelectedWorklogIds([]);
              }}
              className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-slate-900 outline-none focus:ring-2 focus:ring-[#E15A3E] focus:border-transparent transition-all bg-white"
            >
              <option value="" disabled>
                -- Pilih Klien --
              </option>
              {DUMMY_CLIENTS.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.companyName} — {client.email}
                </option>
              ))}
            </select>
            {selectedClient && (
              <div className="mt-3 flex items-center gap-2 text-sm text-slate-600 bg-indigo-50/50 border border-indigo-100 rounded-lg px-3 py-2">
                <Briefcase className="w-4 h-4 text-indigo-400" />
                <span>
                  Tagihan untuk:{" "}
                  <strong className="text-slate-900">
                    {selectedClient.companyName}
                  </strong>
                </span>
              </div>
            )}
          </div>

          {/* Section 2: Auto-Import Unbilled Worklogs */}
          {selectedClient && (
            <div className="border-b border-slate-100 pb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                    2
                  </span>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Worklog Belum Ditagih
                  </h3>
                  {unbilledWorklogs.length > 0 && (
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                      {unbilledWorklogs.length} tersedia
                    </span>
                  )}
                </div>
                {unbilledWorklogs.length > 0 && (
                  <button
                    onClick={handleSelectAllWorklogs}
                    type="button"
                    className="text-xs font-medium text-[#E15A3E] hover:underline"
                  >
                    {selectedWorklogIds.length === unbilledWorklogs.length
                      ? "Hapus Semua"
                      : "Pilih Semua"}
                  </button>
                )}
              </div>

              {unbilledWorklogs.length === 0 ? (
                <div className="text-center py-10 text-sm text-slate-400 border border-dashed border-slate-200 rounded-lg">
                  <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                  <p>Tidak ada worklog belum ditagih untuk klien ini</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {unbilledWorklogs.map((worklog) => {
                    const isSelected = selectedWorklogIds.includes(worklog.id);
                    const itemSubtotal =
                      worklog.durationHours * worklog.hourlyRate;
                    return (
                      <label
                        key={worklog.id}
                        className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                          isSelected
                            ? "border-[#E15A3E] bg-orange-50/40 shadow-sm"
                            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleWorklog(worklog.id)}
                          className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#E15A3E] focus:ring-[#E15A3E] cursor-pointer"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 line-clamp-1">
                            {worklog.taskDescription}
                          </p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {worklog.durationHours} hrs
                            </span>
                            <span className="flex items-center gap-1">
                              <Tag className="h-3 w-3" />
                              {formatIDR(worklog.hourlyRate)}/hr
                            </span>
                            <span>{formatDate(worklog.logDate)}</span>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-slate-900 whitespace-nowrap">
                          {formatIDR(itemSubtotal)}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Section 3: Line Items Preview */}
          {lineItems.length > 0 && (
            <div className="border-b border-slate-100 pb-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                  3
                </span>
                <h3 className="text-sm font-semibold text-slate-900">
                  Line Items Invoice
                </h3>
              </div>
              <div className="overflow-hidden rounded-lg border border-slate-200 shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-100 text-xs uppercase tracking-wider text-slate-600">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Deskripsi</th>
                      <th className="px-4 py-3 font-semibold text-center">
                        Jam
                      </th>
                      <th className="px-4 py-3 font-semibold text-right">
                        Tarif
                      </th>
                      <th className="px-4 py-3 font-semibold text-right">
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {lineItems.map((item) => (
                      <tr key={item.worklogId} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-slate-700">
                          {item.description}
                        </td>
                        <td className="px-4 py-3 text-center text-slate-700">
                          {item.hours}
                        </td>
                        <td className="px-4 py-3 text-right text-slate-700">
                          {formatIDR(item.rate)}
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-slate-900">
                          {formatIDR(item.subtotal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Section 4: Kalkulator Pajak & Diskon */}
          {lineItems.length > 0 && (
            <div className="border-b border-slate-100 pb-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                  4
                </span>
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                  <Calculator className="h-4 w-4 text-slate-400" /> Pajak & Diskon
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">
                    Tipe Diskon
                  </label>
                  <select
                    value={discountType}
                    onChange={(e) =>
                      setDiscountType(e.target.value as DiscountType)
                    }
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[#E15A3E] focus:border-transparent transition-all bg-white"
                  >
                    <option value="PERCENT">Persentase (%)</option>
                    <option value="NOMINAL">Nominal (Rp)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">
                    Nilai Diskon
                  </label>
                  <input
                    type="number"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    min="0"
                    placeholder={discountType === "PERCENT" ? "10" : "500000"}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[#E15A3E] focus:border-transparent transition-all"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">
                    PPN / Pajak (%)
                  </label>
                  <input
                    type="number"
                    value={taxPercent}
                    onChange={(e) => setTaxPercent(e.target.value)}
                    min="0"
                    max="100"
                    step="0.5"
                    placeholder="11"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[#E15A3E] focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section 5: Summary */}
          {lineItems.length > 0 && (
            <div className="pb-2">
              <div className="flex items-center gap-2 mb-4">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                  5
                </span>
                <h3 className="text-sm font-semibold text-slate-900">
                  Ringkasan
                </h3>
              </div>
              <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-xl p-5 space-y-2.5 shadow-sm">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="font-medium text-slate-900">
                    {formatIDR(calculations.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">
                    Diskon{" "}
                    {discountType === "PERCENT"
                      ? `(${Number(discountValue) || 0}%)`
                      : ""}
                  </span>
                  <span className="font-medium text-rose-600">
                    -{formatIDR(calculations.discountAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">
                    PPN ({Number(taxPercent) || 0}%)
                  </span>
                  <span className="font-medium text-slate-900">
                    {formatIDR(calculations.taxAmount)}
                  </span>
                </div>
                <div className="border-t border-slate-200 pt-3 mt-1 flex justify-between items-center">
                  <span className="font-bold text-slate-900">Grand Total</span>
                  <span className="text-xl font-bold text-[#E15A3E]">
                    {formatIDR(calculations.grandTotal)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer — Action Buttons */}
        <div className="bg-white border-t border-slate-200 px-6 py-4 flex gap-3">
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={!canSubmit}
            className="flex-1 bg-white border border-slate-300 text-slate-700 rounded-lg py-2.5 px-4 font-medium hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="flex items-center justify-center gap-2">
              <FileText className="w-4 h-4" />
              Simpan Draft
            </span>
            <span className="block text-xs font-normal text-slate-400 mt-0.5">
              Worklog tidak dikunci
            </span>
          </button>
          <button
            type="button"
            onClick={handlePublishAndSend}
            disabled={!canSubmit}
            className="flex-1 bg-[#E15A3E] text-white rounded-lg py-2.5 px-4 font-medium hover:bg-[#C14A2F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <span className="flex items-center justify-center gap-2">
              <Send className="w-4 h-4" />
              Terbitkan & Kirim
            </span>
            <span className="block text-xs font-normal text-orange-100 mt-0.5 flex items-center justify-center gap-1">
              <Lock className="h-3 w-3" /> Worklog dikunci
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
