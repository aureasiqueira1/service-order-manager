import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from './modal';

describe('Modal', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('should not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={mockOnClose} title="Test Modal">
        Content
      </Modal>
    );
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
  });

  it('should render when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        Content
      </Modal>
    );
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
  });

  it('should render title', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="My Modal">
        Content
      </Modal>
    );
    expect(screen.getByText('My Modal')).toBeInTheDocument();
  });

  it('should render children content', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test">
        <p>Modal content goes here</p>
      </Modal>
    );
    expect(screen.getByText('Modal content goes here')).toBeInTheDocument();
  });

  it('should call onClose when clicking backdrop', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test">
        Content
      </Modal>
    );

    const backdrop = container.querySelector('.bg-black.bg-opacity-50') as HTMLElement;
    await user.click(backdrop);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when clicking close button', async () => {
    const user = userEvent.setup();
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test">
        Content
      </Modal>
    );

    const closeButton = screen.getByRole('button');
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when pressing Escape key', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test">
        Content
      </Modal>
    );

    const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(escapeEvent);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should not call onClose when pressing other keys', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test">
        Content
      </Modal>
    );

    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    document.dispatchEvent(enterEvent);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should apply small size class', () => {
    const { container } = render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test" size="sm">
        Content
      </Modal>
    );

    const modal = container.querySelector('.max-w-md');
    expect(modal).toBeInTheDocument();
  });

  it('should apply medium size class', () => {
    const { container } = render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test" size="md">
        Content
      </Modal>
    );

    const modal = container.querySelector('.max-w-lg');
    expect(modal).toBeInTheDocument();
  });

  it('should apply large size class', () => {
    const { container } = render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test" size="lg">
        Content
      </Modal>
    );

    const modal = container.querySelector('.max-w-2xl');
    expect(modal).toBeInTheDocument();
  });

  it('should apply xl size class', () => {
    const { container } = render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test" size="xl">
        Content
      </Modal>
    );

    const modal = container.querySelector('.max-w-4xl');
    expect(modal).toBeInTheDocument();
  });

  it('should use medium size by default', () => {
    const { container } = render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test">
        Content
      </Modal>
    );

    const modal = container.querySelector('.max-w-lg');
    expect(modal).toBeInTheDocument();
  });

  it('should set body overflow to hidden when open', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test">
        Content
      </Modal>
    );

    expect(document.body.style.overflow).toBe('hidden');
  });

  it('should reset body overflow when closed', () => {
    const { rerender } = render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test">
        Content
      </Modal>
    );

    rerender(
      <Modal isOpen={false} onClose={mockOnClose} title="Test">
        Content
      </Modal>
    );

    expect(document.body.style.overflow).toBe('unset');
  });

  it('should cleanup event listeners on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');

    const { unmount } = render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test">
        Content
      </Modal>
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
  });

  it('should render close icon', () => {
    const { container } = render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test">
        Content
      </Modal>
    );

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should have proper z-index', () => {
    const { container } = render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test">
        Content
      </Modal>
    );

    const wrapper = container.querySelector('.z-50');
    expect(wrapper).toBeInTheDocument();
  });

  it('should render complex children', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test">
        <div>
          <h2>Subtitle</h2>
          <p>Paragraph 1</p>
          <p>Paragraph 2</p>
        </div>
      </Modal>
    );

    expect(screen.getByText('Subtitle')).toBeInTheDocument();
    expect(screen.getByText('Paragraph 1')).toBeInTheDocument();
    expect(screen.getByText('Paragraph 2')).toBeInTheDocument();
  });
});
