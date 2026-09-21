import { InvoiceStatus } from "@prisma/client";

export type InvoicesStatus =
  | "DRAFT"
  | "PENDING"
  | "UNPAID"
  | "PAID"
  | "OVERDUE"
  | "CANCELLED";

export interface InvoiceData {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  status: InvoicesStatus;
  issueDate: string;
  dueDate: string;
  nominalTotal: number;
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
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface PaymentTransactionData {
  id: string;
  transactionId: string | null;
  amount: number;
  status: string;
  createdAt: string;
}

export interface InvoiceDetail {
  id: string;
  invoiceNumber: string;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  subTotal: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
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
  rate: number;
  subtotal: number;
}

export type DiscountType = "PERCENT" | "NOMINAL";

export interface InvoiceBuilderPayload {
  clientId: string;
  clientName: string;
  lineItems: InvoiceLineItem[];
  discountType: DiscountType;
  discountValue: number;
  taxPercent: number;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  grandTotal: number;
  action: "DRAFT" | "PUBLISH";
}
