import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "TEAM")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        client: { select: { id: true, name: true } },
        worklogs: {
          orderBy: { date: "desc" },
          take: 5,
          select: { id: true, hours: true, isBilled: true },
        },
      },
    });
    if (!project) return NextResponse.json({ message: "Project tidak ditemukan" }, { status: 404 });
    return NextResponse.json(project, { status: 200 });
  } catch (error) {
    console.error("[PROJECT_GET_ID]", error);
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "TEAM")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const body = await req.json();
    const { name, description, clientId, billingType, rate, status } = body;
    if (!name || !clientId || !billingType) {
      return NextResponse.json({ message: "Nama, client, dan billing wajib diisi" }, { status: 400 });
    }
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ message: "Project tidak ditemukan" }, { status: 404 });
    const updated = await prisma.project.update({
      where: { id },
      data: {
        name,
        description: description || null,
        billingType,
        rate: rate ? Number(rate) : null,
        status: status || existing.status,
        clientId,
      },
      include: {
        client: { select: { id: true, name: true } },
        worklogs: {
          orderBy: { date: "desc" },
          take: 5,
          select: { id: true, hours: true, isBilled: true },
        },
      },
    });
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("[PROJECT_PUT]", error);
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ message: "Project tidak ditemukan" }, { status: 404 });
    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ message: "Project berhasil dihapus" }, { status: 200 });
  } catch (error) {
    console.error("[PROJECT_DELETE]", error);
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 });
  }
}
