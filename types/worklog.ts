export type BillingStatus = "UNBILLED" | "BILLED";

export interface WorklogData {
  id: string;
  projectName: string;
  clientName: string;
  taskDescription: string;
  durationHours: number;
  logDate: string;
  teamMember: string;
  billingStatus: BillingStatus;
}

export interface ProjectOption {
  id: string;
  projectName: string;
  clientName: string;
}

export type DateRangePreset = "THIS_WEEK" | "THIS_MONTH" | "CUSTOM";
