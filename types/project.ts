// =============================================
// Type definitions untuk Project domain
// Disesuaikan dengan Prisma schema
// =============================================

// Sesuai enum di schema.prisma
export type BillingType = "HOURLY_RATE" | "FIXED_PRICE";
export type ProjectStatusDB = "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

// Untuk komponen TableProjects yang sudah ada
export type BillingModel = "HOURLY" | "FIXED" | "MILESTONE";
export type ProjectStatus = "ACTIVE" | "ON_HOLD" | "COMPLETED" | "CANCELLED";

// Bentuk data Project yang dikembalikan API (sesuai Prisma include)
export interface Project {
  id: string;
  name: string;
  description: string | null;
  status: ProjectStatusDB;
  billingType: BillingType;
  rate: number | null;
  createdAt: string;
  updatedAt: string;
  clientId: string;
  client: {
    id: string;
    name: string;
  };
  worklogs: {
    id: string;
    hours: number;
    isBilled: boolean;
  }[];
}

// Payload untuk Create / Update
export interface ProjectPayload {
  name: string;
  description?: string;
  clientId: string;
  billingType: BillingType;
  rate?: number | null;
  status?: ProjectStatusDB;
}

// Format yang dipakai TableProjects (sudah ada, tidak diubah)
export interface ProjectData {
  id: string;
  projectName: string;
  clientName: string;
  billingModel: BillingModel;
  hoursLogged: number;
  hoursBudget: number;
  spentAmount: string;
  budgetAmount: string;
  status: ProjectStatus;
  deadline: string;
}

// Helper: map data API → format TableProjects
export function mapToTableFormat(p: Project): ProjectData {
  const totalHours = p.worklogs.reduce((sum, w) => sum + Number(w.hours), 0);
  const billingModel: BillingModel =
    p.billingType === "HOURLY_RATE" ? "HOURLY" : "FIXED";
  const rate = Number(p.rate ?? 0);
  const spent = totalHours * (billingModel === "HOURLY" ? rate : 0);

  return {
    id: p.id,
    projectName: p.name,
    clientName: p.client.name,
    billingModel,
    hoursLogged: totalHours,
    hoursBudget: 0,         // Bisa ditambah field nanti
    spentAmount: `Rp ${spent.toLocaleString("id-ID")}`,
    budgetAmount: billingModel === "FIXED" ? `Rp ${rate.toLocaleString("id-ID")}` : "-",
    status:
      p.status === "IN_PROGRESS"
        ? "ACTIVE"
        : p.status === "COMPLETED"
        ? "COMPLETED"
        : "CANCELLED",
    deadline: "-",          // Bisa ditambah field nanti ke schema
  };
}
