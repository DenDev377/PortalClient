"use client";
import { CalendarClock, Mail, AlertTriangle } from "lucide-react";

// Mock Data (biasanya dari API)
const mockInvoices = [
  {
    id: 1,
    client: "PT Maju Jaya",
    invoiceNo: "INV-2026-001",
    dueDate: "2026-09-12", // 3 hari lagi
    amount: 8_500_000,
  },
  {
    id: 2,
    client: "CV Kreatif Abadi",
    invoiceNo: "INV-2026-003",
    dueDate: "2026-09-10", // 1 hari lagi
    amount: 4_200_000,
  },
  {
    id: 3,
    client: "Toko Modern Sentosa",
    invoiceNo: "INV-2026-007",
    dueDate: "2026-09-15", // 6 hari lagi
    amount: 12_000_000,
  },
  {
    id: 4,
    client: "Startup Inovasi Tech",
    invoiceNo: "INV-2026-009",
    dueDate: "2026-09-16", // 7 hari lagi
    amount: 2_750_000,
  },
  {
    id: 5,
    client: "PT Solusi Digital",
    invoiceNo: "INV-2026-010",
    dueDate: "2026-09-08", // Hari ini (sangat urgent)
    amount: 6_300_000,
  },
];

export default function DueInvoicesWidget() {
  const handleSendReminder = (invoiceNo: string) => {
    console.log(`Kirim reminder email untuk invoice ${invoiceNo}`);
    // TODO: Integrasi dengan email service
  };

  // Hitung selisih hari (mock sederhana)
  const getDaysUntil = (date: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(date);
    due.setHours(0, 0, 0, 0);
    const diff = Math.ceil(
      (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );
    return diff;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
          Tagihan Jatuh Tempo
        </h3>
        <span className="text-xs bg-rose-50 text-rose-600 px-2 py-1 rounded-full font-medium">
          {mockInvoices.length} perlu perhatian
        </span>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto max-h-80 pr-1">
        {mockInvoices.map((inv) => {
          const daysLeft = getDaysUntil(inv.dueDate);
          let urgency: "overdue" | "urgent" | "normal" = "normal";
          if (daysLeft <= 0) urgency = "overdue";
          else if (daysLeft <= 3) urgency = "urgent";

          const urgencyStyles: Record<typeof urgency, string> = {
            overdue: "border-rose-200 bg-rose-50/50",
            urgent: "border-amber-200 bg-amber-50/50",
            normal: "border-slate-100 bg-white",
          };

          return (
            <div
              key={inv.id}
              className={`p-3 rounded-lg border ${urgencyStyles[urgency]} transition-all hover:shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2`}
            >
              {/* Kiri: Info Invoice */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-slate-800 truncate">
                    {inv.client}
                  </span>
                  <span className="text-xs text-slate-400 font-mono bg-slate-100 px-1.5 py-0.5 rounded">
                    {inv.invoiceNo}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">
                    Rp {inv.amount.toLocaleString("id-ID")}
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarClock className="w-3 h-3" />
                    {daysLeft <= 0 ? (
                      <span className="text-rose-600 font-medium">
                        Lewat Jatuh Tempo!
                      </span>
                    ) : daysLeft === 1 ? (
                      <span className="text-amber-600 font-medium">Besok</span>
                    ) : (
                      `${daysLeft} hari lagi`
                    )}
                  </span>
                </div>
              </div>

              {/* Kanan: Tombol Reminder */}
              <button
                onClick={() => handleSendReminder(inv.invoiceNo)}
                className={`shrink-0 flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-md transition-all ${
                  daysLeft <= 0
                    ? "bg-rose-600 text-white hover:bg-rose-700"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                Kirim Reminder
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
