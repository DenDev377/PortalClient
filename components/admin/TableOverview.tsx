"use client";

import Link from "next/link";

export default function TableOverview({ recentInvoices }: { recentInvoices?: any[] }) {
  const data = recentInvoices || [];
  const renderBadge = (status: string) => {
    if (status === "PAID") {
      return (
        <span className="bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-900">
          Dibayar
        </span>
      );
    } else if (status === "PENDING" || status === "UNPAID") {
      return (
        <span className="bg-amber-100 text-amber-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-amber-200 dark:text-amber-900">
          Menunggu
        </span>
      );
    } else if (status === "OVERDUE") {
      return (
        <span className="bg-rose-100 text-rose-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-rose-200 dark:text-rose-900">
          Jatuh Tempo
        </span>
      );
    } else {
      return (
        <span className="bg-slate-100 text-slate-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-slate-200 dark:text-slate-900">
          {status}
        </span>
      );
    }
  };

  return (
    <div className="max-w-full mx-auto w-full bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <div className=" grid grid-cols-3 lg:grid-cols-1 gap-6">
        <div className="px-6 py-2 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">Total Pendapatan</h2>
          <Link
            href="/invoices"
            className="text-slate-50 bg-blue-500 px-4 py-2 rounded-md hover:text-slate-200 hover:bg-blue-600 transition-all duration-200 text-sm"
          >
            Lihat Semua
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-100 border-b border-slate-200/80">
              <tr>
                <th scope="col" className="px-6 py-4 font-semibold">
                  No. Invoice
                </th>
                <th scope="col" className="px-6 py-4 font-semibold">
                  Nama Client
                </th>
                <th scope="col" className="px-6 py-4 font-semibold">
                  Tanggal Jatuh Tempo
                </th>
                <th scope="col" className="px-6 py-4 font-semibold">
                  Total Nominal
                </th>
                <th scope="col" className="px-6 py-4 font-semibold">
                  Status Badge
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((item, index) => (
                <tr key={index} className="bg-white hover:bg-slate-50">
                  <td className="px-6 py-4">{item.invoiceNumber}</td>
                  <td className="px-6 py-4 text-slate-600">
                    {item.clientName}
                  </td>
                  <td className="px-6 py-4">{item.date}</td>
                  <td className="px-6 py-4">{item.amount}</td>
                  <td className="px-6 py-4">{renderBadge(item.status)}</td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-center text-slate-500"
                  >
                    Tidak ada data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
