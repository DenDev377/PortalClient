import { redirect } from 'next/navigation';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function HomePage() {
  // Ambil sesi otentikasi nyata dari NextAuth server-side
  const session = await getServerSession(authOptions);

  // Jika tidak punya akses login, tolak ke halaman /login
  if (!session || !session.user) {
    redirect('/login');
  }

  // Identifikasi peran autentik
  const role = session.user.role; 

  if (role === 'ADMIN' || role === 'TEAM') {
    redirect('/overview');
  } else if (role === 'CLIENT') {
    redirect('/portal/dashboard');
  } else {
    // Fallback jika tidak diketahui (keamanan ekstra)
    redirect('/login');
  }
}
