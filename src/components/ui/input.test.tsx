import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './input';

describe('Input', () => {
  it('should render input element', () => {
    render(<Input />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should render with label', () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('should display error message', () => {
    render(<Input error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('should apply error styles when error exists', () => {
    render(<Input error="Error message" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-red-400');
  });

  it('should handle value changes', async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();

    render(<Input onChange={handleChange} />);
    const input = screen.getByRole('textbox');

    await user.type(input, 'test');
    expect(handleChange).toHaveBeenCalled();
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Input disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('should apply disabled styles', () => {
    render(<Input disabled />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('disabled:bg-slate-100', 'disabled:cursor-not-allowed');
  });

  it('should accept placeholder text', () => {
    render(<Input placeholder="Enter your email" />);
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
  });

  it('should handle different input types', () => {
    const { container } = render(<Input type="password" />);
    const input = container.querySelector('input');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('should apply custom className', () => {
    render(<Input className="custom-input" />);
    expect(screen.getByRole('textbox')).toHaveClass('custom-input');
  });

  it('should forward ref correctly', () => {
    const ref = jest.fn();
    render(<Input ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });

  it('should associate label with input using id', () => {
    render(<Input label="Username" id="username-input" />);
    const input = screen.getByLabelText('Username');
    expect(input).toHaveAttribute('id', 'username-input');
  });

  it('should generate id from label when id not provided', () => {
    render(<Input label="Email Address" />);
    const input = screen.getByLabelText('Email Address');
    expect(input).toHaveAttribute('id', 'email-address');
  });

  it('should handle maxLength attribute', () => {
    render(<Input maxLength={10} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('maxLength', '10');
  });

  it('should handle required attribute', () => {
    render(<Input required />);
    expect(screen.getByRole('textbox')).toBeRequired();
  });

  it('should display both label and error', () => {
    render(<Input label="Password" error="Password is too short" />);
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByText('Password is too short')).toBeInTheDocument();
  });

  it('should not render label when label prop not provided', () => {
    const { container } = render(<Input />);
    expect(container.querySelector('label')).not.toBeInTheDocument();
  });

  it('should not render error message when error prop not provided', () => {
    const { container } = render(<Input />);
    const errorText = container.querySelector('.text-red-700');
    expect(errorText).not.toBeInTheDocument();
  });

  it('should accept defaultValue', () => {
    render(<Input defaultValue="default text" />);
    expect(screen.getByRole('textbox')).toHaveValue('default text');
  });

  it('should accept controlled value', () => {
    render(<Input value="controlled value" onChange={() => {}} />);
    expect(screen.getByRole('textbox')).toHaveValue('controlled value');
  });

  it('should handle name attribute', () => {
    render(<Input name="email" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('name', 'email');
  });

  it('should have proper focus styles', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500');
  });

  it('should have error focus styles when error exists', () => {
    render(<Input error="Error" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('focus:ring-red-500');
  });
});
