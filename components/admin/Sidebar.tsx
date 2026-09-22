"use client";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Clock,
  Receipt,
  FileText,
  LogOut,
  Settings,
  Settings2,
} from "lucide-react";
import { usePathname } from "next/navigation";

export default function SidebarPage() {
  const pathname = usePathname();

  const menuItems = [
    {
      name: "Overview",
      href: "/overview",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    { name: "Clients", href: "/clients", icon: <Users className="w-5 h-5" /> },
    {
      name: "Project",
      href: "/projects",
      icon: <Briefcase className="w-5 h-5" />,
    },
    {
      name: "Worklogs",
      href: "/worklogs",
      icon: <Clock className="w-5 h-5" />,
    },
    {
      name: "Invoices",
      href: "/invoices",
      icon: <Receipt className="w-5 h-5" />,
    },
  ];
  const menuItems2 = [
    {
      name: "General",
      href: "/general",
      icon: <Settings className="w-5 h-5" />,
    },
    {
      name: "Billing Rules",
      href: "/billing",
      icon: <Settings2 className="w-5 h-5 " />,
    },
  ];

  //handleLogout
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <aside className="w-72 border-r bg-white border-slate-200 h-screen flex flex-col p-5 shrink-0 overflow-y-auto">
      {/* Logo Section */}
      <div className="flex items-center gap-0.5 px-2 mb-8 mt-2">
        <div className="w-10 h-10 bg-[#E15A3E] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-sm border border-[#C54A30]">
          P
        </div>
        <h1 className="text-2xl font-extrabold text-slate-800 leading-none tracking-tight">
          ortal<span className="text-slate-400 font-semibold">Client</span>
        </h1>
      </div>

      {/* Main Navigation */}
      <div className="mb-6">
        <h2 className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Menu Utama
        </h2>
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#E15A3E] text-white shadow-md shadow-[#E15A3E]/20"
                    : "text-slate-500 hover:bg-[#FFF0ED] hover:text-[#E15A3E]"
                }`}
              >
                <span className={isActive ? "text-white" : "text-slate-400"}>
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mb-6">
        <h2 className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Settings & Governance
        </h2>
        {menuItems2.map((items) => {
          const isActive = pathname === items.href;
          return (
            <Link
              key={items.name}
              href={items.href}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-[#E15A3E] text-white shadow-md shadow-[#E15A3E]/20"
                  : "text-slate-500 hover:bg-[#FFF0ED] hover:text-[#E15A3E]"
              }`}
            >
              <span className={isActive ? "text-white" : "text-slate-400"}>
                {items.icon}
              </span>
              <span>{items.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="border-t border-slate-100 pt-5 mt-auto space-y-1">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-[#FFF0ED] hover:text-[#E15A3E] transition-all duration-200"
        >
          <FileText className="w-5 h-5 text-slate-400" />
          <span>Documentation</span>
        </Link>
<button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 focus:outline-none"
          >
            <LogOut className="w-5 h-5 text-slate-400" />
            <span>Logout</span>
          </button>
      </div>
    </aside>
  );
}
