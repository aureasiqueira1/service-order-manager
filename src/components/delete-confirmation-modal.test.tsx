import { deleteRepairOrder } from '@/actions/repair-orders';
import { RepairOrderEntity } from '@/domain/types';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DeleteConfirmationModal } from './delete-confirmation-modal';

// Mock do action
jest.mock('@/actions/repair-orders', () => ({
  deleteRepairOrder: jest.fn(),
}));

describe('DeleteConfirmationModal', () => {
  const mockOrder: RepairOrderEntity = {
    id: '1',
    title: 'Reparo no elevador',
    description: 'Elevador apresentando problemas',
    location: 'Torre A - Apto 101',
    priority: 'HIGH',
    status: 'OPEN',
    dueDate: new Date('2024-12-31'),
    completedAt: null,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  const mockOnClose = jest.fn();
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render when isOpen is false', () => {
    render(
      <DeleteConfirmationModal
        isOpen={false}
        onClose={mockOnClose}
        order={mockOrder}
        onSuccess={mockOnSuccess}
      />
    );

    expect(screen.queryByText(/Confirmar Exclusão/i)).not.toBeInTheDocument();
  });

  it('should render when isOpen is true', () => {
    render(
      <DeleteConfirmationModal
        isOpen={true}
        onClose={mockOnClose}
        order={mockOrder}
        onSuccess={mockOnSuccess}
      />
    );

    expect(screen.getByText(/Confirmar Exclusão/i)).toBeInTheDocument();
  });

  it('should not render when order is null', () => {
    render(
      <DeleteConfirmationModal
        isOpen={true}
        onClose={mockOnClose}
        order={null}
        onSuccess={mockOnSuccess}
      />
    );

    expect(screen.queryByText(/Confirmar Exclusão/i)).not.toBeInTheDocument();
  });

  it('should show order title in confirmation message', () => {
    render(
      <DeleteConfirmationModal
        isOpen={true}
        onClose={mockOnClose}
        order={mockOrder}
        onSuccess={mockOnSuccess}
      />
    );

    expect(screen.getByText(/Reparo no elevador/i)).toBeInTheDocument();
  });

  it('should show warning message', () => {
    render(
      <DeleteConfirmationModal
        isOpen={true}
        onClose={mockOnClose}
        order={mockOrder}
        onSuccess={mockOnSuccess}
      />
    );

    expect(screen.getByText(/Esta ação não pode ser desfeita/i)).toBeInTheDocument();
  });

  it('should have Cancel button', () => {
    render(
      <DeleteConfirmationModal
        isOpen={true}
        onClose={mockOnClose}
        order={mockOrder}
        onSuccess={mockOnSuccess}
      />
    );

    expect(screen.getByRole('button', { name: /Cancelar/i })).toBeInTheDocument();
  });

  it('should have Delete button', () => {
    render(
      <DeleteConfirmationModal
        isOpen={true}
        onClose={mockOnClose}
        order={mockOrder}
        onSuccess={mockOnSuccess}
      />
    );

    expect(screen.getByRole('button', { name: /Excluir/i })).toBeInTheDocument();
  });

  it('should call onClose when Cancel button clicked', async () => {
    const user = userEvent.setup();
    render(
      <DeleteConfirmationModal
        isOpen={true}
        onClose={mockOnClose}
        order={mockOrder}
        onSuccess={mockOnSuccess}
      />
    );

    await user.click(screen.getByRole('button', { name: /Cancelar/i }));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should call deleteRepairOrder when Delete button clicked', async () => {
    const user = userEvent.setup();
    (deleteRepairOrder as jest.Mock).mockResolvedValue({ success: true });

    render(
      <DeleteConfirmationModal
        isOpen={true}
        onClose={mockOnClose}
        order={mockOrder}
        onSuccess={mockOnSuccess}
      />
    );

    await user.click(screen.getByRole('button', { name: /Excluir/i }));

    await waitFor(() => {
      expect(deleteRepairOrder).toHaveBeenCalledWith('1');
    });
  });

  it('should call onSuccess after successful deletion', async () => {
    const user = userEvent.setup();
    (deleteRepairOrder as jest.Mock).mockResolvedValue({ success: true });

    render(
      <DeleteConfirmationModal
        isOpen={true}
        onClose={mockOnClose}
        order={mockOrder}
        onSuccess={mockOnSuccess}
      />
    );

    await user.click(screen.getByRole('button', { name: /Excluir/i }));

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledTimes(1);
    });
  });

  it('should show loading state during deletion', async () => {
    const user = userEvent.setup();
    (deleteRepairOrder as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({ success: true }), 100))
    );

    render(
      <DeleteConfirmationModal
        isOpen={true}
        onClose={mockOnClose}
        order={mockOrder}
        onSuccess={mockOnSuccess}
      />
    );

    await user.click(screen.getByRole('button', { name: /Excluir/i }));

    expect(screen.getByText(/Excluindo.../i)).toBeInTheDocument();
  });

  it('should disable buttons during deletion', async () => {
    const user = userEvent.setup();
    (deleteRepairOrder as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({ success: true }), 100))
    );

    render(
      <DeleteConfirmationModal
        isOpen={true}
        onClose={mockOnClose}
        order={mockOrder}
        onSuccess={mockOnSuccess}
      />
    );

    await user.click(screen.getByRole('button', { name: /Excluir/i }));

    const cancelButton = screen.getByRole('button', { name: /Cancelar/i });
    const deleteButton = screen.getByRole('button', { name: /Excluindo.../i });

    expect(cancelButton).toBeDisabled();
    expect(deleteButton).toBeDisabled();
  });
});
