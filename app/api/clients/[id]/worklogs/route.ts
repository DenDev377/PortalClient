import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

// =============================================
// GET /api/clients/[id]/worklogs
// CLIENT-scoped worklogs. Hanya bisa diakses role CLIENT.
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
    const search = searchParams.get("search") || "";
    const projectId = searchParams.get("projectId") || "";
    const isBilled = searchParams.get("isBilled") || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50")));
    const skip = (page - 1) * limit;

    const where = {
      AND: [
        { project: { clientId: id } },
        search ? { description: { contains: search } } : {},
        projectId ? { projectId } : {},
        isBilled === "true" ? { isBilled: true } : isBilled === "false" ? { isBilled: false } : {},
      ],
    };

    const [worklogs, total] = await Promise.all([
      prisma.worklog.findMany({
        where,
        include: {
          project: {
            select: { id: true, name: true, rate: true },
          },
          user: { select: { id: true, name: true } },
          invoice: { select: { id: true, invoiceNumber: true } },
        },
        orderBy: { date: "desc" },
        skip,
        take: limit,
      }),
      prisma.worklog.count({ where }),
    ]);

    const data = worklogs.map((w) => ({
      id: w.id,
      projectId: w.projectId,
      projectName: w.project.name,
      taskDescription: w.description,
      durationHours: Number(w.hours),
      hourlyRate: w.project.rate?.toString() ?? "0",
      logDate: w.date.toISOString().slice(0, 10),
      teamMember: w.user?.name ?? "",
      billingStatus: (w.isBilled ? "BILLED" : "UNBILLED") as "BILLED" | "UNBILLED",
      invoiceNumber: w.invoice?.invoiceNumber ?? undefined,
    }));

    return NextResponse.json(
      { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } },
      { status: 200 },
    );
  } catch (error) {
    console.error("[CLIENT_WORKLOGS_GET]", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
