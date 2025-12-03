export interface CSRQuality {
  id?: number;
  pci: number;
  pcs: number;
  humidity: number;
  granulometry: number;
  cendres: number;
  carbone: number;
  densite: number;
  created_at?: string;
}

export interface ReactorData {
  id?: number;
  temperature: number;
  created_at?: string;
}

export interface FlowData {
  id?: number;
  debit: number;
  created_at?: string;
}

export interface SyngasData {
  id?: number;
  H2: number;
  CO: number;
  CH4: number;
  CO2: number;
  tars: number;
  N2?: number;
  created_at?: string;
}

export interface DashboardResponse {
  csrQuality?: CSRQuality | null;
  reactor?: ReactorData | null;
  flow?: FlowData | null;
  syngas?: SyngasData | null;
}

export interface BatchRecord {
  id: number;
  name: string;
  batch_ref: string;
  pci: number;
  humidity: number;
  granulometry: number;
  carbon: number;
  hydrogen: number;
  oxygen: number;
  pollutants: Record<string, number>;
  created_at: string;
}

export type TaskStatus = "todo" | "doing" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface TaskRecord {
  id: number;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string;
  created_at: string;
}
