'use client';

import { createRepairOrder, updateRepairOrder } from '@/actions/repair-orders';
import { PRIORITY_LABELS, PRIORITY_VALUES, RepairOrderEntity, STATUS_LABELS, STATUS_VALUES } from '@/domain/types';
import { FormEvent, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select } from './ui/select';
import { Textarea } from './ui/textarea';

interface RepairOrderFormProps {
  order?: RepairOrderEntity;
  onSuccess: () => void;
  onCancel: () => void;
}

export function RepairOrderForm({ order, onSuccess, onCancel }: RepairOrderFormProps) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      location: formData.get('location') as string,
      priority: formData.get('priority') as string,
      status: formData.get('status') as string,
      dueDate: new Date(formData.get('dueDate') as string),
    };

    try {
      let result;
      if (order) {
        result = await updateRepairOrder({ id: order.id, ...data });
      } else {
        result = await createRepairOrder(data);
      }

      if (result.success) {
        onSuccess();
      } else {
        setErrors({ general: result.error || 'Erro ao salvar ordem de serviço' });
      }
    } catch (error) {
      setErrors({ general: 'Erro inesperado ao salvar ordem de serviço' });
    } finally {
      setLoading(false);
    }
  };

  const formatDateForInput = (date: Date | string | null): string => {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toISOString().split('T')[0];
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.general && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {errors.general}
        </div>
      )}

      <Input
        name="title"
        label="Título"
        defaultValue={order?.title}
        required
        maxLength={255}
        error={errors.title}
      />

      <Textarea
        name="description"
        label="Descrição"
        defaultValue={order?.description}
        required
        error={errors.description}
      />

      <Input
        name="location"
        label="Local"
        defaultValue={order?.location}
        required
        maxLength={255}
        placeholder="Ex: Torre A - Apto 101"
        error={errors.location}
      />

      <Select
        name="priority"
        label="Prioridade"
        defaultValue={order?.priority || 'MEDIUM'}
        required
        options={PRIORITY_VALUES.map((value) => ({
          value,
          label: PRIORITY_LABELS[value],
        }))}
        error={errors.priority}
      />

      <Select
        name="status"
        label="Status"
        defaultValue={order?.status || 'OPEN'}
        required
        options={STATUS_VALUES.map((value) => ({
          value,
          label: STATUS_LABELS[value],
        }))}
        error={errors.status}
      />

      <Input
        name="dueDate"
        label="Data de Conclusão"
        type="date"
        defaultValue={formatDateForInput(order?.dueDate || null)}
        required
        error={errors.dueDate}
      />

      <div className="flex gap-3 justify-end pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={loading}
        >
          {loading ? 'Salvando...' : order ? 'Atualizar' : 'Criar'}
        </Button>
      </div>
    </form>
  );
}
