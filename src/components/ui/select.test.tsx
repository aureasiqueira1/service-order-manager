import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from './select';

describe('Select', () => {
  const mockOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  it('should render select element', () => {
    render(<Select options={mockOptions} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('should render with label', () => {
    render(<Select label="Choose option" options={mockOptions} />);
    expect(screen.getByLabelText('Choose option')).toBeInTheDocument();
  });

  it('should render all options', () => {
    render(<Select options={mockOptions} />);
    mockOptions.forEach(option => {
      expect(screen.getByRole('option', { name: option.label })).toBeInTheDocument();
    });
  });

  it('should display error message', () => {
    render(<Select options={mockOptions} error="Please select an option" />);
    expect(screen.getByText('Please select an option')).toBeInTheDocument();
  });

  it('should apply error styles when error exists', () => {
    render(<Select options={mockOptions} error="Error message" />);
    const select = screen.getByRole('combobox');
    expect(select).toHaveClass('border-red-400');
  });

  it('should handle value changes', async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();

    render(<Select options={mockOptions} onChange={handleChange} />);
    const select = screen.getByRole('combobox');

    await user.selectOptions(select, 'option2');
    expect(handleChange).toHaveBeenCalled();
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Select options={mockOptions} disabled />);
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('should apply disabled styles', () => {
    render(<Select options={mockOptions} disabled />);
    const select = screen.getByRole('combobox');
    expect(select).toHaveClass('disabled:bg-slate-100', 'disabled:cursor-not-allowed');
  });

  it('should apply custom className', () => {
    render(<Select options={mockOptions} className="custom-select" />);
    expect(screen.getByRole('combobox')).toHaveClass('custom-select');
  });

  it('should forward ref correctly', () => {
    const ref = jest.fn();
    render(<Select options={mockOptions} ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });

  it('should associate label with select using id', () => {
    render(<Select label="Status" options={mockOptions} id="status-select" />);
    const select = screen.getByLabelText('Status');
    expect(select).toHaveAttribute('id', 'status-select');
  });

  it('should generate id from label when id not provided', () => {
    render(<Select label="User Status" options={mockOptions} />);
    const select = screen.getByLabelText('User Status');
    expect(select).toHaveAttribute('id', 'user-status');
  });

  it('should handle required attribute', () => {
    render(<Select options={mockOptions} required />);
    expect(screen.getByRole('combobox')).toBeRequired();
  });

  it('should display both label and error', () => {
    render(<Select label="Priority" options={mockOptions} error="Priority is required" />);
    expect(screen.getByLabelText('Priority')).toBeInTheDocument();
    expect(screen.getByText('Priority is required')).toBeInTheDocument();
  });

  it('should not render label when label prop not provided', () => {
    const { container } = render(<Select options={mockOptions} />);
    expect(container.querySelector('label')).not.toBeInTheDocument();
  });

  it('should not render error message when error prop not provided', () => {
    const { container } = render(<Select options={mockOptions} />);
    const errorText = container.querySelector('.text-red-700');
    expect(errorText).not.toBeInTheDocument();
  });

  it('should accept defaultValue', () => {
    render(<Select options={mockOptions} defaultValue="option2" />);
    expect(screen.getByRole('combobox')).toHaveValue('option2');
  });

  it('should accept controlled value', () => {
    render(<Select options={mockOptions} value="option3" onChange={() => {}} />);
    expect(screen.getByRole('combobox')).toHaveValue('option3');
  });

  it('should handle name attribute', () => {
    render(<Select options={mockOptions} name="priority" />);
    expect(screen.getByRole('combobox')).toHaveAttribute('name', 'priority');
  });

  it('should have proper focus styles', () => {
    render(<Select options={mockOptions} />);
    const select = screen.getByRole('combobox');
    expect(select).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500');
  });

  it('should have error focus styles when error exists', () => {
    render(<Select options={mockOptions} error="Error" />);
    const select = screen.getByRole('combobox');
    expect(select).toHaveClass('focus:ring-red-500');
  });

  it('should render chevron icon', () => {
    const { container } = render(<Select options={mockOptions} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should have minimum height', () => {
    render(<Select options={mockOptions} />);
    const select = screen.getByRole('combobox');
    expect(select).toHaveClass('min-h-[2.75rem]');
  });

  it('should handle empty options array', () => {
    render(<Select options={[]} />);
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    expect(select.querySelectorAll('option')).toHaveLength(0);
  });

  it('should render options with correct values', () => {
    render(<Select options={mockOptions} />);
    const option1 = screen.getByRole('option', { name: 'Option 1' }) as HTMLOptionElement;
    expect(option1.value).toBe('option1');
  });

  it('should apply cursor pointer style', () => {
    render(<Select options={mockOptions} />);
    const select = screen.getByRole('combobox');
    expect(select).toHaveClass('cursor-pointer');
  });

  it('should hide native appearance', () => {
    render(<Select options={mockOptions} />);
    const select = screen.getByRole('combobox');
    expect(select).toHaveClass('appearance-none');
  });
});
