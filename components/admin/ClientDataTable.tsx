"use client";

import React, { useState } from "react";
import {
  MoreVertical,
  ExternalLink,
  Edit,
  Send,
  Trash2,
  UserCheck,
  Clock,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

// Tipe Data untuk Klien
export interface ClientData {
  id: string;
  companyName: string;
  email: string;
  picName: string;
  phone: string;
  activeProjectsCount: number;
  unbilledHours: number;
  unbilledAmount: string;
  billingStatus: "LUNAS" | "PENDING" | "OVERDUE";
  portalStatus: "TERVERIFIKASI" | "UNDANGAN_DITERIMA";
}

interface ClientDataTableProps {
  clients: ClientData[];
  onViewWorkspace: (clientId: string) => void;
  onEditClient: (clientId: string) => void;
  onSendPortalLink: (clientId: string) => void;
  onDeleteClient: (clientId: string) => void;
}

export const ClientDataTable: React.FC<ClientDataTableProps> = ({
  clients,
  onViewWorkspace,
  onEditClient,
  onSendPortalLink,
  onDeleteClient,
}) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = (id: string) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  // Helper function untuk warna Avatar dari inisial
  const getAvatarInitial = (name: string) => name.charAt(0).toUpperCase();

  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div 
        className="overflow-x-auto"
        style={{ minHeight: clients.length > 0 ? "350px" : "auto" }}
      >
        <table className="w-full text-left text-sm">
          {/* Header Tabel */}
          <thead className="border-b border-slate-200 bg-slate-100 text-xs uppercase tracking-wider text-slate-600">
            <tr>
              <th scope="col" className="px-6 py-4 font-semibold">
                Klien / Perusahaan
              </th>
              <th scope="col" className="px-6 py-4 font-semibold">
                Penanggung Jawab
              </th>
              <th scope="col" className="px-6 py-4 font-semibold text-center">
                Proyek Aktif
              </th>
              <th scope="col" className="px-6 py-4 font-semibold">
                Jam Belum Ditagih
              </th>
              <th scope="col" className="px-6 py-4 font-semibold">
                Status Tagihan
              </th>
              <th scope="col" className="px-6 py-4 font-semibold">
                Status Akun Portal
              </th>
              <th scope="col" className="px-6 py-4 font-semibold text-right">
                Aksi
              </th>
            </tr>
          </thead>

          {/* Body Tabel */}
          <tbody className="divide-y divide-slate-100">
            {clients.map((client, index) => (
              <tr
                key={client.id}
                className="transition-colors hover:bg-slate-50"
              >
                {/* 1. Klien / Perusahaan */}
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 font-bold text-indigo-600 border border-indigo-200">
                      {getAvatarInitial(client.companyName)}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-900">
                        {client.companyName}
                      </span>
                      <span className="text-xs text-slate-500">
                        {client.email}
                      </span>
                    </div>
                  </div>
                </td>

                {/* 2. Penanggung Jawab */}
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-slate-900">{client.picName}</span>
                    <span className="text-xs text-slate-500">
                      {client.phone}
                    </span>
                  </div>
                </td>

                {/* 3. Proyek Aktif */}
                <td className="whitespace-nowrap px-6 py-4 text-center">
                  <span className="inline-flex items-center rounded-md bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 border border-slate-200">
                    {client.activeProjectsCount} Proyek
                  </span>
                </td>

                {/* 4. Jam Belum Ditagih */}
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 font-medium text-slate-900">
                      <Clock className="h-3.5 w-3.5 text-amber-500" />
                      <span>{client.unbilledHours} hrs</span>
                    </div>
                    <span className="text-xs text-slate-500">
                      ≈ {client.unbilledAmount}
                    </span>
                  </div>
                </td>

                {/* 5. Status Tagihan */}
                <td className="whitespace-nowrap px-6 py-4">
                  {client.billingStatus === "LUNAS" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 border border-green-200">
                      <CheckCircle2 className="h-3 w-3" /> Lunas
                    </span>
                  )}
                  {client.billingStatus === "PENDING" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 border border-amber-200">
                      <Clock className="h-3 w-3" /> Ada Tagihan Pending
                    </span>
                  )}
                  {client.billingStatus === "OVERDUE" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700 border border-rose-200">
                      <AlertCircle className="h-3 w-3" /> Jatuh Tempo
                    </span>
                  )}
                </td>

                {/* 6. Status Akun Portal */}
                <td className="whitespace-nowrap px-6 py-4">
                  {client.portalStatus === "TERVERIFIKASI" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 border border-blue-200">
                      <UserCheck className="h-3 w-3" /> Terverifikasi
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 border border-slate-200">
                      Undangan Diterima
                    </span>
                  )}
                </td>

                {/* 7. Aksi (Actions) */}
                <td className="whitespace-nowrap px-6 py-4 text-right">
                  <div className="relative inline-block text-left">
                    <button
                      onClick={() => toggleDropdown(client.id)}
                      className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>

                    {/* Dropdown Menu */}
                    {activeDropdown === client.id && (
                      <div className={`absolute right-0 z-50 w-48 rounded-xl border border-slate-200 bg-white py-1 shadow-lg ${
                        index >= 2 ? "bottom-full mb-2" : "top-full mt-2"
                      }`}>
                        <button
                          onClick={() => {
                            onViewWorkspace(client.id);
                            setActiveDropdown(null);
                          }}
                          className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <ExternalLink className="h-4 w-4 text-blue-500" />{" "}
                          Detail Workspace
                        </button>
                        <button
                          onClick={() => {
                            onEditClient(client.id);
                            setActiveDropdown(null);
                          }}
                          className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <Edit className="h-4 w-4 text-slate-500" /> Edit Data
                        </button>
                        <button
                          onClick={() => {
                            onSendPortalLink(client.id);
                            setActiveDropdown(null);
                          }}
                          className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <Send className="h-4 w-4 text-green-500" /> Kirim Link
                          Portal
                        </button>
                        <div className="my-1 border-t border-slate-100"></div>
                        <button
                          onClick={() => {
                            onDeleteClient(client.id);
                            setActiveDropdown(null);
                          }}
                          className="flex w-full items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 className="h-4 w-4" /> Hapus
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
