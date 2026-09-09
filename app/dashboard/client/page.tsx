import React from "react";
import { CircleDollarSign, Users } from "lucide-react";
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
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-semibold text-slate-500">
              Total Client
            </h3>
            <div className="p-2.5 bg-amber-50 text-amber-500 rounded-lg">
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
      </div>
    </div>
  );
};

export default clientPage;
