'use client';

import { RepairOrderEntity, Status, STATUS_LABELS, STATUS_VALUES } from '@/domain/types';
import { Filter, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { DeleteConfirmationModal } from './delete-confirmation-modal';
import { RepairOrderCard } from './repair-order-card';
import { RepairOrderForm } from './repair-order-form';
import { Button } from './ui/button';
import { Modal } from './ui/modal';
import { Select } from './ui/select';

interface RepairOrdersListProps {
  initialOrders: RepairOrderEntity[];
}

export function RepairOrdersList({ initialOrders }: RepairOrdersListProps) {
  const [orders, setOrders] = useState<RepairOrderEntity[]>(initialOrders);
  const [filterStatus, setFilterStatus] = useState<Status | 'ALL'>('ALL');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<RepairOrderEntity | null>(null);

  const filteredOrders = useMemo(() => {
    if (filterStatus === 'ALL') return orders;
    return orders.filter((order) => order.status === filterStatus);
  }, [orders, filterStatus]);

  const handleEdit = (order: RepairOrderEntity) => {
    setSelectedOrder(order);
    setIsFormOpen(true);
  };

  const handleDelete = (order: RepairOrderEntity) => {
    setSelectedOrder(order);
    setIsDeleteModalOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedOrder(null);
    // Recarregar a página para obter dados atualizados
    window.location.reload();
  };

  const handleDeleteSuccess = () => {
    setIsDeleteModalOpen(false);
    setSelectedOrder(null);
    // Recarregar a página para obter dados atualizados
    window.location.reload();
  };

  const handleNewOrder = () => {
    setSelectedOrder(null);
    setIsFormOpen(true);
  };

  return (
    <>
      {/* Header com filtros e botão de nova ordem */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <Filter className="h-5 w-5 text-gray-500" />
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
            className="w-64"
          />
        </div>

        <Button onClick={handleNewOrder} className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Nova Ordem
        </Button>
      </div>

      {/* Lista de ordens */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg">
            {filterStatus === 'ALL'
              ? 'Nenhuma ordem de serviço cadastrada'
              : `Nenhuma ordem com status "${STATUS_LABELS[filterStatus]}"`}
          </p>
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
