"use client";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { LogOut, Receipt, ShieldCheck } from "lucide-react";

export default function Navbar({ user }: { user: any }) {
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm shadow-slate-100/50">
      <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6 sm:gap-10">
            {/* Logo */}
            <div className="flex items-center gap-2 select-none">
              <div className="w-9 h-9 bg-[#E15A3E] rounded-xl flex items-center justify-center text-white font-black text-lg shadow-md border border-[#C54A30]/20">
                P
              </div>
              <span className="font-extrabold text-xl hidden sm:block tracking-tight text-slate-800">
                Portal<span className="text-[#E15A3E] font-semibold">Klien</span>
              </span>
            </div>
            
            {/* Nav Links */}
            <nav className="flex gap-2">
              <Link
                href="/portal/dashboard"
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                  pathname === '/portal/dashboard' 
                    ? 'bg-[#E15A3E] text-white shadow-md shadow-[#E15A3E]/20' 
                    : 'text-slate-500 hover:bg-[#FFF0ED] hover:text-[#E15A3E]'
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/portal/invoices"
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                  pathname.startsWith('/portal/invoices') 
                    ? 'bg-[#E15A3E] text-white shadow-md shadow-[#E15A3E]/20' 
                    : 'text-slate-500 hover:bg-[#FFF0ED] hover:text-[#E15A3E]'
                }`}
              >
                <Receipt className="w-4 h-4" />
                Tagihan
              </Link>
            </nav>
          </div>

          {/* User Info & Actions */}
          <div className="flex items-center gap-5">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-bold text-slate-800 leading-tight select-none">
                {user?.name}
              </span>
              <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1 mt-0.5 select-none">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                Verified Client
              </span>
            </div>
            <div className="h-8 w-px bg-slate-200 hidden md:block"></div>
            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-rose-200"
              title="Logout"
            >
              <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

