'use client';

import { getLateRepairOrders } from '@/actions/repair-orders';
import { Priority, RepairOrderEntity } from '@/domain/types';
import { AlertCircle, ArrowDownUp } from 'lucide-react';
import { useMemo, useState } from 'react';
import { DeleteConfirmationModal } from './delete-confirmation-modal';
import { RepairOrderCard } from './repair-order-card';
import { RepairOrderForm } from './repair-order-form';
import { SearchBar } from './search-bar';
import { Modal } from './ui/modal';
import { Select } from './ui/select';

interface LateOrdersListProps {
  orders: RepairOrderEntity[];
}

type SortOption = 'none' | 'priority-high' | 'priority-low' | 'date-asc' | 'date-desc';

const PRIORITY_ORDER: Record<Priority, number> = {
  URGENT: 4,
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};

export function LateOrdersList({ orders: initialOrders }: LateOrdersListProps) {
  const [orders, setOrders] = useState<RepairOrderEntity[]>(initialOrders);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<RepairOrderEntity | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('none');

  const filteredOrders = useMemo(() => {
    let filtered = orders;

    // Filtrar por busca
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((order) =>
        order.title.toLowerCase().includes(query) ||
        order.description.toLowerCase().includes(query) ||
        order.location.toLowerCase().includes(query)
      );
    }

    // Ordenar
    if (sortBy !== 'none') {
      filtered = [...filtered].sort((a, b) => {
        switch (sortBy) {
          case 'priority-high':
            return PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority];
          case 'priority-low':
            return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
          case 'date-asc':
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          case 'date-desc':
            return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
          default:
            return 0;
        }
      });
    }

    return filtered;
  }, [orders, searchQuery, sortBy]);

  const handleEdit = (order: RepairOrderEntity) => {
    setSelectedOrder(order);
    setIsFormOpen(true);
  };

  const handleDelete = (order: RepairOrderEntity) => {
    setSelectedOrder(order);
    setIsDeleteModalOpen(true);
  };

  const handleFormSuccess = async () => {
    setIsFormOpen(false);
    setSelectedOrder(null);
    // Atualizar lista de ordens sem recarregar a página
    const result = await getLateRepairOrders();
    if (result.success) {
      setOrders(result.data);
    }
  };

  const handleDeleteSuccess = async () => {
    setIsDeleteModalOpen(false);
    setSelectedOrder(null);
    // Atualizar lista de ordens sem recarregar a página
    const result = await getLateRepairOrders();
    if (result.success) {
      setOrders(result.data);
    }
  };

  return (
    <>
      {/* Filtros */}
      <div className="mb-6 bg-white rounded-2xl shadow-md border-2 border-slate-100 p-4">
        <div className="flex flex-col gap-3">
          {/* Busca e Ordenação em 1 linha */}
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1">
              <SearchBar onSearch={setSearchQuery} />
            </div>
            <div className="flex items-center gap-2 lg:w-80">
              <ArrowDownUp className="h-4 w-4 text-slate-500 flex-shrink-0" />
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                options={[
                  { value: 'none', label: 'Sem Ordenação' },
                  { value: 'priority-high', label: 'Prioridade: Alta → Baixa' },
                  { value: 'priority-low', label: 'Prioridade: Baixa → Alta' },
                  { value: 'date-asc', label: 'Prazo: Mais Atrasado' },
                  { value: 'date-desc', label: 'Prazo: Menos Atrasado' },
                ]}
              />
            </div>
          </div>

          {/* Contador e Limpar */}
          {(searchQuery || sortBy !== 'none') && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 font-medium">
                {filteredOrders.length} {filteredOrders.length === 1 ? 'resultado' : 'resultados'}
              </span>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSortBy('none');
                }}
                className="text-xs text-slate-600 hover:text-slate-900 font-medium underline"
              >
                Limpar filtros
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Lista ou Empty State */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-md border border-slate-200">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-emerald-100 rounded-full">
              <AlertCircle className="h-12 w-12 text-emerald-700" />
            </div>
            <div>
              <p className="text-slate-900 text-xl font-bold mb-2">
                {orders.length === 0 ? 'Nenhuma ordem atrasada!' : 'Nenhum resultado encontrado'}
              </p>
              <p className="text-slate-600">
                {orders.length === 0
                  ? 'Todas as ordens estão dentro do prazo ou já foram concluídas.'
                  : 'Tente ajustar os filtros de busca.'}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((order) => (
            <RepairOrderCard
              key={order.id}
              order={order}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Modal de formulário */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedOrder(null);
        }}
        title="Editar Ordem de Serviço"
        size="lg"
      >
        <RepairOrderForm
          order={selectedOrder || undefined}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setIsFormOpen(false);
            setSelectedOrder(null);
          }}
        />
      </Modal>

      {/* Modal de confirmação de exclusão */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
        onSuccess={handleDeleteSuccess}
      />
    </>
  );
}
