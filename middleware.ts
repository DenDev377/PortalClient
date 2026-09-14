import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const { pathname } = req.nextUrl;
    const role = req.nextauth.token?.role;

    // === Proteksi Route ADMIN / TEAM ===
    // Jika user mencoba akses halaman admin tapi bukan ADMIN/TEAM → Tolak
    const isAdminRoute = pathname.startsWith("/overview") ||
      pathname.startsWith("/clients") ||
      pathname.startsWith("/projects") ||
      pathname.startsWith("/worklogs") ||
      pathname.startsWith("/invoices");

    if (isAdminRoute && role !== "ADMIN" && role !== "TEAM") {
      // Jika dia CLIENT, arahkan ke portalnya
      if (role === "CLIENT") {
        return NextResponse.redirect(new URL("/portal/dashboard", req.url));
      }
      // Jika tidak ada session, arahkan ke login
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // === Proteksi Route CLIENT / PORTAL ===
    // Jika CLIENT mencoba akses URL sembarang yang bukan portal → Tolak
    const isPortalRoute = pathname.startsWith("/portal");

    if (isPortalRoute && role !== "CLIENT") {
      if (role === "ADMIN" || role === "TEAM") {
        return NextResponse.redirect(new URL("/overview", req.url));
      }
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Pastikan ada token JWT yang valid sebelum masuk ke middleware di atas.
      // Jika token tidak ada (belum login), withAuth otomatis redirect ke signIn page.
      authorized: ({ token }) => !!token,
    },
  }
);

// Tentukan path mana saja yang harus diproses oleh middleware ini
export const config = {
  matcher: [
    "/overview/:path*",
    "/clients/:path*",
    "/projects/:path*",
    "/worklogs/:path*",
    "/invoices/:path*",
    "/portal/:path*",
  ],
};
