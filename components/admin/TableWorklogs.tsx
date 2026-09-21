"use client";

import { useState, useRef, useEffect } from "react";
import {
  MoreVertical,
  Edit,
  Trash2,
  Calendar,
  Briefcase,
  FileText,
  Clock,
  Tag,
  DollarSign,
  CheckCircle2,
} from "lucide-react";
import type { BillingStatus, WorklogData } from "@/types/worklog";

interface TableWorklogsProps {
  worklogs: WorklogData[];
  selectedIds: string[];
  onToggleSelect: (worklogId: string) => void;
  onToggleSelectAll: (worklogIds: string[]) => void;
  onEditLog: (worklogId: string) => void;
  onDeleteLog: (worklogId: string) => void;
}

export default function TableWorklogs({
  worklogs,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onEditLog,
  onDeleteLog,
}: TableWorklogsProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = (id: string) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const getAvatarInitial = (name: string) => name.charAt(0).toUpperCase();

  const formatIDR = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);

  const formatDuration = (hours: number) => {
    const whole = Math.floor(hours);
    const decimal = hours - whole;
    if (decimal === 0) return `${whole} hrs`;
    if (decimal === 0.5) return `${whole}.5 hrs`;
    return `${hours.toFixed(2)} hrs`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const getBillingBadge = (status: BillingStatus, invoiceNumber?: string) => {
    if (status === "BILLED") {
      return (
        <div className="flex flex-col gap-1">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 border border-emerald-200 w-fit">
            <CheckCircle2 className="h-3 w-3" /> Sudah Ditagih
          </span>
          {invoiceNumber && (
            <span className="text-xs text-slate-500">
              Invoice: {invoiceNumber}
            </span>
          )}
        </div>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 border border-amber-200">
        Belum Ditagih
      </span>
    );
  };

  const allIds = worklogs.map((w) => w.id);
  const allSelected =
    worklogs.length > 0 && allIds.every((id) => selectedIds.includes(id));
  const someSelected = selectedIds.length > 0 && !allSelected;

  const headerCheckboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = someSelected;
    }
  }, [someSelected]);

  const handleHeaderCheckbox = () => {
    if (allSelected) {
      onToggleSelectAll([]);
    } else {
      onToggleSelectAll(allIds);
    }
  };

  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div
        className="overflow-x-auto"
        style={{ minHeight: worklogs.length > 0 ? "350px" : "auto" }}
      >
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-100 text-xs uppercase tracking-wider text-slate-600">
            <tr>
              <th scope="col" className="px-4 py-4 font-semibold w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={headerCheckboxRef}
                  onChange={handleHeaderCheckbox}
                  className="h-4 w-4 rounded border-slate-300 text-[#E15A3E] focus:ring-[#E15A3E] cursor-pointer"
                />
              </th>
              <th scope="col" className="px-4 py-4 font-semibold">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" /> Tanggal & Tim
                </div>
              </th>
              <th scope="col" className="px-4 py-4 font-semibold">
                <div className="flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5" /> Proyek & Klien
                </div>
              </th>
              <th scope="col" className="px-4 py-4 font-semibold">
                <div className="flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5" /> Deskripsi Pekerjaan
                </div>
              </th>
              <th scope="col" className="px-4 py-4 font-semibold">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" /> Durasi Jam
                </div>
              </th>
              <th scope="col" className="px-4 py-4 font-semibold">
                <div className="flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5" /> Tarif / Jam
                </div>
              </th>
              <th scope="col" className="px-4 py-4 font-semibold">
                <div className="flex items-center gap-1.5">
                  <DollarSign className="h-3.5 w-3.5" /> Subtotal Nilai
                </div>
              </th>
              <th scope="col" className="px-4 py-4 font-semibold">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Status Tagihan
                </div>
              </th>
              <th scope="col" className="px-4 py-4 font-semibold text-right">
                Aksi
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {worklogs.map((worklog) => {
              const subtotal = worklog.durationHours * Number(worklog.hourlyRate);
              const isChecked = selectedIds.includes(worklog.id);

              return (
                <tr
                  key={worklog.id}
                  className={`transition-colors hover:bg-slate-50 ${
                    isChecked ? "bg-orange-50/40" : ""
                  }`}
                >
                  <td className="whitespace-nowrap px-4 py-4">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onToggleSelect(worklog.id)}
                      className="h-4 w-4 rounded border-slate-300 text-[#E15A3E] focus:ring-[#E15A3E] cursor-pointer"
                    />
                  </td>

                  <td className="whitespace-nowrap px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 font-bold text-indigo-600 border border-indigo-200 text-sm">
                        {getAvatarInitial(worklog.teamMember)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-slate-900">
                          {worklog.teamMember}
                        </span>
                        <span className="text-xs text-slate-500">
                          {formatDate(worklog.logDate)}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-4 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-slate-900">
                        {worklog.projectName}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600 border border-slate-200 w-fit">
                        {worklog.clientName}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-4 max-w-xs">
                    <p className="text-slate-700 text-sm leading-snug line-clamp-2">
                      {worklog.taskDescription}
                    </p>
                  </td>

                  <td className="whitespace-nowrap px-4 py-4">
                    <div className="flex items-center gap-1.5 font-medium text-slate-900">
                      <Clock className="h-3.5 w-3.5 text-amber-500" />
                      <span>{formatDuration(worklog.durationHours)}</span>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-4 py-4">
                    <span className="text-slate-700">
                      {formatIDR(Number(worklog.hourlyRate))}/hr
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-4 py-4">
                    <span className="font-semibold text-slate-900">
                      {formatIDR(subtotal)}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-4 py-4">
                    {getBillingBadge(
                      worklog.billingStatus,
                      worklog.invoiceNumber,
                    )}
                  </td>

                  <td className="whitespace-nowrap px-4 py-4 text-right">
                    <div className="relative inline-block text-left">
                      <button
                        onClick={() => toggleDropdown(worklog.id)}
                        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>

                      {activeDropdown === worklog.id && (
                        <div className="absolute right-0 z-20 mt-2 w-44 rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                          <button
                            onClick={() => {
                              onEditLog(worklog.id);
                              setActiveDropdown(null);
                            }}
                            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          >
                            <Edit className="h-4 w-4 text-slate-500" /> Edit Log
                          </button>
                          <div className="my-1 border-t border-slate-100" />
                          <button
                            onClick={() => {
                              onDeleteLog(worklog.id);
                              setActiveDropdown(null);
                            }}
                            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50"
                          >
                            <Trash2 className="h-4 w-4" /> Hapus Log
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
