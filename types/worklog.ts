export type BillingStatus = "UNBILLED" | "BILLED";

export interface WorklogData {
  id: string;
  projectId: string;
  projectName: string;
  clientName: string;
  taskDescription: string;
  durationHours: number;
  hourlyRate: string;
  logDate: string;
  teamMember: string;
  billingStatus: BillingStatus;
  invoiceNumber?: string;
}

export interface ProjectOption {
  id: string;
  projectName: string;
  clientName: string;
}

export type DateRangePreset = "THIS_WEEK" | "THIS_MONTH" | "CUSTOM";
