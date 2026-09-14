export type InvoicesStatus = "DRAFT" | "PENDING" | "PAID" | "OVERDUE";

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
