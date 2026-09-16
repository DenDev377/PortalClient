import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

// =============================================
// GET /api/clients
// Ambil semua client (yang belum soft-deleted)
// =============================================
export async function GET(req: NextRequest) {
  try {
    // 1. Proteksi: hanya ADMIN / TEAM yang boleh mengakses
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "TEAM")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 2. Baca query parameter untuk search
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    // 3. Query Prisma — hanya ambil client yang belum dihapus (deletedAt = null)
    const clients = await prisma.client.findMany({
      where: {
        deletedAt: null, // Soft Delete filter
        OR: [
          { name: { contains: search } },
          { email: { contains: search } },
        ],
      },
      include: {
        // Hitung jumlah proyek aktif milik klien ini
        projects: {
          where: { status: "IN_PROGRESS" },
          select: { id: true },
        },
        // Ambil data invoice untuk menghitung status tagihan
        invoices: {
          where: {
            status: { in: ["PENDING", "UNPAID", "OVERDUE"] },
          },
          select: { id: true, status: true, totalAmount: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(clients, { status: 200 });
  } catch (error) {
    console.error("[CLIENTS_GET]", error);
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 });
  }
}

// =============================================
// POST /api/clients
// Tambah client baru
// =============================================
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "TEAM")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, email, phone, address } = body;

    // Validasi field wajib
    if (!name) {
      return NextResponse.json({ message: "Nama perusahaan wajib diisi" }, { status: 400 });
    }

    // Buat client baru di database
    const client = await prisma.client.create({
      data: {
        name,
        email: email || null,
        phone: phone || null,
        address: address || null,
      },
    });

    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    console.error("[CLIENTS_POST]", error);
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 });
  }
}
