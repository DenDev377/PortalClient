"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Bell, ChevronDown, User } from "lucide-react";
import { useState } from "react";

export default function NavbarPage() {
  const pathname = usePathname();
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const configPage: Record<string, { title: string; subtitle: string }> = {
    "/overview": {
      title: "Dasbor",
      subtitle: "Selamat datang kembali! Ini ringkasan hari ini.",
    },
    "/clients": {
      title: "Klien",
      subtitle: "Selamat datang pada halaman klien",
    },
    "/projects": {
      title: "Proyek",
      subtitle: "Selamat datang pada halaman proyek",
    },
    "/worklogs": {
      title: "Worklog",
      subtitle: "Selamat datang pada halaman worklog",
    },
    "/invoices": {
      title: "Tagihan",
      subtitle: "Selamat datang pada halaman tagihan",
    },
  };

  const currentConfig = configPage[pathname] || configPage["/overview"];

  return (
    <nav className="bg-white w-full border-b border-slate-200 shrink-0">
      <div className="max-w-full px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
        <div className="flex flex-col min-w-0 flex-1">
          <h1 className="text-xl font-bold text-slate-800 leading-tight truncate">
            {currentConfig.title}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 hidden sm:block">
            {currentConfig.subtitle}
          </p>
        </div>

        <div className="flex items-center justify-end gap-5">
          {/* Search Bar */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari..."
              className="bg-slate-50 hover:bg-slate-100 text-slate-700 placeholder-slate-400 text-sm py-2 pl-9 pr-4 rounded-xl transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:w-64 w-52 border border-slate-200 focus:border-primary/30 shadow-sm"
            />
          </div>

          {/* Notification Bell */}
          <div className="relative flex items-center">
            <button className="relative p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-transparent hover:border-slate-200 text-slate-600 transition-all cursor-pointer">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
            </button>
          </div>

          {/* Profile Section */}
          <div className="relative flex items-center gap-3 pl-5 border-l border-slate-200/70">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 overflow-hidden">
                <User className="w-5 h-5" />
              </div>
              <div className="hidden sm:flex flex-col items-start min-w-25">
                <span className="text-sm font-semibold text-slate-800 leading-none mb-1">
                  Admin User
                </span>
                <span className="text-xs text-slate-500 leading-none">
                  admin@portal.com
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-2 border-b border-slate-100 sm:hidden">
                  <p className="text-sm font-semibold text-slate-800">
                    Admin User
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    admin@portal.com
                  </p>
                </div>
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Profil Saya
                </Link>
                <Link
                  href="/settings"
                  className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Pengaturan
                </Link>
                <div className="h-px bg-slate-100 my-1"></div>
                <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                  Keluar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
