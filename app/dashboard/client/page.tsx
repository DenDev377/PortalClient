import React from "react";
import { ClientDataTable } from "@/components/dashboard/ClientDataTable";
import {
  CircleDollarSign,
  Users,
  UsersRound,
  AlertCircle,
  Clock,
  Settings2,
} from "lucide-react";
const clientPage = () => {
  return (
    <div className="flex flex-col max-w-full w-full mx-auto p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-slate-900">Client Overview</h1>
        <p className="text-slate-500 mt-1">
          Welcome back, here's what's happening with your clients today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-all duration-200 p-6 cursor-default group">
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-semibold text-slate-500">
              Total Client
            </h3>
            <div className="p-2.5 bg-amber-50 text-amber-500 rounded-lg group-hover:scale-110 group-hover:bg-amber-100 transition-all duration-200">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-1">
              <p className="text-3xl font-bold tracking-tight text-slate-900">
                120
              </p>
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <span className="text-slate-400">Total clients registered</span>
            </div>
          </div>
        </div>

        {/* Card 2: Active Clitens */}

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition-all duration-200 cursor-default group">
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-semibold text-slate-500">
              Active Clients
            </h3>
            <div className="p-2.5 bg-green-100 text-green-500 rounded-lg group-hover:scale-110 group-hover:bg-green-200 transition-all duration-200">
              <UsersRound className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-1">
              <p className="text-3xl font-bold tracking-tight text-slate-900">
                20
              </p>
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <span className="text-slate-400">Active clients this month</span>
            </div>
          </div>
        </div>

        {/*Card 3: Total Outsanding Balance */}

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition-all duration-200 cursor-default group">
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-semibold text-slate-500">
              Total Outstanding Balance
            </h3>
            <div className="p-2.5 bg-red-50 text-red-500 rounded-lg group-hover:scale-110 group-hover:bg-red-100 transition-all duration-200">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-1">
              <p className="text-3xl font-bold tracking-tight text-slate-900">
                $5,000
              </p>
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <span className="text-slate-400">Total outstanding balance</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition-all duration-200 cursor-default group">
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-semibold text-slate-500">
              Unbilled Worklog Hours
            </h3>
            <div className="p-2.5 bg-purple-50 text-purple-500 rounded-lg group-hover:scale-110 group-hover:bg-purple-100 transition-all duration-200">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-1">
              <p className="text-3xl font-bold tracking-tight text-slate-900">
                10
              </p>
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <span className="text-slate-400">Unbilled worklog hours</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex justify-between items-center px-8">
          {/*Search Bar */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search clients..."
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E15A3E] focus:border-transparent"
            />
          </div>
          {/*Status Select */}

          <div className="flex items-center gap-3">
            <div className="relative flex items-center">
              <Settings2 className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none z-10" />

              <select className="appearance-none bg-white border border-slate-300 rounded-lg pl-9 pr-8 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#E15A3E] focus:border-transparent transition-all cursor-pointer">
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <div className="absolute right-3 pointer-events-none text-slate-400">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>

            {/* Button Add Client */}
            <button className="bg-[#E15A3E] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#C14A2F] transition-all duration-200 shadow-sm">
              Add Client
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="mt-4 overflow-x-auto">
          <ClientDataTable />
        </div>
      </div>
    </div>
  );
};

export default clientPage;
