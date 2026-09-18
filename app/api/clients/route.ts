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
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "TEAM")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    const clients = await prisma.client.findMany({
      where: {
        deletedAt: null,
        OR: [
          { name: { contains: search } },
          { email: { contains: search } },
        ],
      },
      include: {
        _count: {
          select: {
            projects: { where: { status: "IN_PROGRESS" } },
          },
        },
        invoices: {
          where: { status: { in: ["PENDING", "UNPAID", "OVERDUE"] } },
          select: { status: true, totalAmount: true },
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

    if (!name) {
      return NextResponse.json({ message: "Nama perusahaan wajib diisi" }, { status: 400 });
    }

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
