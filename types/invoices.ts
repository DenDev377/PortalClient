import type { InvoiceStatus, WebhookStatus } from "@prisma/client";

export type InvoicesStatus = InvoiceStatus;

export interface InvoiceData {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  status: InvoicesStatus;
  issueDate: string;
  dueDate: string;
  nominalTotal: string;
}

export interface InvoiceClientInfo {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
}

export interface InvoiceItemData {
  id: string;
  description: string;
  quantity: string;
  unitPrice: string;
  total: string;
}

export interface PaymentTransactionData {
  id: string;
  transactionId: string | null;
  amount: string;
  status: string;
  createdAt: string;
}

export interface InvoiceDetail {
  id: string;
  invoiceNumber: string;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  subTotal: string;
  taxRate: string;
  taxAmount: string;
  totalAmount: string;
  client: InvoiceClientInfo;
  items: InvoiceItemData[];
  paymentTransactions: PaymentTransactionData[];
}

export interface ClientOption {
  id: string;
  companyName: string;
  email: string;
}

export interface InvoiceLineItem {
  worklogId: string;
  description: string;
  hours: number;
  rate: string;
  subtotal: string;
}

export type DiscountType = "PERCENT" | "NOMINAL";

export interface InvoiceBuilderPayload {
  clientId: string;
  clientName: string;
  lineItems: InvoiceLineItem[];
  discountType: DiscountType;
  discountValue: number;
  taxPercent: string;
  subtotal: string;
  discountAmount: string;
  taxAmount: string;
  grandTotal: string;
  action: "DRAFT" | "PUBLISH";
}