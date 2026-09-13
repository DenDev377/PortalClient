import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  Settings2,
} from "lucide-react";

export default function Invoices() {
  return (
    <div className=" flex flex-col max-w-full w-full mx-auto p-6 justify-between">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-slate-900">Invoices Overview</h1>
        <p className="text-slate-500 mt-1">
          Welcome back, here's what's happening with your invoices today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Total Invoices Issued */}
        <div className="group flex cursor-default flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md">
          <div className="flex items-start justify-between">
            <h3 className="text-sm font-semibold text-slate-500">
              Total Invoices Issued
            </h3>
            <div className="rounded-lg bg-indigo-50 p-2.5 text-indigo-600 transition-all duration-200 group-hover:scale-110 group-hover:bg-indigo-100">
              <FileText className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-baseline gap-1">
              <p className="text-3xl font-bold tracking-tight text-slate-900">
                Rp 1.248.500.000
              </p>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
              <span className="font-semibold text-emerald-600">+12%</span>
              <span>vs bulan lalu • 328 tagihan</span>
            </div>
          </div>
        </div>
        {/* Card 2: Paid Invoices */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-all duration-200 p-6 cursor-default group">
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-semibold text-slate-500">
              Paid Invoices
            </h3>
            <div className="p-2.5 bg-emerald-50 text-emerald-400 rounded-lg group-hover:scale-110 group-hover:bg-emerald-100 transition-all duration-200">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-1">
              <p className="text-3xl font-bold tracking-tight text-slate-900">
                Rp 876.250.000
              </p>
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <span className="text-slate-400">214 invoices verified</span>
            </div>
          </div>
        </div>

        {/* Card 3: Awaiting Payment (Pending) */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-all duration-200 p-6 cursor-default group">
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-semibold text-slate-500">
              Awaiting Payment
            </h3>
            <div className="p-2.5 bg-amber-50 text-amber-400 rounded-lg group-hover:scale-110 group-hover:bg-amber-100 transition-all duration-200">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-1">
              <p className="text-3xl font-bold tracking-tight text-slate-900">
                Rp 289.750.000
              </p>
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <span className="text-slate-400">86 invoices pending</span>
            </div>
          </div>
        </div>

        {/* Card 4: Overdue */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-all duration-200 p-6 cursor-default group">
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-semibold text-slate-500">Overdue</h3>
            <div className="p-2.5 bg-rose-50 text-rose-400 rounded-lg group-hover:scale-110 group-hover:bg-rose-100 transition-all duration-200">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-1">
              <p className="text-3xl font-bold tracking-tight text-slate-900">
                Rp 82.500.000
              </p>
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <span className="text-slate-400">28 invoices past due</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col bg-white rounded-xl shadow-sm border mt-6 border-slate-200 p-6">
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search invoices..."
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E15A3E] focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex items-center">
              <Settings2 className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none z-10" />
              <select className="appearance-none bg-white border border-slate-300 rounded-lg pl-9 pr-8 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#E15A3E] focus:border-transparent transition-all cursor-pointer">
                <option value="">All Status</option>
                <option value="">Draft</option>
                <option value="">Pending</option>
                <option value="">Paid</option>
                <option value="">Overdue</option>
              </select>
              <div className="absolute right-3 pointer-events-none text-slate-400">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
            <button className="bg-[#E15A3E] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#C14A2F] transition-all duration-200 shadow-sm">
              Add Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
