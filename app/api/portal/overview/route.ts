import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "CLIENT" || !session.user.clientId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const clientId = session.user.clientId;

    // Semua invoice milik klien ini
    const [allInvoices, activeProjects, unbilledWorklogs] = await Promise.all([
      prisma.invoice.findMany({
        where: { clientId },
        select: { status: true, totalAmount: true, dueDate: true },
      }),
      prisma.project.count({
        where: { clientId, status: "IN_PROGRESS" },
      }),
      prisma.worklog.aggregate({
        where: {
          project: { clientId },
          isBilled: false,
        },
        _sum: { hours: true },
      }),
    ]);

    const totalPaid = allInvoices
      .filter((inv) => inv.status === "PAID")
      .reduce((sum, inv) => sum + Number(inv.totalAmount), 0);

    const pendingInvoices = allInvoices.filter(
      (inv) => inv.status === "PENDING" || inv.status === "UNPAID"
    );
    const totalPending = pendingInvoices.reduce(
      (sum, inv) => sum + Number(inv.totalAmount),
      0
    );

    const overdueInvoices = allInvoices.filter(
      (inv) => inv.status === "OVERDUE"
    );
    const totalOverdue = overdueInvoices.reduce(
      (sum, inv) => sum + Number(inv.totalAmount),
      0
    );

    const urgentInvoices = await prisma.invoice.findMany({
      where: {
        clientId,
        status: { in: ["PENDING", "UNPAID", "OVERDUE"] },
      },
      orderBy: { dueDate: "asc" },
      take: 3,
    });

    return NextResponse.json({
      totalPaid,
      totalPending,
      totalOverdue,
      activeProjects,
      unbilledHours: Number(unbilledWorklogs._sum.hours || 0),
      urgentInvoices: urgentInvoices.map((inv) => ({
        id: inv.id,
        invoiceNumber: inv.invoiceNumber,
        totalAmount: Number(inv.totalAmount),
        status: inv.status,
        dueDate: inv.dueDate.toISOString().slice(0, 10),
        snapToken: inv.snapToken ?? null,
        paymentUrl: inv.paymentUrl ?? null,
      })),
    });
  } catch (error) {
    console.error("[PORTAL_OVERVIEW_GET]", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
