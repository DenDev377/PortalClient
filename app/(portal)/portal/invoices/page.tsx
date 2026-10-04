"use client";

import { useEffect, useState, useCallback } from "react";
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Search,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface PortalInvoice {
  id: string;
  invoiceNumber: string;
  status: string;
  issueDate: string;
  dueDate: string;
  totalAmount: number;
  subTotal: number;
  taxRate: number;
  taxAmount: number;
  snapToken: string | null;
  paymentUrl: string | null;
  items: InvoiceItem[];
  lastPayment: { status: string; paymentMethod: string | null; createdAt: string } | null;
}

const formatIDR = (val: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(val);

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
    PAID: { label: "Lunas", cls: "bg-emerald-100 text-emerald-700", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
    PENDING: { label: "Menunggu Pembayaran", cls: "bg-amber-100 text-amber-700", icon: <Clock className="w-3.5 h-3.5" /> },
    UNPAID: { label: "Belum Dibayar", cls: "bg-amber-100 text-amber-700", icon: <Clock className="w-3.5 h-3.5" /> },
    OVERDUE: { label: "Jatuh Tempo!", cls: "bg-rose-100 text-rose-700", icon: <AlertCircle className="w-3.5 h-3.5" /> },
    DRAFT: { label: "Draft", cls: "bg-slate-100 text-slate-500", icon: <FileText className="w-3.5 h-3.5" /> },
    CANCELLED: { label: "Dibatalkan", cls: "bg-slate-100 text-slate-500", icon: null },
  };
  const { label, cls, icon } = map[status] ?? { label: status, cls: "bg-slate-100 text-slate-600", icon: null };
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${cls}`}>
      {icon}
      {label}
    </span>
  );
};

const canPay = (status: string) => ["PENDING", "UNPAID", "OVERDUE"].includes(status);

export default function PortalInvoices() {
  const [invoices, setInvoices] = useState<PortalInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [payingId, setPayingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ limit: "50" });
    if (statusFilter) params.set("status", statusFilter);
    try {
      const res = await fetch(`/api/portal/invoices?${params.toString()}`);
      const json = await res.json();
      setInvoices(json.data ?? []);
    } catch {
      console.error("Failed to fetch invoices");
    }
    setLoading(false);
  }, [statusFilter]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const filtered = invoices.filter((inv) =>
    inv.invoiceNumber.toLowerCase().includes(search.toLowerCase())
  );

  const handlePay = async (invoice: PortalInvoice) => {
    setPayingId(invoice.id);
    try {
      if (invoice.paymentUrl) {
        window.open(invoice.paymentUrl, "_blank");
        setPayingId(null);
        return;
      }
      const res = await fetch(`/api/invoices/${invoice.id}/payment`);
      const json = await res.json();
      if (res.ok && json.redirect_url) {
        window.open(json.redirect_url, "_blank");
        await fetchInvoices();
      } else {
        alert(json.message || "Gagal membuka halaman pembayaran");
      }
    } catch {
      alert("Terjadi kesalahan jaringan");
    }
    setPayingId(null);
  };

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Riwayat Tagihan</h1>
        <p className="text-slate-500 mt-0.5 text-sm">
          Semua tagihan dari pekerjaan yang telah dilakukan.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nomor invoice..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="py-2.5 px-4 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all cursor-pointer"
        >
          <option value="">Semua Status</option>
          <option value="PENDING">Menunggu</option>
          <option value="UNPAID">Belum Dibayar</option>
          <option value="OVERDUE">Jatuh Tempo</option>
          <option value="PAID">Lunas</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400 gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Memuat tagihan...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-2">
            <FileText className="w-10 h-10 text-slate-300" />
            <p className="text-sm font-medium">Tidak ada tagihan ditemukan</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((inv) => (
              <div key={inv.id}>
                {/* Invoice Row */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 px-6 py-4 hover:bg-slate-50/80 transition-colors">
                  {/* Left section */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-mono text-sm font-semibold text-slate-800">
                        {inv.invoiceNumber}
                      </span>
                      <StatusBadge status={inv.status} />
                    </div>
                    <div className="flex items-center gap-4 mt-1.5 text-xs text-slate-500 flex-wrap">
                      <span>Diterbitkan: {inv.issueDate}</span>
                      <span
                        className={
                          inv.status === "OVERDUE"
                            ? "text-rose-600 font-medium"
                            : "text-slate-400"
                        }
                      >
                        Jatuh Tempo: {inv.dueDate}
                      </span>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="text-right shrink-0">
                    <p className="font-bold text-slate-900">{formatIDR(inv.totalAmount)}</p>
                    {inv.taxAmount > 0 && (
                      <p className="text-xs text-slate-400">termasuk pajak {inv.taxRate}%</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => toggleExpand(inv.id)}
                      className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all"
                      title="Lihat detail"
                    >
                      {expandedId === inv.id ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                    {canPay(inv.status) && (
                      <button
                        onClick={() => handlePay(inv)}
                        disabled={payingId === inv.id}
                        className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {payingId === inv.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <CreditCard className="w-3.5 h-3.5" />
                        )}
                        Bayar
                      </button>
                    )}
                  </div>
                </div>

                {/* Expandable Detail */}
                {expandedId === inv.id && (
                  <div className="px-6 pb-5 bg-slate-50/50 border-t border-slate-100">
                    <h4 className="text-xs font-bold uppercase tracking-wide text-slate-400 mt-4 mb-3">
                      Rincian Tagihan
                    </h4>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-xs text-slate-400 uppercase">
                          <th className="text-left pb-2 font-semibold">Deskripsi</th>
                          <th className="text-right pb-2 font-semibold">Qty</th>
                          <th className="text-right pb-2 font-semibold">Harga Satuan</th>
                          <th className="text-right pb-2 font-semibold">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {inv.items.map((item, i) => (
                          <tr key={i}>
                            <td className="py-2 text-slate-700">{item.description}</td>
                            <td className="py-2 text-right text-slate-500">{item.quantity}</td>
                            <td className="py-2 text-right text-slate-500">
                              {formatIDR(item.unitPrice)}
                            </td>
                            <td className="py-2 text-right font-medium text-slate-800">
                              {formatIDR(item.total)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        {inv.taxAmount > 0 && (
                          <tr className="border-t border-slate-200">
                            <td colSpan={3} className="pt-3 text-right text-slate-500 text-xs">
                              Pajak ({inv.taxRate}%)
                            </td>
                            <td className="pt-3 text-right text-slate-600">
                              {formatIDR(inv.taxAmount)}
                            </td>
                          </tr>
                        )}
                        <tr className="border-t border-slate-200 font-bold">
                          <td colSpan={3} className="pt-2 text-right text-slate-800">
                            Total
                          </td>
                          <td className="pt-2 text-right text-slate-900 text-base">
                            {formatIDR(inv.totalAmount)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>

                    {inv.lastPayment && (
                      <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-700 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                        <div>
                          <span className="font-semibold">Pembayaran diterima</span> via{" "}
                          {inv.lastPayment.paymentMethod || "transfer"} pada{" "}
                          {new Date(inv.lastPayment.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
