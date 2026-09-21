"use client";

import { useState } from "react";
import { Plus, Clock } from "lucide-react";
import type { ProjectOption } from "@/types/worklog";

interface QuickTimeLogBarProps {
  projects: ProjectOption[];
  onSuccess?: () => void;
}

export default function QuickTimeLogBar({
  projects,
  onSuccess,
}: QuickTimeLogBarProps) {
  const [projectId, setProjectId] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [durationHours, setDurationHours] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleReset = () => {
    setProjectId("");
    setTaskDescription("");
    setDurationHours("");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/worklogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          date: new Date().toISOString().split("T")[0],
          hours: Number(durationHours),
          description: taskDescription,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Gagal mencatat worklog");
        return;
      }
      handleReset();
      onSuccess?.();
    } catch (err) {
      setError("Terjadi kesalahan jaringan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-indigo-500" />
        <h2 className="text-sm font-semibold text-slate-700">Quick Time Log</h2>
        <span className="text-xs text-slate-400">
          Catat jam kerja hari ini dengan cepat
        </span>
      </div>

      {error && (
        <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          <div className="md:col-span-4">
            <label
              htmlFor="quickProject"
              className="block text-xs font-medium text-slate-600 mb-1"
            >
              Proyek <span className="text-red-500">*</span>
            </label>
            <select
              id="quickProject"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              required
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[#E15A3E] focus:border-transparent transition-all bg-white"
            >
              <option value="" disabled>
                -- Pilih Proyek --
              </option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.projectName} — {project.clientName}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-5">
            <label
              htmlFor="quickTask"
              className="block text-xs font-medium text-slate-600 mb-1"
            >
              Deskripsi Tugas <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="quickTask"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              required
              placeholder="Contoh: Fixing Bug Auth & Slices UI"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[#E15A3E] focus:border-transparent transition-all"
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="quickDuration"
              className="block text-xs font-medium text-slate-600 mb-1"
            >
              Durasi (jam) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="quickDuration"
              value={durationHours}
              onChange={(e) => setDurationHours(e.target.value)}
              required
              step="0.25"
              min="0.25"
              placeholder="2.5"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[#E15A3E] focus:border-transparent transition-all"
            />
          </div>

          <div className="md:col-span-1">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg py-2 px-3 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              {isLoading ? "..." : "Catat"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
