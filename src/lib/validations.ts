import { PRIORITY_VALUES, STATUS_VALUES } from '@/domain/types';
import { z } from 'zod';

export const createRepairOrderSchema = z.object({
  title: z
    .string()
    .min(1, 'Título é obrigatório')
    .max(255, 'Título deve ter no máximo 255 caracteres'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  location: z
    .string()
    .min(1, 'Local é obrigatório')
    .max(255, 'Local deve ter no máximo 255 caracteres'),
  priority: z.enum(PRIORITY_VALUES, {
    errorMap: () => ({ message: 'Prioridade inválida' }),
  }),
  status: z
    .enum(STATUS_VALUES, {
      errorMap: () => ({ message: 'Status inválido' }),
    })
    .optional(),
  dueDate: z.coerce.date({
    errorMap: () => ({ message: 'Data de conclusão inválida' }),
  }),
});

export const updateRepairOrderSchema = z.object({
  id: z.string().min(1, 'ID é obrigatório'),
  title: z
    .string()
    .min(1, 'Título é obrigatório')
    .max(255, 'Título deve ter no máximo 255 caracteres')
    .optional(),
  description: z.string().min(1, 'Descrição é obrigatória').optional(),
  location: z
    .string()
    .min(1, 'Local é obrigatório')
    .max(255, 'Local deve ter no máximo 255 caracteres')
    .optional(),
  priority: z
    .enum(PRIORITY_VALUES, {
      errorMap: () => ({ message: 'Prioridade inválida' }),
    })
    .optional(),
  status: z
    .enum(STATUS_VALUES, {
      errorMap: () => ({ message: 'Status inválido' }),
    })
    .optional(),
  dueDate: z.coerce
    .date({
      errorMap: () => ({ message: 'Data de conclusão inválida' }),
    })
    .optional(),
  completedAt: z.coerce.date().nullable().optional(),
});

export type CreateRepairOrderInput = z.infer<typeof createRepairOrderSchema>;
export type UpdateRepairOrderInput = z.infer<typeof updateRepairOrderSchema>;
