'use client';

import { PRIORITY_COLORS, PRIORITY_LABELS, RepairOrderEntity, STATUS_COLORS, STATUS_LABELS } from '@/domain/types';
import { formatDate, isOverdue } from '@/lib/utils';
import { AlertCircle, Calendar, MapPin, Pencil, Trash2 } from 'lucide-react';
import { Button } from './ui/button';

interface RepairOrderCardProps {
  order: RepairOrderEntity;
  onEdit: (order: RepairOrderEntity) => void;
  onDelete: (order: RepairOrderEntity) => void;
}

export function RepairOrderCard({ order, onEdit, onDelete }: RepairOrderCardProps) {
  const overdue = isOverdue(order.dueDate, order.status);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{order.title}</h3>
          <div className="flex flex-wrap gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${PRIORITY_COLORS[order.priority]}`}>
              {PRIORITY_LABELS[order.priority]}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.status]}`}>
              {STATUS_LABELS[order.status]}
            </span>
            {overdue && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Atrasado
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2 ml-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(order)}
            className="p-2"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(order)}
            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{order.description}</p>

      {/* Footer */}
      <div className="flex flex-col gap-2 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span>{order.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>Prazo: {formatDate(order.dueDate)}</span>
        </div>
        {order.completedAt && (
          <div className="flex items-center gap-2 text-green-600">
            <Calendar className="h-4 w-4" />
            <span>Concluído em: {formatDate(order.completedAt)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
