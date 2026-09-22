"use client";

import { useState, useEffect, useCallback } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  Settings2,
} from "lucide-react";

import type { InvoiceData, InvoiceBuilderPayload } from "@/types/invoices";
import TableInvoices from "@/components/admin/TableInvoices";
import InvoiceBuilder from "@/components/admin/InvoiceBuilder";

const formatIDR = (amount: string) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(Number(amount));

export default function Invoices() {
  const [builderOpen, setBuilderOpen] = useState(false);
  const [editingInvoiceId, setEditingInvoiceId] = useState<string | null>(null);
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);

  const fetchInvoices = useCallback(async () => {
    try {
      const res = await fetch("/api/invoices?limit=100");
      if (!res.ok) return;
      const json = await res.json();
      setInvoices(json.data ?? []);
    } catch {
      console.error("Failed to fetch invoices");
    }
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const handleEditInvoice = (invoiceId: string) => {
    setBuilderOpen(true);
    setEditingInvoiceId(invoiceId);
  };

  const handlePreviewPdf = (invoiceId: string) => {
    console.log("Preview PDF:", invoiceId);
  };
  const handleSendPortalLink = (invoiceId: string) => {
    console.log("Send portal link:", invoiceId);
  };
  const handleCheckInvoice = (invoiceId: string) => {
    console.log("Mark paid:", invoiceId);
  };
  const handleDeleteInvoice = (invoiceId: string) => {
    console.log("Delete invoice:", invoiceId);
  };

  const handleSaveDraft = async (payload: InvoiceBuilderPayload) => {
    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to save draft");
      setBuilderOpen(false);
      setEditingInvoiceId(null);
      fetchInvoices();
    } catch (err) {
      console.error(err);
    }
  };

  const handlePublishAndSend = async (payload: InvoiceBuilderPayload) => {
    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to publish");
      setBuilderOpen(false);
      setEditingInvoiceId(null);
      fetchInvoices();
    } catch (err) {
      console.error(err);
    }
  };

  const totalIssuedCount = invoices.length;
  const paidInvoices = invoices.filter((inv) => inv.status === "PAID");
  const totalPaid = paidInvoices.reduce(
    (sum, inv) => sum + Number(inv.nominalTotal),
    0,
  );
  const pendingInvoices = invoices.filter(
    (inv) => inv.status === "PENDING" || inv.status === "UNPAID",
  );
  const totalPending = pendingInvoices.reduce(
    (sum, inv) => sum + Number(inv.nominalTotal),
    0,
  );
  const overdueInvoices = invoices.filter((inv) => inv.status === "OVERDUE");
  const totalOverdue = overdueInvoices.reduce(
    (sum, inv) => sum + Number(inv.nominalTotal),
    0,
  );

  return (
    <div className="flex flex-col max-w-full w-full mx-auto p-6 justify-between">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-slate-900">Ikhtisar Tagihan</h1>
        <p className="text-slate-500 mt-1">
          Selamat datang, inilah yang terjadi dengan tagihan Anda hari ini.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="group flex cursor-default flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md">
          <div className="flex items-start justify-between">
            <h3 className="text-sm font-semibold text-slate-500">
              Total Invoices Issued
            </h3>
            <div className="rounded-lg bg-indigo-50 p-2.5 text-indigo-600 transition-all duration-200 group-hover:scale-110 group-hover:bg-indigo-100">
              <FileText className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-1">
              <p className="text-3xl font-bold tracking-tight text-slate-900">
                {totalIssuedCount} tagihan
              </p>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
              <span className="font-semibold text-emerald-600">+12%</span>
              <span>vs bulan lalu</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-all duration-200 p-6 cursor-default group">
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-semibold text-slate-500">
              Tagihan Dibayar
            </h3>
            <div className="p-2.5 bg-emerald-50 text-emerald-400 rounded-lg group-hover:scale-110 group-hover:bg-emerald-100 transition-all duration-200">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-1">
              <p className="text-3xl font-bold tracking-tight text-slate-900">
                {formatIDR(totalPaid.toString())}
              </p>
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <span className="text-slate-400">
                {paidInvoices.length} invoices verified
              </span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-all duration-200 p-6 cursor-default group">
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-semibold text-slate-500">
              Menunggu Pembayaran
            </h3>
            <div className="p-2.5 bg-amber-50 text-amber-400 rounded-lg group-hover:scale-110 group-hover:bg-amber-100 transition-all duration-200">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-1">
              <p className="text-3xl font-bold tracking-tight text-slate-900">
                {formatIDR(totalPending.toString())}
              </p>
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <span className="text-slate-400">
                {pendingInvoices.length} invoices pending
              </span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-all duration-200 p-6 cursor-default group">
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-semibold text-slate-500">
              Jatuh Tempo
            </h3>
            <div className="p-2.5 bg-rose-50 text-rose-400 rounded-lg group-hover:scale-110 group-hover:bg-rose-100 transition-all duration-200">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-1">
              <p className="text-3xl font-bold tracking-tight text-slate-900">
                {formatIDR(totalOverdue.toString())}
              </p>
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <span className="text-slate-400">
                {overdueInvoices.length} invoices past due
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col bg-white rounded-xl shadow-sm border mt-6 border-slate-200 p-6">
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Cari tagihan..."
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E15A3E] focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setBuilderOpen(true)}
              className="bg-[#E15A3E] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#C14A2F] transition-all duration-200 shadow-sm"
            >
              Buat Invoice
            </button>
          </div>
        </div>
        <div className="mt-4 overflow-x-auto">
          <TableInvoices
            invoices={invoices}
            onPreviewPdf={handlePreviewPdf}
            onSendPortalLink={handleSendPortalLink}
            onCheckInvoice={handleCheckInvoice}
            onDeleteInvoices={handleDeleteInvoice}
            onEditInvoices={handleEditInvoice}
          />
        </div>
      </div>

      <InvoiceBuilder
        isOpen={builderOpen}
        onClose={() => {
          setBuilderOpen(false);
          setEditingInvoiceId(null);
        }}
        onSaveDraft={handleSaveDraft}
        onPublishAndSend={handlePublishAndSend}
        editingInvoiceId={editingInvoiceId}
      />
    </div>
  );
}
