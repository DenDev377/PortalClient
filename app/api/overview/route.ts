import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "TEAM")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 1. Total Revenue (Invoices status PAID)
    const paidInvoices = await prisma.invoice.aggregate({
      where: { status: "PAID" },
      _sum: { totalAmount: true },
    });
    const totalRevenue = Number(paidInvoices._sum.totalAmount || 0);

    // 2. Unpaid Invoices count (PENDING, UNPAID, OVERDUE)
    const unpaidCount = await prisma.invoice.count({
      where: { status: { in: ["PENDING", "UNPAID", "OVERDUE"] } },
    });

    // 3. Unbilled Worklog Hours
    const unbilledWorklogs = await prisma.worklog.aggregate({
      where: { isBilled: false },
      _sum: { hours: true },
    });
    const unbilledHours = Number(unbilledWorklogs._sum.hours || 0);

    // 4. Active Clients Count
    const activeClients = await prisma.client.count({
      where: { deletedAt: null },
    });

    // 5. Recent Invoices (For TableOverview)
    const recentInvoicesQuery = await prisma.invoice.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { client: { select: { name: true } } },
    });
    const recentInvoices = recentInvoicesQuery.map(inv => ({
      invoiceNumber: inv.invoiceNumber,
      clientName: inv.client.name,
      status: inv.status,
      date: inv.dueDate.toISOString().slice(0, 10),
      amount: Number(inv.totalAmount),
    }));

    // 6. Due Invoices (For DueInvoicesWidget)
    // Ambil tagihan yang belum lunas dan jatuh temponya sebentar lagi atau sudah lewat
    const dueInvoicesQuery = await prisma.invoice.findMany({
      where: { status: { in: ["PENDING", "UNPAID", "OVERDUE"] } },
      orderBy: { dueDate: "asc" },
      take: 10,
      include: { client: { select: { name: true } } },
    });
    const dueInvoices = dueInvoicesQuery.map(inv => ({
      id: inv.id,
      client: inv.client.name,
      invoiceNo: inv.invoiceNumber,
      dueDate: inv.dueDate.toISOString().slice(0, 10),
      amount: Number(inv.totalAmount),
    }));

    // 7. Chart Data (12 Months array)
    const currentYear = new Date().getFullYear();
    const invoicesThisYear = await prisma.invoice.findMany({
      where: {
        createdAt: {
          gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
          lte: new Date(`${currentYear}-12-31T23:59:59.999Z`),
        },
      },
      select: {
        status: true,
        totalAmount: true,
        createdAt: true,
      },
    });

    const paidChart = new Array(12).fill(0);
    const unpaidChart = new Array(12).fill(0);

    invoicesThisYear.forEach(invoice => {
      const monthIndex = invoice.createdAt.getMonth(); // 0 - 11
      const amount = Number(invoice.totalAmount);
      
      if (invoice.status === "PAID") {
        paidChart[monthIndex] += amount;
      } else if (["PENDING", "UNPAID", "OVERDUE"].includes(invoice.status)) {
        unpaidChart[monthIndex] += amount;
      }
    });

    return NextResponse.json({
      totalRevenue,
      unpaidCount,
      unbilledHours,
      activeClients,
      recentInvoices,
      dueInvoices,
      chartData: {
        paid: paidChart,
        unpaid: unpaidChart
      }
    }, { status: 200 });

  } catch (error) {
    console.error("[OVERVIEW_GET]", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
