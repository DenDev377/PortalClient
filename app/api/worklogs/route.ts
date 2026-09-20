import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

// =============================================
// GET /api/worklogs
// Ambil daftar worklog dengan filter: search, projectId, isBilled, rentang tanggal.
// Response = array Worklog (langsung, tanpa envelope) supaya cocok dengan
// kontrak yang dipakai frontend (lihat types/worklog.ts).
// =============================================
export async function GET(req: NextRequest) {
  try {
    // ── 1. AUTENTIKASI & AUTHORIZATION ─────────────────────
    // Hanya ADMIN & TEAM yang boleh mengakses seluruh worklog.
    // (CLIENT punya scope terpisah di /api/clients/[id]/worklogs — belum dibuat.)
    const session = await getServerSession(authOptions);
    if (
      !session ||
      (session.user.role !== "ADMIN" && session.user.role !== "TEAM")
    ) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // ── 2. PARSING QUERY PARAMS ────────────────────────────

    // search      → cari di deskripsi task (contains, case-insensitive default MySQL)
    // projectId   → filter per project (dropdown di toolbar)
    // isBilled    → "true" | "false" → filter billingStatus (UNBILLED/BILLED)
    // startDate   → batas bawah tanggal log (inclusive)
    // endDate     → batas atas tanggal log (inclusive)
    // page/limit  → pagination sederhana (default 1 / 50)
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const projectId = searchParams.get("projectId") || "";
    const isBilled = searchParams.get("isBilled") || "";
    const startDate = searchParams.get("startDate") || "";
    const endDate = searchParams.get("endDate") || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") || "50")),
    );
    const skip = (page - 1) * limit;

    // ── 3. BANGUN CLAUSE `where` PRISMA ────────────────────
    // Pakai AND array supaya tiap filter independen & mudah di-toggle.
    // Filter kosong (string "") dilewatkan sebagai {} agar tidak mempengaruhi query.
    const where = {
      AND: [
        // Pencarian teks di deskripsi task
        search ? { description: { contains: search } } : {},
        // Filter project spesifik
        projectId ? { projectId } : {},
        // Filter status billing: isBilled boolean di DB ↔ "BILLED"/"UNBILLED" di UI
        isBilled === "true"
          ? { isBilled: true }
          : isBilled === "false"
            ? { isBilled: false }
            : {},
        // Filter rentang tanggal pada field `date` (tanggal log, bukan createdAt)
        startDate ? { date: { gte: new Date(startDate) } } : {},
        endDate ? { date: { lte: new Date(endDate) } } : {},
      ],
    };

    // ── 4. QUERY DATABASE ──────────────────────────────────
    // include project.client agar frontend dapat projectName + clientName tanpa
    // round-trip request kedua. user & invoice diisi dari relasi hasil migrasi.
    const [worklogs, total] = await Promise.all([
      prisma.worklog.findMany({
        where,
        include: {
          project: {
            select: {
              id: true,
              name: true,
              rate: true,
              client: { select: { id: true, name: true } },
            },
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
      clientName: w.project.client.name,
      taskDescription: w.description,
      durationHours: Number(w.hours),
      hourlyRate: w.project.rate ? Number(w.project.rate) : 0,
      logDate: w.date.toISOString().slice(0, 10),
      teamMember: w.user?.name ?? "",
      billingStatus: (w.isBilled ? "BILLED" : "UNBILLED") as
        | "BILLED"
        | "UNBILLED",
      invoiceNumber: w.invoice?.invoiceNumber ?? undefined,
    }));

    return NextResponse.json(
      {
        data,
        meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[WORKLOGS_GET]", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}

// =============================================
// POST /api/worklogs
// Buat worklog baru. Default isBilled = false (belum ditagih).
// userId otomatis terisi dari session user yang login (team member pencatat).
// =============================================
export async function POST(req: NextRequest) {
  try {
    // ── 1. AUTENTIKASI ─────────────────────────────────────
    const session = await getServerSession(authOptions);
    if (
      !session ||
      (session.user.role !== "ADMIN" && session.user.role !== "TEAM")
    ) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // ── 2. PARSING & VALIDASI BODY ─────────────────────────
    const body = await req.json();
    const { projectId, date, hours, description } = body;

    // Field wajib: projectId (target), date (kapan dikerjakan),
    // hours (durasi), description (apa yang dikerjakan)
    if (!projectId || !date || !hours || !description) {
      return NextResponse.json(
        { message: "Project, tanggal, jam, dan deskripsi wajib diisi" },
        { status: 400 },
      );
    }

    // Validasi numerik: hours harus positif (tidak boleh 0 / negatif)
    const hoursNum = Number(hours);
    if (isNaN(hoursNum) || hoursNum <= 0) {
      return NextResponse.json(
        { message: "Jam harus berupa angka positif" },
        { status: 400 },
      );
    }

    // ── 3. PASTIKAN PROJECT ADA ────────────────────────────
    // Cegah pembuatan worklog ke project yang tidak ada / sudah dibatalkan.
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) {
      return NextResponse.json(
        { message: "Project tidak ditemukan" },
        { status: 404 },
      );
    }

    // ── 4. CREATE WORKLOG ──────────────────────────────────
    // isBilled default false (sesuai schema @default(false)).
    // date disimpan sebagai DateTime; input frontend biasanya "YYYY-MM-DD".
    // userId diambil dari session.user.id (team member yang mencatat jam).
    //   - Jika session tidak bawa id (mis. callback belum propagasi), beri undefined
    //     → Prisma anggap "field tidak diisi" → userId tetap null (data lama valid).
    const worklog = await prisma.worklog.create({
      data: {
        projectId,
        date: new Date(date),
        hours: hoursNum,
        description,
        userId: session.user.id || undefined,
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            rate: true,
            client: { select: { id: true, name: true } },
          },
        },
        user: { select: { id: true, name: true } },
        invoice: { select: { id: true, invoiceNumber: true } },
      },
    });

    // ── 5. MAP RESPONSE → KONTRAK FRONTEND ─────────────────
    const data = {
      id: worklog.id,
      projectId: worklog.projectId,
      projectName: worklog.project.name,
      clientName: worklog.project.client.name,
      taskDescription: worklog.description,
      durationHours: Number(worklog.hours),
      hourlyRate: worklog.project.rate ? Number(worklog.project.rate) : 0,
      logDate: worklog.date.toISOString().slice(0, 10),
      teamMember: worklog.user?.name ?? "",
      billingStatus: (worklog.isBilled ? "BILLED" : "UNBILLED") as
        | "BILLED"
        | "UNBILLED",
      invoiceNumber: worklog.invoice?.invoiceNumber ?? undefined,
    };

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("[WORKLOGS_POST]", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
