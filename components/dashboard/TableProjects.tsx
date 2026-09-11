"use client";

import React, { useState } from "react";
import {
  MoreVertical,
  ExternalLink,
  Edit,
  Archive,
  Trash2,
  Clock,
  Briefcase,
  Layers,
  Pause,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export interface ProjectData {
  id: string;
  projectName: string;
  clientName: string;
  billingModel: "HOURLY" | "FIXED" | "MILESTONE";
  hoursLogged: number;
  hoursBudget: number;
  spentAmount: string;
  budgetAmount: string;
  status: "ACTIVE" | "ON_HOLD" | "COMPLETED" | "CANCELLED";
  deadline: string;
}

interface TableProjectsProps {
  projects: ProjectData[];
  onViewProject: (projectId: string) => void;
  onEditProject: (projectId: string) => void;
  onArchiveProject: (projectId: string) => void;
  onDeleteProject: (projectId: string) => void;
}

export default function TableProjects({
  projects,
  onViewProject,
  onEditProject,
  onArchiveProject,
  onDeleteProject,
}: TableProjectsProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = (id: string) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const getAvatarInitial = (name: string) => name.charAt(0).toUpperCase();

  const getBillingModelBadge = (model: ProjectData["billingModel"]) => {
    switch (model) {
      case "HOURLY":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 border border-blue-200">
            <Clock className="h-3 w-3" /> Hourly
          </span>
        );
      case "FIXED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 border border-amber-200">
            <Briefcase className="h-3 w-3" /> Fixed
          </span>
        );
      case "MILESTONE":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700 border border-purple-200">
            <Layers className="h-3 w-3" /> Milestone
          </span>
        );
    }
  };

  const getStatusBadge = (status: ProjectData["status"]) => {
    switch (status) {
      case "ACTIVE":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 border border-green-200">
            <CheckCircle2 className="h-3 w-3" /> Active
          </span>
        );
      case "ON_HOLD":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 border border-amber-200">
            <Pause className="h-3 w-3" /> On Hold
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 border border-slate-200">
            <CheckCircle2 className="h-3 w-3" /> Completed
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700 border border-rose-200">
            <XCircle className="h-3 w-3" /> Cancelled
          </span>
        );
    }
  };

  const getProgressColor = (percent: number) => {
    if (percent >= 90) return "bg-rose-500";
    if (percent >= 70) return "bg-amber-500";
    return "bg-emerald-500";
  };

  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-100 text-xs uppercase tracking-wider text-slate-600">
            <tr>
              <th scope="col" className="px-6 py-4 font-semibold">
                Nama Project
              </th>
              <th scope="col" className="px-6 py-4 font-semibold">
                Client
              </th>
              <th scope="col" className="px-6 py-4 font-semibold">
                Model Billing
              </th>
              <th scope="col" className="px-6 py-4 font-semibold">
                Progres Jam / Anggaran
              </th>
              <th scope="col" className="px-6 py-4 font-semibold">
                Deadline
              </th>
              <th scope="col" className="px-6 py-4 font-semibold">
                Status Project
              </th>
              <th scope="col" className="px-6 py-4 font-semibold text-right">
                Aksi
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {projects.map((project) => {
              const progressPercent =
                project.hoursBudget > 0
                  ? Math.min(
                      100,
                      Math.round(
                        (project.hoursLogged / project.hoursBudget) * 100
                      )
                    )
                  : 0;

              return (
                <tr
                  key={project.id}
                  className="transition-colors hover:bg-slate-50"
                >
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 font-bold text-indigo-600 border border-indigo-200">
                        {getAvatarInitial(project.projectName)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900">
                          {project.projectName}
                        </span>
                        <span className="text-xs text-slate-500">
                          ID: {project.id}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="text-slate-900">{project.clientName}</span>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    {getBillingModelBadge(project.billingModel)}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-1.5 font-medium text-slate-900">
                          <Clock className="h-3.5 w-3.5 text-amber-500" />
                          <span>
                            {project.hoursLogged} / {project.hoursBudget} hrs
                          </span>
                        </div>
                        <span className="text-xs text-slate-500">
                          {progressPercent}%
                        </span>
                      </div>
                      <div className="h-1.5 w-32 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${getProgressColor(progressPercent)}`}
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500">
                        {project.spentAmount} / {project.budgetAmount}
                      </span>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="text-slate-700">{project.deadline}</span>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    {getStatusBadge(project.status)}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <div className="relative inline-block text-left">
                      <button
                        onClick={() => toggleDropdown(project.id)}
                        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>

                      {activeDropdown === project.id && (
                        <div className="absolute right-0 z-20 mt-2 w-48 rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                          <button
                            onClick={() => {
                              onViewProject(project.id);
                              setActiveDropdown(null);
                            }}
                            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          >
                            <ExternalLink className="h-4 w-4 text-blue-500" />{" "}
                            Lihat Detail
                          </button>
                          <button
                            onClick={() => {
                              onEditProject(project.id);
                              setActiveDropdown(null);
                            }}
                            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          >
                            <Edit className="h-4 w-4 text-slate-500" /> Edit
                            Project
                          </button>
                          <button
                            onClick={() => {
                              onArchiveProject(project.id);
                              setActiveDropdown(null);
                            }}
                            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          >
                            <Archive className="h-4 w-4 text-amber-500" />{" "}
                            Arsipkan
                          </button>
                          <div className="my-1 border-t border-slate-100" />
                          <button
                            onClick={() => {
                              onDeleteProject(project.id);
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
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
