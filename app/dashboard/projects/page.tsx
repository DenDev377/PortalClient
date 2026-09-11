"use client";
import { Activity, FolderKanban, Briefcase, Clock } from "lucide-react";

import TableProjects from "@/components/dashboard/TableProjects";

export default function ProjectsPage() {
  return (
    <div className="max-w-full w-full mx-auto flex flex-col p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-slate-900">
          {" "}
          Projects Overview
        </h1>
        <p className="text-slate-500 mt-1">
          Welcome back, here's what's happening with your projects today.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between transition-all duration-200 hover:shadow-md cursor-default group">
          <div className="flex items-start justify-between">
            <h3 className="text-slate-500 font-semibold">Total Project</h3>
            <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-100 transition-all duration-200">
              <FolderKanban className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-1">
              <p className="text-3xl font-bold tracking-tight text-slate-900">
                120
              </p>
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <span className="text-slate-400">Total projects registered</span>
            </div>
          </div>
        </div>

        {/* Card 2: Active Projects */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between transition-all duration-200 hover:shadow-md cursor-default group">
          <div className="flex items-start justify-between">
            <h3 className="text-slate-500 font-semibold">Active Project</h3>
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-100 transition-all duration-200">
              <Activity className="w-5 h-5" />
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
                Projects currently in progress
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Fixed Price Projects */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between transition-all duration-200 hover:shadow-md cursor-default group">
          <div className="flex items-start justify-between">
            <h3 className="text-slate-500 font-semibold">
              Fixed Price Projects
            </h3>
            <div className="p-2.5 rounded-lg bg-amber-50 text-amber-400 group-hover:scale-110 group-hover:bg-amber-100 transition-all duration-200">
              <Briefcase className="w-5 h-5" />
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
                Projects with fixed pricing
              </span>
            </div>
          </div>
        </div>

        {/*Hourly Rate Project */}

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between transition-all duration-200 hover:shadow-md cursor-default group">
          <div className="flex items-start justify-between">
            <h3 className="text-slate-500 font-semibold">
              Hourly Rate Projects
            </h3>
            <div className="p-2.5 rounded-lg bg-red-50 text-red-400 group-hover:scale-110 group-hover:bg-red-100 transition-all duration-200">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-1">
              <p className="text-3xl font-bold tracking-tight text-slate-900">
                25
              </p>
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <span className="text-slate-400">Projects with hourly rates</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm "></div>
    </div>
  );
}
