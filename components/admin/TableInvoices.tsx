"use client";
import {
  Hash,
  Building2,
  Calendar,
  DollarSign,
  Activity,
  MoreVertical,
  Printer,
  Send,
  Check,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Edit,
} from "lucide-react";
import { useState } from "react";
import type { InvoiceData, InvoicesStatus } from "@/types/invoices";

interface TableInvoicesProps {
  invoices: InvoiceData[];
  onPreviewPdf: (invoicesId: string) => void;
  onSendPortalLink: (invoicesId: string) => void;
  onCheckInvoice: (invoicesId: string) => void;
  onDeleteInvoices: (invoicesId: string) => void;
  onEditInvoices: (invoicesId: string) => void;
}

export default function TableInvoices({
  invoices,
  onPreviewPdf,
  onSendPortalLink,
  onCheckInvoice,
  onDeleteInvoices,
  onEditInvoices,
}: TableInvoicesProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const toggleDropdown = (id: string) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  //Helper function
  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffMs = due.getTime() - today.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  };

  const getStatusBadge = (status: InvoicesStatus) => {
    switch (status) {
      case "DRAFT":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 border border-slate-200">
            Draft
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 border border-amber-200">
            Pending
          </span>
        );
      case "PAID":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-3 w-3" /> Paid
          </span>
        );
      case "OVERDUE":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700 border border-rose-200">
            <AlertCircle className="h-3 w-3" /> Overdue
          </span>
        );
    }
  };

  return (
    <div className="overflow-hidden w-full rounded-xl border border-slate-200 bg-white shadow-sm">
      <div
        className="overflow-x-auto"
        style={{ minHeight: invoices.length > 0 ? "350px" : "auto" }}
      >
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-100 text-xs uppercase tracking-wider text-slate-600">
            <tr>
              <th scope="col" className="px-6 py-4 font-semibold">
                <div className="flex items-center gap-1.5">
                  <Hash className="h-3.5 w-3.5" /> No. Invoice
                </div>
              </th>
              <th scope="col" className="px-6 py-4 font-semibold">
                <div className="flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5" /> Klien
                </div>
              </th>
              <th scope="col" className="px-6 py-4 font-semibold">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" /> Tanggal Terbit & Due Date
                </div>
              </th>
              <th scope="col" className="px-6 py-4 font-semibold">
                <div className="flex items-center gap-1.5">
                  <DollarSign className="h-3.5 w-3.5" /> Total Nominal
                </div>
              </th>
              <th scope="col" className="px-6 py-4 font-semibold">
                <div className="flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5" /> Status
                </div>
              </th>
              <th scope="col" className="px-6 py-4 font-semibold text-right">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {invoices.map((invoice) => (
              <tr
                key={invoice.id}
                className="transition-colors hover:bg-slate-50"
              >
                {/* Kolom 1: No. Invoice */}
                <td className="whitespace-nowrap px-6 py-4">
                  <span className="font-bold text-slate-900">
                    {invoice.invoiceNumber}
                  </span>
                </td>

                {/* Kolom 2: Klien */}
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-900">
                      {invoice.clientName}
                    </span>
                    <span className="text-xs text-slate-500">
                      {invoice.clientEmail}
                    </span>
                  </div>
                </td>

                {/* Kolom 3: Tanggal Terbit & Due Date */}
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-slate-900 text-sm">
                      {formatDate(invoice.issueDate)}
                    </span>
                    <span className="text-xs text-slate-500">
                      Jatuh tempo: {formatDate(invoice.dueDate)}
                    </span>
                    {invoice.status === "PENDING" &&
                      (() => {
                        const days = getDaysUntilDue(invoice.dueDate);
                        if (days <= 3) {
                          return (
                            <span className="text-xs font-medium text-rose-600 mt-0.5">
                              {days <= 0
                                ? "Jatuh tempo hari ini!"
                                : `Sisa ${days} hari`}
                            </span>
                          );
                        }
                        return (
                          <span className="text-xs text-slate-400 mt-0.5">
                            Sisa {days} hari
                          </span>
                        );
                      })()}
                    {invoice.status === "OVERDUE" &&
                      (() => {
                        const days = Math.abs(getDaysUntilDue(invoice.dueDate));
                        return (
                          <span className="text-xs font-medium text-rose-600 mt-0.5">
                            Terlambat {days} hari
                          </span>
                        );
                      })()}
                  </div>
                </td>

                {/* Kolom 4: Total Nominal */}
                <td className="whitespace-nowrap px-6 py-4">
                  <span className="font-semibold text-slate-900">
                    {formatIDR(Number(invoice.nominalTotal))}
                  </span>
                </td>

                {/* Kolom 5: Status */}
                <td className="whitespace-nowrap px-6 py-4">
                  {getStatusBadge(invoice.status)}
                </td>

                {/* Kolom 6: Aksi — dropdown menu Step 8 */}
                <td className="whitespace-nowrap px-6 py-4 text-right">
                  <div className="relative inline-block text-left">
                    <button
                      onClick={() => toggleDropdown(invoice.id)}
                      className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>

                    {activeDropdown === invoice.id && (
                      <div className="absolute right-0 z-20 mt-2 w-52 rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                        <button
                          onClick={() => {
                            onPreviewPdf(invoice.id);
                            setActiveDropdown(null);
                          }}
                          className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <Printer className="h-4 w-4 text-blue-500" />{" "}
                          Pratinjau / Cetak PDF
                        </button>
                        <button
                          onClick={() => {
                            onSendPortalLink(invoice.id);
                            setActiveDropdown(null);
                          }}
                          className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <Send className="h-4 w-4 text-green-500" /> Kirim Link
                          Portal Klien
                        </button>
                        <button
                          onClick={() => {
                            onCheckInvoice(invoice.id);
                            setActiveDropdown(null);
                          }}
                          className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <Check className="h-4 w-4 text-emerald-500" /> Tandai
                          Lunas Manual
                        </button>
                        <div className="my-1 border-t border-slate-100" />
                        {invoice.status === "DRAFT" && (
                          <button
                            onClick={() => {
                              onEditInvoices(invoice.id);
                              setActiveDropdown(null);
                            }}
                            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50"
                          >
                            <Edit className="h-4 w-4" /> Edit Invoice
                          </button>
                        )}
                        <button
                          onClick={() => {
                            onDeleteInvoices(invoice.id);
                            setActiveDropdown(null);
                          }}
                          className="flex w-full items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 className="h-4 w-4" /> Hapus / Batal
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
