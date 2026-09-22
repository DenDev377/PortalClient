import cron from "node-cron";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const checkOverdue = async () => {
  try {
    const overdueInvoices = await prisma.invoice.updateMany({
      where: {
        status: { in: ["PENDING", "UNPAID"] as const },
        dueDate: { lt: new Date() },
      },
      data: { status: "OVERDUE" },
    });

    if (overdueInvoices.count > 0) {
      console.log(
        `[OVERDUE] ${overdueInvoices.count} invoice updated to OVERDUE`,
      );
    }
  } catch (error) {
    console.error("[OVERDUE_CHECK]", error);
  }
};

// Jalankan setiap jam (0 * * * *)
cron.schedule("0 * * * *", checkOverdue);

// Jalankan juga sekali saat server mulai (development)
checkOverdue();

export async function GET() {
  await checkOverdue();
  return NextResponse.json({ message: "Overdue check done" }, { status: 200 });
}
