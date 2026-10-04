"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Briefcase,
  ArrowRight,
  CreditCard,
  Loader2,
  FileText,
} from "lucide-react";

interface UrgentInvoice {
  id: string;
  invoiceNumber: string;
  totalAmount: number;
  status: string;
  dueDate: string;
  snapToken: string | null;
  paymentUrl: string | null;
}

interface OverviewData {
  totalPaid: number;
  totalPending: number;
  totalOverdue: number;
  activeProjects: number;
  unbilledHours: number;
  urgentInvoices: UrgentInvoice[];
}

const formatIDR = (val: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(val);

const getDaysUntil = (dateStr: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dateStr);
  due.setHours(0, 0, 0, 0);
  return Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, { label: string; cls: string }> = {
    PAID: { label: "Lunas", cls: "bg-emerald-100 text-emerald-700" },
    PENDING: { label: "Menunggu", cls: "bg-amber-100 text-amber-700" },
    UNPAID: { label: "Belum Bayar", cls: "bg-amber-100 text-amber-700" },
    OVERDUE: { label: "Jatuh Tempo!", cls: "bg-rose-100 text-rose-700" },
    DRAFT: { label: "Draft", cls: "bg-slate-100 text-slate-600" },
  };
  const { label, cls } = map[status] ?? { label: status, cls: "bg-slate-100 text-slate-600" };
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cls}`}>
      {label}
    </span>
  );
};

export default function PortalDashboard() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/portal/overview")
      .then((r) => r.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handlePay = async (invoice: UrgentInvoice) => {
    setPayingId(invoice.id);
    try {
      // Jika sudah ada paymentUrl → buka langsung
      if (invoice.paymentUrl) {
        window.open(invoice.paymentUrl, "_blank");
        setPayingId(null);
        return;
      }

      // Minta generate Snap Token baru
      const res = await fetch(`/api/invoices/${invoice.id}/payment`);
      const json = await res.json();
      if (res.ok && json.redirect_url) {
        window.open(json.redirect_url, "_blank");
        // Refresh data setelah pembayaran
        const refreshed = await fetch("/api/portal/overview").then((r) => r.json());
        setData(refreshed);
      } else {
        alert(json.message || "Gagal membuka halaman pembayaran");
      }
    } catch {
      alert("Terjadi kesalahan jaringan");
    }
    setPayingId(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-slate-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="text-sm font-medium">Memuat dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Selamat Datang</h1>
        <p className="text-slate-500 mt-0.5 text-sm">
          Berikut ringkasan akun dan tagihan Anda.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow group cursor-default">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Sudah Dibayar</span>
            <div className="p-2 bg-emerald-50 rounded-lg group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 truncate">
            {data ? formatIDR(data.totalPaid) : "Rp 0"}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow group cursor-default">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Menunggu</span>
            <div className="p-2 bg-amber-50 rounded-lg group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 truncate">
            {data ? formatIDR(data.totalPending) : "Rp 0"}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow group cursor-default">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Jatuh Tempo</span>
            <div className="p-2 bg-rose-50 rounded-lg group-hover:scale-110 transition-transform">
              <AlertCircle className="w-4 h-4 text-rose-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 truncate">
            {data ? formatIDR(data.totalOverdue) : "Rp 0"}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow group cursor-default">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Proyek Aktif</span>
            <div className="p-2 bg-blue-50 rounded-lg group-hover:scale-110 transition-transform">
              <Briefcase className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {data?.activeProjects ?? 0}
          </p>
        </div>
      </div>

      {/* Urgent Invoices */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Tagihan Perlu Dibayar</h2>
            <p className="text-xs text-slate-400 mt-0.5">Tagihan yang menunggu pembayaran Anda</p>
          </div>
          <Link
            href="/portal/invoices"
            className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            Lihat Semua
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {!data?.urgentInvoices?.length ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-300" />
            <p className="text-sm font-medium text-emerald-600">Semua tagihan sudah lunas!</p>
            <p className="text-xs text-slate-400">Tidak ada tagihan yang perlu dibayar saat ini.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {data.urgentInvoices.map((inv) => {
              const daysLeft = getDaysUntil(inv.dueDate);
              return (
                <div
                  key={inv.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 hover:bg-slate-50/70 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-slate-100 rounded-lg shrink-0">
                      <FileText className="w-5 h-5 text-slate-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-slate-800 font-mono text-sm">
                          {inv.invoiceNumber}
                        </span>
                        <StatusBadge status={inv.status} />
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                        <span className="font-bold text-slate-700 text-sm">
                          {formatIDR(inv.totalAmount)}
                        </span>
                        <span
                          className={`flex items-center gap-1 ${
                            daysLeft <= 0
                              ? "text-rose-600 font-semibold"
                              : daysLeft <= 3
                              ? "text-amber-600 font-medium"
                              : "text-slate-400"
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          {daysLeft <= 0
                            ? "Sudah lewat jatuh tempo!"
                            : daysLeft === 1
                            ? "Jatuh tempo besok"
                            : `${daysLeft} hari lagi`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handlePay(inv)}
                    disabled={payingId === inv.id}
                    className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm shadow-blue-200 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {payingId === inv.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CreditCard className="w-4 h-4" />
                    )}
                    {payingId === inv.id ? "Memproses..." : "Bayar Sekarang"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
