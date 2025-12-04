import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-16 bg-white rounded-xl shadow-md border border-slate-200">
      <div className="flex flex-col items-center gap-4 max-w-md mx-auto px-4">
        <div className="p-4 bg-slate-100 rounded-full">
          <Icon className="h-12 w-12 text-slate-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
          <p className="text-slate-600">{description}</p>
        </div>
        {action && <div className="mt-4">{action}</div>}
      </div>
    </div>
  );
}
