'use client';

import { createRepairOrder, updateRepairOrder } from '@/actions/repair-orders';
import { Priority, PRIORITY_LABELS, PRIORITY_VALUES, RepairOrderEntity, Status, STATUS_LABELS, STATUS_VALUES } from '@/domain/types';
import { FormEvent, useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select } from './ui/select';
import { Textarea } from './ui/textarea';
import { useToast } from './ui/toast';

interface RepairOrderFormProps {
  order?: RepairOrderEntity;
  onSuccess: () => void;
  onCancel: () => void;
}

const formatDateForInput = (date: Date | string | null): string => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  // Ajustar para timezone local para evitar perder um dia
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export function RepairOrderForm({ order, onSuccess, onCancel }: RepairOrderFormProps) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(1);
  const { showToast } = useToast();

  // Estado para armazenar valores do formulário
  const [formValues, setFormValues] = useState({
    title: order?.title || '',
    description: order?.description || '',
    location: order?.location || '',
    priority: order?.priority || 'MEDIUM',
    status: order?.status || 'OPEN',
    dueDate: order?.dueDate ? formatDateForInput(order.dueDate) : '',
  });

  // Atualizar formValues quando order mudar
  useEffect(() => {
    if (order) {
      setFormValues({
        title: order.title || '',
        description: order.description || '',
        location: order.location || '',
        priority: order.priority || 'MEDIUM',
        status: order.status || 'OPEN',
        dueDate: order.dueDate ? formatDateForInput(order.dueDate) : '',
      });
      setCurrentStep(1);
      setErrors({});
    }
  }, [order]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Criar data no timezone local para evitar perder um dia
    const [year, month, day] = formValues.dueDate.split('-');
    const dueDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), 12, 0, 0);

    const data = {
      title: formValues.title,
      description: formValues.description,
      location: formValues.location,
      priority: formValues.priority as Priority,
      status: formValues.status as Status,
      dueDate: dueDate,
    };

    try {
      let result;
      if (order) {
        result = await updateRepairOrder({ id: order.id, ...data });
      } else {
        result = await createRepairOrder(data);
      }

      if (result.success) {
        showToast(
          order ? 'Ordem atualizada com sucesso!' : 'Ordem criada com sucesso!',
          'success'
        );
        onSuccess();
      } else {
        const errorMsg = result.error || 'Erro ao salvar ordem de serviço';
        setErrors({ general: errorMsg });
        showToast(errorMsg, 'error');
      }
    } catch (error) {
      const errorMsg = 'Erro inesperado ao salvar ordem de serviço';
      setErrors({ general: errorMsg });
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formValues.title.trim()) {
      newErrors.title = 'Título é obrigatório';
    }

    if (!formValues.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }

    if (!formValues.location.trim()) {
      newErrors.location = 'Local é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevenir submit do form
    if (validateStep1()) {
      setCurrentStep(2);
      setErrors({}); // Limpa erros ao avançar
    } else {
      showToast('Por favor, preencha todos os campos obrigatórios', 'error');
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
    setErrors({}); // Limpa erros ao voltar
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Indicador de Etapas */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <div className={`flex items-center gap-2 ${currentStep === 1 ? 'text-blue-600' : 'text-slate-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${currentStep === 1 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
            1
          </div>
          <span className="font-semibold hidden sm:inline">Informações</span>
        </div>
        <div className="w-12 h-0.5 bg-slate-300"></div>
        <div className={`flex items-center gap-2 ${currentStep === 2 ? 'text-blue-600' : 'text-slate-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${currentStep === 2 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
            2
          </div>
          <span className="font-semibold hidden sm:inline">Configurações</span>
        </div>
      </div>

      {errors.general && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-800 px-4 py-3 rounded-r-lg font-medium flex items-start gap-3">
          <span className="text-red-500 text-xl">⚠️</span>
          <span>{errors.general}</span>
        </div>
      )}

      {/* Etapa 1: Informações Básicas */}
      {currentStep === 1 && (
        <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <h3 className="text-base font-bold text-slate-900 pb-2 border-b-2 border-slate-300">
          Informações Básicas
        </h3>

        <Input
          name="title"
          label="Título da Ordem"
          value={formValues.title}
          onChange={(e) => setFormValues({...formValues, title: e.target.value})}
          required
          maxLength={255}
          placeholder="Ex: Reparo de vazamento"
          error={errors.title}
        />

        <Textarea
          name="description"
          label="Descrição Detalhada"
          value={formValues.description}
          onChange={(e) => setFormValues({...formValues, description: e.target.value})}
          required
          rows={4}
          placeholder="Descreva o problema ou serviço necessário..."
          error={errors.description}
        />

        <Input
          name="location"
          label="Local"
          value={formValues.location}
          onChange={(e) => setFormValues({...formValues, location: e.target.value})}
          required
          maxLength={255}
          placeholder="Ex: Torre A - Apto 101"
          error={errors.location}
        />
        </div>
      )}

      {/* Etapa 2: Configurações */}
      {currentStep === 2 && (
        <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <h3 className="text-base font-bold text-slate-900 pb-2 border-b-2 border-slate-300">
            Configurações
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            name="priority"
            label="Prioridade"
            value={formValues.priority}
            onChange={(e) => setFormValues({...formValues, priority: e.target.value as Priority})}
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
            value={formValues.status}
            onChange={(e) => setFormValues({...formValues, status: e.target.value as Status})}
            required
            options={STATUS_VALUES.map((value) => ({
              value,
              label: STATUS_LABELS[value],
            }))}
            error={errors.status}
          />
        </div>

        <Input
          type="date"
          name="dueDate"
          label="Prazo de Conclusão"
          value={formValues.dueDate}
          onChange={(e) => setFormValues({...formValues, dueDate: e.target.value})}
          required
          error={errors.dueDate}
        />
        </div>
      )}

      {/* Botões de Navegação */}
      <div className="flex gap-3 justify-between pt-6 border-t border-slate-200">
        <div>
          {currentStep === 2 && (
            <Button
              type="button"
              variant="secondary"
              onClick={handleBack}
              disabled={loading}
              size="lg"
            >
              ← Voltar
            </Button>
          )}
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={loading}
            size="lg"
          >
            Cancelar
          </Button>

          {currentStep === 1 ? (
            <Button
              type="button"
              variant="primary"
              onClick={handleNext}
              size="lg"
            >
              Próximo →
            </Button>
          ) : (
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              size="lg"
            >
              {order ? 'Atualizar Ordem' : 'Criar Ordem'}
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
