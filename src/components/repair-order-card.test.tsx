import { RepairOrderEntity } from '@/domain/types';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RepairOrderCard } from './repair-order-card';

describe('RepairOrderCard', () => {
  const mockOrder: RepairOrderEntity = {
    id: '1',
    title: 'Reparo no elevador',
    description: 'Elevador apresentando problemas',
    location: 'Torre A - Apto 101',
    priority: 'HIGH',
    status: 'OPEN',
    dueDate: new Date(2024, 11, 31), // 31 de dezembro de 2024
    completedAt: null,
    createdAt: new Date(2024, 0, 1),
    updatedAt: new Date(2024, 0, 1),
  };

  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    mockOnEdit.mockClear();
    mockOnDelete.mockClear();
  });

  it('should render order title', () => {
    render(<RepairOrderCard order={mockOrder} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    expect(screen.getByText('Reparo no elevador')).toBeInTheDocument();
  });

  it('should render order description', () => {
    render(<RepairOrderCard order={mockOrder} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    expect(screen.getByText('Elevador apresentando problemas')).toBeInTheDocument();
  });

  it('should render order location', () => {
    render(<RepairOrderCard order={mockOrder} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    expect(screen.getByText('Torre A - Apto 101')).toBeInTheDocument();
  });

  it('should render priority badge', () => {
    render(<RepairOrderCard order={mockOrder} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    expect(screen.getByText('Alta')).toBeInTheDocument();
  });

  it('should render status badge', () => {
    render(<RepairOrderCard order={mockOrder} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    expect(screen.getByText('Aberto')).toBeInTheDocument();
  });

  it('should format due date correctly', () => {
    render(<RepairOrderCard order={mockOrder} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    // Verificar que a data está presente no formato brasileiro
    expect(screen.getByText(/\d{2}\/\d{2}\/2024/)).toBeInTheDocument();
  });

  it('should call onEdit when edit button clicked', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <RepairOrderCard order={mockOrder} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    // Hover sobre o card para mostrar os botões
    const card = container.querySelector('.group') as HTMLElement;
    await user.hover(card);

    // Encontrar o botão de editar (primeiro botão)
    const buttons = screen.getAllByRole('button');
    await user.click(buttons[0]);

    expect(mockOnEdit).toHaveBeenCalledWith(mockOrder);
  });

  it('should call onDelete when delete button clicked', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <RepairOrderCard order={mockOrder} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    // Hover sobre o card para mostrar os botões
    const card = container.querySelector('.group') as HTMLElement;
    await user.hover(card);

    // Encontrar o botão de deletar (segundo botão)
    const buttons = screen.getAllByRole('button');
    await user.click(buttons[1]);

    expect(mockOnDelete).toHaveBeenCalledWith(mockOrder);
  });

  it('should show overdue indicator for past due date', () => {
    const overdueOrder = {
      ...mockOrder,
      dueDate: new Date('2023-01-01'),
    };

    render(<RepairOrderCard order={overdueOrder} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    // Verificar se há elementos com classes de alerta
    const { container } = render(
      <RepairOrderCard order={overdueOrder} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    const redElements = container.querySelectorAll('.text-red-600');
    expect(redElements.length).toBeGreaterThan(0);
  });

  it('should not show overdue indicator for future due date', () => {
    const futureOrder = {
      ...mockOrder,
      dueDate: new Date('2025-12-31'),
    };

    const { container } = render(
      <RepairOrderCard order={futureOrder} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    const redElements = container.querySelectorAll('.text-red-600');
    expect(redElements.length).toBe(0);
  });

  it('should show completion date when completed', () => {
    const completedOrder = {
      ...mockOrder,
      status: 'COMPLETED' as const,
      completedAt: new Date('2024-01-15'),
    };

    render(<RepairOrderCard order={completedOrder} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    expect(screen.getByText(/Concluído em/)).toBeInTheDocument();
  });

  it('should not show overdue indicator for completed orders', () => {
    const completedOrder = {
      ...mockOrder,
      status: 'COMPLETED' as const,
      dueDate: new Date('2023-01-01'),
      completedAt: new Date('2024-01-15'),
    };

    const { container } = render(
      <RepairOrderCard order={completedOrder} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    const redElements = container.querySelectorAll('.text-red-600');
    expect(redElements.length).toBe(0);
  });

  it('should render urgent priority correctly', () => {
    const urgentOrder = {
      ...mockOrder,
      priority: 'URGENT' as const,
    };

    render(<RepairOrderCard order={urgentOrder} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    expect(screen.getByText('Urgente')).toBeInTheDocument();
  });

  it('should render low priority correctly', () => {
    const lowOrder = {
      ...mockOrder,
      priority: 'LOW' as const,
    };

    render(<RepairOrderCard order={lowOrder} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    expect(screen.getByText('Baixa')).toBeInTheDocument();
  });

  it('should render in progress status correctly', () => {
    const inProgressOrder = {
      ...mockOrder,
      status: 'IN_PROGRESS' as const,
    };

    render(<RepairOrderCard order={inProgressOrder} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    expect(screen.getByText('Em Progresso')).toBeInTheDocument();
  });

  it('should render cancelled status correctly', () => {
    const cancelledOrder = {
      ...mockOrder,
      status: 'CANCELLED' as const,
    };

    render(<RepairOrderCard order={cancelledOrder} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    expect(screen.getByText('Cancelado')).toBeInTheDocument();
  });

  it('should truncate long descriptions', () => {
    const longDescOrder = {
      ...mockOrder,
      description: 'A'.repeat(500),
    };

    const { container } = render(
      <RepairOrderCard order={longDescOrder} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    const description = container.querySelector('.line-clamp-3');
    expect(description).toBeInTheDocument();
  });

  it('should have hover effects', () => {
    const { container } = render(
      <RepairOrderCard order={mockOrder} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    const card = container.querySelector('.group');
    expect(card).toHaveClass('hover:shadow-2xl');
  });
});
