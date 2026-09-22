"use client";

import { useState, useEffect, useCallback } from "react";
import React from "react";
import { ClientDataTable, ClientData } from "@/components/admin/ClientDataTable";
import { Client, getBillingStatus } from "@/types/client";
import {
  Users,
  UsersRound,
  AlertCircle,
  Clock,
  Settings2,
  Loader2,
} from "lucide-react";
import AddModalClient from "@/components/admin/AddModalClient";
import { useRouter } from "next/navigation";

const ClientPage = () => {
  const router = useRouter();

  // ── State ─────────────────────────────────────────────
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  // State untuk modal Add/Edit
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Client | null>(null);

  // State untuk modal konfirmasi delete
  const [deleteTarget, setDeleteTarget] = useState<Client | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ── Fetch Data dari API ────────────────────────────────
  const fetchClients = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/clients?search=${search}`);
      if (!res.ok) throw new Error("Gagal mengambil data");
      const data: Client[] = await res.json();
      setClients(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [search]);

  // Panggil fetchClients saat pertama render dan setiap search berubah
  useEffect(() => {
    const delay = setTimeout(() => fetchClients(), 300); // debounce 300ms
    return () => clearTimeout(delay);
  }, [fetchClients]);

  // ── Handler Aksi Tabel ────────────────────────────────
  const handleViewWorkspace = (clientId: string) => {
    router.push(`/clients/${clientId}`);
  };

  const handleEditClient = (clientId: string) => {
    const target = clients.find((c) => c.id === clientId) || null;
    setEditTarget(target);
    setModalOpen(true);
  };

  const handleDeleteClient = (clientId: string) => {
    const target = clients.find((c) => c.id === clientId) || null;
    setDeleteTarget(target);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await fetch(`/api/clients/${deleteTarget.id}`, { method: "DELETE" });
      setDeleteTarget(null);
      fetchClients(); // refresh tabel
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  // ── Transform data API → format ClientDataTable ───────
  // ClientDataTable masih menggunakan format lama, kita mapping di sini
  const tableData: ClientData[] = clients.map((c) => ({
    id: c.id,
    companyName: c.name,
    email: c.email || "-",
    picName: "-",          // Belum ada field PIC di schema — bisa ditambah nanti
    phone: c.phone || "-",
    activeProjectsCount: c.projects.length,
    unbilledHours: 0,      // Akan diisi saat Worklog sudah diimplementasi
    unbilledAmount: "Rp 0",
    billingStatus: getBillingStatus(c.invoices),
    portalStatus: "UNDANGAN_DITERIMA" as const,
  }));

  // ── Statistik ringkasan (dihitung dari data yang sudah di-fetch) ─
  const totalClients = clients.length;
  const activeClients = clients.filter((c) => c.projects.length > 0).length;
  const overdueCount = clients.filter(
    (c) => getBillingStatus(c.invoices) === "OVERDUE"
  ).length;

  return (
    <div className="flex flex-col max-w-full w-full mx-auto p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-slate-900">Ikhtisar Klien</h1>
        <p className="text-slate-500 mt-1">
          Kelola semua perusahaan klien, proyek, dan status tagihannya.
        </p>
      </div>

      {/* ── Summary Cards ─────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Client */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-all duration-200 p-6 cursor-default group">
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-semibold text-slate-500">Total Klien</h3>
            <div className="p-2.5 bg-amber-50 text-amber-500 rounded-lg group-hover:scale-110 group-hover:bg-amber-100 transition-all duration-200">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-bold tracking-tight text-slate-900">
              {isLoading ? "..." : totalClients}
            </p>
            <span className="text-sm text-slate-400 mt-2 block">Total clients terdaftar</span>
          </div>
        </div>

        {/* Active Clients */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition-all duration-200 cursor-default group">
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-semibold text-slate-500">Klien Aktif</h3>
            <div className="p-2.5 bg-green-100 text-green-500 rounded-lg group-hover:scale-110 group-hover:bg-green-200 transition-all duration-200">
              <UsersRound className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-bold tracking-tight text-slate-900">
              {isLoading ? "..." : activeClients}
            </p>
            <span className="text-sm text-slate-400 mt-2 block">Memiliki proyek berjalan</span>
          </div>
        </div>

        {/* Tagihan Jatuh Tempo */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition-all duration-200 cursor-default group">
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-semibold text-slate-500">Tagihan Jatuh Tempo</h3>
            <div className="p-2.5 bg-red-50 text-red-500 rounded-lg group-hover:scale-110 group-hover:bg-red-100 transition-all duration-200">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-bold tracking-tight text-slate-900">
              {isLoading ? "..." : overdueCount}
            </p>
            <span className="text-sm text-slate-400 mt-2 block">Klien dengan tagihan overdue</span>
          </div>
        </div>

        {/* Unbilled */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition-all duration-200 cursor-default group">
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-semibold text-slate-500">Jam Belum Ditagih</h3>
            <div className="p-2.5 bg-purple-50 text-purple-500 rounded-lg group-hover:scale-110 group-hover:bg-purple-100 transition-all duration-200">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-bold tracking-tight text-slate-900">0</p>
            <span className="text-sm text-slate-400 mt-2 block">Tersedia setelah Worklogs aktif</span>
          </div>
        </div>
      </div>

      {/* ── Tabel + Filter ───────────────────────────────── */}
      <div className="mt-6 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex justify-between items-center mb-4">
          {/* Search */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Cari nama atau email client..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E15A3E] focus:border-transparent w-64"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Filter */}
            <div className="relative flex items-center">
              <Settings2 className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none z-10" />
              <select className="appearance-none bg-white border border-slate-300 rounded-lg pl-9 pr-8 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#E15A3E] focus:border-transparent transition-all cursor-pointer">
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Tombol Add */}
            <button
              onClick={() => {
                setEditTarget(null);
                setModalOpen(true);
              }}
              className="bg-[#E15A3E] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#C14A2F] transition-all duration-200 shadow-sm"
            >
              + Add Client
            </button>
          </div>
        </div>

        {/* Loading state */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-slate-400 gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Memuat data client...</span>
          </div>
        ) : tableData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <Users className="w-10 h-10 mb-3 text-slate-300" />
            <p className="text-sm font-medium">Belum ada client terdaftar</p>
            <p className="text-xs mt-1">Klik tombol &quot;+ Add Client&quot; untuk menambahkan client pertama</p>
          </div>
        ) : (
          <ClientDataTable
            clients={tableData}
            onViewWorkspace={handleViewWorkspace}
            onEditClient={handleEditClient}
            onSendPortalLink={(id) => console.log("Send portal link:", id)}
            onDeleteClient={handleDeleteClient}
          />
        )}
      </div>

      {/* ── Modal Add / Edit ─────────────────────────────── */}
      <AddModalClient
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditTarget(null);
        }}
        onSuccess={fetchClients}
        editData={
          editTarget
            ? {
                id: editTarget.id,
                name: editTarget.name,
                email: editTarget.email,
                phone: editTarget.phone,
                address: editTarget.address,
              }
            : null
        }
      />

      {/* ── Modal Konfirmasi Delete ──────────────────────── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Hapus Client</h3>
            <p className="text-sm text-slate-500 mb-6">
              Apakah kamu yakin ingin menghapus{" "}
              <span className="font-semibold text-slate-700">
                {deleteTarget.name}
              </span>
              ? Data klien tidak akan hilang dari database (Soft Delete).
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
};

export default ClientPage;
