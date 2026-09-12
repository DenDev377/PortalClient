export type BillingModel = "HOURLY" | "FIXED" | "MILESTONE";

export type ProjectStatus = "ACTIVE" | "ON_HOLD" | "COMPLETED" | "CANCELLED";

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
