import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id: invoiceId } = params;

    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        client: true,
        items: true,
      },
    });

    if (!invoice) {
      return NextResponse.json(
        { message: "Invoice tidak ditemukan" },
        { status: 404 }
      );
    }

    // Role check:
    // If CLIENT, they can only generate payment for THEIR invoice
    if (session.user.role === "CLIENT" && invoice.clientId !== session.user.clientId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Jika sudah pernah di-generate, kembalikan URL yang sudah ada
    if (invoice.paymentUrl && invoice.snapToken) {
      return NextResponse.json({
        token: invoice.snapToken,
        redirect_url: invoice.paymentUrl,
      });
    }

    // Hanya invoice dengan status PENDING/UNPAID yang boleh dibayar
    if (invoice.status !== "PENDING" && invoice.status !== "UNPAID" && invoice.status !== "OVERDUE") {
      return NextResponse.json(
        { message: "Invoice sudah lunas atau belum diterbitkan" },
        { status: 400 }
      );
    }

    // Prepare Midtrans Payload
    const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
    if (!serverKey) {
      return NextResponse.json(
        { message: "Server API Key Midtrans belum dikonfigurasi" },
        { status: 500 }
      );
    }
    const authString = Buffer.from(serverKey + ":").toString("base64");

    const item_details = invoice.items.map((item) => ({
      id: item.id,
      price: Number(item.unitPrice),
      quantity: Number(item.quantity),
      name: item.description.substring(0, 50),
    }));

    // Tambahkan pajak sebagai item terpisah jika ada
    if (Number(invoice.taxAmount) > 0) {
      item_details.push({
        id: "TAX-1",
        price: Number(invoice.taxAmount),
        quantity: 1,
        name: `Pajak (${Number(invoice.taxRate)}%)`,
      });
    }

    const midtransPayload = {
      transaction_details: {
        order_id: invoice.invoiceNumber,
        gross_amount: Number(invoice.totalAmount),
      },
      customer_details: {
        first_name: invoice.client.name,
        email: invoice.client.email || "",
      },
      item_details,
    };

    const midtransRes = await fetch(
      "https://app.sandbox.midtrans.com/snap/v1/transactions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Basic ${authString}`,
        },
        body: JSON.stringify(midtransPayload),
      }
    );

    const midtransData = await midtransRes.json();

    if (!midtransRes.ok) {
      console.error("[MIDTRANS_ERROR]", midtransData);
      return NextResponse.json(
        { message: "Gagal memproses transaksi di Payment Gateway" },
        { status: 500 }
      );
    }

    // Simpan token dan redirect url ke database
    await prisma.invoice.update({
      where: { id: invoice.id },
      data: {
        snapToken: midtransData.token,
        paymentUrl: midtransData.redirect_url,
      },
    });

    return NextResponse.json({
      token: midtransData.token,
      redirect_url: midtransData.redirect_url,
    });
  } catch (error) {
    console.error("[INVOICE_PAYMENT_GET]", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
