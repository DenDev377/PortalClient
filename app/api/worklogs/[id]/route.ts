import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

// =============================================
// GET /api/worklogs/[id]
// Ambil satu worklog by id (untuk form edit).
// =============================================
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // ── 1. AUTENTIKASI ─────────────────────────────────────
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "TEAM")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // ── 2. AMBIL ID DARI PATH PARAMS ───────────────────────
    // Next.js 15: params adalah Promise — wajib di-await.
    const { id } = await params;

    // ── 3. QUERY SINGLE RECORD + RELASI ────────────────────
    const worklog = await prisma.worklog.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            rate: true,
            client: { select: { id: true, name: true } },
          },
        },
        // Relasi hasil migrasi
        user: { select: { id: true, name: true } },
        invoice: { select: { id: true, invoiceNumber: true } },
      },
    });

    if (!worklog) {
      return NextResponse.json({ message: "Worklog tidak ditemukan" }, { status: 404 });
    }

    // ── 4. MAP RESPONSE → KONTRAK FRONTEND ─────────────────
    const data = {
      id: worklog.id,
      projectId: worklog.projectId,
      projectName: worklog.project.name,
      clientName: worklog.project.client.name,
      taskDescription: worklog.description,
      durationHours: Number(worklog.hours),
      hourlyRate: worklog.project.rate?.toString() ?? "0",
      logDate: worklog.date.toISOString().slice(0, 10),
      teamMember: worklog.user?.name ?? "",
      billingStatus: (worklog.isBilled ? "BILLED" : "UNBILLED") as "BILLED" | "UNBILLED",
      invoiceNumber: worklog.invoice?.invoiceNumber ?? undefined,
    };

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("[WORKLOG_GET_ID]", error);
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 });
  }
}

// =============================================
// PUT /api/worklogs/[id]
// Update worklog. Field yang bisa diubah: date, hours, description, isBilled.
// projectId TIDAK diizinkan diubah di sini — pindahkan worklog = hapus + buat baru
// (mencegah inkonsistensi data billing).
// userId juga tidak diubah di sini — pencatat tetap user yang create.
// =============================================
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // ── 1. AUTENTIKASI ─────────────────────────────────────
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "TEAM")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // ── 2. AMBIL ID & BODY ─────────────────────────────────
    const { id } = await params;
    const body = await req.json();
    const { date, hours, description, isBilled } = body;

    // ── 3. VALIDASI INPUT ──────────────────────────────────
    if (!date || !hours || !description) {
      return NextResponse.json(
        { message: "Tanggal, jam, dan deskripsi wajib diisi" },
        { status: 400 }
      );
    }
    const hoursNum = Number(hours);
    if (isNaN(hoursNum) || hoursNum <= 0) {
      return NextResponse.json(
        { message: "Jam harus berupa angka positif" },
        { status: 400 }
      );
    }

    // ── 4. CEK EKSISTENSI RECORD ───────────────────────────
    // Penting: update ke id yang tidak ada akan throw P2025 — kita tangani lebih awal.
    const existing = await prisma.worklog.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ message: "Worklog tidak ditemukan" }, { status: 404 });
    }

    // ── 5. GUARD: TIDAK BOLEH EDIT WORKLOG SUDAH DITAGIH ────
    // isBilled = true berarti worklog sudah masuk ke invoice.
    // Mengubah jam/deskripsi setelah ditagih = merusak perhitungan invoice.
    // Frontend tetap bisa toggle isBilled true→false (unbill), tapi tidak edit konten.
    const isEditingBilledContent = existing.isBilled && (
      Number(existing.hours) !== hoursNum ||
      existing.description !== description ||
      existing.date.toISOString().slice(0, 10) !== new Date(date).toISOString().slice(0, 10)
    );
    if (isEditingBilledContent) {
      return NextResponse.json(
        { message: "Worklog yang sudah ditagih tidak dapat diubah. Ubah status billing terlebih dahulu." },
        { status: 409 }
      );
    }

    // ── 6. UPDATE ──────────────────────────────────────────
    // isBilled hanya boleh di-set jika memang diberikan di body (optional).
    const updated = await prisma.worklog.update({
      where: { id },
      data: {
        date: new Date(date),
        hours: hoursNum,
        description,
        ...(isBilled !== undefined ? { isBilled: Boolean(isBilled) } : {}),
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
        // Relasi hasil migrasi
        user: { select: { id: true, name: true } },
        invoice: { select: { id: true, invoiceNumber: true } },
      },
    });

    // ── 7. MAP RESPONSE → KONTRAK FRONTEND ─────────────────
    const data = {
      id: updated.id,
      projectId: updated.projectId,
      projectName: updated.project.name,
      clientName: updated.project.client.name,
      taskDescription: updated.description,
      durationHours: Number(updated.hours),
      hourlyRate: updated.project.rate?.toString() ?? "0",
      logDate: updated.date.toISOString().slice(0, 10),
      teamMember: updated.user?.name ?? "",
      billingStatus: (updated.isBilled ? "BILLED" : "UNBILLED") as "BILLED" | "UNBILLED",
      invoiceNumber: updated.invoice?.invoiceNumber ?? undefined,
    };

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("[WORKLOG_PUT]", error);
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 });
  }
}

// =============================================
// DELETE /api/worklogs/[id]
// Hapus worklog. Hanya ADMIN yang boleh (data sensitif terkait billing).
// Worklog yang sudah ditagih (isBilled=true) tidak boleh dihapus langsung —
// harus unbill dulu agar konsistensi invoice terjaga.
// =============================================
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // ── 1. AUTENTIKASI: ADMIN SAJA ─────────────────────────
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // ── 2. AMBIL ID ────────────────────────────────────────
    const { id } = await params;

    // ── 3. CEK EKSISTENSI & STATUS BILLING ─────────────────
    const existing = await prisma.worklog.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ message: "Worklog tidak ditemukan" }, { status: 404 });
    }
    if (existing.isBilled) {
      return NextResponse.json(
        { message: "Worklog yang sudah ditagih tidak dapat dihapus. Ubah status billing terlebih dahulu." },
        { status: 409 }
      );
    }

    // ── 4. DELETE ──────────────────────────────────────────
    await prisma.worklog.delete({ where: { id } });

    return NextResponse.json({ message: "Worklog berhasil dihapus" }, { status: 200 });
  } catch (error) {
    console.error("[WORKLOG_DELETE]", error);
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 });
  }
}