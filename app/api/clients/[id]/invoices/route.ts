import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

// =============================================
// GET /api/clients/[id]/invoices
// CLIENT-scoped invoices. Hanya bisa diakses role CLIENT.
// =============================================
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "CLIENT") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Pastikan clientId dari session cocok dengan requested ID
    if (session.user.clientId !== id) {
      return NextResponse.json(
        { message: "Akses ditolak" },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "10")));
    const skip = (page - 1) * limit;

    const where = {
      AND: [
        { clientId: id },
        status ? { status: status as any } : {},
      ],
    };

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        include: {
          client: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.invoice.count({ where }),
    ]);

    const data = invoices.map((inv) => ({
      id: inv.id,
      invoiceNumber: inv.invoiceNumber,
      clientName: inv.client.name,
      status: inv.status,
      issueDate: inv.issueDate.toISOString().slice(0, 10),
      dueDate: inv.dueDate.toISOString().slice(0, 10),
      nominalTotal: inv.totalAmount.toString(),
    }));

    return NextResponse.json(
      { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } },
      { status: 200 },
    );
  } catch (error) {
    console.error("[CLIENT_INVOICES_GET]", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
