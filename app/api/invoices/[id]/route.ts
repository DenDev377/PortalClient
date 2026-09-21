import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (
      !session ||
      (session.user.role !== "ADMIN" && session.user.role !== "TEAM")
    ) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
          },
        },
        items: true,
        paymentTransactions: {
          orderBy: { createdAt: "desc" },
        },
        worklogs: {
          orderBy: { date: "desc" },
        },
      },
    });

    if (!invoice) {
      return NextResponse.json(
        { message: "Invoice tidak ditemukan" },
        { status: 404 },
      );
    }

    //Mapping data
    // Field datar — transformasi tipe data
    const data = {
      id: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      status: invoice.status,
      issueDate: invoice.issueDate.toISOString().slice(0, 10),
      dueDate: invoice.dueDate.toISOString().slice(0, 10),
      subTotal: invoice.subTotal.toString(),
      taxRate: invoice.taxRate.toString(),
      taxAmount: invoice.taxAmount.toString(),
      totalAmount: invoice.totalAmount.toString(),

      // Object tunggal — langsung pakai
      client: invoice.client,

      // Array — map tiap item
      items: invoice.items.map((item) => ({
        id: item.id,
        description: item.description,
        quantity: item.quantity.toString(),
        unitPrice: item.unitPrice.toString(),
        total: item.total.toString(),
      })),

      // Array — map tiap transaksi
      paymentTransactions: invoice.paymentTransactions.map((pt) => ({
        id: pt.id,
        transactionId: pt.transactionId,
        amount: pt.amount.toString(),
        status: pt.status,
        createdAt: pt.createdAt.toISOString().slice(0, 10),
      })),
    };

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("[INVOICE_GET_ID]", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.invoice.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { message: "Invoice tidak ditemukan" },
        { status: 404 },
      );
    }
    if (existing.status === "PAID") {
      return NextResponse.json(
        { message: "Invoice yang sudah dibayar tidak dapat dihapus" },
        { status: 409 },
      );
    }
    await prisma.$transaction(async (tx) => {
      // Unbind worklogs: lepas kaitan + reset billing status
      await tx.worklog.updateMany({
        where: { invoiceId: id },
        data: { invoiceId: null, isBilled: false },
      });
      // Hapus invoice
      await tx.invoice.delete({ where: { id } });
    });

    return NextResponse.json(
      { message: "Invoice berhasil dihapus" },
      { status: 200 },
    );
  } catch (error) {
    console.error("[INVOICE_DELETE]", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
