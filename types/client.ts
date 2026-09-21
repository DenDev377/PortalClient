// =============================================
// Type definitions untuk Client domain
// Dipakai bersama oleh Page, Table, dan Modal
// =============================================

// Bentuk data Client yang dikembalikan oleh API
export interface Client {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  projects: { id: string }[];
  invoices: { id: string; status: string; totalAmount: string }[];
}

// Payload untuk membuat / mengedit client
export interface ClientPayload {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

// Helper: tentukan billing status dari daftar invoice
export function getBillingStatus(
  invoices: Client["invoices"]
): "LUNAS" | "PENDING" | "OVERDUE" {
  if (invoices.some((inv) => inv.status === "OVERDUE")) return "OVERDUE";
  if (invoices.some((inv) => inv.status === "PENDING" || inv.status === "UNPAID"))
    return "PENDING";
  return "LUNAS";
}
