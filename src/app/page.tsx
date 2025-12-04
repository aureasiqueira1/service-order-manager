import { getRepairOrders } from '@/actions/repair-orders';
import { RepairOrdersList } from '@/components/repair-orders-list';
import { StatsDashboard } from '@/components/stats-dashboard';

export default async function Home() {
  const result = await getRepairOrders();
  const allOrders = result.success ? result.data : [];

  // Filtrar ordens atrasadas (elas aparecem apenas na página dedicada)
  const orders = allOrders.filter(order => {
    const now = new Date();
    const isLate = new Date(order.dueDate) < now &&
                   order.status !== 'COMPLETED' &&
                   order.status !== 'CANCELLED';
    return !isLate; // Retorna apenas as NÃO atrasadas
  });

  const lateCount = allOrders.length - orders.length;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-slate-900 mb-2">
            Ordens de Serviço
          </h1>
          <p className="text-lg text-slate-600">
            Gerencie todas as ordens de reparo do seu condomínio em um só lugar
          </p>
        </div>



        <StatsDashboard orders={allOrders} />
        <RepairOrdersList initialOrders={orders} />
      </div>
    </main>
  );
}
