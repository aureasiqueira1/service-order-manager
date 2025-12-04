import { datetime, mysqlEnum, mysqlTable, text, timestamp, varchar } from 'drizzle-orm/mysql-core';

export const repairOrders = mysqlTable('repair_orders', {
  id: varchar('id', { length: 36 }).primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  location: varchar('location', { length: 255 }).notNull(),
  priority: mysqlEnum('priority', ['LOW', 'MEDIUM', 'HIGH', 'URGENT']).notNull(),
  status: mysqlEnum('status', ['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
    .notNull()
    .default('OPEN'),
  dueDate: datetime('due_date', { mode: 'date' }).notNull(),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
});

export type RepairOrder = typeof repairOrders.$inferSelect;
export type NewRepairOrder = typeof repairOrders.$inferInsert;
