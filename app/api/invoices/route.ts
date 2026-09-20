import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (
      !session ||
      (session.user.role !== "ADMIN" && session.user.role !== "TEAM")
    ) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const clientId = searchParams.get("clientId") || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") || "10")),
    );
    const skip = (page - 1) * limit;

    const where = {
      AND: [
        // Grup 1: search (OR karena 2 field alternatif)
        search
          ? {
              OR: [
                { invoiceNumber: { contains: search } },
                { client: { name: { contains: search } } },
              ],
            }
          : {},

        status ? { status: status as any } : {},

        clientId ? { clientId } : {},
      ],
    };

    const [invoice, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        include: {
          client: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.invoice.count({ where }),
    ]);

    const data = invoice.map((inv) => ({
      id: inv.id,
      invoiceNumber: inv.invoiceNumber,
      clientName: inv.client.name,
      clientEmail: inv.client.email ?? "",
      status: inv.status, // enum, langsung pakai
      issueDate: inv.issueDate.toISOString().slice(0, 10),
      dueDate: inv.dueDate.toISOString().slice(0, 10),
      nominalTotal: Number(inv.totalAmount),
    }));

    return NextResponse.json(
      {
        data,
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[INVOICE_GET]", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (
      !session ||
      (session.user.role !== "ADMIN" && session.user.role !== "TEAM")
    ) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      clientId,
      issueDate,
      dueDate,
      lineItems,
      taxPercent,
      subtotal,
      taxAmount,
      grandTotal,
      action,
    } = body;

    if (
      !clientId ||
      !dueDate ||
      !lineItems ||
      !Array.isArray(lineItems) ||
      lineItems.length === 0
    ) {
      return NextResponse.json(
        { message: "Client, due date, dan minimal 1 line item wajib diisi" },
        { status: 400 },
      );
    }

    const client = await prisma.client.findUnique({
      where: { id: clientId, deletedAt: null },
    });
    if (!client) {
      return NextResponse.json(
        { message: "Client tidak ditemukan" },
        { status: 404 },
      );
    }

    const invoiceStatus = action === "PUBLISH" ? "PENDING" : "DRAFT";

    const invoice = await prisma.$transaction(async (tx) => {
      const year = new Date().getFullYear();
      const lastInvoice = await tx.invoice.findFirst({
        where: { invoiceNumber: { startsWith: `INV-${year}-` } },
        orderBy: { invoiceNumber: "desc" },
      });
      const seq = lastInvoice
        ? parseInt(lastInvoice.invoiceNumber.split("-")[2]) + 1
        : 1;
      const invoiceNumber = `INV-${year}-${String(seq).padStart(4, "0")}`;

      const inv = await tx.invoice.create({
        data: {
          invoiceNumber,
          clientId,
          issueDate: issueDate ? new Date(issueDate) : new Date(),
          dueDate: new Date(dueDate),
          status: invoiceStatus,
          subTotal: Number(subtotal),
          taxRate: Number(taxPercent) || 0,
          taxAmount: Number(taxAmount) || 0,
          totalAmount: Number(grandTotal),
        },
      });

      await tx.invoiceItem.createMany({
        data: lineItems.map(
          (item: {
            description: string;
            hours: number;
            rate: number;
            subtotal: number;
          }) => ({
            invoiceId: inv.id,
            description: item.description,
            quantity: Number(item.hours),
            unitPrice: Number(item.rate),
            total: Number(item.subtotal),
          }),
        ),
      });

      if (action === "PUBLISH") {
        const worklogIds = lineItems
          .map((item: { worklogId?: string }) => item.worklogId)
          .filter((id): id is string => Boolean(id));

        if (worklogIds.length > 0) {
          await tx.worklog.updateMany({
            where: { id: { in: worklogIds } },
            data: {
              invoiceId: inv.id,
              isBilled: true,
            },
          });
        }
      }

      return inv;
    });

    const result = await prisma.invoice.findUnique({
      where: { id: invoice.id },
      include: {
        client: { select: { id: true, name: true, email: true } },
        items: true,
      },
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("[INVOICE_POST]", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
