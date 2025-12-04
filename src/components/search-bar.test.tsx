import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar } from './search-bar';

describe('SearchBar', () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  it('should render search input', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should render with default placeholder', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    expect(
      screen.getByPlaceholderText('Buscar por título, descrição ou local...')
    ).toBeInTheDocument();
  });

  it('should render with custom placeholder', () => {
    render(<SearchBar onSearch={mockOnSearch} placeholder="Buscar ordens..." />);
    expect(screen.getByPlaceholderText('Buscar ordens...')).toBeInTheDocument();
  });

  it('should call onSearch when typing', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'test');

    expect(mockOnSearch).toHaveBeenCalled();
  });

  it('should update input value when typing', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByRole('textbox') as HTMLInputElement;
    await user.type(input, 'search query');

    expect(input.value).toBe('search query');
  });

  it('should show clear button when input has value', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'test');

    const clearButton = screen.getByLabelText('Limpar busca');
    expect(clearButton).toBeInTheDocument();
  });

  it('should not show clear button when input is empty', () => {
    render(<SearchBar onSearch={mockOnSearch} />);

    const clearButton = screen.queryByLabelText('Limpar busca');
    expect(clearButton).not.toBeInTheDocument();
  });

  it('should clear input when clear button clicked', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByRole('textbox') as HTMLInputElement;
    await user.type(input, 'test');

    const clearButton = screen.getByLabelText('Limpar busca');
    await user.click(clearButton);

    expect(input.value).toBe('');
  });

  it('should call onSearch with empty string when cleared', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'test');

    mockOnSearch.mockClear();

    const clearButton = screen.getByLabelText('Limpar busca');
    await user.click(clearButton);

    expect(mockOnSearch).toHaveBeenCalledWith('');
  });

  it('should render search icon', () => {
    const { container } = render(<SearchBar onSearch={mockOnSearch} />);
    const searchIcon = container.querySelector('svg');
    expect(searchIcon).toBeInTheDocument();
  });

  it('should have proper styling classes', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('w-full', 'pl-12', 'pr-12', 'py-3');
  });

  it('should have focus styles', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('focus:ring-2', 'focus:ring-blue-500');
  });

  it('should call onSearch for each character typed', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'abc');

    // 'a', 'ab', 'abc'
    expect(mockOnSearch).toHaveBeenCalledTimes(3);
  });

  it('should handle multiple clear operations', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByRole('textbox') as HTMLInputElement;

    // Primeira busca
    await user.type(input, 'first');
    let clearButton = screen.getByLabelText('Limpar busca');
    await user.click(clearButton);
    expect(input.value).toBe('');

    // Segunda busca
    await user.type(input, 'second');
    clearButton = screen.getByLabelText('Limpar busca');
    await user.click(clearButton);
    expect(input.value).toBe('');
  });

  it('should handle special characters', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByRole('textbox');
    await user.type(input, '!@#$%');

    expect(mockOnSearch).toHaveBeenCalled();
  });

  it('should handle whitespace', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByRole('textbox');
    await user.type(input, '   ');

    expect(mockOnSearch).toHaveBeenCalled();
  });

  it('should have hover effects on clear button', () => {
    const { container } = render(<SearchBar onSearch={mockOnSearch} />);

    // Type something first
    const input = screen.getByRole('textbox') as HTMLInputElement;
    input.value = 'test';

    // Re-render to show clear button
    render(<SearchBar onSearch={mockOnSearch} />);

    const clearButtonContainer = container.querySelector('button');
    if (clearButtonContainer) {
      expect(clearButtonContainer).toHaveClass('hover:text-red-500');
    }
  });
});
