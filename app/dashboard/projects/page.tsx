"use client";
import {
  Activity,
  FolderKanban,
  Briefcase,
  Clock,
  Settings2,
} from "lucide-react";

import TableProjects, {
  ProjectData,
} from "@/components/dashboard/TableProjects";

export default function ProjectsPage() {
  const sampleProjects: ProjectData[] = [
    {
      id: "1",
      projectName: "Website Redesign",
      clientName: "PT Maju Jaya",
      billingModel: "HOURLY",
      hoursLogged: 120,
      hoursBudget: 200,
      spentAmount: "Rp 3.000.000",
      budgetAmount: "Rp 5.000.000",
      status: "ACTIVE",
      deadline: "2024-07-15",
    },
    {
      id: "2",
      projectName: "Mobile App Development",
      clientName: "CV Kreatif Abadi",
      billingModel: "FIXED",
      hoursLogged: 80,
      hoursBudget: 100,
      spentAmount: "Rp 2.500.000",
      budgetAmount: "Rp 3.000.000",
      status: "ON_HOLD",
      deadline: "2024-08-01",
    },
    {
      id: "3",
      projectName: "E-commerce Platform",
      clientName: "PT Teknologi Nusantara",
      billingModel: "MILESTONE",
      hoursLogged: 150,
      hoursBudget: 200,
      spentAmount: "Rp 4.500.000",
      budgetAmount: "Rp 6.000.000",
      status: "COMPLETED",
      deadline: "2024-06-30",
    },
  ];
  const handleViewProject = (projectId: string) => {
    console.log("View project:", projectId);
  };

  const handleEditProject = (projectId: string) => {
    console.log("Edit project:", projectId);
  };

  const handleArchiveProject = (projectId: string) => {
    console.log("Archive project:", projectId);
  };

  const handleDeleteProject = (projectId: string) => {
    console.log("Delete project:", projectId);
  };

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

      <div className="bg-white rounded-xl shadow-sm p-6 mt-6 flex flex-col">
        <div className="flex justify-between items-center px-8">
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search projects..."
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E15A3E] focus:border-transparent"
            />
            <div className="relative flex items-center">
              <Settings2 className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none z-10" />

              <select className="appearance-none bg-white border border-slate-300 rounded-lg pl-9 pr-8 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#E15A3E] focus:border-transparent transition-all cursor-pointer">
                <option value="">All Type</option>
                <option value="active">Hourly Rate</option>
                <option value="inactive">Fixed Price</option>
              </select>

              <div className="absolute right-3 pointer-events-none text-slate-400">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex items-center">
              <Settings2 className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none z-10" />
              <select className="appearance-none bg-white border border-slate-300 rounded-lg pl-9 pr-8 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#E15A3E] focus:border-transparent transition-all cursor-pointer">
                <option value="">All Status</option>
                <option value="">In Progress</option>
                <option value="">Completed</option>
                <option value="">On Hold</option>
              </select>
              <div className="absolute right-3 pointer-events-none text-slate-400">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
            <button className="bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-4 rounded-lg">
              Add Project
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="mt-4 overflow-x-auto">
          <TableProjects
            projects={sampleProjects}
            onViewProject={handleViewProject}
            onEditProject={handleEditProject}
            onArchiveProject={handleArchiveProject}
            onDeleteProject={handleDeleteProject}
          />
        </div>
      </div>
    </div>
  );
}
