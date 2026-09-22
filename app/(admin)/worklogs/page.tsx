"use client";

import { useState, useEffect, useCallback } from "react";
import { Clock, Coins, FileCheck, Timer, FileText, Loader2 } from "lucide-react";
import QuickTimeLogBar from "@/components/admin/QuickTimeLogBar";
import WorklogToolbar from "@/components/admin/WorklogToolbar";
import TableWorklogs from "@/components/admin/TableWorklogs";
import EditWorklogModal from "@/components/admin/EditWorklogModal";
import type { DateRangePreset, ProjectOption, WorklogData } from "@/types/worklog";

export default function WorklogsPage() {
  const [worklogs, setWorklogs] = useState<WorklogData[]>([]);
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedBilling, setSelectedBilling] = useState("");
  const [datePreset, setDatePreset] = useState<DateRangePreset>("THIS_MONTH");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingWorklog, setEditingWorklog] = useState<WorklogData | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<WorklogData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ── Hitung rentang tanggal dari preset ──────────────────────
  const getDateRange = useCallback(() => {
    const today = new Date();
    const end = today.toISOString().slice(0, 10);
    let start = "";

    if (datePreset === "THIS_WEEK") {
      const day = today.getDay();
      const diff = day === 0 ? 6 : day - 1;
      const monday = new Date(today);
      monday.setDate(today.getDate() - diff);
      start = monday.toISOString().slice(0, 10);
    } else if (datePreset === "THIS_MONTH") {
      start = new Date(today.getFullYear(), today.getMonth(), 1)
        .toISOString()
        .slice(0, 10);
    } else if (datePreset === "CUSTOM") {
      return { startDate: customStartDate, endDate: customEndDate };
    }

    return { startDate: start, endDate: end };
  }, [datePreset, customStartDate, customEndDate]);

  // ── Fetch Worklogs ──────────────────────────────────────────
  const fetchWorklogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      if (selectedProject) params.set("projectId", selectedProject);
      if (selectedBilling)
        params.set("isBilled", selectedBilling === "BILLED" ? "true" : "false");
      const { startDate, endDate } = getDateRange();
      if (startDate) params.set("startDate", startDate);
      if (endDate) params.set("endDate", endDate);

      const res = await fetch(`/api/worklogs?${params.toString()}`);
      if (!res.ok) throw new Error("Gagal mengambil data");
      const json = await res.json();
      setWorklogs(json.data ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedProject, selectedBilling, getDateRange]);

  // ── Fetch Projects untuk dropdown ───────────────────────────
  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch("/api/projects?limit=100");
      if (!res.ok) return;
      const json = await res.json();
const options: ProjectOption[] = (json ?? []).map((p: {
	id: string;
	name: string;
	client?: { name?: string };
}) => ({
	id: p.id,
	projectName: p.name,
	clientName: p.client?.name ?? "",
}));
      setProjects(options);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => fetchWorklogs(), 300);
    return () => clearTimeout(delay);
  }, [fetchWorklogs]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // ── Handlers ────────────────────────────────────────────────
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
    const worklog = worklogs.find((w) => w.id === worklogId) || null;
    setEditingWorklog(worklog);
  };

  const handleDeleteLog = (worklogId: string) => {
    const target = worklogs.find((w) => w.id === worklogId) || null;
    setDeleteTarget(target);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await fetch(`/api/worklogs/${deleteTarget.id}`, { method: "DELETE" });
      setSelectedIds((prev) => prev.filter((id) => id !== deleteTarget.id));
      setDeleteTarget(null);
      fetchWorklogs();
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleConvertToInvoice = () => {
    console.log("Convert to invoice:", selectedIds);
  };

  // ── Statistik dari data real ────────────────────────────────
  const totalHours = worklogs.reduce((sum, w) => sum + w.durationHours, 0);
  const unbilledValue = worklogs
    .filter((w) => w.billingStatus === "UNBILLED")
    .reduce((sum, w) => sum + w.durationHours * Number(w.hourlyRate), 0);
  const unbilledHours = worklogs
    .filter((w) => w.billingStatus === "UNBILLED")
    .reduce((sum, w) => sum + w.durationHours, 0);
  const billedHours = worklogs
    .filter((w) => w.billingStatus === "BILLED")
    .reduce((sum, w) => sum + w.durationHours, 0);

  const totalSelectedAmount = worklogs
    .filter((w) => selectedIds.includes(w.id))
    .reduce((sum, w) => sum + w.durationHours * Number(w.hourlyRate), 0);
  const totalSelectedHours = worklogs
    .filter((w) => selectedIds.includes(w.id))
    .reduce((sum, w) => sum + w.durationHours, 0);

  const formatIDR = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);

  const stats = [
    {
      label: "Total Jam",
      value: totalHours.toFixed(1),
      icon: <Clock className="w-5 h-5" />,
      color: "indigo",
      desc: "Total jam yang dicatat (filter saat ini)",
    },
    {
      label: "Nilai Belum Ditagih",
      value: formatIDR(unbilledValue),
      icon: <Timer className="w-5 h-5" />,
      color: "emerald",
      desc: "Estimasi nilai jam yang belum ditagih",
    },
    {
      label: "Jam Belum Ditagih",
      value: unbilledHours.toFixed(1),
      icon: <Coins className="w-5 h-5" />,
      color: "amber",
      desc: "Total jam worklog yang belum ditagih",
    },
    {
      label: "Jam Sudah Ditagih",
      value: billedHours.toFixed(1),
      icon: <FileCheck className="w-5 h-5" />,
      color: "red",
      desc: "Jam yang sudah ditagih",
    },
  ];

  return (
    <div className="max-w-full w-full flex flex-col justify-between p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-slate-900">Ikhtisar Worklog</h1>
        <p className="text-slate-500 mt-1">
          {" "}
          Welcome back, ini ringkasan worklog Anda
          hari ini.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between transition-all duration-200 hover:shadow-md cursor-default group"
          >
            <div className="flex items-start justify-between">
              <h3 className="text-slate-500 text-sm font-semibold">{card.label}</h3>
              <div className={`p-2.5 rounded-lg bg-${card.color}-50 text-${card.color}-400 group-hover:scale-110 group-hover:bg-${card.color}-100 transition-all duration-200`}>
                {card.icon}
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-baseline gap-1">
                <p className="text-3xl font-bold tracking-tight text-slate-900">
                  {isLoading ? "..." : card.value}
                </p>
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm">
                <span className="text-slate-400">{card.desc}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <QuickTimeLogBar projects={projects} onSuccess={fetchWorklogs} />

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
          projects={projects}
        />

        {selectedIds.length > 0 && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-indigo-900">
                {selectedIds.length} worklog dipilih
              </span>
              <span className="text-xs text-indigo-700">
                {totalSelectedHours.toFixed(2)} hrs — {formatIDR(totalSelectedAmount)}
              </span>
            </div>
            <button
              onClick={handleConvertToInvoice}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
            >
              <FileText className="w-4 h-4" /> Konversi ke Invoice
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-slate-400 gap-2 bg-white rounded-xl border border-slate-200">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Memuat data worklog...</span>
          </div>
        ) : worklogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 bg-white rounded-xl border border-slate-200">
            <Clock className="w-10 h-10 mb-3 text-slate-300" />
            <p className="text-sm font-medium">Belum ada worklog</p>
            <p className="text-xs mt-1">Gunakan Quick Time Log di atas untuk mencatat jam kerja</p>
          </div>
        ) : (
          <TableWorklogs
            worklogs={worklogs}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
            onToggleSelectAll={handleToggleSelectAll}
            onEditLog={handleEditLog}
            onDeleteLog={handleDeleteLog}
          />
        )}
      </div>

      <EditWorklogModal
        isOpen={editingWorklog !== null}
        onClose={() => setEditingWorklog(null)}
        worklog={editingWorklog}
        isAdmin={true}
        projects={projects}
        onSuccess={fetchWorklogs}
      />

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Hapus Worklog</h3>
            <p className="text-sm text-slate-500 mb-6">
              Apakah kamu yakin ingin menghapus worklog{" "}
              <span className="font-semibold text-slate-700">{deleteTarget.taskDescription}</span>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 border border-slate-300 text-slate-700 rounded-lg py-2.5 text-sm hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 bg-red-600 text-white rounded-lg py-2.5 text-sm hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isDeleting ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}