'use client';

import { getRepairOrders } from '@/actions/repair-orders';
import { Priority, RepairOrderEntity, Status, STATUS_LABELS, STATUS_VALUES } from '@/domain/types';
import { ArrowDownUp, Filter, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { DeleteConfirmationModal } from './delete-confirmation-modal';
import { RepairOrderCard } from './repair-order-card';
import { RepairOrderForm } from './repair-order-form';
import { SearchBar } from './search-bar';
import { Button } from './ui/button';
import { Modal } from './ui/modal';
import { Select } from './ui/select';

interface RepairOrdersListProps {
  initialOrders: RepairOrderEntity[];
}

type SortOption = 'none' | 'priority-high' | 'priority-low' | 'date-asc' | 'date-desc';

const PRIORITY_ORDER: Record<Priority, number> = {
  URGENT: 4,
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};

export function RepairOrdersList({ initialOrders }: RepairOrdersListProps) {
  const [orders, setOrders] = useState<RepairOrderEntity[]>(initialOrders);
  const [filterStatus, setFilterStatus] = useState<Status | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('none');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<RepairOrderEntity | null>(null);

  const filteredOrders = useMemo(() => {
    let filtered = orders;

    // Filtrar por status
    if (filterStatus !== 'ALL') {
      filtered = filtered.filter((order) => order.status === filterStatus);
    }

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
  }, [orders, filterStatus, searchQuery, sortBy]);

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
    const result = await getRepairOrders();
    if (result.success) {
      // Filtrar ordens atrasadas (elas aparecem apenas na página dedicada)
      const now = new Date();
      const filteredOrders = result.data.filter(order => {
        const isLate = new Date(order.dueDate) < now &&
                       order.status !== 'COMPLETED' &&
                       order.status !== 'CANCELLED';
        return !isLate; // Retorna apenas as NÃO atrasadas
      });
      setOrders(filteredOrders);
    }
  };

  const handleDeleteSuccess = async () => {
    setIsDeleteModalOpen(false);
    setSelectedOrder(null);
    // Atualizar lista de ordens sem recarregar a página
    const result = await getRepairOrders();
    if (result.success) {
      // Filtrar ordens atrasadas (elas aparecem apenas na página dedicada)
      const now = new Date();
      const filteredOrders = result.data.filter(order => {
        const isLate = new Date(order.dueDate) < now &&
                       order.status !== 'COMPLETED' &&
                       order.status !== 'CANCELLED';
        return !isLate; // Retorna apenas as NÃO atrasadas
      });
      setOrders(filteredOrders);
    }
  };

  const handleNewOrder = () => {
    setSelectedOrder(null);
    setIsFormOpen(true);
  };

  return (
    <>
      {/* Header compacto com busca, filtros e ações */}
      <div className="mb-6 bg-white rounded-2xl shadow-md border-2 border-slate-100 p-4">
        <div className="flex flex-col gap-3">
          {/* Linha 1: Busca */}
          <SearchBar onSearch={setSearchQuery} />

          {/* Linha 2: Filtros e Botão */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <div className="flex items-center gap-2 flex-1">
              <Filter className="h-4 w-4 text-slate-500 flex-shrink-0" />
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as Status | 'ALL')}
                options={[
                  { value: 'ALL', label: 'Todos os Status' },
                  ...STATUS_VALUES.map((value) => ({
                    value,
                    label: STATUS_LABELS[value],
                  })),
                ]}
              />
            </div>

            <div className="flex items-center gap-2 flex-1">
              <ArrowDownUp className="h-4 w-4 text-slate-500 flex-shrink-0" />
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                options={[
                  { value: 'none', label: 'Sem Ordenação' },
                  { value: 'priority-high', label: 'Prioridade: Alta → Baixa' },
                  { value: 'priority-low', label: 'Prioridade: Baixa → Alta' },
                  { value: 'date-asc', label: 'Prazo: Próximo → Distante' },
                  { value: 'date-desc', label: 'Prazo: Distante → Próximo' },
                ]}
              />
            </div>

            <Button
              onClick={handleNewOrder}
              className="flex items-center gap-2 whitespace-nowrap shadow-lg hover:shadow-xl"
              size="lg"
            >
              <Plus className="h-5 w-5" />
              Nova Ordem
            </Button>
          </div>

          {/* Contador e Limpar */}
          {(filterStatus !== 'ALL' || searchQuery || sortBy !== 'none') && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 font-medium">
                {filteredOrders.length} {filteredOrders.length === 1 ? 'resultado' : 'resultados'}
              </span>
              <button
                onClick={() => {
                  setFilterStatus('ALL');
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

      {/* Lista de ordens */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-md border-2 border-slate-100">
          <div className="max-w-md mx-auto px-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Plus className="h-10 w-10 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              {filterStatus === 'ALL' ? 'Nenhuma ordem cadastrada' : 'Nenhum resultado encontrado'}
            </h3>
            <p className="text-slate-600 mb-6">
              {filterStatus === 'ALL'
                ? 'Comece criando sua primeira ordem de serviço'
                : `Não há ordens com o filtro "${STATUS_LABELS[filterStatus]}"`}
            </p>
            {filterStatus === 'ALL' && (
              <Button onClick={handleNewOrder} size="lg" className="shadow-lg">
                <Plus className="h-5 w-5" />
                Criar Primeira Ordem
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((order, index) => (
            <div
              key={order.id}
              className="animate-in fade-in slide-in-from-bottom-4 duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <RepairOrderCard
                order={order}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
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
        title={selectedOrder ? 'Editar Ordem de Serviço' : 'Nova Ordem de Serviço'}
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
