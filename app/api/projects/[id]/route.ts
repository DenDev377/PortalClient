import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]/route";

//GET Api berdasarkan id

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (
      !session ||
      (session.user.role !== "ADMIN" && session.user.role !== "TEAM")
    ) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        client: { select: { id: true, name: true, email: true, phone: true } },
        worklogs: {
          orderBy: { date: "desc" },
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        {
          message: "Project tidak ditemukan",
        },
        { status: 404 },
      );
    }
    return NextResponse.json({
      message: "Project berhasil ditemukan",
      data: project,
    });
  } catch (error) {
    console.error("[PROJECT_GET_BY_ID]", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
