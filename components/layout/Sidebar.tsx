"use client"
import Link from "next/link"
import { LayoutDashboard, Users, Briefcase, Clock, Receipt, LogOut, Settings } from "lucide-react"
import { usePathname } from "next/navigation"
export default function SidebarPage() {
    const pathname = usePathname()

    const menuItems = [
        { name: "Overview", href: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
        { name: "Clients", href: "/dashboard/client", icon: <Users className="w-5 h-5" /> },
        { name: "Project", href: "/dashboard/projects", icon: <Briefcase className="w-5 h-5" /> },
        { name: "Worklogs", href: "/dashboard/worklogs", icon: <Clock className="w-5 h-5" /> },
        { name: "Invoices", href: "/dashboard/invoices", icon: <Receipt className="w-5 h-5" /> }
    ]
    return (
        <aside className="w-80 border-r bg-white border-slate-250 min-h-screen flex flex-col justify-between p-4 shrink-0">
            <div className="space-y-6">
                <div className="flex items-center gap-0.5 px-2 pt-2">
                    <div className="w-10 h-10 bg-[#E15A3E] rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm border border-[#C54A30]">
                        P
                    </div>
                    <div>
                        <h1 className=" text-2xl font-bold text-black loading-tight">
                            ortalClient
                        </h1>
                    </div>

                </div>


                <nav className="space-y-1.5">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                    ? "bg-[#E15A3E] text-white shadow-md shadow-[#E15A3E]/20"
                                    : "text-slate-500 hover:bg-[#FFF0ED] hover:text-[#E15A3E]"
                                    }`}
                            >
                                <span className="text-base">{item.icon}</span>
                                <span>{item.name}</span>

                            </Link>
                        )
                    })}

                </nav>
            </div>

            <div className="border-t border-slate-250 pt-4 -mx-4 px-4">
                <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-[#0A2540] transition-all"
                >
                    <Settings className="w-5 h-5" />
                    <span>Settings</span>
                </Link>
                <button
                    className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-all focus:outline-none focus:ring-2 focus:ring-red-100"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                </button>
            </div>

        </aside>
    )
}