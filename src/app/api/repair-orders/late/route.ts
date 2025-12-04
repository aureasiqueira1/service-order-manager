import { db } from '@/db';
import { repairOrders } from '@/db/schema';
import { and, lt, notInArray } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const now = new Date();

    // Buscar ordens com dueDate ultrapassado e status diferente de COMPLETED e CANCELLED
    const lateOrders = await db
      .select()
      .from(repairOrders)
      .where(
        and(
          lt(repairOrders.dueDate, now),
          notInArray(repairOrders.status, ['COMPLETED', 'CANCELLED'])
        )
      );

    return NextResponse.json({
      success: true,
      data: lateOrders,
      count: lateOrders.length,
    });
  } catch (error) {
    console.error('Error fetching late repair orders:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao buscar ordens atrasadas',
        data: [],
      },
      { status: 500 }
    );
  }
}
