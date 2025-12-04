import { render, screen } from '@testing-library/react';
import { Plus } from 'lucide-react';
import { EmptyState } from './empty-state';

describe('EmptyState', () => {
  it('should render title', () => {
    render(<EmptyState icon={Plus} title="No items" description="Create your first item" />);

    expect(screen.getByText('No items')).toBeInTheDocument();
  });

  it('should render description', () => {
    render(<EmptyState icon={Plus} title="No items" description="Create your first item" />);

    expect(screen.getByText('Create your first item')).toBeInTheDocument();
  });

  it('should render icon', () => {
    const { container } = render(
      <EmptyState icon={Plus} title="No items" description="Create your first item" />
    );

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should render action when provided', () => {
    render(
      <EmptyState
        icon={Plus}
        title="No items"
        description="Create your first item"
        action={<button>Create New</button>}
      />
    );

    expect(screen.getByRole('button', { name: /Create New/i })).toBeInTheDocument();
  });

  it('should not render action when not provided', () => {
    render(<EmptyState icon={Plus} title="No items" description="Create your first item" />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('should have proper styling', () => {
    const { container } = render(
      <EmptyState icon={Plus} title="No items" description="Create your first item" />
    );

    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('text-center', 'py-16', 'bg-white');
  });

  it('should render with different icons', () => {
    const { container: container1 } = render(
      <EmptyState icon={Plus} title="Title 1" description="Description 1" />
    );

    const { container: container2 } = render(
      <EmptyState icon={Plus} title="Title 2" description="Description 2" />
    );

    const svg1 = container1.querySelector('svg');
    const svg2 = container2.querySelector('svg');

    expect(svg1).toBeInTheDocument();
    expect(svg2).toBeInTheDocument();
  });

  it('should render complex action component', () => {
    render(
      <EmptyState
        icon={Plus}
        title="No items"
        description="Create your first item"
        action={
          <div>
            <button>Action 1</button>
            <button>Action 2</button>
          </div>
        }
      />
    );

    expect(screen.getByRole('button', { name: /Action 1/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Action 2/i })).toBeInTheDocument();
  });

  it('should apply max-width to content', () => {
    const { container } = render(
      <EmptyState icon={Plus} title="No items" description="Create your first item" />
    );

    const content = container.querySelector('.max-w-md');
    expect(content).toBeInTheDocument();
  });

  it('should center content', () => {
    const { container } = render(
      <EmptyState icon={Plus} title="No items" description="Create your first item" />
    );

    const content = container.querySelector('.mx-auto');
    expect(content).toBeInTheDocument();
  });

  it('should render long descriptions correctly', () => {
    const longDescription = 'A'.repeat(200);

    render(<EmptyState icon={Plus} title="No items" description={longDescription} />);

    expect(screen.getByText(longDescription)).toBeInTheDocument();
  });

  it('should render long titles correctly', () => {
    const longTitle = 'This is a very long title that should still render correctly';

    render(<EmptyState icon={Plus} title={longTitle} description="Description" />);

    expect(screen.getByText(longTitle)).toBeInTheDocument();
  });
});
