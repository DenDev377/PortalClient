import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

// GET /api/portal/invoices — List invoice milik klien yang sedang login
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "CLIENT" || !session.user.clientId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const clientId = session.user.clientId;

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {
      // KUNCI TENANT ISOLATION: hanya ambil invoice milik clientId ini
      clientId,
    };

    if (status) {
      where.status = status;
    }

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          items: true,
          paymentTransactions: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      }),
      prisma.invoice.count({ where }),
    ]);

    const data = invoices.map((inv) => {
      const i = inv as any; // snapToken & paymentUrl require: npx prisma generate
      return {
      id: i.id,
      invoiceNumber: i.invoiceNumber,
      status: i.status,
      issueDate: i.issueDate.toISOString().slice(0, 10),
      dueDate: i.dueDate.toISOString().slice(0, 10),
      totalAmount: Number(i.totalAmount),
      subTotal: Number(i.subTotal),
      taxRate: Number(i.taxRate),
      taxAmount: Number(i.taxAmount),
      snapToken: i.snapToken ?? null,
      paymentUrl: i.paymentUrl ?? null,
      items: i.items.map((item: any) => ({
        description: item.description,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
        total: Number(item.total),
      })),
      lastPayment: inv.paymentTransactions[0]
        ? {
            status: inv.paymentTransactions[0].status,
            paymentMethod: inv.paymentTransactions[0].paymentMethod,
            createdAt: inv.paymentTransactions[0].createdAt.toISOString(),
          }
        : null,
      };
    });

    return NextResponse.json({ data, total, page, limit }, { status: 200 });
  } catch (error) {
    console.error("[PORTAL_INVOICES_GET]", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
