import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

// =============================================
// GET /api/clients/[id]
// Ambil detail satu client berdasarkan ID
// =============================================
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "TEAM")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const client = await prisma.client.findUnique({
      where: { id: params.id, deletedAt: null },
      include: {
        projects: { orderBy: { createdAt: "desc" } },
        invoices: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!client) {
      return NextResponse.json({ message: "Client tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(client, { status: 200 });
  } catch (error) {
    console.error("[CLIENT_GET_ID]", error);
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 });
  }
}

// =============================================
// PUT /api/clients/[id]
// Update data client
// =============================================
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Pastikan client masih ada (belum soft deleted)
    const existing = await prisma.client.findUnique({
      where: { id: params.id, deletedAt: null },
    });

    if (!existing) {
      return NextResponse.json({ message: "Client tidak ditemukan" }, { status: 404 });
    }

    const updated = await prisma.client.update({
      where: { id: params.id },
      data: {
        name,
        email: email || null,
        phone: phone || null,
        address: address || null,
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("[CLIENT_PUT]", error);
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 });
  }
}

// =============================================
// DELETE /api/clients/[id]
// Soft Delete — set deletedAt, bukan hapus fisik
// =============================================
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      // Hanya ADMIN yang boleh delete (TEAM tidak)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const existing = await prisma.client.findUnique({
      where: { id: params.id, deletedAt: null },
    });

    if (!existing) {
      return NextResponse.json({ message: "Client tidak ditemukan" }, { status: 404 });
    }

    // Soft Delete: isi deletedAt, data tetap ada di database
    await prisma.client.update({
      where: { id: params.id },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json({ message: "Client berhasil dihapus" }, { status: 200 });
  } catch (error) {
    console.error("[CLIENT_DELETE]", error);
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 });
  }
}
