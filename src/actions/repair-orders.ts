'use server';

import { db } from '@/db';
import { repairOrders } from '@/db/schema';
import { generateId } from '@/lib/utils';
import type { CreateRepairOrderInput, UpdateRepairOrderInput } from '@/lib/validations';
import { createRepairOrderSchema, updateRepairOrderSchema } from '@/lib/validations';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function createRepairOrder(data: CreateRepairOrderInput) {
  try {
    const validated = createRepairOrderSchema.parse(data);

    const newOrder = {
      id: generateId(),
      title: validated.title,
      description: validated.description,
      location: validated.location,
      priority: validated.priority,
      status: validated.status || 'OPEN',
      dueDate: validated.dueDate,
      completedAt: null,
    };

    await db.insert(repairOrders).values(newOrder);

    revalidatePath('/');
    return { success: true, data: newOrder };
  } catch (error) {
    console.error('Error creating repair order:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao criar ordem de serviço',
    };
  }
}

export async function getRepairOrders() {
  try {
    const orders = await db.select().from(repairOrders);
    return { success: true, data: orders };
  } catch (error) {
    console.error('Error fetching repair orders:', error);
    return {
      success: false,
      error: 'Erro ao buscar ordens de serviço',
      data: [],
    };
  }
}

export async function getRepairOrderById(id: string) {
  try {
    const [order] = await db.select().from(repairOrders).where(eq(repairOrders.id, id));

    if (!order) {
      return { success: false, error: 'Ordem de serviço não encontrada' };
    }

    return { success: true, data: order };
  } catch (error) {
    console.error('Error fetching repair order:', error);
    return {
      success: false,
      error: 'Erro ao buscar ordem de serviço',
    };
  }
}

export async function updateRepairOrder(data: UpdateRepairOrderInput) {
  try {
    const validated = updateRepairOrderSchema.parse(data);
    const { id, ...updateData } = validated;

    // Se o status for alterado para COMPLETED, definir completedAt
    if (updateData.status === 'COMPLETED' && !updateData.completedAt) {
      updateData.completedAt = new Date();
    }

    // Se o status for alterado para algo diferente de COMPLETED, limpar completedAt
    if (updateData.status && updateData.status !== 'COMPLETED') {
      updateData.completedAt = null;
    }

    await db.update(repairOrders).set(updateData).where(eq(repairOrders.id, id));

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error updating repair order:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao atualizar ordem de serviço',
    };
  }
}

export async function deleteRepairOrder(id: string) {
  try {
    await db.delete(repairOrders).where(eq(repairOrders.id, id));

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error deleting repair order:', error);
    return {
      success: false,
      error: 'Erro ao deletar ordem de serviço',
    };
  }
}
