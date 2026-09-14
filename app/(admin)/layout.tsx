import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import SidebarPage from "@/components/admin/Sidebar";
import NavbarPage from "@/components/admin/Navbar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Second line of defense: jika lolos middleware tapi session kosong, tolak
  if (!session || !session.user) {
    redirect("/login");
  }

  // Jika role bukan ADMIN atau TEAM, tolak
  if (session.user.role !== "ADMIN" && session.user.role !== "TEAM") {
    redirect("/portal/dashboard");
  }

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