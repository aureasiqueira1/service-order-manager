import { render } from '@testing-library/react';
import { RepairOrderCardSkeleton, Skeleton, StatsCardSkeleton } from './skeleton';

describe('Skeleton', () => {
  it('should render skeleton with default classes', () => {
    const { container } = render(<Skeleton />);
    const skeleton = container.firstChild as HTMLElement;

    expect(skeleton).toHaveClass('animate-pulse', 'bg-slate-200', 'rounded');
  });

  it('should apply custom className', () => {
    const { container } = render(<Skeleton className="h-10 w-full" />);
    const skeleton = container.firstChild as HTMLElement;

    expect(skeleton).toHaveClass('h-10', 'w-full');
  });

  it('should combine default and custom classes', () => {
    const { container } = render(<Skeleton className="custom-class" />);
    const skeleton = container.firstChild as HTMLElement;

    expect(skeleton).toHaveClass('animate-pulse', 'bg-slate-200', 'rounded', 'custom-class');
  });
});

describe('RepairOrderCardSkeleton', () => {
  it('should render card skeleton structure', () => {
    const { container } = render(<RepairOrderCardSkeleton />);

    expect(container.querySelector('.bg-white')).toBeInTheDocument();
    expect(container.querySelector('.rounded-xl')).toBeInTheDocument();
    expect(container.querySelector('.shadow-md')).toBeInTheDocument();
  });

  it('should render multiple skeleton elements', () => {
    const { container } = render(<RepairOrderCardSkeleton />);
    const skeletons = container.querySelectorAll('.animate-pulse');

    expect(skeletons.length).toBeGreaterThan(3);
  });

  it('should have proper spacing', () => {
    const { container } = render(<RepairOrderCardSkeleton />);

    expect(container.querySelector('.space-y-2')).toBeInTheDocument();
  });
});

describe('StatsCardSkeleton', () => {
  it('should render stats card skeleton structure', () => {
    const { container } = render(<StatsCardSkeleton />);

    expect(container.querySelector('.bg-white')).toBeInTheDocument();
    expect(container.querySelector('.rounded-xl')).toBeInTheDocument();
  });

  it('should render skeleton elements', () => {
    const { container } = render(<StatsCardSkeleton />);
    const skeletons = container.querySelectorAll('.animate-pulse');

    expect(skeletons.length).toBe(3);
  });

  it('should have proper layout', () => {
    const { container } = render(<StatsCardSkeleton />);

    expect(container.querySelector('.flex.items-center.justify-between')).toBeInTheDocument();
  });
});
