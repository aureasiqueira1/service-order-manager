import { getLateRepairOrders } from '@/actions/repair-orders';
import { LateOrdersList } from '@/components/late-orders-list';
import { AlertCircle } from 'lucide-react';

export default async function LateOrdersPage() {
  const result = await getLateRepairOrders();
  const lateOrders = result.success ? result.data : [];

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl shadow-lg p-8 text-white">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
              <AlertCircle className="h-12 w-12" />
            </div>
            <div>
              <h1 className="text-4xl font-black mb-2">Ordens Atrasadas</h1>
              <p className="text-xl font-medium text-red-50">
                {lateOrders.length} {lateOrders.length === 1 ? 'ordem precisa de atenção' : 'ordens precisam de atenção'}
              </p>
            </div>
          </div>
        </div>

        {/* Lista de ordens atrasadas */}
        <LateOrdersList orders={lateOrders} />
      </div>
    </main>
  );
}
