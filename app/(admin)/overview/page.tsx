import Link from "next/link";
import {
  CircleDollarSign,
  AlertCircle,
  ArrowUpRight,
  Clock,
  Users,
  Briefcase,
} from "lucide-react";
import FinancialOverview from "@/components/admin/FInancialOverview";
import TableOverview from "@/components/admin/TableOverview";
import QuickActionWidget from "@/components/admin/QuickActionWidget";
import DueInvoicesWidget from "@/components/admin/DueInvoicesWidget";
export default function DashboardPage() {
  return (
    <div className="flex flex-col max-w-full w-full mx-auto p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-slate-900">
          Dashboard Overview
        </h1>
        <p className="text-slate-500 mt-1">
          Welcome back, here's what's happening with your clients today.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Total Revenue */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition-all duration-200 cursor-default group">
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-semibold text-slate-500">
              Total Revenue
            </h3>
            <div className="p-2.5 bg-amber-50 text-amber-500 rounded-lg group-hover:scale-110 group-hover:bg-amber-100 transition-all duration-200">
              <CircleDollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-slate-700">Rp</span>
              <p className="text-3xl font-bold tracking-tight text-slate-900">
                24.580.000
              </p>
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <span className="flex items-center text-amber-500 font-medium bg-amber-50 px-1.5 py-0.5 rounded-md">
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                12.5%
              </span>
              <span className="text-slate-400">dari bulan lalu</span>
            </div>
          </div>
        </div>

        {/* Card 2: Unpaid Invoice */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition-all duration-200 cursor-default group">
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-semibold text-slate-500">
              Unpaid Invoices
            </h3>
            <div className="p-2.5 bg-rose-50 text-rose-600 rounded-lg group-hover:scale-110 group-hover:bg-rose-100 transition-all duration-200">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold tracking-tight text-slate-900">
                3
              </p>
              <span className="text-base font-semibold text-slate-600">
                Pending
              </span>
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <span className="flex items-center text-rose-600 font-medium bg-rose-50 px-1.5 py-0.5 rounded-md">
                <Clock className="w-3.5 h-3.5 mr-1" />
                Butuh perhatian
              </span>
            </div>
          </div>
        </div>
        {/* Card 3: Unbilled Worklog Hours */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition-all duration-200 cursor-default group">
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-semibold text-slate-500">
              Unbilled Worklog Hours
            </h3>
            <div className="p-2.5 bg-blue-50 text-blue-500 rounded-lg group-hover:scale-110 group-hover:bg-blue-100 transition-all duration-200">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold tracking-tight text-slate-900">
                12.5
              </p>
              <span className="text-base font-semibold text-slate-600">
                Hours
              </span>
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <span className="flex items-center text-blue-500 font-medium bg-blue-50 px-1.5 py-0.5 rounded-md">
                <Clock className="w-3.5 h-3.5 mr-1" />
                Perlu ditagihkan
              </span>
            </div>
          </div>
        </div>
        {/* Card 4: Active Client */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition-all duration-200 cursor-default group">
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-semibold text-slate-500">
              Active Client
            </h3>
            <div className="p-2.5 bg-green-50 text-green-600 rounded-lg group-hover:scale-110 group-hover:bg-green-100 transition-all duration-200">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold tracking-tight text-slate-900">
                3
              </p>
              <span className="text-base font-semibold text-slate-600">
                Client
              </span>
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <span className="flex items-center text-green-600 font-medium bg-green-50 px-1.5 py-0.5 rounded-md">
                <Users className="w-3.5 h-3.5 mr-1" />
                Aktif
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <FinancialOverview />
        <TableOverview />
      </div>

      {/* widget */}
      <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <QuickActionWidget />
        <DueInvoicesWidget />
      </div>
    </div>
  );
}
