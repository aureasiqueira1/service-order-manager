import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Textarea } from './textarea';

describe('Textarea', () => {
  it('should render textarea element', () => {
    render(<Textarea />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should render with label', () => {
    render(<Textarea label="Description" />);
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
  });

  it('should display error message', () => {
    render(<Textarea error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('should apply error styles when error exists', () => {
    render(<Textarea error="Error message" />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass('border-red-400');
  });

  it('should handle value changes', async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();

    render(<Textarea onChange={handleChange} />);
    const textarea = screen.getByRole('textbox');

    await user.type(textarea, 'test');
    expect(handleChange).toHaveBeenCalled();
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Textarea disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('should apply disabled styles', () => {
    render(<Textarea disabled />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass('disabled:bg-slate-100', 'disabled:cursor-not-allowed');
  });

  it('should accept placeholder text', () => {
    render(<Textarea placeholder="Enter description" />);
    expect(screen.getByPlaceholderText('Enter description')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(<Textarea className="custom-textarea" />);
    expect(screen.getByRole('textbox')).toHaveClass('custom-textarea');
  });

  it('should forward ref correctly', () => {
    const ref = jest.fn();
    render(<Textarea ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });

  it('should associate label with textarea using id', () => {
    render(<Textarea label="Comments" id="comments-input" />);
    const textarea = screen.getByLabelText('Comments');
    expect(textarea).toHaveAttribute('id', 'comments-input');
  });

  it('should generate id from label when id not provided', () => {
    render(<Textarea label="User Comments" />);
    const textarea = screen.getByLabelText('User Comments');
    expect(textarea).toHaveAttribute('id', 'user-comments');
  });

  it('should handle rows attribute', () => {
    render(<Textarea rows={5} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '5');
  });

  it('should handle required attribute', () => {
    render(<Textarea required />);
    expect(screen.getByRole('textbox')).toBeRequired();
  });

  it('should display both label and error', () => {
    render(<Textarea label="Description" error="Description is too short" />);
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByText('Description is too short')).toBeInTheDocument();
  });

  it('should not render label when label prop not provided', () => {
    const { container } = render(<Textarea />);
    expect(container.querySelector('label')).not.toBeInTheDocument();
  });

  it('should not render error message when error prop not provided', () => {
    const { container } = render(<Textarea />);
    const errorText = container.querySelector('.text-red-700');
    expect(errorText).not.toBeInTheDocument();
  });

  it('should accept defaultValue', () => {
    render(<Textarea defaultValue="default text" />);
    expect(screen.getByRole('textbox')).toHaveValue('default text');
  });

  it('should accept controlled value', () => {
    render(<Textarea value="controlled value" onChange={() => {}} />);
    expect(screen.getByRole('textbox')).toHaveValue('controlled value');
  });

  it('should handle name attribute', () => {
    render(<Textarea name="description" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('name', 'description');
  });

  it('should have proper focus styles', () => {
    render(<Textarea />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500');
  });

  it('should have error focus styles when error exists', () => {
    render(<Textarea error="Error" />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass('focus:ring-red-500');
  });

  it('should have minimum height class', () => {
    render(<Textarea />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass('min-h-[100px]');
  });

  it('should have resize-y class for vertical resizing', () => {
    render(<Textarea />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass('resize-y');
  });

  it('should handle maxLength attribute', () => {
    render(<Textarea maxLength={500} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('maxLength', '500');
  });
});
