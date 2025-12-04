'use client';

import { PRIORITY_COLORS, PRIORITY_LABELS, RepairOrderEntity, STATUS_COLORS, STATUS_LABELS } from '@/domain/types';
import { formatDate, isOverdue } from '@/lib/utils';
import { AlertCircle, Calendar, CheckCircle, MapPin, Pencil, Trash2 } from 'lucide-react';
import { Button } from './ui/button';

interface RepairOrderCardProps {
  order: RepairOrderEntity;
  onEdit: (order: RepairOrderEntity) => void;
  onDelete: (order: RepairOrderEntity) => void;
}

export function RepairOrderCard({ order, onEdit, onDelete }: RepairOrderCardProps) {
  const overdue = isOverdue(order.dueDate, order.status);

  return (
    <div className="group relative bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-md hover:shadow-2xl border border-slate-200 hover:border-blue-300 p-6 transition-all duration-300 h-full flex flex-col overflow-hidden">
      {/* Decorative corner */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-full opacity-50 -mr-16 -mt-16"></div>

      {/* Header */}
      <div className="relative flex items-start justify-between mb-4 flex-shrink-0">
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-slate-900 mb-3 truncate group-hover:text-blue-600 transition-colors">
            {order.title}
          </h3>
          <div className="flex flex-wrap gap-2">
            <span
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide shadow-sm ${
                PRIORITY_COLORS[order.priority]
              }`}
            >
              {PRIORITY_LABELS[order.priority]}
            </span>
            <span
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wide shadow-sm ${
                STATUS_COLORS[order.status]
              }`}
            >
              {STATUS_LABELS[order.status]}
            </span>
          </div>
        </div>
        <div className="flex gap-1 ml-3 opacity-0 group-hover:opacity-100 transition-all duration-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(order)}
            className="p-2.5 hover:bg-blue-100 hover:text-blue-700 rounded-xl transition-all hover:scale-110"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(order)}
            className="p-2.5 hover:bg-red-100 hover:text-red-700 rounded-xl transition-all hover:scale-110"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Description */}
      <p className="relative text-slate-700 text-sm mb-4 line-clamp-3 leading-relaxed flex-grow">
        {order.description}
      </p>

      {/* Footer */}
      <div className="relative space-y-3 pt-4 border-t-2 border-slate-200 flex-shrink-0 mt-auto min-h-[140px]">
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center justify-center w-8 h-8 bg-slate-100 rounded-lg flex-shrink-0">
            <MapPin className="h-4 w-4 text-slate-600" />
          </div>
          <span className="truncate font-medium text-slate-700">{order.location}</span>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <div className={`flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0 ${
            overdue ? 'bg-red-100' : 'bg-blue-100'
          }`}>
            <Calendar className={`h-4 w-4 ${overdue ? 'text-red-600' : 'text-blue-600'}`} />
          </div>
          <div className="flex items-center gap-2">
            {overdue && <AlertCircle className="h-4 w-4 text-red-600" />}
            <span className={`font-semibold ${overdue ? 'text-red-600' : 'text-slate-700'}`}>
              {formatDate(order.dueDate)}
            </span>
          </div>
        </div>

        {order.completedAt && (
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center justify-center w-8 h-8 bg-emerald-100 rounded-lg flex-shrink-0">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
            </div>
            <span className="font-semibold text-emerald-700">
              Concluído em {formatDate(order.completedAt)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
