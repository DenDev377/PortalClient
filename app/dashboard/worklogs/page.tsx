"use client";

import { Clock, Coins, FileCheck, Timer } from "lucide-react";

export default function WorklogsPage() {
  return (
    <div className="max-w-full w-full flex flex-col justify-between p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-slate-900">
          {" "}
          Worklogs Overview
        </h1>
        <p className="text-slate-500 mt-1">
          {" "}
          Welcome back, here&apos;s what&apos;s happening with your worklogs today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between transition-all duration-200 hover:shadow-md cursor-default group">
          <div className="flex items-start justify-between">
            <h3 className="text-slate-500 text-sm font-semibold">Total Hours</h3>
            <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-100 transition-all duration-200">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-1">
              <p className="text-3xl font-bold tracking-tight text-slate-900">
                12
              </p>
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <span className="text-slate-400">
                Total logged hours this month
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Unbilled Hours */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between transition-all duration-200 hover:shadow-md cursor-default group">
          <div className="flex items-start justify-between">
            <h3 className="text-slate-500 text-sm font-semibold">
              Unbilled Hours
            </h3>
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-100 transition-all duration-200">
              <Timer className="w-5 h-5" />
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
                Accumulated unbilled worklog hours
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Unbilled Value */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between transition-all duration-200 hover:shadow-md cursor-default group">
          <div className="flex items-start justify-between">
            <h3 className="text-slate-500 text-sm font-semibold">
              Unbilled Value
            </h3>
            <div className="p-2.5 rounded-lg bg-amber-50 text-amber-400 group-hover:scale-110 group-hover:bg-amber-100 transition-all duration-200">
              <Coins className="w-5 h-5" />
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
                Estimated value of unbilled hours
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Billed Hours */}

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between transition-all duration-200 hover:shadow-md cursor-default group">
          <div className="flex items-start justify-between">
            <h3 className="text-slate-500 text-sm font-semibold">
              Billed Hours
            </h3>
            <div className="p-2.5 rounded-lg bg-red-50 text-red-400 group-hover:scale-110 group-hover:bg-red-100 transition-all duration-200">
              <FileCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-1">
              <p className="text-3xl font-bold tracking-tight text-slate-900">
                25
              </p>
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <span className="text-slate-400">
                Hours that have been billed
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
