"use client"
import Link from "next/link"
import {
    usePathname, useRouter

} from "next/navigation"

export default function NavbarPage() {
    const pathname = usePathname();
    return (
        <nav className="bg-white w-full border-b border-slate-200 shrink-0">
            <div className="max-w-full px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
                <div className="flex flex-col min-w-0">
                    <h1 className="text-xl font-bold text-slate-800 leading-tight truncate">Dashboard</h1>
                    <p className="text-xs text-slate-400 mt-0.5 hidden sm:block">Selamat datang kembali! Ini ringkasan hari ini.</p>

                </div>
            </div>

        </nav>
    )
}
