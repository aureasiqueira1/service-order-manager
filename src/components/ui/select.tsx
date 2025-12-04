import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { SelectHTMLAttributes, forwardRef } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, options, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className='w-full'>
        {label && (
          <label htmlFor={selectId} className="block text-sm font-semibold text-slate-800 mb-1">
            {label}
          </label>
        )}
        <div className="relative w-full">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              'w-full px-3 py-2.5 pr-10 border border-slate-300 rounded-lg text-slate-900 bg-white',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
              'disabled:bg-slate-100 disabled:cursor-not-allowed',
              'appearance-none cursor-pointer min-h-[2.75rem]',
              error && 'border-red-400 focus:ring-red-500',
              className
            )}
            {...props}
          >
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <div className="absolute top-0 bottom-0 right-0 flex items-center justify-center w-10 pointer-events-none">
            <ChevronDown
              className={cn(
                'w-5 h-5 transition-colors',
                error ? 'text-red-400' : 'text-slate-500',
                props.disabled && 'text-slate-300'
              )}
            />
          </div>
        </div>

        {error && <p className="mt-1 text-sm font-medium text-red-700">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export { Select };
