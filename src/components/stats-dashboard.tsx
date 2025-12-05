'use client';

import { RepairOrderEntity } from '@/domain/types';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useMemo } from 'react';

interface StatsDashboardProps {
  orders: RepairOrderEntity[];
}

export function StatsDashboard({ orders }: StatsDashboardProps) {
  const stats = useMemo(() => {
    const total = orders.length;
    const inProgress = orders.filter(o => o.status === 'IN_PROGRESS').length;
    const completed = orders.filter(o => o.status === 'COMPLETED').length;
    const late = orders.filter(o => {
      const now = new Date();
      return new Date(o.dueDate) < now && o.status !== 'COMPLETED' && o.status !== 'CANCELLED';
    }).length;

    return { total, inProgress, completed, late };
  }, [orders]);

  const statCards = [
    {
      label: 'Total',
      value: stats.total,
      icon: Clock,
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      label: 'Em Progresso',
      value: stats.inProgress,
      icon: Clock,
      gradient: 'from-indigo-500 to-indigo-600',
    },
    {
      label: 'Concluídas',
      value: stats.completed,
      icon: CheckCircle,
      gradient: 'from-emerald-500 to-emerald-600',
    },
    {
      label: 'Atrasadas',
      value: stats.late,
      icon: AlertCircle,
      gradient: 'from-red-500 to-red-600',
      highlight: stats.late > 0,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className={`
              relative overflow-hidden bg-gradient-to-br ${stat.gradient}
              rounded-2xl p-6 text-white shadow-lg
              hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-default
              ${stat.highlight ? 'ring-4 ring-red-300 ring-offset-2' : ''}
            `}
          >
            <div className="relative z-10">
              <Icon className="h-8 w-8 mb-3 opacity-90" />
              <div className="text-4xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm font-medium opacity-90">{stat.label}</div>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <Icon className="h-32 w-32" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
