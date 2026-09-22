import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

// =============================================
// GET /api/clients/[id]/projects
// CLIENT-scoped projects. Hanya bisa diakses role CLIENT.
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

    const projects = await prisma.project.findMany({
      where: { clientId: id },
      include: {
        worklogs: {
          orderBy: { date: "desc" },
          take: 5,
          select: { id: true, hours: true, isBilled: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const data = projects.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      status: p.status,
      billingType: p.billingType,
      rate: p.rate?.toString() ?? null,
      worklogs: p.worklogs.map((w) => ({
        id: w.id,
        hours: Number(w.hours),
        isBilled: w.isBilled,
      })),
    }));

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("[CLIENT_PROJECTS_GET]", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
