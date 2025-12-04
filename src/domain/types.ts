export const PRIORITY_VALUES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const;
export const STATUS_VALUES = ['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] as const;

export type Priority = (typeof PRIORITY_VALUES)[number];
export type Status = (typeof STATUS_VALUES)[number];

export interface RepairOrderEntity {
  id: string;
  title: string;
  description: string;
  location: string;
  priority: Priority;
  status: Status;
  dueDate: Date;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRepairOrderDTO {
  title: string;
  description: string;
  location: string;
  priority: Priority;
  status?: Status;
  dueDate: Date;
}

export interface UpdateRepairOrderDTO {
  id: string;
  title?: string;
  description?: string;
  location?: string;
  priority?: Priority;
  status?: Status;
  dueDate?: Date;
  completedAt?: Date | null;
}

export const PRIORITY_LABELS: Record<Priority, string> = {
  LOW: 'Baixa',
  MEDIUM: 'Média',
  HIGH: 'Alta',
  URGENT: 'Urgente',
};

export const STATUS_LABELS: Record<Status, string> = {
  OPEN: 'Aberto',
  IN_PROGRESS: 'Em Progresso',
  COMPLETED: 'Concluído',
  CANCELLED: 'Cancelado',
};

export const PRIORITY_COLORS: Record<Priority, string> = {
  LOW: 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold',
  MEDIUM: 'bg-amber-100 text-amber-800 border border-amber-300 font-semibold',
  HIGH: 'bg-orange-100 text-orange-800 border border-orange-300 font-semibold',
  URGENT: 'bg-rose-100 text-rose-800 border border-rose-300 font-semibold',
};

export const STATUS_COLORS: Record<Status, string> = {
  OPEN: 'bg-sky-100 text-sky-800 border border-sky-300 font-medium',
  IN_PROGRESS: 'bg-indigo-100 text-indigo-800 border border-indigo-300 font-medium',
  COMPLETED: 'bg-green-100 text-green-800 border border-green-300 font-medium',
  CANCELLED: 'bg-slate-100 text-slate-700 border border-slate-300 font-medium',
};
