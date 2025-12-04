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
  LOW: 'bg-blue-100 text-blue-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  HIGH: 'bg-orange-100 text-orange-800',
  URGENT: 'bg-red-100 text-red-800',
};

export const STATUS_COLORS: Record<Status, string> = {
  OPEN: 'bg-gray-100 text-gray-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};
