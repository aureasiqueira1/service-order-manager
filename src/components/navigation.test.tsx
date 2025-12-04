import { render, screen, waitFor } from '@testing-library/react';
import { Navigation } from './navigation';

// Mock do usePathname
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

// Mock do fetch
global.fetch = jest.fn();

describe('Navigation', () => {
  const usePathname = require('next/navigation').usePathname;

  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      json: async () => ({ success: true, count: 0 }),
    });
  });

  it('should render navigation bar', () => {
    usePathname.mockReturnValue('/');
    render(<Navigation />);

    expect(screen.getByText('Pipelore')).toBeInTheDocument();
  });

  it('should render home link', () => {
    usePathname.mockReturnValue('/');
    render(<Navigation />);

    expect(screen.getByText('Início')).toBeInTheDocument();
  });

  it('should render late orders link', () => {
    usePathname.mockReturnValue('/');
    render(<Navigation />);

    expect(screen.getByText('Atrasadas')).toBeInTheDocument();
  });

  it('should highlight active home link', () => {
    usePathname.mockReturnValue('/');
    render(<Navigation />);

    const homeLink = screen.getByText('Início').closest('a');
    expect(homeLink).toHaveClass('bg-white', 'text-blue-700');
  });

  it('should highlight active late orders link', () => {
    usePathname.mockReturnValue('/atrasadas');
    render(<Navigation />);

    const lateLink = screen.getByText('Atrasadas').closest('a');
    expect(lateLink).toHaveClass('bg-white', 'text-blue-700');
  });

  it('should not highlight inactive links', () => {
    usePathname.mockReturnValue('/');
    render(<Navigation />);

    const lateLink = screen.getByText('Atrasadas').closest('a');
    expect(lateLink).not.toHaveClass('bg-white', 'text-blue-700');
  });

  it('should fetch late orders count on mount', async () => {
    usePathname.mockReturnValue('/');
    render(<Navigation />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/repair-orders/late');
    });
  });

  it('should display late orders badge when count > 0', async () => {
    usePathname.mockReturnValue('/');
    (global.fetch as jest.Mock).mockResolvedValue({
      json: async () => ({ success: true, count: 5 }),
    });

    render(<Navigation />);

    await waitFor(() => {
      expect(screen.getByText('5')).toBeInTheDocument();
    });
  });

  it('should not display badge when count is 0', async () => {
    usePathname.mockReturnValue('/');
    (global.fetch as jest.Mock).mockResolvedValue({
      json: async () => ({ success: true, count: 0 }),
    });

    render(<Navigation />);

    await waitFor(() => {
      const badge = screen.queryByText('0');
      expect(badge).not.toBeInTheDocument();
    });
  });

  it('should handle fetch errors gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    usePathname.mockReturnValue('/');
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    render(<Navigation />);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });

  it('should have proper navigation structure', () => {
    usePathname.mockReturnValue('/');
    const { container } = render(<Navigation />);

    const nav = container.querySelector('nav');
    expect(nav).toBeInTheDocument();
  });

  it('should render logo with proper styling', () => {
    usePathname.mockReturnValue('/');
    render(<Navigation />);

    const logo = screen.getByText('Pipelore');
    expect(logo).toHaveClass('text-2xl', 'font-bold', 'text-white');
  });

  it('should have gradient background', () => {
    usePathname.mockReturnValue('/');
    const { container } = render(<Navigation />);

    const nav = container.querySelector('nav');
    expect(nav).toHaveClass('bg-gradient-to-r', 'from-blue-600', 'to-indigo-600');
  });

  it('should render icons for navigation items', () => {
    usePathname.mockReturnValue('/');
    const { container } = render(<Navigation />);

    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(0);
  });

  it('should have correct href for home link', () => {
    usePathname.mockReturnValue('/');
    render(<Navigation />);

    const homeLink = screen.getByText('Início').closest('a');
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('should have correct href for late orders link', () => {
    usePathname.mockReturnValue('/');
    render(<Navigation />);

    const lateLink = screen.getByText('Atrasadas').closest('a');
    expect(lateLink).toHaveAttribute('href', '/atrasadas');
  });

  it('should update late count when pathname changes', async () => {
    usePathname.mockReturnValue('/');
    const { rerender } = render(<Navigation />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    usePathname.mockReturnValue('/atrasadas');
    rerender(<Navigation />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });

  it('should render badge with pulse animation', async () => {
    usePathname.mockReturnValue('/');
    (global.fetch as jest.Mock).mockResolvedValue({
      json: async () => ({ success: true, count: 3 }),
    });

    const { container } = render(<Navigation />);

    await waitFor(() => {
      const badge = screen.getByText('3').closest('span');
      expect(badge).toHaveClass('animate-pulse');
    });
  });

  it('should handle large late order counts', async () => {
    usePathname.mockReturnValue('/');
    (global.fetch as jest.Mock).mockResolvedValue({
      json: async () => ({ success: true, count: 999 }),
    });

    render(<Navigation />);

    await waitFor(() => {
      expect(screen.getByText('999')).toBeInTheDocument();
    });
  });

  it('should handle undefined count from API', async () => {
    usePathname.mockReturnValue('/');
    (global.fetch as jest.Mock).mockResolvedValue({
      json: async () => ({ success: true }),
    });

    render(<Navigation />);

    await waitFor(() => {
      // Should not display badge when count is undefined
      const badge = screen.queryByText(/\d+/);
      expect(badge).not.toBeInTheDocument();
    });
  });

  it('should have responsive padding', () => {
    usePathname.mockReturnValue('/');
    const { container } = render(<Navigation />);

    const innerContainer = container.querySelector('.px-4');
    expect(innerContainer).toHaveClass('sm:px-6', 'lg:px-8');
  });

  it('should render logo icon', () => {
    usePathname.mockReturnValue('/');
    const { container } = render(<Navigation />);

    const logoIcon = container.querySelector('.w-10.h-10');
    expect(logoIcon).toBeInTheDocument();
  });
});
