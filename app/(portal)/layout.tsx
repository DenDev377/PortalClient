import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Navbar from "@/components/portal/Navbar";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  // Jika ADMIN atau TEAM, tendang balik ke /overview
  if (session.user.role === "ADMIN" || session.user.role === "TEAM") {
    redirect("/overview");
  }

  // Anomalistik guard: Jika role CLIENT tapi tidak punya relasi database clientId
  if (session.user.role === "CLIENT" && !session.user.clientId) {
    redirect("/login?error=InvalidClientData");
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0A2540] flex flex-col font-sans selection:bg-[#FFF0ED]">
      {/* Top Navbar Component */}
      <Navbar user={session.user} />
      
      {/* Konten Utama */}
      <main className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-6 lg:p-8 animate-in fade-in duration-500">
        {children}
      </main>

      {/* Footer Ringan */}
      <footer className="w-full border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-400">
          Reptara Agency &copy; {new Date().getFullYear()} — Client Portal
        </div>
      </footer>
    </div>
  );
}

