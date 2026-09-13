"use client";

import { useState } from "react";
import { Clock, Coins, FileCheck, Timer, FileText } from "lucide-react";
import QuickTimeLogBar from "@/components/admin/QuickTimeLogBar";
import WorklogToolbar from "@/components/admin/WorklogToolbar";
import TableWorklogs from "@/components/admin/TableWorklogs";
import EditWorklogModal from "@/components/admin/EditWorklogModal";
import type { DateRangePreset, WorklogData } from "@/types/worklog";

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
    id: "wl-002",
    projectId: "2",
    projectName: "Mobile App Development",
    clientName: "CV Kreatif Abadi",
    taskDescription: "Implementasi endpoint API untuk modul notifikasi",
    durationHours: 5,
    hourlyRate: 250000,
    logDate: "2026-09-11",
    teamMember: "Siti Rahma",
    billingStatus: "BILLED",
    invoiceNumber: "INV-2026-001",
  },
  {
    id: "wl-003",
    projectId: "3",
    projectName: "E-commerce Platform",
    clientName: "PT Teknologi Nusantara",
    taskDescription:
      "Optimasi query database untuk halaman produk, indexing, dan caching layer Redis",
    durationHours: 2.5,
    hourlyRate: 300000,
    logDate: "2026-09-11",
    teamMember: "Budi Santoso",
    billingStatus: "UNBILLED",
  },
  {
    id: "wl-004",
    projectId: "1",
    projectName: "Website Redesign",
    clientName: "PT Maju Jaya",
    taskDescription: " slicing ulang komponen Navbar dan Sidebar responsif",
    durationHours: 4,
    hourlyRate: 200000,
    logDate: "2026-09-12",
    teamMember: "Andi Pratama",
    billingStatus: "UNBILLED",
  },
  {
    id: "wl-005",
    projectId: "4",
    projectName: "Internal Dashboard",
    clientName: "Toko Modern Sentosa",
    taskDescription:
      "Setup CI/CD pipeline, konfigurasi Vercel dan environment variables",
    durationHours: 1.5,
    hourlyRate: 350000,
    logDate: "2026-09-12",
    teamMember: "Siti Rahma",
    billingStatus: "BILLED",
    invoiceNumber: "INV-2026-002",
  },
  {
    id: "wl-006",
    projectId: "3",
    projectName: "E-commerce Platform",
    clientName: "PT Teknologi Nusantara",
    taskDescription:
      "Review PR tim frontend, diskusi arsitektur state management dengan Zustand",
    durationHours: 2,
    hourlyRate: 300000,
    logDate: "2026-09-13",
    teamMember: "Budi Santoso",
    billingStatus: "UNBILLED",
  },
];

export default function WorklogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedBilling, setSelectedBilling] = useState("");
  const [datePreset, setDatePreset] = useState<DateRangePreset>("THIS_MONTH");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingWorklog, setEditingWorklog] = useState<WorklogData | null>(null);

  const handleToggleSelect = (worklogId: string) => {
    setSelectedIds((prev) =>
      prev.includes(worklogId)
        ? prev.filter((id) => id !== worklogId)
        : [...prev, worklogId],
    );
  };

  const handleToggleSelectAll = (worklogIds: string[]) => {
    setSelectedIds(worklogIds);
  };

  const handleEditLog = (worklogId: string) => {
    const worklog = DUMMY_WORKLOGS.find((w) => w.id === worklogId);
    if (worklog) {
      setEditingWorklog(worklog);
    }
  };

  const handleDeleteLog = (worklogId: string) => {
    console.log("Delete worklog:", worklogId);
    setSelectedIds((prev) => prev.filter((id) => id !== worklogId));
  };

  const handleConvertToInvoice = () => {
    console.log("Convert to invoice:", selectedIds);
  };

  const totalSelectedAmount = DUMMY_WORKLOGS.filter((w) =>
    selectedIds.includes(w.id),
  ).reduce((sum, w) => sum + w.durationHours * w.hourlyRate, 0);

  const totalSelectedHours = DUMMY_WORKLOGS.filter((w) =>
    selectedIds.includes(w.id),
  ).reduce((sum, w) => sum + w.durationHours, 0);

  const formatIDR = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);

  return (
    <div className="max-w-full w-full flex flex-col justify-between p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-slate-900">
          {" "}
          Worklogs Overview
        </h1>
        <p className="text-slate-500 mt-1">
          {" "}
          Welcome back, here&apos;s what&apos;s happening with your worklogs
          today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between transition-all duration-200 hover:shadow-md cursor-default group">
          <div className="flex items-start justify-between">
            <h3 className="text-slate-500 text-sm font-semibold">
              Total Hours
            </h3>
            <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-100 transition-all duration-200">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-1">
              <p className="text-3xl font-bold tracking-tight text-slate-900">
                12
              </p>
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <span className="text-slate-400">
                Total logged hours this month
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Unbilled Value */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between transition-all duration-200 hover:shadow-md cursor-default group">
          <div className="flex items-start justify-between">
            <h3 className="text-slate-500 text-sm font-semibold">
              Unbilled Value
            </h3>
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-100 transition-all duration-200">
              <Timer className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-1">
              <p className="text-3xl font-bold tracking-tight text-slate-900">
                35
              </p>
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <span className="text-slate-400">
                Estimated value of unbilled hours
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Unbilled Hours */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between transition-all duration-200 hover:shadow-md cursor-default group">
          <div className="flex items-start justify-between">
            <h3 className="text-slate-500 text-sm font-semibold">
              Unbilled Hours
            </h3>
            <div className="p-2.5 rounded-lg bg-amber-50 text-amber-400 group-hover:scale-110 group-hover:bg-amber-100 transition-all duration-200">
              <Coins className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-1">
              <p className="text-3xl font-bold tracking-tight text-slate-900">
                85
              </p>
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <span className="text-slate-400">
                Accumulated unbilled worklog hours
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Billed Hours */}

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between transition-all duration-200 hover:shadow-md cursor-default group">
          <div className="flex items-start justify-between">
            <h3 className="text-slate-500 text-sm font-semibold">
              Billed Hours
            </h3>
            <div className="p-2.5 rounded-lg bg-red-50 text-red-400 group-hover:scale-110 group-hover:bg-red-100 transition-all duration-200">
              <FileCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-1">
              <p className="text-3xl font-bold tracking-tight text-slate-900">
                25
              </p>
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <span className="text-slate-400">
                Hours that have been billed
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <QuickTimeLogBar />

        <WorklogToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedProject={selectedProject}
          onProjectChange={setSelectedProject}
          selectedBilling={selectedBilling}
          onBillingChange={setSelectedBilling}
          datePreset={datePreset}
          onDatePresetChange={setDatePreset}
          customStartDate={customStartDate}
          onCustomStartDateChange={setCustomStartDate}
          customEndDate={customEndDate}
          onCustomEndDateChange={setCustomEndDate}
        />

        {selectedIds.length > 0 && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-indigo-900">
                {selectedIds.length} worklog dipilih
              </span>
              <span className="text-xs text-indigo-700">
                {totalSelectedHours.toFixed(2)} hrs —{" "}
                {formatIDR(totalSelectedAmount)}
              </span>
            </div>
            <button
              onClick={handleConvertToInvoice}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
            >
              <FileText className="w-4 h-4" /> Convert to Invoice
            </button>
          </div>
        )}

        <TableWorklogs
          worklogs={DUMMY_WORKLOGS}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onToggleSelectAll={handleToggleSelectAll}
          onEditLog={handleEditLog}
          onDeleteLog={handleDeleteLog}
        />
      </div>

      <EditWorklogModal
        isOpen={editingWorklog !== null}
        onClose={() => setEditingWorklog(null)}
        worklog={editingWorklog}
        isAdmin={true}
      />
    </div>
  );
}
