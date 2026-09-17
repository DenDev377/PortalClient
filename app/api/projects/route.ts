import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

// =============================================
// GET /api/projects
// =============================================
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "TEAM")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const billingType = searchParams.get("billingType") || "";

    const projects = await prisma.project.findMany({
      where: {
        AND: [
          {
            OR: [
              { name: { contains: search } },
              { client: { name: { contains: search } } },
            ],
          },
          status ? { status: status as "IN_PROGRESS" | "COMPLETED" | "CANCELLED" } : {},
          billingType
            ? { billingType: billingType as "HOURLY_RATE" | "FIXED_PRICE" }
            : {},
        ],
      },
      include: {
        client: { select: { id: true, name: true } },
        worklogs: { select: { id: true, hours: true, isBilled: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.error("[PROJECTS_GET]", error);
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 });
  }
}

// =============================================
// POST /api/projects
// =============================================
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "TEAM")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, clientId, billingType, rate } = body;

    if (!name || !clientId || !billingType) {
      return NextResponse.json(
        { message: "Nama project, client, dan tipe billing wajib diisi" },
        { status: 400 }
      );
    }

    const client = await prisma.client.findUnique({
      where: { id: clientId, deletedAt: null },
    });
    if (!client) {
      return NextResponse.json({ message: "Client tidak ditemukan" }, { status: 404 });
    }

    const project = await prisma.project.create({
      data: {
        name,
        description: description || null,
        billingType,
        rate: rate ? Number(rate) : null,
        status: "IN_PROGRESS",
        clientId,
      },
      include: {
        client: { select: { id: true, name: true } },
        worklogs: { select: { id: true, hours: true, isBilled: true } },
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("[PROJECTS_POST]", error);
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 });
  }
}
