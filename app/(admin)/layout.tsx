import SidebarPage from "@/components/admin/Sidebar";
import NavbarPage from "@/components/admin/Navbar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-screen bg-[#F8FAFC] text-[#0A2540] flex overflow-hidden">
            <SidebarPage />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <NavbarPage />
                <main className="p-6 md:p-8 flex-1 overflow-y-auto">{children}</main>
            </div>
        </div>
    );
}