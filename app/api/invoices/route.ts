import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (
      !session ||
      (session.user.role !== "ADMIN" && session.user.role !== "TEAM")
    ) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const clientId = searchParams.get("clientId") || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") || "10")),
    );
    const skip = (page - 1) * limit;

    const where = {
      AND: [
        // Grup 1: search (OR karena 2 field alternatif)
        search
          ? {
              OR: [
                { invoiceNumber: { contains: search } },
                { client: { name: { contains: search } } },
              ],
            }
          : {},

        status ? { status: status as any } : {},

        clientId ? { clientId } : {},
      ],
    };

    const [invoice, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        include: {
          client: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.invoice.count({ where }),
    ]);

    const data = invoice.map((inv) => ({
      id: inv.id,
      invoiceNumber: inv.invoiceNumber,
      clientName: inv.client.name,
      clientEmail: inv.client.email ?? "",
      status: inv.status, // enum, langsung pakai
      issueDate: inv.issueDate.toISOString().slice(0, 10),
      dueDate: inv.dueDate.toISOString().slice(0, 10),
      nominalTotal: Number(inv.totalAmount),
    }));

    return NextResponse.json(
      {
        data,
        meta: {
          page,
          limit,
          total,
          totalPage: Math.ceil(total / limit),
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[INVOICE_GET]", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
