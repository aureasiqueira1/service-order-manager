'use client';

import { deleteRepairOrder } from '@/actions/repair-orders';
import { RepairOrderEntity } from '@/domain/types';
import { useState } from 'react';
import { Button } from './ui/button';
import { Modal } from './ui/modal';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: RepairOrderEntity | null;
  onSuccess: () => void;
}

export function DeleteConfirmationModal({ isOpen, onClose, order, onSuccess }: DeleteConfirmationModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!order) return;

    setLoading(true);
    setError(null);

    try {
      const result = await deleteRepairOrder(order.id);

      if (result.success) {
        onSuccess();
        onClose();
      } else {
        setError(result.error || 'Erro ao deletar ordem de serviço');
      }
    } catch (err) {
      setError('Erro inesperado ao deletar ordem de serviço');
    } finally {
      setLoading(false);
    }
  };

  if (!order) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirmar Exclusão" size="sm">
      <div className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <p className="text-gray-600">
          Tem certeza que deseja excluir a ordem de serviço <strong>{order.title}</strong>?
        </p>
        <p className="text-sm text-gray-500">
          Esta ação não pode ser desfeita.
        </p>

        <div className="flex gap-3 justify-end pt-4">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? 'Excluindo...' : 'Excluir'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
