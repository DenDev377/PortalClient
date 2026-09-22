import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;

async function verifyMidtransSignature(body: unknown): Promise<boolean> {
  const payload = body as {
    order_id: string;
    transaction_id: string;
    gross_amount: string;
    signature_key: string;
  };

  if (!MIDTRANS_SERVER_KEY) return false;

  const stringToSign = `${payload.order_id}${payload.transaction_id}${payload.gross_amount}${MIDTRANS_SERVER_KEY}`;
  const expectedSignature = crypto
    .createHmac("sha512", MIDTRANS_SERVER_KEY)
    .update(stringToSign)
    .digest("hex");

  const expectedBuf = Buffer.from(expectedSignature);
  const actualBuf = Buffer.from(payload.signature_key);

  if (expectedBuf.length !== actualBuf.length) return false;

  return crypto.timingSafeEqual(expectedBuf, actualBuf);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Verify signature
    const isValid = await verifyMidtransSignature(body);
    if (!isValid) {
      return NextResponse.json(
        { message: "Invalid webhook signature" },
        { status: 403 },
      );
    }

    const {
      order_id,
      transaction_id,
      gross_amount,
      transaction_status,
      payment_type,
      transaction_time,
    } = body;

    // 2. Find invoice by order_id (invoiceNumber)
    const invoice = await prisma.invoice.findUnique({
      where: { invoiceNumber: order_id },
    });

    if (!invoice) {
      return NextResponse.json(
        { message: "Invoice tidak ditemukan" },
        { status: 404 },
      );
    }

    // 3. Handle idempotency — cek apakah transaction sudah diproses
    const existingTransaction = await prisma.paymentTransaction.findFirst({
      where: { transactionId: transaction_id },
    });

    if (existingTransaction) {
      return NextResponse.json(
        { message: "Transaksi sudah diproses" },
        { status: 200 },
      );
    }

    // 4. Process based on transaction status
    if (transaction_status === "settlement") {
      await prisma.$transaction(async (tx) => {
        // Buat PaymentTransaction
        await tx.paymentTransaction.create({
          data: {
            transactionId: transaction_id,
            amount: Number(gross_amount),
            paymentMethod: payment_type,
            status: "SUCCESS",
            rawPayload: body,
            invoiceId: invoice.id,
          },
        });

        // Update Invoice jadi PAID
        await tx.invoice.update({
          where: { id: invoice.id },
          data: { status: "PAID" },
        });
      });
    } else if (transaction_status === "deny" || transaction_status === "failure") {
      await prisma.paymentTransaction.create({
        data: {
          transactionId: transaction_id,
          amount: Number(gross_amount),
          paymentMethod: payment_type,
          status: "FAILED",
          rawPayload: body,
          invoiceId: invoice.id,
        },
      });
    } else {
      // pending, challenge, atau status lainnya
      await prisma.paymentTransaction.create({
        data: {
          transactionId: transaction_id,
          amount: Number(gross_amount),
          paymentMethod: payment_type,
          status: "PENDING",
          rawPayload: body,
          invoiceId: invoice.id,
        },
      });
    }

    return NextResponse.json(
      { message: "Webhook processed successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("[WEBHOOK_POST]", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server" },
      { status: 500 },
    );
  }
}
