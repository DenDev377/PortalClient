import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Second line of defense: jika lolos middleware tapi session kosong, tolak
  if (!session || !session.user) {
    redirect("/login");
  }

  // Jika role bukan CLIENT, tolak dan arahkan ke area admin
  if (session.user.role !== "CLIENT") {
    redirect("/overview");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Portal Topbar akan kamu bangun di sini nanti */}
      <main className="p-6">{children}</main>
    </div>
  );
}
