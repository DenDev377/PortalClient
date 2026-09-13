"use client";

import { Search, Settings2, Calendar } from "lucide-react";
import type { DateRangePreset } from "@/types/worklog";

const DUMMY_PROJECTS = [
  { id: "1", projectName: "Website Redesign" },
  { id: "2", projectName: "Mobile App Development" },
  { id: "3", projectName: "E-commerce Platform" },
  { id: "4", projectName: "Internal Dashboard" },
];

interface WorklogToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedProject: string;
  onProjectChange: (value: string) => void;
  selectedBilling: string;
  onBillingChange: (value: string) => void;
  datePreset: DateRangePreset;
  onDatePresetChange: (value: DateRangePreset) => void;
  customStartDate: string;
  onCustomStartDateChange: (value: string) => void;
  customEndDate: string;
  onCustomEndDateChange: (value: string) => void;
}

export default function WorklogToolbar({
  searchQuery,
  onSearchChange,
  selectedProject,
  onProjectChange,
  selectedBilling,
  onBillingChange,
  datePreset,
  onDatePresetChange,
  customStartDate,
  onCustomStartDateChange,
  customEndDate,
  onCustomEndDateChange,
}: WorklogToolbarProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col gap-3">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex items-center flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none z-10" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari deskripsi tugas atau anggota tim..."
              className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[#E15A3E] focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex items-center">
            <Settings2 className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none z-10" />
            <select
              value={selectedProject}
              onChange={(e) => onProjectChange(e.target.value)}
              className="appearance-none bg-white border border-slate-300 rounded-lg pl-9 pr-8 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-[#E15A3E] focus:border-transparent transition-all cursor-pointer"
            >
              <option value="">Semua Proyek</option>
              {DUMMY_PROJECTS.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.projectName}
                </option>
              ))}
            </select>
            <div className="absolute right-3 pointer-events-none text-slate-400">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>

          <div className="relative flex items-center">
            <Settings2 className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none z-10" />
            <select
              value={selectedBilling}
              onChange={(e) => onBillingChange(e.target.value)}
              className="appearance-none bg-white border border-slate-300 rounded-lg pl-9 pr-8 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-[#E15A3E] focus:border-transparent transition-all cursor-pointer"
            >
              <option value="">Semua Status</option>
              <option value="UNBILLED">Belum Ditagih</option>
              <option value="BILLED">Sudah Ditagih</option>
            </select>
            <div className="absolute right-3 pointer-events-none text-slate-400">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>

          <div className="relative flex items-center">
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none z-10" />
            <select
              value={datePreset}
              onChange={(e) => onDatePresetChange(e.target.value as DateRangePreset)}
              className="appearance-none bg-white border border-slate-300 rounded-lg pl-9 pr-8 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-[#E15A3E] focus:border-transparent transition-all cursor-pointer"
            >
              <option value="THIS_WEEK">Minggu Ini</option>
              <option value="THIS_MONTH">Bulan Ini</option>
              <option value="CUSTOM">Custom Date</option>
            </select>
            <div className="absolute right-3 pointer-events-none text-slate-400">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {datePreset === "CUSTOM" && (
        <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <label
              htmlFor="startDate"
              className="text-xs font-medium text-slate-600 whitespace-nowrap"
            >
              Dari:
            </label>
            <input
              type="date"
              id="startDate"
              value={customStartDate}
              onChange={(e) => onCustomStartDateChange(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[#E15A3E] focus:border-transparent transition-all"
            />
          </div>
          <span className="text-slate-400 text-xs">—</span>
          <div className="flex items-center gap-2">
            <label
              htmlFor="endDate"
              className="text-xs font-medium text-slate-600 whitespace-nowrap"
            >
              Sampai:
            </label>
            <input
              type="date"
              id="endDate"
              value={customEndDate}
              onChange={(e) => onCustomEndDateChange(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[#E15A3E] focus:border-transparent transition-all"
            />
          </div>
        </div>
      )}
    </div>
  );
}
