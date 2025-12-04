import { getRepairOrders } from '@/actions/repair-orders';
import { RepairOrdersList } from '@/components/repair-orders-list';

export default async function Home() {
  const result = await getRepairOrders();
  const orders = result.success ? result.data : [];

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Pipelore</h1>
          <p className="mt-2 text-gray-600">Sistema de Gestão de Ordens de Serviço</p>
        </div>

        <RepairOrdersList initialOrders={orders} />
      </div>
    </main>
  );
}
