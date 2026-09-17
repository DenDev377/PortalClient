"use client";

import {
  Activity,
  FolderKanban,
  Briefcase,
  Clock,
  Settings2,
  Loader2,
} from "lucide-react";
import TableProjects from "@/components/admin/TableProjects";
import AddModalProject from "@/components/admin/AddModalProject";
import { useState, useEffect, useCallback } from "react";
import type { Project, ProjectData, ProjectStatusDB, BillingType, mapToTableFormat } from "@/types/project";
import { mapToTableFormat as mapProject } from "@/types/project";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterBilling, setFilterBilling] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Project | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ── Fetch Data ─────────────────────────────────────────
  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (filterBilling) params.set("billingType", filterBilling);
      if (filterStatus) params.set("status", filterStatus);

      const res = await fetch(`/api/projects?${params.toString()}`);
      if (!res.ok) throw new Error("Gagal mengambil data");
      const data: Project[] = await res.json();
      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [search, filterBilling, filterStatus]);

  useEffect(() => {
    const delay = setTimeout(() => fetchProjects(), 300);
    return () => clearTimeout(delay);
  }, [fetchProjects]);

  // ── Handlers ───────────────────────────────────────────
  const handleEditProject = (projectId: string) => {
    const target = projects.find((p) => p.id === projectId) || null;
    setEditTarget(target);
    setModalOpen(true);
  };

  const handleDeleteProject = (projectId: string) => {
    const target = projects.find((p) => p.id === projectId) || null;
    setDeleteTarget(target);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await fetch(`/api/projects/${deleteTarget.id}`, { method: "DELETE" });
      setDeleteTarget(null);
      fetchProjects();
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  // ── Statistik ──────────────────────────────────────────
  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => p.status === "IN_PROGRESS").length;
  const fixedProjects = projects.filter((p) => p.billingType === "FIXED_PRICE").length;
  const hourlyProjects = projects.filter((p) => p.billingType === "HOURLY_RATE").length;

  // ── Transform ke format tabel ──────────────────────────
  const tableData: ProjectData[] = projects.map(mapProject);

  return (
    <div className="max-w-full w-full mx-auto flex flex-col p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-slate-900">Projects Overview</h1>
        <p className="text-slate-500 mt-1">
          Kelola semua proyek berdasarkan klien, tipe billing, dan statusnya.
        </p>
      </div>

      {/* ── Summary Cards ─────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Project", value: totalProjects, icon: <FolderKanban className="w-5 h-5" />, color: "indigo" },
          { label: "Sedang Berjalan", value: activeProjects, icon: <Activity className="w-5 h-5" />, color: "emerald" },
          { label: "Fixed Price", value: fixedProjects, icon: <Briefcase className="w-5 h-5" />, color: "amber" },
          { label: "Hourly Rate", value: hourlyProjects, icon: <Clock className="w-5 h-5" />, color: "red" },
        ].map((card) => (
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
              <p className="text-3xl font-bold tracking-tight text-slate-900">
                {isLoading ? "..." : card.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Tabel + Filter ─────────────────────────────── */}
      <div className="bg-white rounded-xl shadow-sm p-6 mt-6 flex flex-col border border-slate-200">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            {/* Search */}
            <input
              type="text"
              placeholder="Cari nama project atau client..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E15A3E] focus:border-transparent w-60"
            />

            {/* Filter Billing */}
            <div className="relative flex items-center">
              <Settings2 className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none z-10" />
              <select
                value={filterBilling}
                onChange={(e) => setFilterBilling(e.target.value)}
                className="appearance-none bg-white border border-slate-300 rounded-lg pl-9 pr-8 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#E15A3E] cursor-pointer"
              >
                <option value="">All Type</option>
                <option value="HOURLY_RATE">Hourly Rate</option>
                <option value="FIXED_PRICE">Fixed Price</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter Status */}
            <div className="relative flex items-center">
              <Settings2 className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none z-10" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="appearance-none bg-white border border-slate-300 rounded-lg pl-9 pr-8 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#E15A3E] cursor-pointer"
              >
                <option value="">All Status</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <button
              onClick={() => { setEditTarget(null); setModalOpen(true); }}
              className="bg-[#E15A3E] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#C14A2F] transition-all duration-200 shadow-sm"
            >
              + Add Project
            </button>
          </div>
        </div>

        {/* Tabel */}
        <div className="mt-2 overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-slate-400 gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Memuat data project...</span>
            </div>
          ) : tableData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <FolderKanban className="w-10 h-10 mb-3 text-slate-300" />
              <p className="text-sm font-medium">Belum ada project</p>
              <p className="text-xs mt-1">Klik &quot;+ Add Project&quot; untuk menambahkan project baru</p>
            </div>
          ) : (
            <TableProjects
              projects={tableData}
              onViewProject={(id) => console.log("view", id)}
              onEditProject={handleEditProject}
              onArchiveProject={(id) => console.log("archive", id)}
              onDeleteProject={handleDeleteProject}
            />
          )}
        </div>
      </div>

      {/* ── Modal Add/Edit ─────────────────────────────── */}
      <AddModalProject
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditTarget(null); }}
        onSuccess={fetchProjects}
        editData={
          editTarget
            ? {
                id: editTarget.id,
                name: editTarget.name,
                description: editTarget.description,
                clientId: editTarget.clientId,
                billingType: editTarget.billingType,
                rate: editTarget.rate,
                status: editTarget.status,
              }
            : null
        }
      />

      {/* ── Modal Konfirmasi Delete ────────────────────── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Hapus Project</h3>
            <p className="text-sm text-slate-500 mb-6">
              Apakah kamu yakin ingin menghapus project{" "}
              <span className="font-semibold text-slate-700">{deleteTarget.name}</span>?
              Semua worklog yang terkait juga akan ikut terhapus.
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
