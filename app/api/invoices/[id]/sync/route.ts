import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (
      !session ||
      (session.user.role !== "ADMIN" && session.user.role !== "TEAM")
    ) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id: invoiceId } = params;

    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
    });

    if (!invoice) {
      return NextResponse.json(
        { message: "Invoice tidak ditemukan" },
        { status: 404 }
      );
    }

    if (invoice.status === "PAID") {
      return NextResponse.json(
        { message: "Invoice sudah lunas" },
        { status: 200 }
      );
    }

    const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
    if (serverKey) {
      // 1. Coba sync dengan Midtrans terlebih dahulu
      const authString = Buffer.from(serverKey + ":").toString("base64");
      
      const midtransRes = await fetch(
        `https://api.sandbox.midtrans.com/v2/${invoice.invoiceNumber}/status`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Basic ${authString}`,
          },
        }
      );

      if (midtransRes.ok) {
        const data = await midtransRes.json();
        const { transaction_status, transaction_id, gross_amount, payment_type } = data;

        // Jika di Midtrans pembayarannya berhasil tapi belum disinkronisasi
        if (transaction_status === "settlement" || transaction_status === "capture") {
          
          await prisma.$transaction(async (tx) => {
            const exists = await tx.paymentTransaction.findFirst({
              where: { transactionId: transaction_id },
            });

            if (!exists) {
              await tx.paymentTransaction.create({
                data: {
                  transactionId: transaction_id,
                  amount: Number(gross_amount) || invoice.totalAmount,
                  paymentMethod: payment_type || "auto-sync",
                  status: "SUCCESS",
                  rawPayload: data,
                  invoiceId: invoice.id,
                },
              });
            }

            await tx.invoice.update({
              where: { id: invoice.id },
              data: { status: "PAID" },
            });
          });

          return NextResponse.json({
            message: "Sinkronisasi berhasil, status diperbarui menjadi PAID.",
            status: "PAID",
          });
        }
      }
    }

    // 2. Jika payload mengirim flag `force=true` (Force Mark as Paid - misal via transfer bank manual)
    const body = await req.json().catch(() => ({}));
    if (body.force === true) {
      await prisma.$transaction(async (tx) => {
        await tx.paymentTransaction.create({
          data: {
            amount: invoice.totalAmount,
            paymentMethod: "Manual / Bank Transfer",
            status: "SUCCESS",
            rawPayload: { manualSync: true, by: session.user.id },
            invoiceId: invoice.id,
          },
        });

        await tx.invoice.update({
          where: { id: invoice.id },
          data: { status: "PAID" },
        });
      });

      return NextResponse.json({
        message: "Invoice telah ditandai lunas secara manual.",
        status: "PAID",
      });
    }

    return NextResponse.json(
      { message: "Tidak ada perubahan status. Pembayaran belum diterima oleh Gateway." },
      { status: 200 }
    );
  } catch (error) {
    console.error("[INVOICE_SYNC_POST]", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
